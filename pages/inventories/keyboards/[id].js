import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import { useSession } from "next-auth/react";
import NotesMUI from "@/components/SharedComponents/NotesMUI";
import EditButtonMUI from "@/components/SharedComponents/EditButtonMUI";
import BackButtonMUI from "@/components/SharedComponents/BackButtonMUI";
import EditButtonsContainerMUI from "@/components/SharedComponents/EditButtonsContainerMUI";
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Checkbox,
  Select,
  MenuItem,
  FormControlLabel,
  FormGroup,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function KeyboardDetail() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const { id } = router.query;

  //Fetching userkeyboard details
  const {
    data: userKeyboards,
    error: userKeyboardError,
    mutate,
  } = useSWR(id ? `/api/inventories/userkeyboards` : null);

  const userKeyboard = userKeyboards?.find((item) => item._id === id);

  const [isEditMode, setIsEditMode] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);

  // State for editable fields
  const [editedName, setEditedName] = useState(userKeyboard?.name || "");
  const [editedDesigner, setEditedDesigner] = useState(
    userKeyboard?.designer || ""
  );
  const [editedLayout, setEditedLayout] = useState(userKeyboard?.layout || "");
  const [editedBlocker, setEditedBlocker] = useState(
    userKeyboard?.blocker || ""
  );
  const [editedSwitchType, setEditedSwitchType] = useState(
    userKeyboard?.switchType || ""
  );
  const [editedPlateMaterial, setEditedPlateMaterial] = useState(
    userKeyboard?.plateMaterial || []
  );
  const [editedMounting, setEditedMounting] = useState(
    userKeyboard?.mounting || []
  );
  const [editedTypingAngle, setEditedTypingAngle] = useState(
    userKeyboard?.typingAngle || ""
  );
  const [editedFrontHeight, setEditedFrontHeight] = useState(
    userKeyboard?.frontHeight || ""
  );
  const [editedSurfaceFinish, setEditedSurfaceFinish] = useState(
    userKeyboard?.surfaceFinish || ""
  );
  const [editedColor, setEditedColor] = useState(userKeyboard?.color || "");
  const [editedWeightMaterial, setEditedWeightMaterial] = useState(
    userKeyboard?.weightMaterial || ""
  );
  const [editedBuildWeight, setEditedBuildWeight] = useState(
    userKeyboard?.buildWeight || ""
  );

  // Add this state to store the current active render image
  const [activeRenderIndex, setActiveRenderIndex] = useState(0);

  // Extract notes with default empty array
  const notes = userKeyboard?.notes ?? [];

  // Add this state declaration with your other useState declarations
  const [editedNotes, setEditedNotes] = useState([]);

  // Add these state variables with your other useState declarations
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (userKeyboard) {
      setEditedName(userKeyboard.name || "");
      setEditedDesigner(userKeyboard.designer || "");
      setEditedLayout(userKeyboard.layout || "");
      setEditedBlocker(userKeyboard.blocker || "");
      setEditedSwitchType(userKeyboard.switchType || "");
      setEditedPlateMaterial(userKeyboard.plateMaterial || []);
      setEditedMounting(userKeyboard.mounting || []);
      setEditedTypingAngle(userKeyboard.typingAngle || "");
      setEditedFrontHeight(userKeyboard.frontHeight || "");
      setEditedSurfaceFinish(userKeyboard.surfaceFinish || "");
      setEditedColor(userKeyboard.color || "");
      setEditedWeightMaterial(userKeyboard.weightMaterial || "");
      setEditedBuildWeight(userKeyboard.buildWeight || "");
      setEditedNotes(userKeyboard.notes ? [...userKeyboard.notes] : []);
    }
  }, [userKeyboard]);

  const handleNotesUpdate = async (updatedNotes) => {
    if (isEditMode) {
      setEditedNotes(updatedNotes);
    } else {
      try {
        // Include all required fields from the existing keyboard data
        const response = await fetch("/api/inventories/userkeyboards", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: id,
            name: userKeyboard.name,
            designer: userKeyboard.designer,
            layout: userKeyboard.layout,
            blocker: userKeyboard.blocker,
            switchType: userKeyboard.switchType,
            renders: userKeyboard.renders,
            notes: updatedNotes,
            // Include any other required fields
            plateMaterial: userKeyboard.plateMaterial || [],
            mounting: userKeyboard.mounting || [],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update notes");
        }

        await mutate();
      } catch (error) {
        console.error("Error updating notes:", error);
        alert("Failed to save notes. Please try again.");
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/inventories/userkeyboards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: id,
          name: editedName,
          designer: editedDesigner,
          layout: editedLayout,
          renders: userKeyboard.renders,
          blocker: editedBlocker,
          switchType: editedSwitchType,
          plateMaterial: editedPlateMaterial,
          mounting: editedMounting,
          typingAngle: editedTypingAngle,
          frontHeight: editedFrontHeight,
          surfaceFinish: editedSurfaceFinish,
          color: editedColor,
          weightMaterial: editedWeightMaterial,
          buildWeight: editedBuildWeight,
          pcbOptions: userKeyboard.pcbOptions,
          notes: editedNotes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update keyboard");
      }

      // Trigger SWR to revalidate data
      mutate();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating keyboard:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleCancelEdits = () => {
    setIsEditMode(false);
    // Reset all edited states to original values
    if (userKeyboard) {
      setEditedName(userKeyboard.name || "");
      setEditedDesigner(userKeyboard.designer || "");
      setEditedLayout(userKeyboard.layout || "");
      setEditedBlocker(userKeyboard.blocker || "");
      setEditedSwitchType(userKeyboard.switchType || "");
      setEditedPlateMaterial(userKeyboard.plateMaterial || []);
      setEditedMounting(userKeyboard.mounting || []);
      setEditedTypingAngle(userKeyboard.typingAngle || "");
      setEditedFrontHeight(userKeyboard.frontHeight || "");
      setEditedSurfaceFinish(userKeyboard.surfaceFinish || "");
      setEditedColor(userKeyboard.color || "");
      setEditedWeightMaterial(userKeyboard.weightMaterial || "");
      setEditedBuildWeight(userKeyboard.buildWeight || "");
      setEditedNotes(userKeyboard.notes ? [...userKeyboard.notes] : []);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setConfirmationName("");
    setDeleteError("");
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setConfirmationName("");
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (confirmationName !== userKeyboard?.name) {
      setDeleteError("The name you entered doesn't match the keyboard name.");
      return;
    }

    try {
      const response = await fetch("/api/inventories/userkeyboards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyboardId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete the keyboard");
      }

      // Redirect to keyboards inventory page
      router.push("/inventories/keyboards");
    } catch (error) {
      console.error("Error deleting keyboard:", error);
      setDeleteError("Failed to delete: " + error.message);
    }
  };

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return null;
  }

  if (userKeyboardError) return <p>Error loading keyboards</p>;
  if (!userKeyboard) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {!isEditMode && <BackButtonMUI href="/inventories/keyboards" />}
      <Container
        maxWidth="md"
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            {isEditMode ? `Editing ${userKeyboard.name}` : userKeyboard.name}
          </Typography>
          {userKeyboard.renders && userKeyboard.renders.length > 0 && (
            <>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "640px",
                  height: {
                    xs: "220px",
                    sm: "280px",
                    md: "320px",
                  },
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 2,
                  mx: "auto",
                }}
              >
                <Image
                  src={userKeyboard.renders[activeRenderIndex]}
                  alt={userKeyboard.name}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Box>

              {userKeyboard.renders.length > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    maxWidth: "100%",
                    padding: "10px 0",
                    justifyContent: "center",
                  }}
                >
                  {userKeyboard.renders.map((render, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "5px",
                        overflow: "hidden",
                        cursor: "pointer",
                        position: "relative",
                        border: (theme) =>
                          index === activeRenderIndex
                            ? `2px solid ${theme.palette.primary.main}`
                            : "2px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                      onClick={() => setActiveRenderIndex(index)}
                    >
                      <Image
                        src={render}
                        alt={`${userKeyboard.name} render ${index + 1}`}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>

        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            mb: 2,
            alignSelf: "center",
          }}
        >
          Details
        </Typography>
        <Paper
          elevation={1}
          sx={{ p: 2, mb: 4, width: "100%", maxWidth: 520, borderRadius: 2 }}
        >
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {isEditMode && (
              <Box component="li" sx={{ py: 1 }}>
                <Typography component="span" fontWeight="bold">
                  Name:
                </Typography>{" "}
                <TextField
                  size="small"
                  value={editedName}
                  onChange={(event) => setEditedName(event.target.value)}
                  sx={{ ml: 1 }}
                />
              </Box>
            )}

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Designer:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedDesigner}
                  onChange={(event) => setEditedDesigner(event.target.value)}
                  sx={{ ml: 1 }}
                />
              ) : (
                userKeyboard.designer
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Layout:
              </Typography>{" "}
              {isEditMode ? (
                <Select
                  size="small"
                  value={editedLayout}
                  onChange={(event) => setEditedLayout(event.target.value)}
                  sx={{ ml: 1, minWidth: 180 }}
                >
                  <MenuItem value="">-- Select Layout --</MenuItem>
                  <MenuItem value="60%">60%</MenuItem>
                  <MenuItem value="65%">65%</MenuItem>
                  <MenuItem value="75%">75%</MenuItem>
                  <MenuItem value="TKL">TKL</MenuItem>
                  <MenuItem value="Full Size">Full Size</MenuItem>
                </Select>
              ) : (
                userKeyboard.layout
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Blocker:
              </Typography>{" "}
              {isEditMode ? (
                <Select
                  size="small"
                  value={editedBlocker}
                  onChange={(event) => setEditedBlocker(event.target.value)}
                  sx={{ ml: 1, minWidth: 180 }}
                >
                  <MenuItem value="">-- Select Blocker --</MenuItem>
                  <MenuItem value="Winkey">WK</MenuItem>
                  <MenuItem value="Winkeyless">WKL</MenuItem>
                  <MenuItem value="HHKB">HHKB</MenuItem>
                </Select>
              ) : (
                userKeyboard.blocker
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Switch Type:
              </Typography>{" "}
              {isEditMode ? (
                <Select
                  size="small"
                  value={editedSwitchType}
                  onChange={(event) => setEditedSwitchType(event.target.value)}
                  sx={{ ml: 1, minWidth: 180 }}
                >
                  <MenuItem value="">-- Select Switch Type --</MenuItem>
                  <MenuItem value="MX">MX</MenuItem>
                  <MenuItem value="Alps">Alps</MenuItem>
                  <MenuItem value="Topre">Topre</MenuItem>
                </Select>
              ) : (
                userKeyboard.switchType
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Plate Material:
              </Typography>{" "}
              {isEditMode ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    ml: 1,
                  }}
                >
                  <FormGroup>
                    {[
                      "Aluminum",
                      "Brass",
                      "Carbon Fiber",
                      "FR4",
                      "POM",
                      "Polycarbonate",
                    ].map((material) => (
                      <FormControlLabel
                        key={material}
                        control={
                          <Checkbox
                            checked={editedPlateMaterial.includes(material)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setEditedPlateMaterial([
                                  ...editedPlateMaterial,
                                  material,
                                ]);
                              } else {
                                setEditedPlateMaterial(
                                  editedPlateMaterial.filter(
                                    (m) => m !== material
                                  )
                                );
                              }
                            }}
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2">{material}</Typography>
                        }
                      />
                    ))}
                  </FormGroup>
                </Box>
              ) : (
                userKeyboard.plateMaterial.join(", ")
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Mounting Style:
              </Typography>{" "}
              {isEditMode ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    ml: 1,
                  }}
                >
                  <FormGroup>
                    {[
                      "Top Mount",
                      "Gasket Mount",
                      "O-ring Mount",
                      "Burger Mount",
                      "Leaf Spring",
                    ].map((mount) => (
                      <FormControlLabel
                        key={mount}
                        control={
                          <Checkbox
                            checked={editedMounting.includes(mount)}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setEditedMounting([...editedMounting, mount]);
                              } else {
                                setEditedMounting(
                                  editedMounting.filter((m) => m !== mount)
                                );
                              }
                            }}
                            size="small"
                          />
                        }
                        label={<Typography variant="body2">{mount}</Typography>}
                      />
                    ))}
                  </FormGroup>
                </Box>
              ) : (
                userKeyboard.mounting.join(", ")
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Typing Angle:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedTypingAngle}
                  onChange={(event) => setEditedTypingAngle(event.target.value)}
                  placeholder="e.g., 6.5°"
                  sx={{ ml: 1 }}
                />
              ) : (
                userKeyboard.typingAngle
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Front Height:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedFrontHeight}
                  onChange={(event) => setEditedFrontHeight(event.target.value)}
                  placeholder="e.g., 19mm"
                  sx={{ ml: 1 }}
                />
              ) : (
                userKeyboard.frontHeight
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Surface Finish:
              </Typography>{" "}
              {isEditMode ? (
                <Select
                  size="small"
                  value={editedSurfaceFinish}
                  onChange={(event) =>
                    setEditedSurfaceFinish(event.target.value)
                  }
                  sx={{ ml: 1, minWidth: 180 }}
                >
                  <MenuItem value="">-- Select Finish --</MenuItem>
                  <MenuItem value="Anodization">Anodization</MenuItem>
                  <MenuItem value="E-coating">E-coating</MenuItem>
                  <MenuItem value="Cerakote">Cerakote</MenuItem>
                  <MenuItem value="Raw">Raw</MenuItem>
                </Select>
              ) : (
                userKeyboard.surfaceFinish
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Color:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedColor}
                  onChange={(event) => setEditedColor(event.target.value)}
                  sx={{ ml: 1 }}
                />
              ) : (
                userKeyboard.color
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Weight Material:
              </Typography>{" "}
              {isEditMode ? (
                <Select
                  size="small"
                  value={editedWeightMaterial}
                  onChange={(event) =>
                    setEditedWeightMaterial(event.target.value)
                  }
                  sx={{ ml: 1, minWidth: 180 }}
                >
                  <MenuItem value="">-- Select Material --</MenuItem>
                  <MenuItem value="Brass">Brass</MenuItem>
                  <MenuItem value="Stainless Steel">Stainless Steel</MenuItem>
                  <MenuItem value="Aluminum">Aluminum</MenuItem>
                  <MenuItem value="Tungsten">Tungsten</MenuItem>
                </Select>
              ) : (
                userKeyboard.weightMaterial
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Build Weight:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedBuildWeight}
                  onChange={(event) => setEditedBuildWeight(event.target.value)}
                  placeholder="e.g., 1200g"
                  sx={{ ml: 1 }}
                />
              ) : (
                userKeyboard.buildWeight
              )}
            </Box>
          </Box>
        </Paper>

        <NotesMUI
          notes={isEditMode ? editedNotes : notes}
          isEditMode={isEditMode}
          onNotesUpdate={handleNotesUpdate}
        />

        {!isEditMode ? (
          <EditButtonMUI
            onEdit={() => {
              setIsEditMode(true);
              setEditedNotes(userKeyboard.notes ? [...userKeyboard.notes] : []);
            }}
          />
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mb: 4,
              }}
            >
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                sx={{
                  "&:hover": {
                    backgroundColor: "error.dark",
                  },
                }}
              >
                Delete Keyboard
              </Button>
            </Box>

            <EditButtonsContainerMUI
              onCancel={handleCancelEdits}
              onConfirm={handleSaveChanges}
            />
          </>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This will permanently delete the
            keyboard
            <strong> {userKeyboard?.name}</strong> from your inventory.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, mb: 1 }}>
            Please type <strong>{userKeyboard?.name}</strong> to confirm:
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            value={confirmationName}
            onChange={(event) => setConfirmationName(event.target.value)}
            error={!!deleteError}
            helperText={deleteError}
            variant="outlined"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={confirmationName !== userKeyboard?.name}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
