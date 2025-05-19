import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Stack,
  NoSsr,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import ProfileButtonMUI from "@/components/SharedComponents/ProfileButtonMUI";
import BackButtonMUI from "@/components/SharedComponents/BackButtonMUI";
import AddButtonMUI from "@/components/SharedComponents/AddButtonMUI";
import KeycapCardMUI from "@/components/KeycapComponents/KeycapCardMUI";
import ScrollPositionManager from "@/components/SharedComponents/ScrollPositionManager";
import AddKeycapModalMUI from "@/components/KeycapComponents/AddKeycapModalMUI";

export default function Keycaps() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  // Basic state
  const [isOpen, setIsOpen] = useState(false);
  const [colorFilters, setColorFilters] = useState(["all"]);

  // Fetch data
  const {
    data: keycaps,
    error,
    mutate,
  } = useSWR("/api/inventories/userkeycaps");

  // Handle adding keycap
  const handleAddKeycap = async (
    keycapToAdd,
    isTemp = false,
    tempId = null
  ) => {
    try {
      // If we're dealing with a temporary keycap, update local state first
      if (isTemp) {
        // Optimistically update the UI with the temporary keycap
        mutate(
          (currentKeycaps = []) => [...currentKeycaps, keycapToAdd],
          false
        );
        return;
      }

      // If we're replacing a temp keycap, remove it first
      if (tempId) {
        // If keycap is null, just remove the temp item
        if (!keycapToAdd) {
          mutate(
            (currentKeycaps) => currentKeycaps.filter((k) => k._id !== tempId),
            false
          );
          return;
        }

        // Otherwise, make the API call to add the real keycap
        const response = await fetch("/api/inventories/userkeycaps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...keycapToAdd,
            _id: undefined, // Don't send the temp ID
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add keycap");
        }

        const data = await response.json();

        // Replace the temp keycap with the real one
        mutate(
          (currentKeycaps) =>
            currentKeycaps.map((k) =>
              k._id === tempId ? { ...data.keycap } : k
            ),
          false
        );

        // Now revalidate to ensure everything is in sync
        mutate();
      } else {
        // Regular flow for dropdown selection
        const response = await fetch("/api/inventories/userkeycaps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(keycapToAdd),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add keycap");
        }

        // Refresh data from server
        mutate();
      }
    } catch (error) {
      console.error("Failed to add keycap:", error);
      alert(`Error: ${error.message}`);

      // If there was an error with a temp keycap, remove it
      if (tempId) {
        mutate(
          (currentKeycaps) => currentKeycaps.filter((k) => k._id !== tempId),
          false
        );
      }
    }
  };

  // Get unique colors
  const uniqueColors = [
    "all",
    ...new Set(keycaps?.flatMap((keycap) => keycap.selectedColors || []) || []),
  ];

  // Filter handler function
  const handleColorChange = (color) => {
    setColorFilters((prev) => {
      // If clicking "all", reset to just "all"
      if (color === "all") {
        return ["all"];
      }

      // If "all" is currently selected and selecting another color, remove "all"
      if (prev.includes("all")) {
        return [color];
      }

      // If color is already selected, remove it
      if (prev.includes(color)) {
        const newSelection = prev.filter((c) => c !== color);
        // If no colors left, select "all"
        return newSelection.length === 0 ? ["all"] : newSelection;
      }

      // Otherwise add the color to selection
      return [...prev, color];
    });
  };

  // Mouse wheel horizontal scroll handler
  const handleWheel = (event) => {
    if (scrollContainerRef.current) {
      event.preventDefault();
      scrollContainerRef.current.scrollLeft += event.deltaY;
    }
  };

  // Setup wheel event listeners
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  // Filter the keycaps
  const filteredKeycaps = keycaps?.filter(
    (keycap) =>
      colorFilters.includes("all") ||
      (keycap.selectedColors &&
        keycap.selectedColors.some((color) => colorFilters.includes(color)))
  );

  // Handle modal
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  // Add at component start
  const scrollContainerRef = useRef(null);

  // Loading state
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
    return null; // This prevents any flash of content before redirect
  }

  if (error) return <p>Error loading keycaps...</p>;
  if (!keycaps)
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

  return (
    <>
      <ProfileButtonMUI />
      <BackButtonMUI href="/" />

      <NoSsr>
        <ScrollPositionManager pageId="keycaps" enabled={true} />
      </NoSsr>

      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Keycap Inventory
        </Typography>

        {/* Add UI for color filters */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            py: 2,
            px: 1,
            mb: 2,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            position: "sticky",
            top: 16,
            zIndex: 10,
            bgcolor: "transparent",
            backdropFilter: "blur(8px)",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ px: 1 }}>
            {uniqueColors.map((color) => (
              <Chip
                key={color}
                label={color === "all" ? "All Colors" : color}
                onClick={() => handleColorChange(color)}
                color={colorFilters.includes(color) ? "primary" : "default"}
                variant={colorFilters.includes(color) ? "filled" : "outlined"}
                sx={
                  color !== "all"
                    ? {
                        bgcolor: colorFilters.includes(color)
                          ? color.toLowerCase()
                          : "transparent",
                        borderColor: color.toLowerCase(),
                        "& .MuiChip-label": {
                          color: colorFilters.includes(color)
                            ? [
                                "white",
                                "beige",
                                "cream",
                                "yellow",
                                "lightgrey",
                              ].includes(color.toLowerCase())
                              ? "#000"
                              : "#fff"
                            : "inherit",
                        },
                        ...(color.toLowerCase() === "white" && {
                          border: "1px solid rgba(0,0,0,0.2)",
                        }),
                      }
                    : {}
                }
              />
            ))}
          </Stack>
        </Box>

        {/* Cards display */}
        <Box
          sx={(theme) => ({
            // Default styles: Handles 1 card (centered) and 2+ cards on small screens (list)
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Centers single card or the list itself
            gap: theme.spacing(0), // Reduced vertical spacing in list view
            width: "100%",

            // Styles for larger screens (md and up) when there are 2+ cards (grid)
            ...(filteredKeycaps &&
              filteredKeycaps.length > 1 && {
                [theme.breakpoints.up("md")]: {
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)", // 2-column grid
                  justifyItems: "center", // Center cards within their grid cells
                  alignItems: "start", // Align cards to the top of their cells
                  columnGap: theme.spacing(2), // Horizontal spacing between columns
                  rowGap: theme.spacing(0), // Reduced vertical spacing between rows
                },
              }),
          })}
        >
          {error && (
            <Typography color="error">Error loading keycaps.</Typography>
          )}
          {!error && filteredKeycaps?.length > 0 ? (
            filteredKeycaps.map((keycap) => (
              <KeycapCardMUI key={keycap._id} keycap={keycap} />
            ))
          ) : (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              {!error && keycaps?.length === 0 && (
                <Typography variant="body1">
                  No keycaps added yet. Click the ➕ button to add a keycap set.
                </Typography>
              )}
              {!error &&
                keycaps?.length > 0 &&
                colorFilters.length === 1 &&
                colorFilters[0] !== "all" && (
                  <Typography variant="body1">
                    No keycaps found with the selected color.
                  </Typography>
                )}
            </Box>
          )}
        </Box>
      </Container>

      <AddButtonMUI onOpenModal={handleOpenModal} itemType="Keycap" />

      <AddKeycapModalMUI
        open={isOpen}
        onClose={handleCloseModal}
        onAddKeycap={handleAddKeycap}
        userId={session.user.id}
      />
    </>
  );
}
