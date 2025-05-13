import { useState, useEffect } from "react";
import { TextField, FormHelperText } from "@mui/material";

// URL validation helper function that can be exported and used elsewhere
export const validateImageUrl = (url) => {
  if (!url) return true; // Empty is valid for optional fields

  // Basic URL validation regex for image files
  const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))(?:\?.*)?$/i;
  return urlRegex.test(url);
};

/**
 * URLValidator component - Validates image URLs in forms
 *
 * @param {string} value - Current URL value
 * @param {function} onChange - Change handler function
 * @param {string} name - Field name
 * @param {boolean} required - Whether field is required
 * @param {boolean} error - External error state (optional)
 * @param {string} label - Field label
 * @param {object} sx - Additional styling
 * @param {object} inputProps - Additional input properties
 * @param {boolean} showHelper - Whether to show helper text always
 * @param {object} TextFieldProps - Additional TextField properties
 */
export default function URLValidator({
  value,
  onChange,
  name = "image",
  required = false,
  error: externalError,
  label = "Image URL",
  sx = {},
  inputProps = {},
  showHelper = true,
  ...TextFieldProps
}) {
  const [internalError, setInternalError] = useState(false);

  // Check if we should use external or internal error state
  const error = externalError !== undefined ? externalError : internalError;

  // Validate on mount and when value changes
  useEffect(() => {
    // Only validate if there's a value (for required fields this is checked elsewhere)
    if (value) {
      setInternalError(!validateImageUrl(value));
    } else {
      setInternalError(false);
    }
  }, [value]);

  const handleChange = (event) => {
    const newValue = event.target.value;

    // Update internal error state
    if (newValue) {
      setInternalError(!validateImageUrl(newValue));
    } else {
      setInternalError(false);
    }

    // Call parent onChange handler
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <>
      <TextField
        fullWidth
        type="url"
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        required={required}
        error={error}
        margin="dense"
        size="small"
        helperText={
          error
            ? "Please enter a valid image URL (.jpg, .jpeg, .png, .gif, or .webp)"
            : ""
        }
        sx={sx}
        inputProps={{
          pattern: "https?://.*\\.(png|jpg|jpeg|gif|webp)(\\?.*)?",
          ...inputProps,
        }}
        {...TextFieldProps}
      />
      {showHelper && (
        <FormHelperText>
          URLs must end with .jpg, .jpeg, .png, .gif, or .webp
        </FormHelperText>
      )}
    </>
  );
}
