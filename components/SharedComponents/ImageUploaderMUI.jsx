import { useState } from "react";
import Image from "next/image";
import { Box, Button, Typography, Divider, styled } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import URLValidator, { validateImageUrl } from "./URLValidator";

// Static method for uploading to Cloudinary
export const uploadToCloudinary = async (file, category, userId) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("category", category);
  formData.append("userId", userId);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Image upload failed");
  }

  const data = await response.json();
  return data.secure_url;
};

// Hidden file input to be triggered by the button
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ImageUploaderMUI({ onImageSelect, prePopulatedUrl }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(prePopulatedUrl || "");

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      alert(
        `File size exceeds 10MB limit. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB.`
      );
      event.target.value = "";
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result;
      setPreviewUrl(preview);
      setSelectedFile(file);

      // Clear URL input when file is selected
      setImageUrl("");

      // Call parent callback
      if (onImageSelect) {
        onImageSelect(file, preview);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle URL input
  const handleUrlChange = (event) => {
    const url = event.target.value;
    setImageUrl(url);

    // Clear file selection when URL is entered
    if (url) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }

    // Call parent callback with null file and the URL
    if (onImageSelect) {
      onImageSelect(null, url);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "background.paper",
        borderRadius: 1,
      }}
    >
      {/* File upload button */}
      <Button
        component="label"
        variant="outlined"
        startIcon={<UploadFileIcon />}
        sx={{ mb: 1 }}
      >
        Choose Photo (Max 10MB)
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>

      {/* Divider with "or" */}
      <Box sx={{ width: "100%", position: "relative", my: 2 }}>
        <Divider>
          <Typography variant="caption" color="text.secondary">
            or
          </Typography>
        </Divider>
      </Box>

      {/* URL input using URLValidator */}
      <URLValidator
        value={imageUrl}
        onChange={handleUrlChange}
        label="Image URL"
        fullWidth
      />

      {/* Preview image if available */}
      {(previewUrl || (prePopulatedUrl && !selectedFile)) && (
        <Box
          sx={{
            mt: 2,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 100,
              height: 100,
              borderRadius: 1,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Image
              src={previewUrl || prePopulatedUrl}
              alt="Image preview"
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
