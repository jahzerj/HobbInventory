import { createPortal } from "react-dom";
import { useState } from "react";
import { nanoid } from "nanoid";
import SwitchCardMUI from "./SwitchCardMUI";
import useSWR from "swr";
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
  Select as MuiSelect,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  List,
  ListItem,
  Divider,
  Paper,
  CircularProgress,
  Autocomplete,
} from "@mui/material";

export default function AddSwitchModal({ open, onClose, onAddSwitch, userId }) {
  const [activeTab, setActiveTab] = useState("dropdown");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedSwitchId, setSelectedSwitchId] = useState("");

  // New state for image file upload
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { data: dbSwitches, error: dbSwitchesError } = useSWR(
    activeTab === "dropdown" ? "/api/inventories/switches" : null
  );

  //Get unique manufacturers and sort alphabetically
  const manufacturers = dbSwitches
    ? [...new Set(dbSwitches.map((sw) => sw.manufacturer))].sort()
    : [];

  //Get Switches filtered by selected manufacturer
  const filteredSwitches = dbSwitches
    ? dbSwitches
        .filter((sw) => sw.manufacturer === selectedManufacturer)
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const [searchTerm, setSearchTerm] = useState("");

  const handleManufacturerChange = (event) => {
    const manufacturer = event.target.value;
    setSelectedManufacturer(manufacturer);
    setSelectedSwitchId(""); //resets switch selection when manufacturer changes
  };

  const handleSwitchChange = (event) => {
    const switchId = event.target.value;
    setSelectedSwitchId(switchId);

    if (switchId) {
      const selectedSwitch = dbSwitches.find((sw) => sw._id === switchId);
      if (selectedSwitch) {
        //populate selectedSwitch data to switchData
        setSwitchData({
          name: selectedSwitch.name,
          manufacturer: selectedSwitch.manufacturer,
          image: selectedSwitch.image,
          quantity: 1,
          switchType: selectedSwitch.switchType,
          factoryLubed: selectedSwitch.factoryLubed || false,
          springWeight: selectedSwitch.springWeight || "",
          topMaterial: selectedSwitch.topMaterial || "",
          bottomMaterial: selectedSwitch.bottomMaterial || "",
          stemMaterial: selectedSwitch.stemMaterial || "",
          isLubed: selectedSwitch.isLubed || false,
          isFilmed: selectedSwitch.isFilmed || false,
          notes: [],
        });
      }
    }
  };

  const resetForm = () => {
    setSelectedManufacturer("");
    setSelectedSwitchId("");
    setSearchTerm("");
    setSwitchData({
      name: "",
      manufacturer: "",
      image: "",
      quantity: 1,
      switchType: "",
      factoryLubed: false,
      springWeight: "",
      topMaterial: "",
      bottomMaterial: "",
      stemMaterial: "",
      isLubed: false,
      isFilmed: false,
      notes: [],
    });
    setNoteText("");
    setIsAdditionalFieldsVisible(false);
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const [isAdditionalFieldsVisible, setIsAdditionalFieldsVisible] =
    useState(false);
  const [switchData, setSwitchData] = useState({
    name: "",
    manufacturer: "",
    image: "",
    quantity: 1,
    switchType: "",
    factoryLubed: false,
    springWeight: "",
    topMaterial: "",
    bottomMaterial: "",
    stemMaterial: "",
    isLubed: false,
    isFilmed: false,
    notes: [],
  });

  const [noteText, setNoteText] = useState("");

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Add length validation for text fields
    if (name === "name" && value.length > 40) {
      alert("Switch name cannot exceed 40 characters.");
      return;
    }

    if (name === "manufacturer" && value.length > 25) {
      alert("Manufacturer name cannot exceed 25 characters.");
      return;
    }

    // Add quantity validation
    if (name === "quantity") {
      const numValue = parseInt(value) || 0;
      if (numValue > 9999) {
        setSwitchData((prevData) => ({
          ...prevData,
          [name]: 9999,
        }));
        return;
      }
    }

    setSwitchData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSelect = (file, preview) => {
    setSelectedImage(file);
    setPreviewUrl(preview);

    // If it's a URL (no file), update the switchData directly
    if (!file && preview) {
      setSwitchData((prevData) => ({
        ...prevData,
        image: preview,
      }));
    }
  };

  const handleAddNote = () => {
    if (noteText.trim() === "") return;

    setSwitchData((prevData) => ({
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

  const handleSubmit = async () => {
    if (activeTab === "manual") {
      // Validation for manual entry
      if (
        !switchData.name ||
        !switchData.manufacturer ||
        !switchData.switchType
      ) {
        alert(
          "Please fill out all required fields: Name, Manufacturer, and Switch Type."
        );
        return;
      }

      // Handle image upload if there's a selected file
      let imageUrl = switchData.image;

      if (selectedImage) {
        try {
          // Upload image to Cloudinary
          imageUrl = await uploadToCloudinary(
            selectedImage,
            "switches",
            userId
          );
        } catch (error) {
          alert(`Error uploading image: ${error.message}`);
          return;
        }
      }

      // Check if we have an image after trying to upload
      if (!imageUrl) {
        alert("Please provide an image for the switch.");
        return;
      }

      // Create the switch object with the updated image URL
      const switchToAdd = {
        ...switchData,
        image: imageUrl,
      };

      onAddSwitch(switchToAdd);
    } else if (activeTab === "dropdown") {
      // Validation for dropdown selection
      if (!selectedSwitchId) {
        alert("Please select a manufacturer and switch.");
        return;
      }

      onAddSwitch(switchData);
    }

    resetForm();
    onClose();
  };

  const isPreviewVisible =
    switchData.name &&
    switchData.manufacturer &&
    (switchData.image || previewUrl) &&
    switchData.switchType;

  return createPortal(
    <Modal
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      aria-labelledby="add-switch-modal-title"
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
          id="add-switch-modal-title"
          variant="h5"
          component="h2"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Add Switch to Inventory
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
        {activeTab === "manual" ? (
          // Manual Entry Tab Content
          <>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Switch Details
              </Typography>
              <TextField
                fullWidth
                name="name"
                label="Switch Name"
                value={switchData.name}
                onChange={handleChange}
                required
                margin="dense"
                size="small"
              />
              <TextField
                fullWidth
                name="manufacturer"
                label="Manufacturer"
                value={switchData.manufacturer}
                onChange={handleChange}
                required
                margin="dense"
                size="small"
              />

              <ImageUploaderMUI
                onImageSelect={handleImageSelect}
                prePopulatedUrl={switchData.image}
              />

              <FormControl fullWidth margin="dense" size="small">
                <InputLabel id="switch-type-label">Switch Type *</InputLabel>
                <MuiSelect
                  labelId="switch-type-label"
                  name="switchType"
                  value={switchData.switchType}
                  onChange={handleChange}
                  label="Switch Type *"
                >
                  <MenuItem value="">Select Switch Type</MenuItem>
                  <MenuItem value="Linear">Linear</MenuItem>
                  <MenuItem value="Tactile">Tactile</MenuItem>
                  <MenuItem value="Clicky">Clicky</MenuItem>
                </MuiSelect>
              </FormControl>
            </Paper>

            {isPreviewVisible && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Preview
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    maxWidth: 250,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <SwitchCardMUI
                    itemObj={{
                      _id: "preview",
                      ...switchData,
                      image: previewUrl || switchData.image,
                    }}
                    isEditMode={false}
                    onDelete={() => {}}
                    isPreview={true}
                  />
                </Box>
              </Paper>
            )}

            <Button
              variant="text"
              onClick={() => {
                setIsAdditionalFieldsVisible(!isAdditionalFieldsVisible);
                setSwitchData((prevData) => ({
                  ...prevData,
                  quantity: 1,
                  factoryLubed: false,
                  springWeight: "",
                  topMaterial: "",
                  bottomMaterial: "",
                  stemMaterial: "",
                  isLubed: false,
                  isFilmed: false,
                  notes: [],
                }));
              }}
              sx={{ mb: 2 }}
            >
              {isAdditionalFieldsVisible
                ? "Hide Additional Information"
                : "Add Additional Information"}
            </Button>

            {isAdditionalFieldsVisible && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2">Quantity</Typography>
                <TextField
                  fullWidth
                  type="number"
                  name="quantity"
                  label="Quantity"
                  InputProps={{ inputProps: { min: 0, max: 9999 } }}
                  value={switchData.quantity}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />

                <TextField
                  fullWidth
                  name="springWeight"
                  label="Spring Weight"
                  value={switchData.springWeight}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="topMaterial"
                  label="Top Housing Material"
                  value={switchData.topMaterial}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="bottomMaterial"
                  label="Bottom Housing Material"
                  value={switchData.bottomMaterial}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />
                <TextField
                  fullWidth
                  name="stemMaterial"
                  label="Stem Material"
                  value={switchData.stemMaterial}
                  onChange={handleChange}
                  margin="dense"
                  size="small"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="factoryLubed"
                      checked={switchData.factoryLubed}
                      onChange={handleChange}
                    />
                  }
                  label="Factory Lubed"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isLubed"
                      checked={switchData.isLubed}
                      onChange={handleChange}
                    />
                  }
                  label="Hand Lubed"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isFilmed"
                      checked={switchData.isFilmed}
                      onChange={handleChange}
                    />
                  }
                  label="Filmed"
                />

                <TextField
                  fullWidth
                  multiline
                  rows={2}
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

                <Typography variant="h6">User Notes</Typography>
                <Paper variant="outlined" sx={{ mt: 1, p: 1 }}>
                  {switchData.notes.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {switchData.notes.map((note, index) => (
                        <ListItem
                          key={nanoid()}
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
                          {index < switchData.notes.length - 1 && (
                            <Divider flexItem sx={{ my: 1, width: "100%" }} />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2">
                      No notes for this switch.
                    </Typography>
                  )}
                </Paper>
              </Paper>
            )}
          </>
        ) : (
          // Dropdown Selection Tab Content
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Choose a switch to add to your inventory:
            </Typography>

            {dbSwitchesError ? (
              <Typography color="error">
                Error loading switches. Please try again.
              </Typography>
            ) : !dbSwitches ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Paper sx={{ p: 2, mb: 2 }}>
                  {/* Step 1: Select Manufacturer */}
                  <FormControl fullWidth margin="dense" size="small">
                    <InputLabel id="manufacturer-select-label">
                      Manufacturer
                    </InputLabel>
                    <MuiSelect
                      labelId="manufacturer-select-label"
                      value={selectedManufacturer}
                      onChange={handleManufacturerChange}
                      label="Manufacturer"
                    >
                      <MenuItem value="">-- Select Manufacturer --</MenuItem>
                      {manufacturers.map((manufacturer) => (
                        <MenuItem key={manufacturer} value={manufacturer}>
                          {manufacturer}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  {/* Step 2: Select Switch using Autocomplete (only shown if manufacturer is selected) */}
                  {selectedManufacturer && (
                    <FormControl fullWidth margin="normal" size="small">
                      <Autocomplete
                        value={
                          selectedSwitchId
                            ? filteredSwitches.find(
                                (sw) => sw._id === selectedSwitchId
                              )?.name || ""
                            : ""
                        }
                        onChange={(event, newValue) => {
                          // Find the switch ID for the selected switch name
                          if (newValue) {
                            const switchObj = filteredSwitches.find(
                              (sw) => sw.name === newValue
                            );
                            if (switchObj) {
                              setSelectedSwitchId(switchObj._id);
                              setSwitchData({
                                name: switchObj.name,
                                manufacturer: switchObj.manufacturer,
                                image: switchObj.image,
                                quantity: 1,
                                switchType: switchObj.switchType,
                                factoryLubed: switchObj.factoryLubed || false,
                                springWeight: switchObj.springWeight || "",
                                topMaterial: switchObj.topMaterial || "",
                                bottomMaterial: switchObj.bottomMaterial || "",
                                stemMaterial: switchObj.stemMaterial || "",
                                isLubed: switchObj.isLubed || false,
                                isFilmed: switchObj.isFilmed || false,
                                notes: [],
                              });
                            }
                          } else {
                            setSelectedSwitchId("");
                          }
                        }}
                        inputValue={searchTerm}
                        onInputChange={(event, newInputValue) => {
                          setSearchTerm(newInputValue);
                        }}
                        options={filteredSwitches.map((sw) => sw.name)}
                        renderInput={(params) => (
                          <TextField {...params} label="Switch" size="small" />
                        )}
                        noOptionsText="No matching switches found"
                      />
                    </FormControl>
                  )}
                </Paper>

                {/* Step 3: Quantity and Preview (only shown if switch is selected) */}
                {selectedSwitchId && (
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity"
                      InputProps={{ inputProps: { min: 0, max: 9999 } }}
                      value={switchData.quantity}
                      onChange={(event) => {
                        const value = Math.min(
                          9999,
                          Math.max(0, parseInt(event.target.value) || 0)
                        );
                        setSwitchData((prev) => ({
                          ...prev,
                          quantity: value,
                        }));
                      }}
                      margin="dense"
                      size="small"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={switchData.isLubed}
                          onChange={(event) =>
                            setSwitchData((prev) => ({
                              ...prev,
                              isLubed: event.target.checked,
                            }))
                          }
                        />
                      }
                      label="Hand Lubed"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={switchData.isFilmed}
                          onChange={(event) =>
                            setSwitchData((prev) => ({
                              ...prev,
                              isFilmed: event.target.checked,
                            }))
                          }
                        />
                      }
                      label="Filmed"
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={2}
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

                    {switchData.notes.length > 0 && (
                      <>
                        <Typography variant="h6">Notes</Typography>
                        <Paper variant="outlined" sx={{ mt: 1, p: 1, mb: 2 }}>
                          <List sx={{ p: 0 }}>
                            {switchData.notes.map((note, index) => (
                              <ListItem
                                key={nanoid()}
                                sx={{
                                  py: 1,
                                  px: 0,
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    wordBreak: "break-word",
                                    width: "100%",
                                  }}
                                >
                                  {note.text} (
                                  {new Date(
                                    note.timestamp
                                  ).toLocaleDateString()}
                                  )
                                </Typography>
                                {index < switchData.notes.length - 1 && (
                                  <Divider
                                    flexItem
                                    sx={{ my: 1, width: "100%" }}
                                  />
                                )}
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </>
                    )}

                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Preview
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        maxWidth: 250,
                        mx: "auto",
                      }}
                    >
                      <SwitchCardMUI
                        itemObj={{
                          _id: "preview",
                          ...switchData,
                        }}
                        isEditMode={false}
                        onDelete={() => {}}
                        isPreview={true}
                      />
                    </Box>
                  </Paper>
                )}
              </>
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              resetForm();
              onClose();
            }}
            sx={{
              mt: 1,
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
                (!switchData.name ||
                  !switchData.manufacturer ||
                  (!switchData.image && !selectedImage) ||
                  !switchData.switchType)) ||
              (activeTab === "dropdown" && !selectedSwitchId)
            }
            sx={{ mt: 1, width: "49%" }}
          >
            Add Switch
          </Button>
        </Box>
      </Box>
    </Modal>,
    document.getElementById("portal")
  );
}
