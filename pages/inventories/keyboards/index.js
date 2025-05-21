import { useState, useEffect, useRef, useCallback } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddButtonMUI from "@/components/SharedComponents/AddButtonMUI";
import ProfileButtonMUI from "@/components/SharedComponents/ProfileButtonMUI";
import BackButtonMUI from "@/components/SharedComponents/BackButtonMUI";
import KeyboardCardMUI from "@/components/KeyboardComponents/KeyboardCardMUI";
import ScrollPositionManager from "@/components/SharedComponents/ScrollPositionManager";
import AddKeyboardModalMUI, {
  LAYOUT_ORDER,
} from "@/components/KeyboardComponents/AddKeyboardModalMUI";

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

export default function Keyboards() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLayouts, setSelectedLayouts] = useState(["all"]);
  const layoutScrollRef = useRef(null);

  const {
    data: keyboards,
    error,
    mutate,
  } = useSWR("/api/inventories/userkeyboards");

  const handleAddKeyboard = useCallback(
    async (keyboardToAdd, isTemp = false, tempId = null) => {
      try {
        // If we're dealing with a temporary keyboard, update local state first
        if (isTemp) {
          // Optimistically update the UI with the temporary keyboard
          mutate((currentData) => {
            return [...(currentData || []), keyboardToAdd];
          }, false); // Don't revalidate yet
          return;
        }

        // If we're replacing a temp keyboard, remove it first
        if (tempId) {
          // If keyboard is null, just remove the temp item
          if (!keyboardToAdd) {
            mutate((currentData) => {
              return currentData.filter((kb) => kb._id !== tempId);
            }, false);
            return;
          }

          // Otherwise, make the API call to add the real keyboard
          const response = await fetch("/api/inventories/userkeyboards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...keyboardToAdd,
              _id: undefined, // Don't send the temp ID
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add keyboard");
          }

          const data = await response.json();

          // Replace the temp keyboard with the real one
          mutate((currentData) => {
            return currentData.map((kb) =>
              kb._id === tempId ? { ...data.keyboard } : kb
            );
          }, false);

          // Now revalidate to ensure everything is in sync
          mutate();
        } else {
          // Regular flow for dropdown selection
          const response = await fetch("/api/inventories/userkeyboards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(keyboardToAdd),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add keyboard");
          }

          // Refresh data from server
          mutate();
        }
      } catch (error) {
        console.error("Failed to add keyboard:", error);
        alert(`Error: ${error.message}`);

        // If there was an error with a temp keyboard, remove it
        if (tempId) {
          mutate((currentData) => {
            return currentData.filter((kb) => kb._id !== tempId);
          }, false);
        }
      }
    },
    [mutate]
  );

  // Function to handle layout selection
  const handleLayoutSelect = useCallback((layout) => {
    setSelectedLayouts((prev) => {
      // If selecting "all", clear other selections
      if (layout === "all") {
        return ["all"];
      }

      // If currently "all" is selected and selecting another layout, remove "all"
      if (prev.includes("all") && layout !== "all") {
        return [layout];
      }

      // Toggle selection
      if (prev.includes(layout)) {
        const newSelection = prev.filter((l) => l !== layout);
        // If no layouts left, select "all"
        return newSelection.length === 0 ? ["all"] : newSelection;
      } else {
        return [...prev, layout];
      }
    });
  }, []);

  // Mouse wheel horizontal scrolling
  const handleWheel = useCallback((event) => {
    if (event.currentTarget) {
      event.preventDefault();
      event.currentTarget.scrollLeft += event.deltaY;
    }
  }, []);

  useEffect(() => {
    const scrollContainer = layoutScrollRef.current;
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
  }, [handleWheel]);

  // Get all unique layouts
  const uniqueLayouts = keyboards
    ? [
        "all",
        ...Array.from(
          new Set(keyboards.map((keyboard) => keyboard.layout))
        ).sort((a, b) => {
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
        }),
      ]
    : ["all"];

  // Filter keyboards
  const filteredKeyboards = keyboards?.filter(
    (keyboard) =>
      selectedLayouts.includes("all") ||
      selectedLayouts.includes(keyboard.layout)
  );

  // Handle opening/closing modal
  const handleOpenModal = useCallback(() => setIsOpen(true), []);
  const handleCloseModal = useCallback(() => setIsOpen(false), []);

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

  if (error) return <p>Error loading keyboards...</p>;
  if (!keyboards)
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
        <ScrollPositionManager pageId="keyboards" enabled={true} />
      </NoSsr>

      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Keyboard Inventory
        </Typography>

        {/* Layout filters */}
        <Box
          ref={layoutScrollRef}
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
            {uniqueLayouts.map((layout) => (
              <Chip
                key={layout}
                label={layout === "all" ? "All Layouts" : layout}
                onClick={() => handleLayoutSelect(layout)}
                color={
                  selectedLayouts.includes(layout) ? "secondary" : "default"
                }
                variant={
                  selectedLayouts.includes(layout) ? "filled" : "outlined"
                }
              />
            ))}
          </Stack>
        </Box>

        {/* Keyboards display */}
        <Box
          sx={(theme) => ({
            // Default styles: Handles 1 card (centered) and 2+ cards on small screens (list)
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: theme.spacing(0),
            width: "100%",

            // Styles for larger screens (md and up) when there are 2+ cards (grid)
            ...(filteredKeyboards &&
              filteredKeyboards.length > 1 && {
                [theme.breakpoints.up("md")]: {
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  justifyItems: "center",
                  alignItems: "start",
                  columnGap: theme.spacing(2),
                  rowGap: theme.spacing(0),
                },
              }),
          })}
        >
          {error && (
            <Typography color="error">Error loading keyboards.</Typography>
          )}
          {!error && filteredKeyboards?.length > 0 ? (
            filteredKeyboards.map((keyboard) => (
              <KeyboardCardMUI key={keyboard._id} itemObj={keyboard} />
            ))
          ) : (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              {!error && keyboards?.length === 0 && (
                <Typography variant="body1">
                  No keyboards added yet. Click the ➕ button to add a keyboard
                  to your inventory.
                </Typography>
              )}
              {!error &&
                keyboards?.length > 0 &&
                selectedLayouts.length === 1 &&
                selectedLayouts[0] !== "all" && (
                  <Typography variant="body1">
                    No keyboards found with the selected layout.
                  </Typography>
                )}
            </Box>
          )}
        </Box>
      </Container>

      <AddButtonMUI onOpenModal={handleOpenModal} itemType="Keyboard" />

      <AddKeyboardModalMUI
        open={isOpen}
        onClose={handleCloseModal}
        onAddKeyboard={handleAddKeyboard}
        userId={session.user.uuid}
      />
    </>
  );
}
