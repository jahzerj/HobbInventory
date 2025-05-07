import { Fab } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Link from "next/link";

export default function BackButtonMUI({ href = "/" }) {
  return (
    <Link href={href} passHref>
      <Fab
        color="primary"
        aria-label="back"
        size="medium"
        sx={{
          position: "fixed",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <KeyboardReturnIcon />
      </Fab>
    </Link>
  );
}
