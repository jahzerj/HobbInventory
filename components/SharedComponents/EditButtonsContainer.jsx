import { Box } from "@mui/material";
import CancelEditButtonMUI from "./CancelEditButtonMUI";
import ConfirmEditButtonMUI from "./ConfirmEditButtonMUI";

export default function EditButtonsContainer({ onCancel, onConfirm }) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 10,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 2,
        zIndex: 1000,
      }}
    >
      <CancelEditButtonMUI onCancel={onCancel} />
      <ConfirmEditButtonMUI onSaveChanges={onConfirm} />
    </Box>
  );
}
