import { createPortal } from "react-dom";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";
import { nanoid } from "nanoid";
import ImageUploaderMUI, {
  uploadToCloudinary,
} from "../SharedComponents/ImageUploaderMUI";
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
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  List,
  ListItem,
  Divider,
  Paper,
  IconButton,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export const LAYOUT_ORDER = [
  "40%",
  "60%",
  "65%",
  "70%",
  "75%",
  "TKL",
  "1800",
  "Full Size",
];

export default function AddKeyboardModal({
  open,
  onClose,
  onAddKeyboard,
  userId,
}) {
  const [activeTab, setActiveTab] = useState("dropdown");
  const [selectedKeyboard, setSelectedKeyboard] = useState("");
  const [isAdditionalFieldsVisible, setIsAdditionalFieldsVisible] =
    useState(false);
  const [noteText, setNoteText] = useState("");

  // New states for file uploads
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [keyboardData, setKeyboardData] = useState({
    name: "",
    designer: "",
    layout: "",
    renders: [""],
    blocker: "",
    switchType: "",
    plateMaterial: [],
    mounting: [],
    typingAngle: "",
    frontHeight: "",
    surfaceFinish: "",
    color: "",
    weightMaterial: "",
    buildWeight: "",
    pcbOptions: {
      thickness: "1.6mm",
      material: "FR4",
      backspace: [],
      layoutStandard: [],
      leftShift: [],
      capslock: [],
      rightShift: [],
      numpad: {
        enter: [],
        plus: [],
        zero: [],
        orientation: [],
      },
      spacebar: [],
      flexCuts: false,
    },
    builds: [],
    notes: [],
  });

  const { data: dbKeyboards, error: dbKeyboardsError } = useSWR(
    activeTab === "dropdown" ? "/api/inventories/keyboards" : null
  );

  // First, add these new state variables at the top of your component
  const [selectedLayout, setSelectedLayout] = useState("");
  const [selectedKeyboardId, setSelectedKeyboardId] = useState("");

  // Replace the existing layouts sorting with this:
  const layouts = dbKeyboards
    ? [...new Set(dbKeyboards.map((kb) => kb.layout))].sort((a, b) => {
        const indexA = LAYOUT_ORDER.indexOf(a);
        const indexB = LAYOUT_ORDER.indexOf(b);

        // If both layouts are in our predefined order, sort by that
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }

        // If only one layout is in our order, prioritize it
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // For any layouts not in our predefined order, sort alphabetically
        return a.localeCompare(b);
      })
    : [];

  // Get keyboards filtered by selected layout
  const filteredKeyboards = dbKeyboards
    ? dbKeyboards
        .filter((kb) => kb.layout === selectedLayout)
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  // Add these state variables at the top of your component
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setSelectedKeyboard("");
    setSelectedLayout("");
    setSelectedKeyboardId("");
    setSearchTerm("");
    setKeyboardData({
      name: "",
      designer: "",
      layout: "",
      renders: [""],
      blocker: "",
      switchType: "",
      plateMaterial: [],
      mounting: [],
      typingAngle: "",
      frontHeight: "",
      surfaceFinish: "",
      color: "",
      weightMaterial: "",
      buildWeight: "",
      pcbOptions: {
        thickness: "1.6mm",
        material: "FR4",
        backspace: [],
        layoutStandard: [],
        leftShift: [],
        capslock: [],
        rightShift: [],
        numpad: {
          enter: [],
          plus: [],
          zero: [],
          orientation: [],
        },
        spacebar: [],
        flexCuts: false,
      },
      builds: [],
      notes: [],
    });
    setNoteText("");
    setIsAdditionalFieldsVisible(false);
    setSelectedImages([]);
    setPreviewUrls([]);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Validation for length
    if (name === "name" && value.length > 40) {
      alert("Keyboard name cannot exceed 40 characters.");
      return;
    }

    // Handle PCB options
    if (name.startsWith("pcbOptions.")) {
      const option = name.split(".")[1];
      setKeyboardData((prevData) => ({
        ...prevData,
        pcbOptions: {
          ...prevData.pcbOptions,
          [option]: type === "checkbox" ? checked : value,
        },
      }));
      return;
    }

    // Handle regular fields
    setKeyboardData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRenderChange = (index, value) => {
    const newRenders = [...keyboardData.renders];
    newRenders[index] = value;
    setKeyboardData((prevData) => ({
      ...prevData,
      renders: newRenders,
    }));
  };

  const handleAddRender = () => {
    if (keyboardData.renders.length < 5) {
      setKeyboardData((prevData) => ({
        ...prevData,
        renders: [...prevData.renders, ""],
      }));

      // Add placeholder for image
      setSelectedImages([...selectedImages, null]);
      setPreviewUrls([...previewUrls, null]);
    }
  };

  const handleAddNote = () => {
    if (noteText.trim() === "") return;

    setKeyboardData((prevData) => ({
      ...prevData,
      notes: [
        ...prevData.notes,
        {
          _id: nanoid(),
          text: noteText,
          timestamp: new Date(),
        },
      ],
    }));

    setNoteText("");
  };

  const handleImageSelect = (index, file, preview) => {
    // Update the selected image and preview
    const newSelectedImages = [...selectedImages];
    newSelectedImages[index] = file;
    setSelectedImages(newSelectedImages);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls[index] = preview;
    setPreviewUrls(newPreviewUrls);

    // If it's a URL (no file), update the renders array directly
    if (!file && preview) {
      handleRenderChange(index, preview);
    }
  };

  // Add these handler functions
  const handleLayoutChange = (event) => {
    const layout = event.target.value;
    setSelectedLayout(layout);
    setSelectedKeyboardId(""); // Reset keyboard selection when layout changes
    setSelectedKeyboard(""); // Reset the keyboard name as well
  };

  const handleSubmit = async () => {
    if (activeTab === "manual") {
      // Validation for manual entry
      if (
        !keyboardData.name ||
        !keyboardData.designer ||
        !keyboardData.layout ||
        !keyboardData.blocker ||
        !keyboardData.switchType
      ) {
        alert(
          "Please fill out all required fields: Name, Designer, Layout, Blocker, and Switch Type."
        );
        return;
      }

      // Create a temporary ID for the loading state
      const tempId = `temp-${Date.now()}`;

      // Close the modal immediately
      resetForm();
      onClose();

      // Create the keyboard with a temporary ID and loading state
      const tempKeyboard = {
        _id: tempId,
        name: keyboardData.name,
        designer: keyboardData.designer,
        layout: keyboardData.layout,
        isLoading: true, // Flag to indicate loading state
        renders: [], // Will be populated after upload
        // Include other fields from keyboardData
        blocker: keyboardData.blocker,
        switchType: keyboardData.switchType,
        plateMaterial: keyboardData.plateMaterial,
        mounting: keyboardData.mounting,
        typingAngle: keyboardData.typingAngle,
        frontHeight: keyboardData.frontHeight,
        surfaceFinish: keyboardData.surfaceFinish,
        color: keyboardData.color,
        weightMaterial: keyboardData.weightMaterial,
        buildWeight: keyboardData.buildWeight,
        pcbOptions: keyboardData.pcbOptions,
        builds: keyboardData.builds,
        notes: keyboardData.notes,
      };

      // Add the temporary keyboard to the inventory
      onAddKeyboard(tempKeyboard, true); // Pass true to indicate it's a temp keyboard

      // Process the uploads in the background
      processUploadsAndSave(tempKeyboard, tempId);
    } else if (activeTab === "dropdown") {
      // Validation for dropdown entry
      if (!selectedKeyboardId) {
        alert("Please select a layout and keyboard.");
        return;
      }

      const selectedKeyboardObj = dbKeyboards.find(
        (keyboard) => keyboard._id === selectedKeyboardId
      );

      if (!selectedKeyboardObj) {
        alert("Error: Could not find selected keyboard.");
        return;
      }

      // Create the keyboard to add with all fields
      const keyboardToAdd = {
        keyboardId: selectedKeyboardObj._id,
        name: selectedKeyboardObj.name,
        designer: selectedKeyboardObj.designer,
        layout: selectedKeyboardObj.layout,
        renders: selectedKeyboardObj.renders,
        blocker: selectedKeyboardObj.blocker,
        switchType: selectedKeyboardObj.switchType,
        plateMaterial: selectedKeyboardObj.plateMaterial,
        mounting: selectedKeyboardObj.mounting,
        typingAngle: selectedKeyboardObj.typingAngle,
        frontHeight: selectedKeyboardObj.frontHeight,
        surfaceFinish: selectedKeyboardObj.surfaceFinish,
        color: selectedKeyboardObj.color,
        weightMaterial: selectedKeyboardObj.weightMaterial,
        buildWeight: selectedKeyboardObj.buildWeight,
        pcbOptions: selectedKeyboardObj.pcbOptions,
        builds: selectedKeyboardObj.builds,
        notes: [],
      };

      onAddKeyboard(keyboardToAdd);
      resetForm();
      onClose();
    }
  };

  // New function to handle the background processing
  const processUploadsAndSave = async (tempKeyboard, tempId) => {
    try {
      // Upload images if necessary and update URLs
      let updatedRenders = [...keyboardData.renders];

      // Process each image selection
      for (let i = 0; i < selectedImages.length; i++) {
        if (selectedImages[i]) {
          try {
            // Upload image to Cloudinary
            const imageUrl = await uploadToCloudinary(
              selectedImages[i],
              "keyboards_renders",
              userId
            );
            updatedRenders[i] = imageUrl;
          } catch (error) {
            console.error(`Error uploading image: ${error.message}`);
          }
        }
      }

      // Filter out empty URLs
      updatedRenders = updatedRenders.filter((url) => url && url.trim() !== "");

      // Create the final keyboard to add with updated renders
      const finalKeyboard = {
        ...tempKeyboard,
        renders: updatedRenders,
        isLoading: false,
      };

      // Replace the temp keyboard with the final one
      onAddKeyboard(finalKeyboard, false, tempId);
    } catch (error) {
      console.error("Error in background processing:", error);
      // Handle error state - remove the temp keyboard or show error
      onAddKeyboard(null, false, tempId);
    }
  };

  if (!open) return null;

  return createPortal(
    <Modal
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      aria-labelledby="add-keyboard-modal-title"
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
          id="add-keyboard-modal-title"
          variant="h5"
          component="h2"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Add Keyboard to Inventory
        </Typography>

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

        {activeTab === "dropdown" ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Choose a keyboard to add to your inventory:
            </Typography>

            {dbKeyboardsError ? (
              <Typography color="error">
                Error loading keyboards. Please try again.
              </Typography>
            ) : !dbKeyboards ? (
              <Typography>Loading keyboards...</Typography>
            ) : (
              <>
                <Paper sx={{ p: 2, mb: 2 }}>
                  {/* Step 1: Select Layout */}
                  <FormControl fullWidth margin="dense" size="small">
                    <InputLabel id="layout-select-label">Layout</InputLabel>
                    <Select
                      labelId="layout-select-label"
                      value={selectedLayout}
                      onChange={handleLayoutChange}
                      label="Layout"
                    >
                      <MenuItem value="">-- Select Layout --</MenuItem>
                      {layouts.map((layout) => (
                        <MenuItem key={layout} value={layout}>
                          {layout}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Step 2: Select Keyboard using Autocomplete (only shown if layout is selected) */}
                  {selectedLayout && (
                    <FormControl fullWidth margin="normal" size="small">
                      <Autocomplete
                        value={selectedKeyboard}
                        onChange={(event, newValue) => {
                          setSelectedKeyboard(newValue);

                          // Find the keyboard ID for the selected keyboard name
                          if (newValue) {
                            const keyboardObj = filteredKeyboards.find(
                              (kb) => kb.name === newValue
                            );
                            if (keyboardObj) {
                              setSelectedKeyboardId(keyboardObj._id);
                            }
                          } else {
                            setSelectedKeyboardId("");
                          }
                        }}
                        inputValue={searchTerm}
                        onInputChange={(event, newInputValue) => {
                          setSearchTerm(newInputValue);
                        }}
                        options={filteredKeyboards.map((kb) => kb.name)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Keyboard"
                            size="small"
                          />
                        )}
                        noOptionsText="No matching keyboards found"
                      />
                    </FormControl>
                  )}
                </Paper>

                {selectedKeyboardId && (
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {filteredKeyboards.find(
                      (keyboard) => keyboard._id === selectedKeyboardId
                    )?.renders?.[0] && (
                      <Image
                        src={
                          filteredKeyboards.find(
                            (keyboard) => keyboard._id === selectedKeyboardId
                          )?.renders[0]
                        }
                        alt={selectedKeyboard}
                        width={300}
                        height={200}
                        style={{
                          objectFit: "cover",
                          borderRadius: "5px",
                          marginBottom: "10px",
                        }}
                      />
                    )}
                    <Box sx={{ width: "100%", textAlign: "left" }}>
                      <Typography variant="h6">{selectedKeyboard}</Typography>
                      <Typography variant="body2">
                        <strong>Designer:</strong>{" "}
                        {
                          filteredKeyboards.find(
                            (keyboard) => keyboard._id === selectedKeyboardId
                          )?.designer
                        }
                      </Typography>
                      <Typography variant="body2">
                        <strong>Layout:</strong> {selectedLayout}
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </>
            )}
          </Box>
        ) : (
          <>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Keyboard Details
              </Typography>
              <TextField
                fullWidth
                name="name"
                label="Keyboard Name"
                value={keyboardData.name}
                onChange={handleChange}
                required
                margin="dense"
                size="small"
              />
              <TextField
                fullWidth
                name="designer"
                label="Designer"
                value={keyboardData.designer}
                onChange={handleChange}
                required
                margin="dense"
                size="small"
              />
              <FormControl fullWidth margin="dense" size="small">
                <InputLabel id="layout-select-label">Layout</InputLabel>
                <Select
                  labelId="layout-select-label"
                  name="layout"
                  value={keyboardData.layout}
                  onChange={handleChange}
                  label="Layout"
                  required
                >
                  <MenuItem value="">Select Layout</MenuItem>
                  <MenuItem value="40%">40%</MenuItem>
                  <MenuItem value="60%">60%</MenuItem>
                  <MenuItem value="65%">65%</MenuItem>
                  <MenuItem value="70%">70%</MenuItem>
                  <MenuItem value="75%">75%</MenuItem>
                  <MenuItem value="TKL">TKL</MenuItem>
                  <MenuItem value="1800">1800</MenuItem>
                  <MenuItem value="Full Size">Full Size</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense" size="small">
                <InputLabel id="blocker-select-label">Blocker Type</InputLabel>
                <Select
                  labelId="blocker-select-label"
                  name="blocker"
                  value={keyboardData.blocker}
                  onChange={handleChange}
                  label="Blocker Type"
                  required
                >
                  <MenuItem value="">Select Blocker Type</MenuItem>
                  <MenuItem value="Winkey">Winkey</MenuItem>
                  <MenuItem value="Winkeyless">Winkeyless</MenuItem>
                  <MenuItem value="HHKB">HHKB</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense" size="small">
                <InputLabel id="switch-type-select-label">
                  Switch Type
                </InputLabel>
                <Select
                  labelId="switch-type-select-label"
                  name="switchType"
                  value={keyboardData.switchType}
                  onChange={handleChange}
                  label="Switch Type"
                  required
                >
                  <MenuItem value="">Select Switch Type</MenuItem>
                  <MenuItem value="MX">MX</MenuItem>
                  <MenuItem value="EC">EC</MenuItem>
                  <MenuItem value="HE">HE</MenuItem>
                  <MenuItem value="Alps">Alps</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
              {keyboardData.renders.map((render, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
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
                          const newRenders = [...keyboardData.renders];
                          newRenders.splice(index, 1);
                          setKeyboardData((prevData) => ({
                            ...prevData,
                            renders: newRenders,
                          }));

                          const newSelectedImages = [...selectedImages];
                          newSelectedImages.splice(index, 1);
                          setSelectedImages(newSelectedImages);

                          const newPreviewUrls = [...previewUrls];
                          newPreviewUrls.splice(index, 1);
                          setPreviewUrls(newPreviewUrls);
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                    )}

                    <Box sx={{ width: "100%" }}>
                      <ImageUploaderMUI
                        onImageSelect={(file, preview) =>
                          handleImageSelect(index, file, preview)
                        }
                        prePopulatedUrl={render}
                      />
                    </Box>

                    {index === keyboardData.renders.length - 1 &&
                      keyboardData.renders.length < 5 && (
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
                          onClick={handleAddRender}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      )}
                  </Box>
                </Box>
              ))}
            </Paper>

            <Button
              variant="text"
              onClick={() => {
                if (isAdditionalFieldsVisible) {
                  setKeyboardData((prevData) => ({
                    ...prevData,
                    // Reset only additional fields
                    surfaceFinish: "",
                    color: "",
                    typingAngle: "",
                    frontHeight: "",
                    weightMaterial: "",
                    buildWeight: "",
                    pcbOptions: {
                      ...prevData.pcbOptions,
                      flexCuts: false,
                    },
                    notes: [],
                  }));
                  setNoteText("");
                }
                setIsAdditionalFieldsVisible(!isAdditionalFieldsVisible);
              }}
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
                  name="color"
                  label="Color (e.g., Navy Blue)"
                  value={keyboardData.color}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="surfaceFinish"
                  label="Surface Finish (e.g., Anodization)"
                  value={keyboardData.surfaceFinish}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="typingAngle"
                  label="Typing Angle (e.g., 7°)"
                  value={keyboardData.typingAngle}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="frontHeight"
                  label="Front Height (e.g., 19mm)"
                  value={keyboardData.frontHeight}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="weightMaterial"
                  label="Weight Material (e.g., Brass, Stainless Steel)"
                  value={keyboardData.weightMaterial}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="buildWeight"
                  label="Build Weight (e.g., 1.5kg)"
                  value={keyboardData.buildWeight}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />

                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  PCB Options
                </Typography>
                <FormControl fullWidth margin="dense" size="small">
                  <InputLabel id="pcb-thickness-label">
                    PCB Thickness
                  </InputLabel>
                  <Select
                    labelId="pcb-thickness-label"
                    name="pcbOptions.thickness"
                    value={keyboardData.pcbOptions.thickness}
                    onChange={handleChange}
                    label="PCB Thickness"
                  >
                    <MenuItem value="1.2mm">1.2mm</MenuItem>
                    <MenuItem value="1.6mm">1.6mm</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="dense" size="small">
                  <InputLabel id="pcb-material-label">PCB Material</InputLabel>
                  <Select
                    labelId="pcb-material-label"
                    name="pcbOptions.material"
                    value={keyboardData.pcbOptions.material}
                    onChange={handleChange}
                    label="PCB Material"
                  >
                    <MenuItem value="FR4">FR4</MenuItem>
                    <MenuItem value="CEM">CEM</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      name="pcbOptions.flexCuts"
                      checked={keyboardData.pcbOptions.flexCuts}
                      onChange={handleChange}
                    />
                  }
                  label="Flex Cuts"
                  sx={{ mt: 1 }}
                />

                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Notes
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="notesText"
                  label="Add a note..."
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  margin="dense"
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handleAddNote}
                  sx={{ mt: 1, mb: 2 }}
                >
                  Add Note
                </Button>

                {keyboardData.notes.length > 0 && (
                  <Paper variant="outlined" sx={{ mt: 1, p: 1 }}>
                    <List sx={{ p: 0 }}>
                      {keyboardData.notes.map((note, index) => (
                        <ListItem
                          key={note._id || nanoid()}
                          sx={{
                            py: 1,
                            px: 0,
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ wordBreak: "break-word", width: "100%" }}
                          >
                            {note.text} (
                            {new Date(note.timestamp).toLocaleDateString()})
                          </Typography>
                          {index < keyboardData.notes.length - 1 && (
                            <Divider flexItem sx={{ my: 1, width: "100%" }} />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
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
                (!keyboardData.name ||
                  !keyboardData.designer ||
                  !keyboardData.layout ||
                  !keyboardData.blocker ||
                  !keyboardData.switchType)) ||
              (activeTab === "dropdown" && !selectedKeyboardId)
            }
            sx={{ width: "49%" }}
          >
            Add Keyboard
          </Button>
        </Box>
      </Box>
    </Modal>,
    document.getElementById("portal")
  );
}
