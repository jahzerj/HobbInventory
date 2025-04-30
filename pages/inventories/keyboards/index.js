import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import useSWR from "swr";
import MenuIcon from "@/components/icons/MenuIcon";
import AddKeyboardModal from "@/components/KeyboardComponents/AddKeyboardModal";
import InventoryList from "@/components/SharedComponents/InventoryList";
import KeyboardCard from "@/components/KeyboardComponents/KeyboardCard";
import ScrollPositionManager from "@/components/SharedComponents/ScrollPositionManager";
import ProfileButton from "@/components/SharedComponents/ProfileButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddButton from "@/components/SharedComponents/AddButton";
import Image from "next/image";
import AddButtonMUI from "@/components/SharedComponents/AddButtonMUI";

//MUI STUFF
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";

export default function Keyboards() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [userKeyboards, setUserKeyboards] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLayouts, setSelectedLayouts] = useState(["all"]);
  const layoutScrollRef = useRef(null);

  const {
    data: keyboards,
    error,
    mutate,
  } = useSWR("/api/inventories/userkeyboards");

  useEffect(() => {
    if (keyboards) {
      setUserKeyboards(keyboards.map((keyboard) => keyboard._id));
    }
  }, [keyboards]);

  const handleAddKeyboard = useCallback(
    async (keyboardToAdd) => {
      try {
        // Update UI optimistically
        setUserKeyboards((prev) => [...prev, keyboardToAdd.keyboardId]);

        const response = await fetch("/api/inventories/userkeyboards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(keyboardToAdd),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add keyboard");
        }

        // Refresh data from server to ensure accuracy
        mutate();
      } catch (error) {
        // Revert UI change on error
        setUserKeyboards((prev) =>
          prev.filter((id) => id !== keyboardToAdd.keyboardId)
        );
        console.error("Failed to add keyboard:", error);
        alert(`Error: ${error.message}`);
      }
    },
    [mutate]
  );

  // Make getDeleteConfirmation a memoized function with useCallback
  const getDeleteConfirmation = useCallback((itemType) => {
    return window.confirm(
      `Are you sure you want to remove this ${itemType}?\n\n` +
        `This will permanently remove:\n` +
        `• This ${itemType}\n` +
        `• Selected switches\n` +
        `• Selected builds\n` +
        `• Selected keycaps\n` +
        `• Any personal notes that you have added`
    );
  }, []);

  const handleDeleteKeyboard = useCallback(
    async (keyboardId, event) => {
      event.stopPropagation();

      if (!getDeleteConfirmation("keyboard")) return;

      try {
        // Optimistic UI update
        setUserKeyboards((prev) => prev.filter((id) => id !== keyboardId));

        const response = await fetch("/api/inventories/userkeyboards", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyboardId: keyboardId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete keyboard");
        }

        mutate();
      } catch (error) {
        console.error("Failed to delete keyboard:", error);
        alert(`Error: ${error.message}`);
        // Force refetch to restore accurate state on error
        mutate();
      }
    },
    [getDeleteConfirmation, mutate]
  );

  // Memoized layout filtering function
  const getFilteredKeyboards = useCallback(
    (keyboardsData, selectedLayoutArray) => {
      if (!keyboardsData) return [];

      // If "all" is selected or no layouts are selected, return all keyboards
      if (
        selectedLayoutArray.includes("all") ||
        selectedLayoutArray.length === 0
      ) {
        return keyboardsData;
      }

      // Return keyboards that match the selected layout
      return keyboardsData.filter((keyboard) =>
        selectedLayoutArray.includes(keyboard.layout)
      );
    },
    []
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
    if (layoutScrollRef.current) {
      event.preventDefault();
      layoutScrollRef.current.scrollLeft += event.deltaY;
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
        ...Array.from(new Set(keyboards.map((keyboard) => keyboard.layout))),
      ]
    : ["all"];

  const filteredKeyboards = getFilteredKeyboards(keyboards, selectedLayouts);

  // Handle opening/closing modal
  const handleOpenModal = useCallback(() => setIsOpen(true), []);
  const handleCloseModal = useCallback(() => setIsOpen(false), []);

  // Handle toggling edit mode
  const handleToggleEdit = useCallback(
    () => setIsEditMode((prevMode) => !prevMode),
    []
  );

  if (status === "loading") {
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );
  }

  if (!session) {
    return null; // This prevents any flash of content before redirect
  }

  if (error) return <p>Error loading keyboards...</p>;
  if (!keyboards)
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );

  return (
    <>
      <ProfileButton />
      <ScrollPositionManager pageId="keyboards" enabled={true} />
      <HomeBurger href="/">
        <MenuIcon />
      </HomeBurger>

      <AddKeyboardModal
        open={isOpen}
        onClose={handleCloseModal}
        onAddKeyboard={handleAddKeyboard}
      />

      <StyledContainer>
        <LongTitle>Keyboard Inventory</LongTitle>

        <LayoutFilterContainer ref={layoutScrollRef}>
          {uniqueLayouts.map((layout) => (
            <LayoutPill
              key={layout}
              $isSelected={selectedLayouts.includes(layout)}
              onClick={() => handleLayoutSelect(layout)}
            >
              {layout === "all" ? "All Layouts" : layout}
            </LayoutPill>
          ))}
        </LayoutFilterContainer>

        <CardContainer $itemCount={filteredKeyboards?.length || 0}>
          {keyboards?.length === 0 ? (
            <EmptyStateMessage>
              <p>No keyboards added yet!</p>
              <p>Click the ➕ button to add a keyboard to your inventory</p>
            </EmptyStateMessage>
          ) : filteredKeyboards?.length === 0 ? (
            <EmptyStateMessage>
              <p>No keyboards found with the selected layout!</p>
              <p>Try selecting a different layout filter</p>
            </EmptyStateMessage>
          ) : (
            <InventoryList
              data={filteredKeyboards}
              isEditMode={isEditMode}
              onDelete={handleDeleteKeyboard}
              ItemComponent={KeyboardCard}
            />
          )}
        </CardContainer>
        <Container>
          <Card
            sx={
              ({
                width: {
                  xs: "80%",
                  sm: "500px",
                },
                m: 2,
              },
              { borderRadius: "30px" },
              { maxWidth: "500px" })
            }
          >
            <CardContent>
              <CardMedia sx={{ height: 200, position: "relative" }}>
                <Image
                  src={keyboards[0]?.renders[0]}
                  alt={keyboards[0]?.name}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </CardMedia>
              <Typography variant="body2" color="text.secondary">
                {keyboards[0]?.designer}
              </Typography>
              <Typography variant="h5" component="div">
                {keyboards[0]?.name}
              </Typography>
              <Typography variant="h6" component="div">
                {keyboards[0]?.layout} {keyboards[0]?.blocker}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </StyledContainer>

      <AddButtonMUI
        onOpenModal={handleOpenModal}
        isEditMode={isEditMode}
        itemType="Keyboard"
      />
    </>
  );
}

const StyledContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 25px;
`;

const CardContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
  margin-bottom: 50px;

  @media (min-width: 900px) {
    /* Only use grid layout when we have multiple items */
    display: ${(props) => (props.$itemCount > 1 ? "grid" : "flex")};
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 90%;
    max-width: 1200px;
    margin: 20px auto 0;
    justify-content: center;
    align-items: ${(props) => (props.$itemCount > 1 ? "start" : "center")};
    flex-direction: column;
  }
`;

const HomeBurger = styled(Link)`
  position: fixed; /* Or absolute if preferred */
  display: flex;
  align-items: center; /* Center icon */
  justify-content: center; /* Center icon */
  background-color: var(--color-primary, #007bff);
  height: 40px;
  width: 40px;
  color: var(--color-primary-fg, white);
  left: 10px;
  top: 8px;
  z-index: 1000;
  border-radius: 10px;
  text-decoration: none; /* Remove underline from link */

  svg {
    /* Style the SVG icon */
    width: 24px;
    height: 24px;
  }
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: #f8f8f8;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 500px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  p:first-child {
    font-weight: bold;
    font-size: 1.2em;
    margin-bottom: 10px;
  }

  p:last-child {
    color: #666;
  }
`;
const LongTitle = styled.h1`
  @media screen and (max-width: 390px) {
    font-size: 28px;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledSpan = styled.span`
  width: 48px;
  height: 48px;
  border: 5px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Add these styled components
const LayoutFilterContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  padding: 10px 15px;
  gap: 10px;
  position: sticky;
  top: 40px;
  z-index: 100;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const LayoutPill = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: fit-content;
  padding: 8px 16px;
  border-radius: 50px;
  white-space: nowrap;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.$isSelected ? "#007bff" : "#f0f0f0")};
  color: ${(props) => (props.$isSelected ? "white" : "#333")};
  border: 2px solid #007bff;
  box-shadow: ${(props) =>
    props.$isSelected ? "0 2px 5px rgba(0,0,0,0.2)" : "none"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
  }
`;

// Mock data for keyboard card development
export const mockKeyboardData = [
  {
    userId: "guest_user",
    _id: "mock_id_1",
    name: "Dune65",
    designer: "Kenny from Grit",
    layout: "65%",
    renders: [
      "https://i.imgur.com/wg1Geuu.jpeg",
      "https://i.imgur.com/i6jpkss.jpeg",
    ],
    blocker: "Winkeyless",
    switchType: "MX",
    plateMaterial: ["Aluminum", "Polycarbonate"],
    mounting: ["Leaf Spring Top Mount", "Gasket Mount"],
    typingAngle: "8°",
    frontHeight: "16.5mm",
    surfaceFinish: "Anodization",
    color: "Sand Gold",
    weightMaterial: "Brass",
    buildWeight: "Not specified",
    pcbOptions: {
      thickness: "1.6mm",
      material: "FR4",
      backspace: ["Full BS", "Split BS"],
      layoutStandard: ["ISO", "ANSI"],
      leftShift: ["Split LS", "Full LS"],
      capslock: ["NormalCapslock", "SteppedCapslock"],
      rightShift: ["Split Right Shift", "Full Right Shift"],
      numpad: {
        enter: [],
        plus: [],
        zero: [],
        orientation: [],
      },
      spacebar: ["7u", "6.25u"],
      flexCuts: false,
    },
    builds: [
      {
        name: "Initial Build",
        plate: "Aluminum",
        switches: [
          {
            switchId: "some_switch_objectid",
            quantity: 67,
            position: "All positions",
          },
        ],
        stabilizers: {
          type: "Screw-in",
          brand: "Durock V2",
          lubed: true,
        },
        modifications: [
          {
            type: "Initial Build",
            description: "Stock configuration",
            date: "2024-03-19T00:00:00.000Z",
          },
        ],
        photos: ["https://i.imgur.com/EbIdAxU.jpeg"],
        active: true,
        buildDate: "2024-03-19T00:00:00.000Z",
      },
    ],
  },
  {
    userId: "guest_user",
    _id: "mock_id_2",
    name: "Derivative R1",
    designer: "JJWKB",
    layout: "60%",
    renders: [
      "https://i.imgur.com/KhTVEmZ.png",
      "https://i.imgur.com/2UErHhw.png",
      "https://i.imgur.com/mU4WF4g.png",
    ],
    blocker: "Winkey",
    switchType: "MX",
    plateMaterial: ["Aluminum", "Polycarbonate"],
    mounting: [
      "O-ring Gasket Mount",
      "Top Mount",
      "Relief Mount",
      "Gasket Relief Mount",
    ],
    typingAngle: "6.5°",
    frontHeight: "22.4mm",
    surfaceFinish: "Anodization",
    color: "Amphibian",
    weightMaterial: "Stainless Steel 304",
    buildWeight: "1200g",
    pcbOptions: {
      thickness: "1.6mm",
      material: "FR4",
      backspace: ["Full BS", "Split BS"],
      layoutStandard: ["ANSI"],
      leftShift: ["Split LS", "Full LS"],
      rightShift: ["Split Right Shift", "Full Right Shift"],
      numpad: {
        enter: [],
        plus: [],
        zero: [],
        orientation: [],
      },
      spacebar: ["7u"],
      flexCuts: false,
    },
    notes: [
      {
        _id: "note2",
        text: "Features three mounting options and comes with 50A O-ring by default. Additional 30A and 70A O-rings available.",
        timestamp: "2024-03-19T00:00:00.000Z",
      },
    ],
    builds: [
      {
        name: "Initial Build",
        plate: "Aluminum",
        switches: [
          {
            switchId: "some_switch_objectid",
            quantity: 61,
            position: "All positions",
          },
        ],
        stabilizers: {
          type: "Screw-in",
          brand: "Durock V2",
          lubed: true,
        },
        modifications: [
          {
            type: "Initial Build",
            description: "Stock configuration",
            date: "2024-03-19T00:00:00.000Z",
          },
        ],
        photos: ["https://i.imgur.com/YbxAoDS.png"],
        active: true,
        buildDate: "2024-03-19T00:00:00.000Z",
      },
    ],
  },
];
