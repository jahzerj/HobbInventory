import { Fab, Zoom } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function CancelEditButtonMUI({ onCancel }) {
  return (
    <Zoom in={true}>
      <Fab
        color="secondary"
        variant="extended"
        onClick={onCancel}
        aria-label="Cancel Edits"
        sx={{
          border: "1px solid",
          backgroundColor: "transparent",
          color: "secondary.main",
          "&:hover": {
            backgroundColor: "secondary.main",
            color: "white",
          },
        }}
      >
        <CloseIcon sx={{ mr: 1 }} />
        Cancel Edits
      </Fab>
    </Zoom>
  );
}
