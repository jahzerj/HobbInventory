import { createPortal } from "react-dom";
import { useState } from "react";
import ImageUploaderMUI, {
  uploadToCloudinary,
} from "@/components/SharedComponents/ImageUploaderMUI";
import { Modal, Box, Typography, Button, Paper } from "@mui/material";

export default function AddRenderModalMUI({
  open,
  onClose,
  onAddRender,
  userId,
}) {
  // Image uploader state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageSelect = (file, preview) => {
    setSelectedImage(file);
    setImageUrl(preview);
  };

  const handleSubmit = async () => {
    // Verify we have either a file or a URL
    if (!selectedImage && !imageUrl) {
      alert("Please provide an image.");
      return;
    }

    // Create a temporary ID for the loading state
    const tempId = `temp-render-${Date.now()}`;

    // Close the modal immediately
    setSelectedImage(null);
    setImageUrl("");
    onClose();

    // Create a temporary render URL with loading state
    const tempRender = {
      url: "",
      _tempId: tempId,
      isLoading: true,
    };

    // Add the temporary render to the keyboard
    onAddRender(tempRender, true);

    // Process the upload in the background
    processUploadAndSave(tempRender, tempId);
  };

  // Function to handle the background processing
  const processUploadAndSave = async (tempRender, tempId) => {
    try {
      let finalRender = null;

      // Upload the image if a file was selected
      if (selectedImage) {
        try {
          const uploadResult = await uploadToCloudinary(
            selectedImage,
            "keyboards_renders",
            userId
          );

          // Add detailed logging
          console.log("Cloudinary upload result:", uploadResult);

          // Check what properties are available on the result
          if (uploadResult) {
            console.log("Available properties:", Object.keys(uploadResult));

            // Try different possible URL formats from Cloudinary
            if (uploadResult.secure_url) {
              finalRender = uploadResult.secure_url;
              console.log("Using secure_url:", finalRender);
            } else if (uploadResult.url) {
              finalRender = uploadResult.url;
              console.log("Using url:", finalRender);
            } else if (typeof uploadResult === "string") {
              finalRender = uploadResult;
              console.log("Using string value:", finalRender);
            } else {
              console.error("No URL found in upload result");
              finalRender = null;
            }
          } else {
            console.error("Upload result is null or undefined");
          }
        } catch (error) {
          console.error(`Error uploading image: ${error.message}`);
          finalRender = null;
        }
      } else if (imageUrl) {
        finalRender = imageUrl;
        console.log("Using provided imageUrl:", finalRender);
      }

      console.log("Final render value:", finalRender);
      console.log("Calling onAddRender with tempId:", tempId);

      // Replace the temp render with the final one
      onAddRender(finalRender, false, tempId);
    } catch (error) {
      console.error("Error in background processing:", error);
      // Handle error state - remove the temp render
      onAddRender(null, false, tempId);
    }
  };

  if (!open) return null;

  return createPortal(
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-render-modal-title"
    >
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
          id="add-render-modal-title"
          variant="h5"
          component="h2"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Add New Render
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Upload Render Image
            </Typography>
            <ImageUploaderMUI
              onImageSelect={handleImageSelect}
              prePopulatedUrl={imageUrl}
              category="keyboards_renders"
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
            disabled={!selectedImage && !imageUrl}
            sx={{ width: "49%" }}
          >
            Add Render
          </Button>
        </Box>
      </Box>
    </Modal>,
    document.getElementById("portal")
  );
}
