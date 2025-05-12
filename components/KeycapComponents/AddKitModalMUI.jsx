import { createPortal } from "react-dom";
import { useState } from "react";
import ImageUploader from "@/components/SharedComponents/ImageUploader";
import URLValidator, {
  validateImageUrl,
} from "@/components/SharedComponents/URLValidator";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";

export default function AddKitModalMUI({ open, onClose, onAddKit, userId }) {
  const [kitData, setKitData] = useState({
    name: "",
    image: "",
  });
  const [urlError, setUrlError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "image") {
      setUrlError(!validateImageUrl(value) && value !== "");
    }

    setKitData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!kitData.name) {
      alert("Please fill out the kit name.");
      return;
    }

    if (!kitData.image) {
      alert("Please provide an image URL.");
      return;
    }

    if (!validateImageUrl(kitData.image)) {
      setUrlError(true);
      alert(
        "Please enter a valid image URL (must be .jpg, .jpeg, .png, .gif, or .webp)"
      );
      return;
    }

    onAddKit(kitData);
    setKitData({ name: "", image: "" });
    setUrlError(false);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <Modal open={open} onClose={onClose} aria-labelledby="add-kit-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 400,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <Typography
          id="add-kit-modal-title"
          variant="h5"
          component="h2"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Add New Kit
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              name="name"
              label="Kit Name"
              value={kitData.name}
              onChange={handleChange}
              required
              margin="dense"
              size="small"
            />
          </Box>

          <ImageUploader
            onImageUpload={(secureUrl) => {
              setKitData((prevData) => ({
                ...prevData,
                image: secureUrl,
              }));
              setUrlError(false);
            }}
            prePopulatedUrl={kitData.image}
            category="keycaps_kits"
            userId={userId}
          />

          <URLValidator
            name="image"
            value={kitData.image}
            onChange={handleChange}
            error={urlError}
            required
            label="Kit Image URL"
          />
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{
              width: "49%",
              "&:hover": {
                backgroundColor: "secondary.main",
                color: "white",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!kitData.name || !kitData.image || urlError}
            sx={{ width: "49%" }}
          >
            Add Kit
          </Button>
        </Box>
      </Box>
    </Modal>,
    document.getElementById("portal")
  );
}
