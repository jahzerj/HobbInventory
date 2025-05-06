import { Fab, Zoom } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

export default function EditButtonMUI({ isEditMode, onToggleEdit }) {
  return (
    <Zoom in={true}>
      {isEditMode ? (
        <Fab
          color="secondary"
          variant="extended"
          onClick={onToggleEdit}
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
      ) : (
        <Fab
          color="primary"
          variant="circular"
          size="medium"
          onClick={onToggleEdit}
          aria-label="Edit Inventory Item"
        >
          <EditIcon />
        </Fab>
      )}
    </Zoom>
  );
}
