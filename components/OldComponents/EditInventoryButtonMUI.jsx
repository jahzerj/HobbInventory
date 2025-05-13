import { Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

export default function EditInventoryButtonMUI({ isEditMode, onToggleEdit }) {
  return (
    <Fab
      color={isEditMode ? "error" : "primary"}
      variant={isEditMode ? "extended" : "circular"}
      aria-label={isEditMode ? "Close Edit Mode" : "Edit"}
      onClick={onToggleEdit}
      sx={{
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 1000,
      }}
    >
      {isEditMode ? (
        <>
          <CloseIcon sx={{ mr: 1 }} /> Close Edit Mode
        </>
      ) : (
        <EditIcon />
      )}
    </Fab>
  );
}
