import InventoryCard from "@/components/KeycapComponents/InventoryCard";
import Link from "next/link";
import AddButton from "@/components/KeycapComponents/AddButton";
import Modal from "@/components/KeycapComponents/AddKeycapModal";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import useSWR from "swr";
import EditInventoryButton from "@/components/KeycapComponents/EditInventoryButton";
import MenuIcon from "@/components/icons/MenuIcon";
import AddKeycapModal from "@/components/KeycapComponents/AddKeycapModal";

export default function Keycaps() {
  const [isOpen, setIsOpen] = useState(false);
  const [userKeycaps, setUserKeycaps] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedColors, setSelectedColors] = useState(["all"]);
  const colorScrollRef = useRef(null);
  const userId = "guest_user";

  const {
    data: keycaps,
    error,
    mutate,
  } = useSWR(`/api/inventories/userkeycaps?userId=${userId}`);

  useEffect(() => {
    if (keycaps) {
      setUserKeycaps(keycaps.map((keycap) => keycap._id));
    }
  }, [keycaps]);

  //Function for adding keycap ID to the userKeycaps array
  const handleAddKeycap = async (keycapId, selectedKits) => {
    if (!userKeycaps.includes(keycapId)) {
      const updatedKeycaps = [...userKeycaps, keycapId];
      setUserKeycaps(updatedKeycaps);

      //Save update in DB
      const response = await fetch("/api/inventories/userkeycaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest_user",
          keycapSetId: keycapId,
          selectedKits,
        }),
      });

      if (response.ok) {
        mutate();
      } else {
        console.error("Failed to add keycap:", await response.json());
      }
    }
  };

  const getDeleteConfirmation = (itemType) => {
    return window.confirm(
      `Are you sure you want to remove this ${itemType}?\n\n` +
        `This will permanently remove:\n` +
        `• This ${itemType}\n` +
        `• Selected kits\n` +
        `• Selected colors\n` +
        `• Any personal notes that you have added`
    );
  };

  const handleDeleteKeycap = async (keycapSetId, event) => {
    event.stopPropagation();

    if (!getDeleteConfirmation("keycapset")) return;

    // Remove from UI
    setUserKeycaps((prevKeycaps) =>
      prevKeycaps.filter((id) => id !== keycapSetId)
    );

    const response = await fetch("/api/inventories/userkeycaps", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, keycapSetId }),
    });

    if (response.ok) {
      mutate();
    } else {
      console.error("Failed to delete keycap:", await response.json());
    }
  };

  // Multiselect filtered keycaps
  const getFilteredKeycaps = (keycapsData, selectedColorArray) => {
    if (!keycapsData) return [];

    // If "all" is selected or no colors are selected, return all keycaps
    if (selectedColorArray.includes("all") || selectedColorArray.length === 0) {
      return keycapsData;
    }

    // Return keycaps that have at least one of the selected colors
    return keycapsData.filter((keycap) => {
      if (!keycap.selectedColors) return false;
      return keycap.selectedColors.some((color) =>
        selectedColorArray.includes(color)
      );
    });
  };

  // Function to handle color selection
  const handleColorSelect = (color) => {
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
  };

  // Mouse wheel horizontal scrolling
  const handleWheel = (event) => {
    if (colorScrollRef.current) {
      event.preventDefault();
      colorScrollRef.current.scrollLeft += event.deltaY;
    }
  };

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
  }, []);

  const filteredKeycaps = getFilteredKeycaps(keycaps, selectedColors);

  // Get all unique colors once
  const uniqueColors = [
    "all",
    ...Array.from(
      new Set(keycaps?.flatMap((keycap) => keycap.selectedColors || []))
    ),
  ];

  if (error) return <p>Error loading keycaps...</p>;
  if (!keycaps)
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );

  return (
    <>
      <HomeBurger href="/">
        <MenuIcon />
      </HomeBurger>

      <AddKeycapModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onAddKeycap={handleAddKeycap}
      />

      <StyledContainer>
        <h1>Keycap Inventory</h1>

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

        <CardContainer>
          {filteredKeycaps?.length ? (
            <InventoryCard
              data={filteredKeycaps}
              isEditMode={isEditMode}
              onDelete={handleDeleteKeycap}
            />
          ) : (
            <>
              <p>No keycaps found with the selected color!</p>
              {keycaps?.length === 0 && (
                <p>Click the ➕ button to add a keycap set to your inventory</p>
              )}
            </>
          )}
        </CardContainer>
      </StyledContainer>
      <AddButton onOpenModal={() => setIsOpen(true)} isEditMode={isEditMode} />
      <EditInventoryButton
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode((prevMode) => !prevMode)}
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
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  @media (min-width: 900px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 90%;
    max-width: 1200px;
    margin: 20px auto 0;
    justify-content: center;
    align-items: start;
  }
`;

const HomeBurger = styled(Link)`
  position: fixed;
  display: flex;
  background-color: #007bff;
  height: 40px;
  width: 40px;
  color: white;
  left: 10px;
  top: 8px;
  z-index: 1000;
  border-radius: 10px;
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
  top: 0;
  z-index: 100;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
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
