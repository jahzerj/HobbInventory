import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import { useEffect, useState } from "react";
import { colorOptions } from "@/utils/colors";
import EditButtonMUI from "@/components/SharedComponents/EditButtonMUI";
import BackButtonMUI from "@/components/SharedComponents/BackButtonMUI";
import EditButtonsContainerMUI from "@/components/SharedComponents/EditButtonsContainerMUI";
import KitImageModalMUI from "@/components/KeycapComponents/KitImageModalMUI";
import NotesMUI from "@/components/SharedComponents/NotesMUI";

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
  Link,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useSession } from "next-auth/react";
import AddKitModalMUI from "@/components/KeycapComponents/AddKitModalMUI";

export default function KeyCapDetail() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const { id } = router.query;

  const {
    data: userKeycaps,
    error: userKeycapError,
    mutate,
  } = useSWR(id ? "/api/inventories/userkeycaps" : null);

  const userKeycap = userKeycaps?.find((item) => item._id === id);
  const selectedColors = userKeycap?.selectedColors ?? [];
  const notes = userKeycap?.notes ?? [];

  const [isEditMode, setIsEditMode] = useState(false);

  const [editedKits, setEditedKits] = useState(userKeycap?.selectedKits || []);
  const [editedColors, setEditedColors] = useState(selectedColors || []);
  const [editedNotes, setEditedNotes] = useState(notes || []);
  const [selectedImage, setSelectedImage] = useState(null);

  const [editedManufacturer, setEditedManufacturer] = useState(
    userKeycap?.manufacturer || ""
  );
  const [editedMaterial, setEditedMaterial] = useState(
    userKeycap?.material || ""
  );
  const [editedProfile, setEditedProfile] = useState(userKeycap?.profile || "");
  const [editedProfileHeight, setEditedProfileHeight] = useState(
    userKeycap?.profileHeight || ""
  );
  const [editedDesigner, setEditedDesigner] = useState(
    userKeycap?.designer || ""
  );
  const [editedGeekhackLink, setEditedGeekhackLink] = useState(
    userKeycap?.geekhacklink || ""
  );

  const [isAddKitModalOpen, setIsAddKitModalOpen] = useState(false);

  useEffect(() => {
    if (userKeycap) {
      setEditedNotes(userKeycap.notes || []);
      setEditedKits(userKeycap.selectedKits || []);
      setEditedColors(userKeycap.selectedColors || []);
      setEditedManufacturer(userKeycap.manufacturer || "");
      setEditedMaterial(userKeycap.material || "");
      setEditedProfile(userKeycap.profile || "");
      setEditedProfileHeight(userKeycap.profileHeight || "");
      setEditedDesigner(userKeycap.designer || "");
      setEditedGeekhackLink(userKeycap.geekhacklink || "");
    }
  }, [userKeycap]);

  const handleKitSelection = (kitName) => {
    if (!isEditMode) return;

    setEditedKits((prevKits) => {
      if (prevKits.includes(kitName)) {
        return prevKits.filter((kit) => kit !== kitName);
      } else {
        return [...prevKits, kitName];
      }
    });
  };

  const handleColorSelection = (selectedColor, currentColors) => {
    if (currentColors.includes(selectedColor)) {
      return { error: "Color already selected" };
    }
    if (currentColors.length >= 6) {
      return { error: "Maximum 6 colors allowed" };
    }
    return { newColors: [...currentColors, selectedColor] };
  };

  const handleColorSelect = async (event) => {
    const selectedColor = event.target.value;
    const colors = isEditMode ? editedColors : selectedColors;

    const result = handleColorSelection(selectedColor, colors);
    if (result.error) {
      alert(result.error);
      return;
    }

    if (isEditMode) {
      setEditedColors(result.newColors);
      return;
    }

    //non-edit mode color selection
    if (selectedColors.includes(selectedColor)) return;
    if (selectedColors.length >= 6) {
      return alert("You can only selected up to 6 colors.");
    }

    const updatedColors = [...selectedColors, selectedColor];

    await fetch("/api/inventories/userkeycaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: userKeycap._id,
        keycapDefinitionId: userKeycap.keycapDefinitionId,
        name: userKeycap.name,
        selectedKits: userKeycap.selectedKits,
        selectedColors: updatedColors,
      }),
    });
    mutate();
  };

  const handleRemoveColor = (color) => {
    if (!isEditMode) return;

    setEditedColors((prevColors) =>
      prevColors.filter((existingColor) => existingColor !== color)
    );
  };

  const handleNotesUpdate = async (updatedNotes) => {
    if (isEditMode) {
      setEditedNotes(updatedNotes);
    } else {
      // Only make API call when not in edit mode
      await fetch("/api/inventories/userkeycaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: userKeycap._id,
          keycapDefinitionId: userKeycap.keycapDefinitionId,
          name: userKeycap.name,
          selectedKits: userKeycap.selectedKits,
          selectedColors: userKeycap.selectedColors,
          notes: updatedNotes,
        }),
      });
      await mutate();
    }
  };

  const handleSaveChanges = async () => {
    // Save all changes including notes
    await fetch("/api/inventories/userkeycaps", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: userKeycap._id,
        keycapDefinitionId: userKeycap.keycapDefinitionId,
        name: userKeycap.name,
        selectedKits: editedKits,
        selectedColors: editedColors,
        notes: editedNotes,
        manufacturer: editedManufacturer,
        material: editedMaterial,
        profile: editedProfile,
        profileHeight: editedProfileHeight,
        designer: editedDesigner,
        geekhacklink: editedGeekhackLink,
      }),
    });
    await mutate();
    setIsEditMode(false);
  };

  const handleCancelEdits = () => {
    setEditedColors([...selectedColors]);
    setEditedKits(userKeycap?.selectedKits || []);
    setEditedNotes([...notes]);
    setEditedManufacturer(userKeycap?.manufacturer || "");
    setEditedMaterial(userKeycap?.material || "");
    setEditedProfile(userKeycap?.profile || "");
    setEditedProfileHeight(userKeycap?.profileHeight || "");
    setEditedDesigner(userKeycap?.designer || "");
    setEditedGeekhackLink(userKeycap?.geekhacklink || "");
    setIsEditMode(false);
  };

  const handleAddKit = async (newKit) => {
    try {
      // Add the new kit to the existing kits
      const updatedKits = [...(userKeycap.kits || []), newKit];

      // Add the new kit name to selectedKits if it's not already there
      const updatedSelectedKits = userKeycap.selectedKits.includes(newKit.name)
        ? userKeycap.selectedKits
        : [...userKeycap.selectedKits, newKit.name];

      // Make the PUT request to update the keycap with the new kit
      const response = await fetch("/api/inventories/userkeycaps", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userKeycap,
          kits: updatedKits,
          selectedKits: updatedSelectedKits,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update keycap with new kit");
      }

      // Update the local state
      mutate(); // Refetch data using SWR
    } catch (error) {
      console.error("Error adding kit:", error);
      alert("Failed to add kit. Please try again.");
    }
  };

  if (!session) {
    return null;
  }

  if (userKeycapError) return <p>Error loading keycap details.</p>;
  if (status === "loading" || !userKeycaps) {
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

  const kitsAvailable = userKeycap.kits ?? [];
  const selectedKits = userKeycap?.selectedKits ?? [];

  return (
    <>
      {!isEditMode && <BackButtonMUI href="/inventories/keycaps" />}
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
            {isEditMode ? `Editing ${userKeycap.name}` : userKeycap.name}
          </Typography>

          {userKeycap.render && (
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
                src={userKeycap.render}
                alt={userKeycap.name}
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
                  placeholder="Manufacturer (e.g. GMK)"
                  sx={{ ml: 1 }}
                />
              ) : (
                userKeycap.manufacturer || "Not specified"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Material:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedMaterial}
                  onChange={(event) => setEditedMaterial(event.target.value)}
                  placeholder="Material (e.g. ABS)"
                  sx={{ ml: 1 }}
                />
              ) : (
                userKeycap.material || "Not specified"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Profile:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedProfile}
                  onChange={(event) => setEditedProfile(event.target.value)}
                  placeholder="Profile (e.g. Cherry)"
                  sx={{ ml: 1 }}
                />
              ) : (
                userKeycap.profile || "Not specified"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Profile Height:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedProfileHeight}
                  onChange={(event) =>
                    setEditedProfileHeight(event.target.value)
                  }
                  placeholder="Profile Height (e.g. 1-1-2-3-4-4)"
                  sx={{ ml: 1 }}
                />
              ) : (
                userKeycap.profileHeight || "Not specified"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Designer:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editedDesigner}
                  onChange={(event) => setEditedDesigner(event.target.value)}
                  placeholder="Designer"
                  sx={{ ml: 1 }}
                />
              ) : (
                userKeycap.designer || "Not specified"
              )}
            </Box>

            <Box component="li" sx={{ py: 1 }}>
              <Typography component="span" fontWeight="bold">
                Geekhack Thread:
              </Typography>{" "}
              {isEditMode ? (
                <TextField
                  size="small"
                  fullWidth
                  value={editedGeekhackLink}
                  onChange={(event) =>
                    setEditedGeekhackLink(event.target.value)
                  }
                  placeholder="Geekhack Link"
                  sx={{ ml: 1 }}
                />
              ) : userKeycap.geekhacklink ? (
                <Link
                  href={userKeycap.geekhacklink}
                  target="_blank"
                  rel="noopener"
                  sx={{ color: "primary.main" }}
                >
                  Visit Geekhack
                </Link>
              ) : (
                "Not specified"
              )}
            </Box>
          </Box>
        </Paper>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            mb: 2,
            alignSelf: "center",
          }}
        >
          Your Kits
        </Typography>
        {isEditMode ? (
          <Box
            component="ul"
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "15px",
              width: "auto",
              margin: "0 0 24px 0",
              maxWidth: 430,
              backgroundColor: "transparent",
              padding: 0,
              listStyle: "none",

              "@media (min-width: 430px)": {
                maxWidth: 400,
              },
              "@media (min-width: 600px)": {
                maxWidth: 600,
              },
            }}
          >
            {kitsAvailable.map((kit) => {
              const wasPreviouslySelected = selectedKits.includes(kit.name);
              const isCurrentlySelected = editedKits.includes(kit.name);

              return (
                <Box
                  component="li"
                  key={kit.name}
                  sx={{
                    position: "relative",
                    borderRadius: "10px",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: 1,
                    cursor: "pointer",
                    opacity: isEditMode && !isCurrentlySelected ? 0.33 : 1,
                    transition: (theme) =>
                      theme.transitions.create([
                        "opacity",
                        "background-color",
                        "box-shadow",
                      ]),
                    border: (theme) =>
                      theme.palette.mode === "dark"
                        ? `1px solid ${theme.palette.divider}`
                        : "none",
                    backgroundColor: "background.paper",
                    width: "100%",

                    "&:hover": {
                      opacity: isEditMode ? 0.8 : 1,
                      backgroundColor: "action.hover",
                      boxShadow: 2,
                    },

                    "& img": {
                      borderRadius: 1,
                      border: (theme) =>
                        theme.palette.mode === "dark"
                          ? `1px solid ${theme.palette.divider}`
                          : "none",
                    },

                    "& input[type='checkbox']": {
                      position: "absolute",
                      opacity: 0,
                      cursor: "pointer",
                      height: "100%",
                      width: "100%",
                      left: 0,
                      top: 0,
                      margin: 0,
                      zIndex: 1,
                    },
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isCurrentlySelected}
                    onChange={() => handleKitSelection(kit.name)}
                  />
                  {kit.image ? (
                    <Image
                      src={kit.image}
                      alt={kit.name}
                      width={116}
                      height={67}
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                  <p>{kit.name}</p>
                  {wasPreviouslySelected !== isCurrentlySelected && (
                    <small>
                      {isCurrentlySelected
                        ? "(Will be added)"
                        : "(Will be removed)"}
                    </small>
                  )}
                </Box>
              );
            })}
            <Box
              component="li"
              onClick={() => setIsAddKitModalOpen(true)}
              sx={{
                position: "relative",
                borderRadius: "10px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 1,
                cursor: "pointer",
                opacity: 1,
                transition: (theme) =>
                  theme.transitions.create(["background-color", "box-shadow"]),
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? `1px solid ${theme.palette.divider}`
                    : "none",
                backgroundColor: "background.paper",
                minHeight: "87px",
                width: "100%",

                "&:hover": {
                  backgroundColor: "action.hover",
                  boxShadow: 2,
                },

                "& img": {
                  borderRadius: 1,
                  border: (theme) =>
                    theme.palette.mode === "dark"
                      ? `1px solid ${theme.palette.divider}`
                      : "none",
                },
              }}
            >
              <AddCircleOutlineIcon
                sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
              />
              <Typography variant="body2">Add Kit</Typography>
            </Box>
          </Box>
        ) : selectedKits.length > 0 ? (
          <Box
            component="ul"
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "15px",
              width: "auto",
              margin: "0 0 24px 0",
              maxWidth: 430,
              backgroundColor: "transparent",
              padding: 0,
              listStyle: "none",

              "@media (min-width: 430px)": {
                maxWidth: 400,
              },
              "@media (min-width: 600px)": {
                maxWidth: 600,
              },
            }}
          >
            {kitsAvailable
              .filter((kit) => selectedKits.includes(kit.name))
              .map((kit) => (
                <Box
                  component="li"
                  key={kit.name}
                  onClick={() =>
                    setSelectedImage({ url: kit.image, name: kit.name })
                  }
                  sx={{
                    position: "relative",
                    borderRadius: "10px",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: 1,
                    cursor: "pointer",
                    opacity: 1,
                    transition: (theme) =>
                      theme.transitions.create([
                        "opacity",
                        "background-color",
                        "box-shadow",
                      ]),
                    border: (theme) =>
                      theme.palette.mode === "dark"
                        ? `1px solid ${theme.palette.divider}`
                        : "none",
                    backgroundColor: "background.paper",
                    width: "100%",

                    "&:hover": {
                      opacity: 1,
                      backgroundColor: "action.hover",
                      boxShadow: 2,
                    },

                    "& img": {
                      borderRadius: 1,
                      border: (theme) =>
                        theme.palette.mode === "dark"
                          ? `1px solid ${theme.palette.divider}`
                          : "none",
                    },
                  }}
                >
                  {kit.image ? (
                    <Image
                      src={kit.image}
                      alt={kit.name}
                      width={116}
                      height={67}
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                  <p>{kit.name}</p>
                </Box>
              ))}
          </Box>
        ) : (
          <p>No kits selected.</p>
        )}

        {/* Opens image modal */}
        <KitImageModalMUI
          open={Boolean(selectedImage)}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage?.url}
          kitName={selectedImage?.name}
        />
        <AddKitModalMUI
          open={isAddKitModalOpen}
          onClose={() => setIsAddKitModalOpen(false)}
          onAddKit={handleAddKit}
          userId={session.user.uuid}
        />
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            mb: 2,
            alignSelf: "center",
          }}
        >
          Choose 6 Colors
        </Typography>
        <Select
          displayEmpty
          value=""
          onChange={handleColorSelect}
          size="small"
          sx={{ maxWidth: 430, width: "100%", mb: 2 }}
        >
          <MenuItem value="" disabled>
            -- Choose up to 6 colors --
          </MenuItem>
          {colorOptions
            .filter((color) =>
              !isEditMode
                ? !selectedColors.includes(color.name)
                : !editedColors.includes(color.name)
            )
            .map((color) => (
              <MenuItem key={color.name} value={color.name}>
                {color.name} {color.emoji}
              </MenuItem>
            ))}
        </Select>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "bold",
            mb: 2,
            alignSelf: "center",
          }}
        >
          Selected Colors
        </Typography>
        <Paper
          sx={{
            p: 2,
            mb: 4,
            width: "100%",
            maxWidth: 430,
            borderRadius: 2,
          }}
        >
          {(isEditMode ? editedColors : selectedColors).length > 0 ? (
            <Grid container spacing={1}>
              {(isEditMode ? editedColors : selectedColors).map((color) => {
                const colorData = colorOptions.find(
                  (option) => option.name === color
                );
                return (
                  <Grid item xs={4} key={color}>
                    <Chip
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
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
                          const colorLower = colorData?.name.toLowerCase();
                          if (
                            ["white", "beige", "yellow"].includes(colorLower)
                          ) {
                            return theme.palette.mode === "dark"
                              ? "inherit"
                              : theme.palette.text.primary;
                          }
                          if (
                            ["black", "navy", "purple"].includes(colorLower)
                          ) {
                            return theme.palette.mode === "dark"
                              ? theme.palette.text.primary
                              : theme.palette.common.white;
                          }
                          return "inherit";
                        },
                      }}
                      onDelete={
                        isEditMode ? () => handleRemoveColor(color) : undefined
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 1 }}>
              <Typography color="text.secondary">
                &lt;-- No colors selected --&gt;
              </Typography>
            </Box>
          )}
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
              setEditedColors([...selectedColors]);
              setEditedKits(userKeycap?.selectedKits || []);
              setEditedNotes([...notes]);
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
