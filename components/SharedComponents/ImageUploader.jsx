// components/ImageUploader.jsx
import { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import UploadIcon from "@/components/icons/UploadIcon";

export default function ImageUploader({
  onImageUpload,
  prePopulatedUrl,
  category,
}) {
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", imageFile);

    // Always pass the category, even if undefined
    // The server will handle validation
    formData.append("category", category);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Call the callback function with the secure_url
        onImageUpload(data.secure_url);

        // Clear the file and preview after successful upload
        setImageFile(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData.message);
        alert("Image upload failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <UploadArea>
      <FileInputLabel>
        <UploadIcon />
        <span>Choose Photo</span>
        <FileInput
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleFileChange}
        />
      </FileInputLabel>

      <Divider>
        <span>or</span>
      </Divider>

      {isUploading ? (
        <UploadingIndicator>
          <StyledSpan /> Uploading...
        </UploadingIndicator>
      ) : (
        imagePreview && (
          <ImagePreview>
            <Image src={imagePreview} alt="Preview" width={100} height={100} />
          </ImagePreview>
        )
      )}

      {imageFile && !isUploading && (
        <UploadButton
          type="button"
          onClick={handleImageUpload}
          disabled={isUploading}
        >
          Upload Image
        </UploadButton>
      )}
    </UploadArea>
  );
}

const UploadArea = styled.div`
  background-color: #fff;
  border-radius: 4px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    margin-top: 5px;
    font-size: 14px;
  }
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  width: 1px;
  height: 1px;
`;

const Divider = styled.div`
  width: 100%;
  text-align: center;
  margin: 10px 0;
  position: relative;

  &:before,
  &:after {
    content: "";
    height: 1px;
    width: 40%;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 50%;
  }

  &:before {
    left: 0;
  }
  &:after {
    right: 0;
  }

  span {
    padding: 0 10px;
    font-size: 12px;
    position: relative;
  }
`;

const UploadButton = styled.button`
  padding: 8px 15px;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  &:disabled {
    opacity: 0.5;
  }
`;

const UploadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  margin-top: 10px;
`;

const ImagePreview = styled.div`
  width: 100%;
  margin: 10px auto 0;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 200px;
    height: 200px;
    border-radius: 5px;
    border: 1px solid #ddd;
    object-fit: contain;
    background-color: #f0f0f0;
  }
`;

const StyledSpan = styled.span`
  width: 32px;
  height: 32px;
  border: 3px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  border-color: #007bff;
  border-bottom-color: transparent;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
