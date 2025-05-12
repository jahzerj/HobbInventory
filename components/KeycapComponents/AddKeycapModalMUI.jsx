import { createPortal } from "react-dom";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";
import { colorOptions } from "@/utils/colors";
import ImageUploaderMUI, {
  uploadToCloudinary,
} from "@/components/SharedComponents/ImageUploaderMUI";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  Tabs,
  Tab,
  List,
  ListItem,
  Paper,
  IconButton,
  Autocomplete,
  Alert,
  Chip,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function AddKeycapModal({ open, onClose, onAddKeycap, userId }) {
  const [activeTab, setActiveTab] = useState("dropdown");
  const [selectedKeycap, setSelectedKeycap] = useState("");
  const [selectedKits, setSelectedKits] = useState([]);
  const [isAdditionalFieldsVisible, setIsAdditionalFieldsVisible] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // New state for image files and previews
  const [renderImageFile, setRenderImageFile] = useState(null);
  const [renderPreview, setRenderPreview] = useState(null);
  const [kitImageFiles, setKitImageFiles] = useState({});
  const [kitPreviews, setKitPreviews] = useState({});

  const [keycapData, setKeycapData] = useState({
    name: "",
    kits: [{ name: "", image: "" }],
    render: "",
    manufacturer: "",
    material: "",
    profile: "",
    profileHeight: "",
    designer: "",
    geekhacklink: "",
    selectedKits: [],
    selectedColors: [],
    notes: [],
  });

  const { data: dbKeycaps, error: dbKeycapsError } = useSWR(
    activeTab === "dropdown" ? "/api/inventories/keycaps" : null
  );

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setSelectedKeycap("");
    setSelectedKits([]);
    setKeycapData({
      name: "",
      kits: [{ name: "", image: "" }],
      render: "",
      manufacturer: "",
      material: "",
      profile: "",
      profileHeight: "",
      designer: "",
      geekhacklink: "",
      selectedKits: [],
      selectedColors: [],
      notes: [],
    });
    setRenderImageFile(null);
    setRenderPreview(null);
    setKitImageFiles({});
    setKitPreviews({});
    setIsAdditionalFieldsVisible(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setKeycapData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKitChange = (index, field, value) => {
    const newKits = [...keycapData.kits];
    newKits[index][field] = value;
    setKeycapData((prevData) => ({
      ...prevData,
      kits: newKits,
    }));
  };

  const handleAddKit = () => {
    if (keycapData.kits.length < 8) {
      setKeycapData((prevData) => ({
        ...prevData,
        kits: [...prevData.kits, { name: "", image: "" }],
      }));
    }
  };

  // Handle render image selection
  const handleRenderImageSelect = (file, preview) => {
    setRenderImageFile(file);
    setRenderPreview(preview);

    // If it's a URL (file is null), update keycapData
    if (!file && preview) {
      setKeycapData((prev) => ({
        ...prev,
        render: preview,
      }));
    }
  };

  // Handle kit image selection
  const handleKitImageSelect = (index, file, preview) => {
    // Store file for later upload
    setKitImageFiles((prev) => ({
      ...prev,
      [index]: file,
    }));

    // Store preview for display
    setKitPreviews((prev) => ({
      ...prev,
      [index]: preview,
    }));

    // If it's a URL (file is null), update keycapData
    if (!file && preview) {
      const newKits = [...keycapData.kits];
      newKits[index].image = preview;
      setKeycapData((prevData) => ({
        ...prevData,
        kits: newKits,
      }));
    }
  };

  // Code for Checkbox Selection in dropdown mode
  const handleKitSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedKits(
      (prevSelected) =>
        checked
          ? [...prevSelected, value] // Add kit
          : prevSelected.filter((kit) => kit !== value) // Remove kit
    );
  };

  // Color selection handling
  const handleColorSelection = (selectedColor, currentColors) => {
    if (currentColors.includes(selectedColor)) {
      return { error: "Color already selected" };
    }
    if (currentColors.length >= 6) {
      return { error: "Maximum 6 colors allowed" };
    }
    return { newColors: [...currentColors, selectedColor] };
  };

  const handleColorSelect = (event) => {
    const selectedColor = event.target.value;
    if (!selectedColor) return;

    const result = handleColorSelection(
      selectedColor,
      keycapData.selectedColors
    );
    if (result.error) {
      alert(result.error);
      return;
    }

    setKeycapData((prevData) => ({
      ...prevData,
      selectedColors: result.newColors,
    }));
  };

  const handleRemoveColor = (colorToRemove) => {
    setKeycapData((prevData) => ({
      ...prevData,
      selectedColors: prevData.selectedColors.filter(
        (color) => color !== colorToRemove
      ),
    }));
  };

  const handleSubmit = async () => {
    if (activeTab === "manual") {
      // Validation for manual entry
      const hasKitName = keycapData.kits[0].name;
      const hasKitImage =
        keycapData.kits[0].image || kitPreviews[0] || kitImageFiles[0];
      const hasRender = keycapData.render || renderPreview || renderImageFile;

      if (!keycapData.name || !hasKitName || !hasKitImage || !hasRender) {
        alert(
          "Please fill out all required fields: Name, Kit Name, Kit Image, and Render."
        );
        return;
      }

      // Upload render image if needed
      let finalRenderUrl = keycapData.render;
      if (renderImageFile) {
        try {
          finalRenderUrl = await uploadToCloudinary(
            renderImageFile,
            "keycaps_render",
            userId
          );
        } catch (error) {
          alert(`Error uploading render image: ${error.message}`);
          return;
        }
      }

      // Upload kit images if needed and build final kit data
      const finalKits = [...keycapData.kits];
      for (let i = 0; i < finalKits.length; i++) {
        if (kitImageFiles[i]) {
          try {
            finalKits[i].image = await uploadToCloudinary(
              kitImageFiles[i],
              "keycaps_kits",
              userId
            );
          } catch (error) {
            alert(`Error uploading kit image ${i + 1}: ${error.message}`);
            return;
          }
        }
      }

      // For manual entry, set the selectedKits to be the kit names
      const kitNames = finalKits.map((kit) => kit.name);

      // Create a complete keycap object with all fields
      const keycapToAdd = {
        name: keycapData.name,
        manufacturer: keycapData.manufacturer,
        profile: keycapData.profile || "",
        material: keycapData.material || "",
        profileHeight: keycapData.profileHeight || "",
        designer: keycapData.designer || "",
        geekhacklink: keycapData.geekhacklink || "",
        render: finalRenderUrl,
        kits: finalKits,
        selectedKits: kitNames,
        selectedColors: keycapData.selectedColors,
        notes: [],
      };

      // Add to inventory (send complete object)
      onAddKeycap(keycapToAdd);
    } else if (activeTab === "dropdown") {
      // Validation for dropdown selection
      if (!selectedKeycap || selectedKits.length === 0) {
        alert("Please select a keycap set and at least one kit.");
        return;
      }

      // Find the selected keycap object
      const selectedKeycapObj = dbKeycaps.find(
        (keycap) => keycap.name === selectedKeycap
      );

      if (!selectedKeycapObj) {
        alert("Error: Could not find selected keycap set.");
        return;
      }

      // Normalize the database colors to match colorOptions case
      const normalizedColors =
        selectedKeycapObj.colors
          ?.map((dbColor) => {
            const matchingColor = colorOptions.find(
              (option) => option.name.toLowerCase() === dbColor.toLowerCase()
            );
            return matchingColor ? matchingColor.name : null;
          })
          .filter(Boolean) || [];

      // Create the keycap to add with all fields
      const keycapToAdd = {
        keycapDefinitionId: selectedKeycapObj._id,
        name: selectedKeycapObj.name,
        manufacturer: selectedKeycapObj.manufacturer,
        profile: selectedKeycapObj.profile || "",
        material: selectedKeycapObj.material || "",
        profileHeight: selectedKeycapObj.profileHeight || "",
        designer: selectedKeycapObj.designer || "",
        geekhacklink: selectedKeycapObj.geekhacklink || "",
        render: selectedKeycapObj.render,
        kits: selectedKeycapObj.kits || [],
        selectedKits: selectedKits,
        selectedColors: normalizedColors,
        notes: [],
      };

      // Add to inventory (send complete object)
      onAddKeycap(keycapToAdd);
    }

    resetForm();
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <Modal
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      aria-labelledby="add-keycap-modal-title"
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
          id="add-keycap-modal-title"
          variant="h5"
          component="h2"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Add Keycap Set
        </Typography>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onChange={(event, newTab) => {
            if (activeTab !== newTab) {
              resetForm();
              setActiveTab(newTab);
            }
          }}
          sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
          variant="fullWidth"
        >
          <Tab label="Select from Database" value="dropdown" />
          <Tab label="Manual Entry" value="manual" />
        </Tabs>

        {/* Tab Content */}
        {activeTab === "dropdown" ? (
          // Database Selection Content
          <Box sx={{ textAlign: "center" }}>
            {dbKeycapsError ? (
              <Typography color="error">
                Error loading keycaps. Please try again.
              </Typography>
            ) : !dbKeycaps ? (
              <Typography>Loading keycaps...</Typography>
            ) : (
              <>
                {/* Dropdown: Select Keycap Set */}
                <FormControl fullWidth margin="normal" size="small">
                  <Autocomplete
                    value={selectedKeycap}
                    onChange={(event, newValue) => {
                      setSelectedKeycap(newValue);
                      setSelectedKits([]);
                    }}
                    inputValue={searchTerm}
                    onInputChange={(event, newInputValue) => {
                      setSearchTerm(newInputValue);
                    }}
                    options={dbKeycaps
                      .map((keycap) => keycap.name)
                      .sort((a, b) => a.localeCompare(b))}
                    renderInput={(params) => (
                      <TextField {...params} label="Keycap Set" size="small" />
                    )}
                    noOptionsText="No matching keycaps found"
                  />
                </FormControl>

                {/* Checkbox Selection for Kits */}
                {selectedKeycap && (
                  <FormControl
                    component={Paper}
                    variant="outlined"
                    sx={{ p: 2, mt: 2, width: "100%" }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, fontWeight: 500 }}
                    >
                      Available Kits
                    </Typography>
                    <List dense sx={{ width: "100%" }}>
                      {dbKeycaps
                        .find((keycap) => keycap.name === selectedKeycap)
                        ?.kits?.map((kit) => (
                          <ListItem
                            key={kit.name}
                            dense
                            disablePadding
                            sx={{ py: 0.5 }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedKits.includes(kit.name)}
                                  onChange={handleKitSelection}
                                  value={kit.name}
                                  size="small"
                                />
                              }
                              label={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  {kit.image && (
                                    <Image
                                      src={kit.image}
                                      alt={kit.name}
                                      width={50}
                                      height={50}
                                      style={{
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                      }}
                                      priority
                                    />
                                  )}
                                  <Typography variant="body2">
                                    {kit.name}
                                  </Typography>
                                </Box>
                              }
                              sx={{ width: "100%", m: 0 }}
                            />
                          </ListItem>
                        )) || (
                        <Typography variant="body2" sx={{ p: 1 }}>
                          No kits available for this set.
                        </Typography>
                      )}
                    </List>
                  </FormControl>
                )}

                {/* Display Selected Items */}
                {selectedKeycap && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Set:</strong> {selectedKeycap}
                  </Typography>
                )}
                {selectedKits.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Selected Kits:</strong> {selectedKits.join(", ")}
                  </Typography>
                )}

                {selectedKeycap && selectedKits.length === 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Please select at least one kit before adding this keycap
                    set.
                  </Alert>
                )}
              </>
            )}
          </Box>
        ) : (
          // Manual Entry Content
          <>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Keycap Set Details
              </Typography>
              <TextField
                fullWidth
                name="name"
                label="Keycap Name"
                value={keycapData.name}
                onChange={handleChange}
                required
                margin="dense"
                size="small"
              />
            </Paper>

            {keycapData.kits.map((kit, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, position: "relative" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    mb: 2,
                  }}
                >
                  {index > 0 && (
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        left: -30,
                        bgcolor: "#dc3545",
                        width: 24,
                        height: 24,
                        color: "white",
                        "&:hover": {
                          bgcolor: "#c82333",
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => {
                        const newKits = [...keycapData.kits];
                        newKits.splice(index, 1);
                        setKeycapData((prevData) => ({
                          ...prevData,
                          kits: newKits,
                        }));

                        // Also remove any stored image files/previews
                        const newKitImageFiles = { ...kitImageFiles };
                        const newKitPreviews = { ...kitPreviews };
                        delete newKitImageFiles[index];
                        delete newKitPreviews[index];
                        setKitImageFiles(newKitImageFiles);
                        setKitPreviews(newKitPreviews);
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  )}

                  <TextField
                    fullWidth
                    label={`Kit ${index + 1} Name`}
                    value={kit.name}
                    onChange={(event) =>
                      handleKitChange(index, "name", event.target.value)
                    }
                    required
                    margin="dense"
                    size="small"
                  />

                  {index === keycapData.kits.length - 1 &&
                    keycapData.kits.length < 8 && (
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          right: -30,
                          bgcolor: "#007bff",
                          width: 24,
                          height: 24,
                          color: "white",
                          "&:hover": {
                            bgcolor: "#0069d9",
                            opacity: 0.8,
                          },
                        }}
                        onClick={handleAddKit}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    )}
                </Box>

                {/* Replace ImageUploader with ImageUploaderMUI */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Kit Image
                  </Typography>
                  <ImageUploaderMUI
                    onImageSelect={(file, preview) =>
                      handleKitImageSelect(index, file, preview)
                    }
                    prePopulatedUrl={kitPreviews[index] || kit.image}
                  />
                </Box>
              </Paper>
            ))}

            <Paper sx={{ p: 2, mb: 2 }}>
              {/* Replace Render ImageUploader with ImageUploaderMUI */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Render Image
                </Typography>
                <ImageUploaderMUI
                  onImageSelect={handleRenderImageSelect}
                  prePopulatedUrl={renderPreview || keycapData.render}
                />
              </Box>
            </Paper>

            <Button
              variant="text"
              onClick={() =>
                setIsAdditionalFieldsVisible(!isAdditionalFieldsVisible)
              }
              sx={{ mb: 2 }}
            >
              {isAdditionalFieldsVisible
                ? "Hide Additional Information"
                : "Add Additional Information"}
            </Button>

            {isAdditionalFieldsVisible && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  name="manufacturer"
                  label="Manufacturer (e.g., GMK)"
                  value={keycapData.manufacturer}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="material"
                  label="Material (e.g., ABS)"
                  value={keycapData.material}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="profile"
                  label="Profile (e.g., Cherry)"
                  value={keycapData.profile}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="profileHeight"
                  label="Profile Height (e.g., 1-1-2-3-4-4)"
                  value={keycapData.profileHeight}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="designer"
                  label="Designer"
                  value={keycapData.designer}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  type="url"
                  name="geekhacklink"
                  label="Geekhack Link"
                  value={keycapData.geekhacklink}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />

                {/* Color Selection Section */}
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 3, mb: 1, fontWeight: 500 }}
                >
                  Choose Colors (up to 6)
                </Typography>

                <FormControl fullWidth margin="dense" size="small">
                  <Select
                    displayEmpty
                    value=""
                    onChange={handleColorSelect}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                  >
                    <MenuItem value="" disabled>
                      -- Choose up to 6 colors --
                    </MenuItem>
                    {colorOptions
                      .filter(
                        (color) =>
                          !keycapData.selectedColors.includes(color.name)
                      )
                      .map((color) => (
                        <MenuItem key={color.name} value={color.name}>
                          {color.name} {color.emoji}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                {keycapData.selectedColors.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Selected Colors
                    </Typography>
                    <Grid container spacing={1}>
                      {keycapData.selectedColors.map((color) => {
                        const colorData = colorOptions.find(
                          (option) => option.name === color
                        );
                        return (
                          <Grid item xs={4} key={color}>
                            <Chip
                              label={
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box component="span">{colorData?.emoji}</Box>
                                  <Box component="span" sx={{ ml: 1 }}>
                                    {color}
                                  </Box>
                                </Box>
                              }
                              sx={{
                                border: (theme) =>
                                  `2px solid ${
                                    theme.palette.mode === "dark" &&
                                    ["white", "beige"].includes(
                                      colorData?.name.toLowerCase()
                                    )
                                      ? theme.palette.grey[600]
                                      : colorData?.name.toLowerCase() ||
                                        theme.palette.text.primary
                                  }`,
                                fontWeight: "bold",
                                width: "100%",
                                justifyContent: "center",
                                color: (theme) => {
                                  const colorLower =
                                    colorData?.name.toLowerCase();
                                  if (
                                    ["white", "beige", "yellow"].includes(
                                      colorLower
                                    )
                                  ) {
                                    return theme.palette.mode === "dark"
                                      ? "inherit"
                                      : theme.palette.text.primary;
                                  }
                                  if (
                                    ["black", "navy", "purple"].includes(
                                      colorLower
                                    )
                                  ) {
                                    return theme.palette.mode === "dark"
                                      ? theme.palette.text.primary
                                      : theme.palette.common.white;
                                  }
                                  return "inherit";
                                },
                              }}
                              onDelete={() => handleRemoveColor(color)}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
              </Paper>
            )}
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              resetForm();
              onClose();
            }}
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
            disabled={
              (activeTab === "manual" &&
                (!keycapData.name ||
                  !keycapData.kits[0].name ||
                  !(
                    keycapData.kits[0].image ||
                    kitPreviews[0] ||
                    kitImageFiles[0]
                  ) ||
                  !(keycapData.render || renderPreview || renderImageFile))) ||
              (activeTab === "dropdown" &&
                (!selectedKeycap || selectedKits.length === 0))
            }
            sx={{ width: "49%" }}
          >
            Add Keycaps
          </Button>
        </Box>
      </Box>
    </Modal>,
    document.getElementById("portal")
  );
}
