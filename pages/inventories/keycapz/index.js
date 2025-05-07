import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import ProfileButtonMUI from "@/components/SharedComponents/ProfileButtonMUI";
import BackButtonMUI from "@/components/SharedComponents/BackButtonMUI";
import AddButtonMUI from "@/components/SharedComponents/AddButtonMUI";
import AddKeycapModal from "@/components/KeycapComponents/AddKeycapModal";
import KeycapCard from "@/components/KeycapComponents/KeycapCard";
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
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {filteredKeycaps?.length > 0 ? (
            filteredKeycaps.map((keycap) => (
              <KeycapCardMUI
                key={keycap._id}
                keycap={keycap}
                onDelete={handleDeleteKeycap}
              />
            ))
          ) : (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              {keycaps?.length === 0 && (
                <Typography variant="body1">
                  Click the ➕ button to add a keycap set to your inventory
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Container>

      <AddButtonMUI
        onOpenModal={handleOpenModal}
        isEditMode={false}
        itemType="Keycap"
      />

      <AddKeycapModal
        open={isOpen}
        onClose={handleCloseModal}
        onAddKeycap={handleAddKeycap}
      />
    </>
  );
}
