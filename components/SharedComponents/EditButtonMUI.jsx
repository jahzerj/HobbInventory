import { Fab, Zoom } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function EditButtonMUI({ isEditMode, onToggleEdit }) {
  return (
    <Zoom in={true}>
      <Fab
        color={isEditMode ? "error" : "primary"}
        onClick={onToggleEdit}
        aria-label={isEditMode ? "Close Edit Mode" : "Edit Inventory"}
        sx={{
          position: "fixed",
          bottom: 10,
          left: 10,
          zIndex: 1000,
          width: isEditMode ? 160 : 45,
          height: 45,
          minWidth: 45,
          borderRadius: isEditMode ? 2 : "50%",
          transition: "all 0.3s ease-in-out",
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
    </Zoom>
  );
}
