import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import { useState, useEffect } from "react";
import EditButtonMUI from "@/components/SharedComponents/EditButtonMUI";
import BackButtonMUI from "@/components/SharedComponents/BackButtonMUI";
import EditButtonsContainerMUI from "@/components/SharedComponents/EditButtonsContainerMUI";
import NotesMUI from "@/components/SharedComponents/NotesMUI";
import styled from "styled-components";

import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Checkbox,
  Link,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useSession } from "next-auth/react";

import {
  BoxContainer,
  StyledSpan,
  LoaderWrapper,
  StyledInput,
} from "@/components/SharedComponents/DetailPageStyles";

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
  const [innerWidth, setInnerWidth] = useState(0);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInnerWidth(window.innerWidth);
    }
  }, []);

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

  if (status === "loading") {
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );
  }

  if (!session) {
    return null;
  }

  if (userSwitchesError) return <p> Error loading switch details</p>;
  if (!userSwitch) {
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
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            {isEditMode ? `Editing ${userSwitch.name}` : userSwitch.name}
          </Typography>

          {userSwitch.image && (
            <Box
              sx={{
                position: "relative",
                width: "60%",
                maxWidth: "300px",
                height: {
                  xs: "200px",
                  sm: "300px",
                },
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
                  onChange={(e) => {
                    const value = Math.min(
                      9999,
                      Math.max(0, parseInt(e.target.value) || 0)
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
                  onChange={(e) => setEditedSpringWeight(e.target.value)}
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
                  onChange={(e) => setEditedTopMaterial(e.target.value)}
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
                  onChange={(e) => setEditedBottomMaterial(e.target.value)}
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
                  onChange={(e) => setEditedStemMaterial(e.target.value)}
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
                    onChange={(e) => setEditedFactoryLubed(e.target.checked)}
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
                    onChange={(e) => setEditedIsLubed(e.target.checked)}
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
                    onChange={(e) => setEditedIsFilmed(e.target.checked)}
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
          <EditButtonsContainerMUI
            onCancel={handleCancelEdits}
            onConfirm={handleSaveChanges}
          />
        )}
      </Container>
    </>
  );
}

const StyledCheckbox = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: 8px;

  input {
    margin-right: 5px;
  }

  label {
    font-size: 14px;
  }
`;
