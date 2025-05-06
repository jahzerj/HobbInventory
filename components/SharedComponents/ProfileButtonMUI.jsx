import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function ProfileButtonMUI() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session) {
    return null;
  }

  return (
    <IconButton
      component={Link}
      href="/profile"
      aria-label="View Profile"
      sx={{
        position: "fixed",
        top: 8,
        right: 10,
        zIndex: 1000,
      }}
    >
      {session.user?.image ? (
        <Avatar
          src={session.user.image}
          alt="User Avatar"
          sx={{ width: 45, height: 45 }}
        />
      ) : (
        <Avatar>
          <PersonIcon />
        </Avatar>
      )}
    </IconButton>
  );
}
