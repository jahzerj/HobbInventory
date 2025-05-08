import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";

import {
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

import ProfileButtonMUI from "@/components/SharedComponents/ProfileButtonMUI";
import BackButtonMUI from "@/components/SharedComponents/BackButtonMUI";
import AddButtonMUI from "@/components/SharedComponents/AddButtonMUI";
import AddKeycapModal from "@/components/KeycapComponents/AddKeycapModal";
import KeycapCardMUI from "@/components/KeycapComponents/KeycapCardMUI";

export default function Keycapz() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  // Basic state
  const [isOpen, setIsOpen] = useState(false);
  const [colorFilter, setColorFilter] = useState("all");

  // Fetch data
  const {
    data: keycaps,
    error,
    mutate,
  } = useSWR("/api/inventories/userkeycaps");

  // Handle adding keycap
  const handleAddKeycap = async (keycapToAdd) => {
    try {
      const response = await fetch("/api/inventories/userkeycaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keycapToAdd),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add keycap");
      }

      mutate();
    } catch (error) {
      console.error("Failed to add keycap:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle deleting keycap
  const handleDeleteKeycap = async (keycapId, event) => {
    event.stopPropagation();

    if (!window.confirm("Are you sure you want to remove this keycap set?")) {
      return;
    }

    try {
      const response = await fetch("/api/inventories/userkeycaps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keycapId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete keycap");
      }

      mutate();
    } catch (error) {
      console.error("Failed to delete keycap:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Filter keycaps by selected color
  const filteredKeycaps = keycaps?.filter(
    (keycap) =>
      colorFilter === "all" ||
      (keycap.selectedColors && keycap.selectedColors.includes(colorFilter))
  );

  // Get all unique colors from keycaps
  const uniqueColors = [
    "all",
    ...new Set(keycaps?.flatMap((keycap) => keycap.selectedColors || []) || []),
  ];

  // Handle modal
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

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

  // Auth check
  if (!session) return null;

  return (
    <>
      <ProfileButtonMUI />
      <BackButtonMUI href="/" />

      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Keycap Inventory
        </Typography>

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
              {!error && keycaps?.length > 0 && colorFilter !== "all" && (
                <Typography variant="body1">
                  No keycaps found with the selected color.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Container>

      <AddButtonMUI
        onOpenModal={handleOpenModal}
        isEditMode={false} // Assuming edit mode is not a feature on this page for the add button
        itemType="Keycap"
      />

      <AddKeycapModal
        open={isOpen}
        onClose={handleCloseModal}
        onAddKeycap={handleAddKeycap}
        // userId={session.user.uuid} // Pass userId if your modal needs it
      />
    </>
  );
}
