import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import useSWR from "swr";
import EditInventoryButton from "@/components/SharedComponents/EditInventoryButton";
import MenuIcon from "@/components/icons/MenuIcon";
import AddKeycapModal from "@/components/KeycapComponents/AddKeycapModal";
import InventoryList from "@/components/SharedComponents/InventoryList";
import KeycapCard from "@/components/KeycapComponents/KeycapCard";
import ScrollPositionManager from "@/components/SharedComponents/ScrollPositionManager";
import ProfileButton from "@/components/SharedComponents/ProfileButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddButton from "@/components/SharedComponents/AddButton";

export default function Keycaps() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [userKeycaps, setUserKeycaps] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedColors, setSelectedColors] = useState(["all"]);
  const colorScrollRef = useRef(null);

  const {
    data: keycaps,
    error,
    mutate,
  } = useSWR("/api/inventories/userkeycaps");

  useEffect(() => {
    if (keycaps) {
      setUserKeycaps(keycaps.map((keycap) => keycap._id));
    }
  }, [keycaps]);

  //Function for adding keycap ID to the userKeycaps array
  const handleAddKeycap = useCallback(
    async (keycapToAdd) => {
      try {
        setUserKeycaps((prev) => [...prev, keycapToAdd.keycapId]);

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
        // Revert on error
        setUserKeycaps((prev) =>
          prev.filter((id) => id !== keycapToAdd.keycapId)
        );
        console.error("Failed to add keycap:", error);
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
        `• Selected kits\n` +
        `• Selected colors\n` +
        `• Any personal notes that you have added`
    );
  }, []);

  const handleDeleteKeycap = useCallback(
    async (keycapId, event) => {
      event.stopPropagation();

      if (!getDeleteConfirmation("keycapset")) return;

      try {
        setUserKeycaps((prev) => prev.filter((id) => id !== keycapId));

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
        // Revert the UI change and refetch data
        mutate();
      }
    },
    [getDeleteConfirmation, mutate]
  );

  // Memoized color filtering function
  const getFilteredKeycaps = useCallback((keycapsData, selectedColorArray) => {
    if (!keycapsData) return [];

    // If "all" is selected or no colors are selected, return all keycaps
    if (selectedColorArray.includes("all") || selectedColorArray.length === 0) {
      return keycapsData;
    }

    // Return keycaps that have at least one of the selected colors
    return keycapsData.filter((keycap) =>
      keycap.selectedColors?.some((color) => selectedColorArray.includes(color))
    );
  }, []);

  // Function to handle color selection
  const handleColorSelect = useCallback((color) => {
    setSelectedColors((prev) => {
      // If selecting "all", clear other selections
      if (color === "all") {
        return ["all"];
      }

      // If currently "all" is selected and selecting another color, remove "all"
      if (prev.includes("all") && color !== "all") {
        return [color];
      }

      // Toggle selection
      if (prev.includes(color)) {
        const newSelection = prev.filter((c) => c !== color);
        // If no colors left, select "all"
        return newSelection.length === 0 ? ["all"] : newSelection;
      } else {
        return [...prev, color];
      }
    });
  }, []);

  // Mouse wheel horizontal scrolling
  const handleWheel = useCallback((event) => {
    if (colorScrollRef.current) {
      event.preventDefault();
      colorScrollRef.current.scrollLeft += event.deltaY;
    }
  }, []);

  useEffect(() => {
    const scrollContainer = colorScrollRef.current;
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

  // Get all unique colors once
  const uniqueColors = keycaps
    ? [
        "all",
        ...Array.from(
          new Set(keycaps.flatMap((keycap) => keycap.selectedColors || []))
        ),
      ]
    : ["all"];

  const filteredKeycaps = getFilteredKeycaps(keycaps, selectedColors);

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

  if (error) return <p>Error loading keycaps...</p>;
  if (!keycaps)
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );

  return (
    <>
      <ProfileButton />
      <ScrollPositionManager pageId="keycaps" enabled={true} />
      <HomeBurger href="/">
        <MenuIcon />
      </HomeBurger>

      <AddKeycapModal
        open={isOpen}
        onClose={handleCloseModal}
        onAddKeycap={handleAddKeycap}
      />

      <StyledContainer>
        <LongTitle>Keycap Inventory</LongTitle>

        <ColorFilterContainer ref={colorScrollRef}>
          {uniqueColors.map((color) => (
            <ColorPill
              key={color}
              $color={color !== "all" ? color.toLowerCase() : null}
              $isSelected={selectedColors.includes(color)}
              onClick={() => handleColorSelect(color)}
            >
              {color === "all" ? "All Colors" : color}
            </ColorPill>
          ))}
        </ColorFilterContainer>

        <CardContainer $itemCount={filteredKeycaps?.length || 0}>
          {keycaps?.length === 0 ? (
            <EmptyStateMessage>
              <p>No keycaps added yet!</p>
              <p>Click the ➕ button to add a keycap set to your inventory</p>
            </EmptyStateMessage>
          ) : filteredKeycaps?.length === 0 ? (
            <EmptyStateMessage>
              <p>No keycaps found with the selected color!</p>
              <p>Try selecting a different color filter</p>
            </EmptyStateMessage>
          ) : (
            <InventoryList
              data={filteredKeycaps}
              isEditMode={isEditMode}
              onDelete={handleDeleteKeycap}
              ItemComponent={KeycapCard}
            />
          )}
        </CardContainer>
      </StyledContainer>

      <AddButton
        onOpenModal={handleOpenModal}
        isEditMode={isEditMode}
        itemType="Keycap"
      />
      <EditInventoryButton
        isEditMode={isEditMode}
        onToggleEdit={handleToggleEdit}
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
  gap: 10px;

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

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ColorFilterContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  padding: 10px 15px;
  gap: 10px;
  position: sticky;
  top: 40px;
  z-index: 100;
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; //IE and Edge

  &::-webkit-scrollbar {
    display: none; // Chrome, Safari, Opera
  }
`;

const ColorPill = styled.button`
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
  background-color: ${(props) =>
    props.$isSelected ? (props.$color ? props.$color : "#007bff") : "#f0f0f0"};

  color: ${(props) => {
    // If selected, always use white text for better contrast
    if (props.$isSelected) return "white";

    // If not selected, always use black text for better readability
    return "#333";
  }};

  border: 2px solid ${(props) => (props.$color ? props.$color : "#007bff")};
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
