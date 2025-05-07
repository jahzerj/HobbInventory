import { Fab, Zoom } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function ConfirmEditButtonMUI({ onSaveChanges }) {
  return (
    <Zoom in={true}>
      <Fab
        color="primary"
        variant="extended"
        onClick={onSaveChanges}
        aria-label="Confirm Edits"
        sx={{
          zIndex: 1000,
        }}
      >
        <CheckIcon sx={{ mr: 1 }} />
        Confirm Edits
      </Fab>
    </Zoom>
  );
}
