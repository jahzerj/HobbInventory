import Link from "next/link";
import AddButton from "@/components/KeycapComponents/AddButton";
import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import useSWR from "swr";
import EditInventoryButton from "@/components/KeycapComponents/EditInventoryButton";
import MenuIcon from "@/components/icons/MenuIcon";
import InventoryList from "@/components/SharedComponents/InventoryList";

export default function Keyboards() {
  const [isOpen, setIsOpen] = useState(false);
  const [userKeyboards, setUserKeyboards] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const filterScrollRef = useRef(null);
  const userId = "guest_user";

  const {
    data: keyboards,
    error,
    mutate,
  } = useSWR(`/api/inventories/userkeyboards?userId=${userId}`);

  useEffect(() => {
    if (keyboards) {
      setUserKeyboards(keyboards.map((keyboard) => keyboard._id));
    }
  }, [keyboards]);

  //Function for adding keyboard to the user's inventory
  const handleAddKeyboard = useCallback(
    async (keyboardToAdd) => {
      if (userKeyboards.includes(keyboardToAdd.keyboardDefinitionId)) return;

      try {
        // Update UI optimistically
        setUserKeyboards((prev) => [
          ...prev,
          keyboardToAdd.keyboardDefinitionId,
        ]);

        // Send complete keyboard data to API
        const response = await fetch("/api/inventories/userkeyboards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(keyboardToAdd),
        });

        if (!response.ok) {
          throw new Error("Failed to add keyboard");
        }

        // Refresh data from server to ensure accuracy
        mutate();
      } catch (error) {
        // Revert UI change on error
        setUserKeyboards((prev) =>
          prev.filter((id) => id !== keyboardToAdd.keyboardDefinitionId)
        );
        console.error("Failed to add keyboard:", error);
      }
    },
    [userKeyboards, mutate]
  );

  // Make getDeleteConfirmation a memoized function with useCallback
  const getDeleteConfirmation = useCallback((itemType) => {
    return window.confirm(
      `Are you sure you want to remove this ${itemType}?\n\n` +
        `This will permanently remove:\n` +
        `• This ${itemType}\n` +
        `• Any personal notes that you have added`
    );
  }, []);

  // Delete handler
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
            userId,
            keyboardDefinitionId: keyboardId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete keyboard");
        }

        mutate();
      } catch (error) {
        console.error("Failed to delete keyboard:", error);
        // Force refetch to restore accurate state on error
        mutate();
      }
    },
    [getDeleteConfirmation, userId, mutate]
  );

  // Memoized filtering function
  const getFilteredKeyboards = useCallback(
    (keyboardsData, selectedFilterArray) => {
      if (!keyboardsData) return [];

      // If "all" is selected or no filters are selected, return all keyboards
      if (
        selectedFilterArray.includes("all") ||
        selectedFilterArray.length === 0
      ) {
        return keyboardsData;
      }

      // Return keyboards that match filter criteria
      return keyboardsData.filter((keyboard) => {
        // Add your filter logic here based on keyboard properties
        return true; // Replace with actual filter logic
      });
    },
    []
  );

  // Function to handle filter selection
  const handleFilterSelect = useCallback((filter) => {
    setSelectedFilters((prev) => {
      // If selecting "all", clear other selections
      if (filter === "all") {
        return ["all"];
      }

      // If currently "all" is selected and selecting another filter, remove "all"
      if (prev.includes("all") && filter !== "all") {
        return [filter];
      }

      // Toggle selection
      if (prev.includes(filter)) {
        const newSelection = prev.filter((f) => f !== filter);
        // If no filters left, select "all"
        return newSelection.length === 0 ? ["all"] : newSelection;
      } else {
        return [...prev, filter];
      }
    });
  }, []);

  // Mouse wheel horizontal scrolling
  const handleWheel = useCallback((event) => {
    if (filterScrollRef.current) {
      event.preventDefault();
      filterScrollRef.current.scrollLeft += event.deltaY;
    }
  }, []);

  useEffect(() => {
    const scrollContainer = filterScrollRef.current;
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

  const filteredKeyboards = getFilteredKeyboards(keyboards, selectedFilters);

  // Get unique filter values - replace with keyboard-specific logic
  const uniqueFilters = keyboards
    ? [
        "all",
        // Extract your filter values from keyboards data
      ]
    : ["all"];

  // Finder function to get full keyboard data
  const findKeyboardData = useCallback((inventoryData, itemObj) => {
    return inventoryData?.find(
      (item) => item._id === itemObj.keyboardDefinitionId
    );
  }, []);

  // Handle opening/closing modal
  const handleOpenModal = useCallback(() => setIsOpen(true), []);
  const handleCloseModal = useCallback(() => setIsOpen(false), []);

  // Handle toggling edit mode
  const handleToggleEdit = useCallback(
    () => setIsEditMode((prevMode) => !prevMode),
    []
  );

  if (error) return <p>Error loading keyboards...</p>;
  if (!keyboards)
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

      {/* Replace with your keyboard modal component */}
      {/* <AddKeyboardModal
        open={isOpen}
        onClose={handleCloseModal}
        onAddKeyboard={handleAddKeyboard}
      /> */}

      <StyledContainer>
        <h1>Keyboard Inventory</h1>

        <FilterContainer ref={filterScrollRef}>
          {uniqueFilters.map((filter) => (
            <FilterPill
              key={filter}
              $color={filter !== "all" ? null : null} // Customize this based on your needs
              $isSelected={selectedFilters.includes(filter)}
              onClick={() => handleFilterSelect(filter)}
            >
              {filter === "all" ? "All Keyboards" : filter}
            </FilterPill>
          ))}
        </FilterContainer>

        <CardContainer $itemCount={filteredKeyboards?.length || 0}>
          {keyboards?.length === 0 ? (
            // No keyboards added at all
            <EmptyStateMessage>
              <p>No keyboards added yet!</p>
              <p>Click the ➕ button to add a keyboard to your inventory</p>
            </EmptyStateMessage>
          ) : filteredKeyboards?.length === 0 ? (
            // Keyboards exist but none match the current filter
            <EmptyStateMessage>
              <p>No keyboards found with the selected filter!</p>
              <p>Try selecting a different filter</p>
            </EmptyStateMessage>
          ) : (
            // Keyboards exist and match the current filter
            <InventoryList
              data={filteredKeyboards}
              isEditMode={isEditMode}
              onDelete={handleDeleteKeyboard}
              ItemComponent={null} // Replace with your KeyboardCard component
              dataEndpoint="/api/inventories/keyboards"
              findFullItemData={findKeyboardData}
            />
          )}
        </CardContainer>
      </StyledContainer>
      <AddButton onOpenModal={handleOpenModal} isEditMode={isEditMode} />
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

const FilterContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  padding: 10px 15px;
  gap: 10px;
  position: sticky;
  top: 40px; // place it under the burger menu
  z-index: 100;
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; //IE and Edge

  &::-webkit-scrollbar {
    display: none; // Chrome, Safari, Opera
  }
`;

const FilterPill = styled.button`
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
