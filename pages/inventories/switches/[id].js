import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import { useState, useEffect } from "react";
import EditButtonMUI from "@/components/SharedComponents/EditButtonMUI";
import BackButtonMUI from "@/components/SharedComponents/BackButtonMUI";
import EditButtonsContainerMUI from "@/components/SharedComponents/EditButtonsContainerMUI";
import NotesMUI from "@/components/SharedComponents/NotesMUI";
import Head from "next/head";

import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Checkbox,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";

export default function SwitchDetail() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const { id } = router.query;

  const {
    data: userSwitches,
    error: userSwitchesError,
    mutate,
  } = useSWR(id ? "/api/inventories/userswitches" : null);

  const userSwitch = userSwitches?.find((item) => item._id === id);
  const notes = userSwitch?.notes ?? [];

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState(userSwitch?.name || "");
  const [editedManufacturer, setEditedManufacturer] = useState(
    userSwitch?.manufacturer || ""
  );
  const [editedImage, setEditedImage] = useState(userSwitch?.image || "");
  const [editedSwitchType, setEditedSwitchType] = useState(
    userSwitch?.switchType || ""
  );
  const [editedQuantity, setEditedQuantity] = useState(
    userSwitch?.quantity || ""
  );
  const [editedSpringWeight, setEditedSpringWeight] = useState(
    userSwitch?.springWeight || ""
  );
  const [editedTopMaterial, setEditedTopMaterial] = useState(
    userSwitch?.topMaterial || ""
  );
  const [editedBottomMaterial, setEditedBottomMaterial] = useState(
    userSwitch?.bottomMaterial || ""
  );
  const [editedStemMaterial, setEditedStemMaterial] = useState(
    userSwitch?.stemMaterial || ""
  );
  const [editedFactoryLubed, setEditedFactoryLubed] = useState(
    userSwitch?.factoryLubed || false
  );
  const [editedIsLubed, setEditedIsLubed] = useState(
    userSwitch?.isLubed || false
  );
  const [editedIsFilmed, setEditedIsFilmed] = useState(
    userSwitch?.isFilmed || false
  );

  const [localNotes, setLocalNotes] = useState(notes);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (userSwitch) {
      setEditedName(userSwitch.name || "");
      setEditedManufacturer(userSwitch.manufacturer || "");
      setEditedImage(userSwitch.image || "");
      setEditedSwitchType(userSwitch.switchType || "");
      setEditedQuantity(userSwitch.quantity || "");
      setEditedSpringWeight(userSwitch.springWeight || "");
      setEditedTopMaterial(userSwitch.topMaterial || "");
      setEditedBottomMaterial(userSwitch.bottomMaterial || "");
      setEditedStemMaterial(userSwitch.stemMaterial || "");
      setEditedFactoryLubed(userSwitch.factoryLubed || false);
      setEditedIsLubed(userSwitch.isLubed || false);
      setEditedIsFilmed(userSwitch.isFilmed || false);
      setLocalNotes(userSwitch.notes ? [...userSwitch.notes] : []);
    }
  }, [userSwitch]);

  const handleNotesUpdate = async (updatedNotes) => {
    if (isEditMode) {
      setLocalNotes(updatedNotes);
    } else {
      // Only make API call when not in edit mode
      await fetch("/api/inventories/userswitches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          switchId: id,
          name: userSwitch.name,
          manufacturer: userSwitch.manufacturer,
          image: userSwitch.image,
          switchType: userSwitch.switchType,
          notes: updatedNotes,
        }),
      });
      await mutate();
    }
  };

  const validateSwitchData = (data) => {
    const requiredFields = ["name", "manufacturer", "image", "switchType"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
  };

  const handleSaveChanges = async () => {
    if (
      !editedName ||
      !editedManufacturer ||
      !editedImage ||
      !editedSwitchType
    ) {
      alert("Name, Manufacturer, Switch Type, and Image are required.");
      return;
    }

    try {
      validateSwitchData({
        name: editedName,
        manufacturer: editedManufacturer,
        image: editedImage,
        switchType: editedSwitchType,
      });
      await fetch("/api/inventories/userswitches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          switchId: id,
          name: editedName,
          manufacturer: editedManufacturer,
          image: editedImage,
          switchType: editedSwitchType,
          quantity: editedQuantity,
          springWeight: editedSpringWeight,
          topMaterial: editedTopMaterial,
          bottomMaterial: editedBottomMaterial,
          stemMaterial: editedStemMaterial,
          factoryLubed: editedFactoryLubed,
          isLubed: editedIsLubed,
          isFilmed: editedIsFilmed,
          notes: localNotes,
        }),
      });

      await mutate();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving notes:", error);
      alert(error.message);
    }
  };

  const handleCancelEdits = () => {
    setIsEditMode(false);
    if (userSwitch) {
      setEditedName(userSwitch.name || "");
      setEditedManufacturer(userSwitch.manufacturer || "");
      setEditedImage(userSwitch.image || "");
      setEditedSwitchType(userSwitch.switchType || "");
      setEditedQuantity(userSwitch.quantity || "");
      setEditedSpringWeight(userSwitch.springWeight || "");
      setEditedTopMaterial(userSwitch.topMaterial || "");
      setEditedBottomMaterial(userSwitch.bottomMaterial || "");
      setEditedStemMaterial(userSwitch.stemMaterial || "");
      setEditedFactoryLubed(userSwitch.factoryLubed || false);
      setEditedIsLubed(userSwitch.isLubed || false);
      setEditedIsFilmed(userSwitch.isFilmed || false);
      setLocalNotes(userSwitch.notes ? [...userSwitch.notes] : []);
    }
  };

  // Delete functionality
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
    if (confirmationName !== userSwitch?.name) {
      setDeleteError("The name you entered doesn't match the switch name.");
      return;
    }

    try {
      const response = await fetch("/api/inventories/userswitches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          switchId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete the switch");
      }

      // Redirect to switches inventory page
      router.push("/inventories/switches");
    } catch (error) {
      console.error("Error deleting switch:", error);
      setDeleteError("Failed to delete: " + error.message);
    }
  };

  if (!session) {
    return null;
  }

  if (userSwitchesError) return <p> Error loading switch details</p>;
  if (!userSwitch || status === "loading") {
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
      <Head>
        <title>{`${userSwitch.name} Details`}</title>
        <meta name="description" content="View and edit switch details" />
      </Head>
      {!isEditMode && <BackButtonMUI href="/inventories/switches" />}
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
            {isEditMode ? `Editing ${userSwitch.name}` : userSwitch.name}
          </Typography>

          {userSwitch.image && (
            <Box
              sx={{
                position: "relative",
                width: "80%",
                maxWidth: "300px",
                height: {
                  xs: "250px",
                  sm: "300px",
                },
                boxShadow: 3,
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? `1px solid ${theme.palette.grey[700]}`
                    : "none",
                borderRadius: 2,
                overflow: "hidden",
                mb: 2,
                mx: "auto",
              }}
            >
              <Image
                src={userSwitch.image}
                alt={userSwitch.name}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>
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
            <Box component="li" sx={{ py: 1 }}>
              {isEditMode && (
                <>
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
                </>
              )}
              <Typography component="span" fontWeight="bold">
                Manufacturer:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedManufacturer}
                  onChange={(event) =>
                    setEditedManufacturer(event.target.value)
                  }
                  placeholder="Manufacturer (e.g. Cherry)"
                  sx={{ ml: 1 }}
                />
              ) : (
                userSwitch.manufacturer || "Not specified"
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
                  renderValue={(selected) => {
                    return selected ? selected : "-- Select Type --";
                  }}
                >
                  <MenuItem value="" disabled>
                    -- Select Type --
                  </MenuItem>
                  <MenuItem value="Linear">Linear</MenuItem>
                  <MenuItem value="Tactile">Tactile</MenuItem>
                  <MenuItem value="Clicky">Clicky</MenuItem>
                </Select>
              ) : (
                <Typography component="span">
                  {userSwitch.switchType}
                </Typography>
              )}
            </Box>
            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Quantity:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  type="number"
                  size="small"
                  inputProps={{ min: 0, max: 9999 }}
                  value={editedQuantity}
                  onChange={(event) => {
                    const value = Math.min(
                      9999,
                      Math.max(0, parseInt(event.target.value) || 0)
                    );
                    setEditedQuantity(value.toString());
                  }}
                  sx={{ ml: 1 }}
                />
              ) : (
                userSwitch.quantity
              )}
            </Box>
            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Spring Weight:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedSpringWeight}
                  onChange={(event) =>
                    setEditedSpringWeight(event.target.value)
                  }
                  sx={{ ml: 1 }}
                />
              ) : (
                userSwitch.springWeight || "Not specified"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Top Housing:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedTopMaterial}
                  onChange={(event) => setEditedTopMaterial(event.target.value)}
                  sx={{ ml: 1 }}
                />
              ) : (
                userSwitch.topMaterial || "Not specified"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Bottom Housing:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedBottomMaterial}
                  onChange={(event) =>
                    setEditedBottomMaterial(event.target.value)
                  }
                  sx={{ ml: 1 }}
                />
              ) : (
                userSwitch.bottomMaterial || "Not specified"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Stem Material:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedStemMaterial}
                  onChange={(event) =>
                    setEditedStemMaterial(event.target.value)
                  }
                  sx={{ ml: 1 }}
                />
              ) : (
                userSwitch.stemMaterial || "Not specified"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Factory Lube:
              </Typography>{" "}
              {isEditMode ? (
                <>
                  <Checkbox
                    checked={editedFactoryLubed}
                    onChange={(event) =>
                      setEditedFactoryLubed(event.target.checked)
                    }
                    sx={{ ml: 1 }}
                  />
                  <Typography component="span">
                    {editedFactoryLubed ? "Yes" : "No"}
                  </Typography>
                </>
              ) : userSwitch.factoryLubed ? (
                "Yes"
              ) : (
                "No"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Hand Lubed:
              </Typography>{" "}
              {isEditMode ? (
                <>
                  <Checkbox
                    checked={editedIsLubed}
                    onChange={(event) => setEditedIsLubed(event.target.checked)}
                    sx={{ ml: 1 }}
                  />
                  <Typography component="span">
                    {editedIsLubed ? "Yes" : "No"}
                  </Typography>
                </>
              ) : userSwitch.isLubed ? (
                "Yes"
              ) : (
                "No"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Filmed:
              </Typography>{" "}
              {isEditMode ? (
                <>
                  <Checkbox
                    checked={editedIsFilmed}
                    onChange={(event) =>
                      setEditedIsFilmed(event.target.checked)
                    }
                    sx={{ ml: 1 }}
                  />
                  <Typography component="span">
                    {editedIsFilmed ? "Yes" : "No"}
                  </Typography>
                </>
              ) : userSwitch.isFilmed ? (
                "Yes"
              ) : (
                "No"
              )}
            </Box>
          </Box>
        </Paper>

        <NotesMUI
          notes={localNotes}
          isEditMode={isEditMode}
          onNotesUpdate={handleNotesUpdate}
        />

        {!isEditMode ? (
          <EditButtonMUI
            onEdit={() => {
              setIsEditMode(true);
              setEditedName(userSwitch?.name || "");
              setEditedManufacturer(userSwitch?.manufacturer || "");
              setEditedImage(userSwitch?.image || "");
              setEditedSwitchType(userSwitch?.switchType || "");
              setEditedQuantity(userSwitch?.quantity || "");
              setEditedSpringWeight(userSwitch?.springWeight || "");
              setEditedTopMaterial(userSwitch?.topMaterial || "");
              setEditedBottomMaterial(userSwitch?.bottomMaterial || "");
              setEditedStemMaterial(userSwitch?.stemMaterial || "");
              setEditedFactoryLubed(userSwitch?.factoryLubed || false);
              setEditedIsLubed(userSwitch?.isLubed || false);
              setEditedIsFilmed(userSwitch?.isFilmed || false);
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
                Delete Switch
              </Button>
            </Box>

            <EditButtonsContainerMUI
              onCancel={handleCancelEdits}
              onConfirm={handleSaveChanges}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={deleteDialogOpen}
              onClose={handleDeleteCancel}
              aria-labelledby="delete-dialog-title"
            >
              <DialogTitle id="delete-dialog-title">
                Confirm Deletion
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This action cannot be undone. This will permanently delete the
                  switch
                  <strong> {userSwitch?.name}</strong> from your inventory.
                </DialogContentText>
                <DialogContentText sx={{ mt: 2, mb: 1 }}>
                  Please type <strong>{userSwitch?.name}</strong> to confirm:
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
                  disabled={confirmationName !== userSwitch?.name}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Container>
    </>
  );
}
