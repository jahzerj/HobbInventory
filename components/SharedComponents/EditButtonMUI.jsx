import { Fab, Zoom } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function EditButtonMUI({ onEdit }) {
  return (
    <Zoom in={true}>
      <Fab
        color="primary"
        variant="circular"
        size="medium"
        onClick={onEdit}
        aria-label="Edit Inventory Item"
        sx={{
          position: "fixed",
          bottom: 10,
          right: 8,
          zIndex: 1000,
        }}
      >
        <EditIcon />
      </Fab>
    </Zoom>
  );
}
