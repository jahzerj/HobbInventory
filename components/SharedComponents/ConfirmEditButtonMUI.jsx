import { Fab } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function ConfirmEditButtonMUI({ isEditMode, onSaveChanges }) {
  return (
    <Fab
      color="primary"
      variant="extended"
      onClick={onSaveChanges}
      aria-label="Confirm Edits"
    >
      <CheckIcon sx={{ mr: 1 }} />
      Confirm Edits
    </Fab>
  );
}
