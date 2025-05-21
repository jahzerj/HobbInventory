import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { nanoid } from "nanoid";

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
import ScrollPositionManager from "@/components/SharedComponents/ScrollPositionManager";
import SwitchCardMUI from "@/components/SwitchComponents/SwitchCardMUI";
import AddSwitchModalMUI from "@/components/SwitchComponents/AddSwitchModalMUI";

export default function Switches() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  // Basic state
  const [isOpen, setIsOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedManufacturers, setSelectedManufacturers] = useState(["all"]);

  // Refs for scrolling
  const typeScrollRef = useRef(null);
  const manufacturerScrollRef = useRef(null);

  // Fetch data
  const {
    data: switches,
    error,
    mutate,
  } = useSWR("/api/inventories/userswitches");

  const handleAddSwitch = async (newSwitch, isTemp = false, tempId = null) => {
    try {
      // If we're dealing with a temporary switch, update local state first
      if (isTemp) {
        // Optimistically update the UI with the temporary switch
        mutate(
          (currentSwitches = []) => [...currentSwitches, newSwitch],
          false
        );
        return;
      }

      // If we're replacing a temp switch, remove it first
      if (tempId) {
        // If switch is null, just remove the temp item
        if (!newSwitch) {
          mutate(
            (currentSwitches) =>
              currentSwitches.filter((s) => s._id !== tempId),
            false
          );
          return;
        }

        // Otherwise, make the API call to add the real switch
        const response = await fetch("/api/inventories/userswitches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newSwitch,
            _id: undefined, // Don't send the temp ID
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add switch");
        }

        const data = await response.json();

        // Replace the temp switch with the real one
        mutate(
          (currentSwitches) =>
            currentSwitches.map((sw) =>
              sw._id === tempId ? { ...data.switch } : sw
            ),
          false
        );

        // Now revalidate to ensure everything is in sync
        mutate();
      } else {
        // Regular flow for dropdown selection
        const response = await fetch("/api/inventories/userswitches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSwitch),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add switch");
        }

        // Refresh data from server
        mutate();
      }
    } catch (error) {
      console.error("Failed to add switch:", error);
      alert(`Error: ${error.message}`);

      // If there was an error with a temp switch, remove it
      if (tempId) {
        mutate(
          (currentSwitches) =>
            currentSwitches.filter((sw) => sw._id !== tempId),
          false
        );
      }
    }
  };

  // Filter switches
  const filteredSwitches = switches?.filter((switchItem) => {
    const matchesType =
      typeFilter === "all" ||
      switchItem.switchType.toLowerCase() === typeFilter.toLowerCase();

    const matchesManufacturer =
      selectedManufacturers.includes("all") ||
      selectedManufacturers.includes(switchItem.manufacturer);

    return matchesType && matchesManufacturer;
  });

  // Handle manufacturer filter
  const handleManufacturerSelect = (manufacturer) => {
    setSelectedManufacturers((prev) => {
      if (manufacturer === "all") {
        return ["all"];
      }
      if (prev.includes("all") && manufacturer !== "all") {
        return [manufacturer];
      }
      if (prev.includes(manufacturer)) {
        const newSelection = prev.filter((m) => m !== manufacturer);
        return newSelection.length === 0 ? ["all"] : newSelection;
      }
      return [...prev, manufacturer];
    });
  };

  // Handle type filter
  const handleTypeSelect = (type) => {
    setTypeFilter(type);
  };

  // Handle wheel events for horizontal scrolling
  const handleWheel = (event) => {
    if (event.currentTarget) {
      event.preventDefault();
      event.currentTarget.scrollLeft += event.deltaY;
    }
  };

  // Add event listeners
  useEffect(() => {
    const typeContainer = typeScrollRef.current;
    const manufacturerContainer = manufacturerScrollRef.current;

    if (typeContainer) {
      typeContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }
    if (manufacturerContainer) {
      manufacturerContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (typeContainer) {
        typeContainer.removeEventListener("wheel", handleWheel);
      }
      if (manufacturerContainer) {
        manufacturerContainer.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  // Get unique manufacturers and sort alphabetically
  const uniqueManufacturers = [
    "all",
    ...Array.from(new Set(switches?.map((sw) => sw.manufacturer) || [])).sort(
      (a, b) => a.localeCompare(b)
    ),
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

  if (!session) {
    return null; // This prevents any flash of content before redirect
  }

  if (error) return <p>Error loading switches...</p>;
  if (!switches)
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
        <ScrollPositionManager pageId="switches" enabled={true} />
      </NoSsr>

      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Switches Inventory
        </Typography>

        {/* Manufacturer filters */}
        <Box
          ref={manufacturerScrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            py: 1.5,
            px: 1,
            mb: 0,
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
            {uniqueManufacturers.map((manufacturer) => (
              <Chip
                key={manufacturer}
                label={
                  manufacturer === "all" ? "All Manufacturers" : manufacturer
                }
                onClick={() => handleManufacturerSelect(manufacturer)}
                color={
                  selectedManufacturers.includes(manufacturer)
                    ? "secondary"
                    : "default"
                }
                variant={
                  selectedManufacturers.includes(manufacturer)
                    ? "filled"
                    : "outlined"
                }
              />
            ))}
          </Stack>
        </Box>

        {/* Type filters */}
        <Box
          ref={typeScrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            py: 1,
            px: 1,
            mb: 2,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            position: "sticky",
            top: 49,
            zIndex: 10,
            bgcolor: "transparent",
            backdropFilter: "blur(8px)",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ px: 1 }}>
            {["all", "linear", "tactile", "clicky"].map((type) => (
              <Chip
                key={type}
                label={
                  type === "all"
                    ? "All Types"
                    : type.charAt(0).toUpperCase() + type.slice(1)
                }
                onClick={() => handleTypeSelect(type)}
                color={typeFilter === type ? "warning" : "default"}
                variant={typeFilter === type ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        </Box>

        {/* Switches display */}
        <Box
          sx={(theme) => ({
            // Default styles for phone screens (2 cards across)
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1,
            width: "100%",

            // Special case for single item (centered regardless of screen size)
            ...(filteredSwitches?.length === 1 && {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }),

            // For tablets and larger (600px+): 4 cards across
            [theme.breakpoints.up("sm")]: {
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
            },
          })}
        >
          {error && (
            <Typography color="error" sx={{ gridColumn: "1 / -1" }}>
              Error loading switches.
            </Typography>
          )}
          {!error && filteredSwitches?.length > 0 ? (
            filteredSwitches.map((switchItem) => (
              <SwitchCardMUI key={switchItem._id} itemObj={switchItem} />
            ))
          ) : (
            <Box sx={{ textAlign: "center", mt: 4, gridColumn: "1 / -1" }}>
              {!error && switches?.length === 0 && (
                <Typography variant="body1">
                  No switches added yet. Click the ➕ button to add a switch.
                </Typography>
              )}
              {!error &&
                switches?.length > 0 &&
                filteredSwitches?.length === 0 && (
                  <Typography variant="body1">
                    No switches found with the selected filters.
                  </Typography>
                )}
            </Box>
          )}
        </Box>
      </Container>

      <AddButtonMUI onOpenModal={handleOpenModal} itemType="Switch" />

      <AddSwitchModalMUI
        open={isOpen}
        onClose={handleCloseModal}
        onAddSwitch={handleAddSwitch}
        userId={session.user.uuid}
      />
    </>
  );
}
