import GlobalStyle from "../styles";
import { SWRConfig } from "swr";
import { SessionProvider, useSession } from "next-auth/react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          fetcher: async (...args) => {
            const response = await fetch(...args);
            if (!response.ok) {
              throw new Error(`Request with ${JSON.stringify(args)} failed.`);
            }
            return await response.json();
          },
        }}
      >
        <Auth>
          <GlobalStyle />
          <Component {...pageProps} />
        </Auth>
      </SWRConfig>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Is loading</div>;
  }
  return children;
}
