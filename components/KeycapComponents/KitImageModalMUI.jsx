import Image from "next/image";
import { Modal, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function KitImageModalMUI({ open, onClose, imageUrl, kitName }) {
  // Ensure the component works even if given a kit object instead of direct URL
  const imageSource =
    typeof imageUrl === "object" ? imageUrl.image || imageUrl.pic : imageUrl;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="kit-image-modal-title"
      BackdropProps={{
        sx: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 2.5,
          width: { xs: 350, md: 680 },
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? `0px 0px 0px 1px ${theme.palette.divider}, 0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)`
              : 24,
          border: (theme) =>
            theme.palette.mode === "dark"
              ? `1px solid ${theme.palette.divider}`
              : "none",
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label="Close Image"
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            zIndex: 1002,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="kit-image-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          {kitName}
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={imageSource}
            alt={kitName}
            width={400}
            height={225}
            sizes="(min-width: 768px) 640px, 400px"
            priority
            style={{
              objectFit: "cover",
              width: "100%",
              height: "auto",
              maxHeight: { xs: "225px", md: "320px" },
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
}
