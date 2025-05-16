import { createPortal } from "react-dom";
import { useState } from "react";
import ImageUploaderMUI, {
  uploadToCloudinary,
} from "@/components/SharedComponents/ImageUploaderMUI";
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

  // Image uploader state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setKitData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageSelect = (file, preview) => {
    setSelectedImage(file);
    setImageUrl(preview);
  };

  const handleSubmit = async () => {
    if (!kitData.name) {
      alert("Please fill out the kit name.");
      return;
    }

    // Verify we have either a file or a URL
    if (!selectedImage && !imageUrl) {
      alert("Please provide an image.");
      return;
    }

    // Create a temporary ID for the loading state
    const tempId = `temp-kit-${Date.now()}`;

    // Close the modal immediately
    setKitData({ name: "", image: "" });
    setSelectedImage(null);
    setImageUrl("");
    onClose();

    // Create the kit with a temporary ID and loading state
    const tempKit = {
      name: kitData.name,
      image: "",
      _tempId: tempId,
      isLoading: true,
    };

    // Add the temporary kit to the inventory
    onAddKit(tempKit, true);

    // Process the upload in the background
    processUploadAndSave(tempKit, tempId);
  };

  // New function to handle the background processing
  const processUploadAndSave = async (tempKit, tempId) => {
    try {
      let finalImageUrl = imageUrl;

      // Upload the image if a file was selected
      if (selectedImage) {
        try {
          finalImageUrl = await uploadToCloudinary(
            selectedImage,
            "keycaps_kits",
            userId
          );
        } catch (error) {
          console.error(`Error uploading image: ${error.message}`);
          // Continue with empty image if upload fails
          finalImageUrl = "";
        }
      }

      // Create the final kit with the image URL, but keep the tempId
      const finalKit = {
        name: kitData.name,
        image: finalImageUrl,
        _tempId: tempId,
        isLoading: false,
      };

      // Replace the temp kit with the final one
      onAddKit(finalKit, false, tempId);
    } catch (error) {
      console.error("Error in background processing:", error);
      // Handle error state - remove the temp kit
      onAddKit(null, false, tempId);
    }
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

          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Kit Image
            </Typography>
            <ImageUploaderMUI
              onImageSelect={handleImageSelect}
              prePopulatedUrl={imageUrl}
              category="keycaps_kits"
              userId={userId}
            />
          </Box>
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
            disabled={!kitData.name || (!selectedImage && !imageUrl)}
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
