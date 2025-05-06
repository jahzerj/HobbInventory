import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/db/connect";
import User from "@/db/models/User";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
      idToken: true,
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      try {
        // Check if user already exists with this provider and account ID
        let dbUser = await User.findOne({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        });

        // If not, create a new user
        if (!dbUser) {
          dbUser = await User.create({
            uuid: uuidv4(),
            email: user.email,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            name: user.name || "User",
            image: user.image,
          });
        }

        // Add the UUID to the user object
        user.uuid = dbUser.uuid;
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // If user object is passed, it means this is the initial sign-in
      if (user) {
        token.uuid = user.uuid;
      }
      return token;
    },
    async session({ session, token }) {
      // Add UUID to the session
      if (token.uuid) {
        session.user.uuid = token.uuid;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
