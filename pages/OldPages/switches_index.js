import styled from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import AddSwitchModal from "@/components/SwitchComponents/AddSwitchModal";
import useSWR from "swr";
import { nanoid } from "nanoid";
import InventoryList from "@/components/SharedComponents/InventoryList";
import SwitchCard from "@/components/SwitchComponents/SwitchCard";
import ScrollPositionManager from "@/components/SharedComponents/ScrollPositionManager";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddButtonMUI from "@/components/SharedComponents/AddButtonMUI";
import ProfileButtonMUI from "@/components/SharedComponents/ProfileButtonMUI";
import BackButtonMUI from "@/components/SharedComponents/BackButtonMUI";

export default function Switches() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedManufacturers, setSelectedManufacturers] = useState(["all"]);
  const typeScrollRef = useRef(null);
  const manufacturerScrollRef = useRef(null);

  const {
    data: switches,
    error,
    mutate,
  } = useSWR("/api/inventories/userswitches");

  const handleAddSwitch = async (newSwitch) => {
    const tempId = nanoid();
    const optimisticSwitch = { ...newSwitch, _id: tempId };

    mutate([...switches, optimisticSwitch], false);

    try {
      const response = await fetch("/api/inventories/userswitches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSwitch),
      });

      if (!response.ok) {
        throw new Error("Failed to add switch.");
      }

      await mutate();
    } catch (error) {
      console.error("Failed to add switch:", error);
      mutate(
        (currentSwitches) => currentSwitches.filter((s) => s._id !== tempId),
        false
      );
    }
  };

  const handleDeleteSwitch = async (switchId, event) => {
    event.stopPropagation();

    if (!switchId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this switch?\n\n" +
        "This will permanently remove this switch and any personal data you have recorded for it"
    );
    if (!confirmDelete) return;

    mutate(
      switches.filter((s) => s._id !== switchId),
      false
    );

    try {
      const response = await fetch("/api/inventories/userswitches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ switchId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete switch");
      }

      await mutate();
    } catch (error) {
      console.error("Error deleting switch.", error);
      await mutate();
    }
  };

  const getFilteredSwitches = (switches, typeFilter, manufacturerFilter) => {
    if (!switches) return [];

    return switches.filter((switchItem) => {
      const matchesType =
        typeFilter === "all" ||
        switchItem.switchType.toLowerCase() === typeFilter.toLowerCase();

      const matchesManufacturer =
        manufacturerFilter.includes("all") ||
        manufacturerFilter.includes(switchItem.manufacturer);

      return matchesType && matchesManufacturer;
    });
  };

  const filteredSwitches = getFilteredSwitches(
    switches,
    typeFilter,
    selectedManufacturers
  );

  // Handle opening/closing modal
  const handleOpenModal = useCallback(() => setIsOpen(true), []);
  const handleCloseModal = useCallback(() => setIsOpen(false), []);

  const handleManufacturerSelect = useCallback((manufacturer) => {
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
  }, []);

  const handleTypeSelect = useCallback((type) => {
    setTypeFilter(type);
  }, []);

  const handleWheel = useCallback((event, ref) => {
    if (ref.current) {
      event.preventDefault();
      ref.current.scrollLeft += event.deltaY;
    }
  }, []);

  useEffect(() => {
    const typeContainer = typeScrollRef.current;
    const manufacturerContainer = manufacturerScrollRef.current;

    const handleTypeWheel = (event) => handleWheel(event, typeScrollRef);
    const handleManufacturerWheel = (event) =>
      handleWheel(event, manufacturerScrollRef);

    if (typeContainer) {
      typeContainer.addEventListener("wheel", handleTypeWheel, {
        passive: false,
      });
    }
    if (manufacturerContainer) {
      manufacturerContainer.addEventListener("wheel", handleManufacturerWheel, {
        passive: false,
      });
    }

    return () => {
      if (typeContainer) {
        typeContainer.removeEventListener("wheel", handleTypeWheel);
      }
      if (manufacturerContainer) {
        manufacturerContainer.removeEventListener(
          "wheel",
          handleManufacturerWheel
        );
      }
    };
  }, [handleWheel]);

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

  if (error) return <p>Error loading switches</p>;
  if (!switches)
    return (
      <LoaderWrapper>
        <StyledSpan />
      </LoaderWrapper>
    );

  return (
    <>
      <ProfileButtonMUI />
      <ScrollPositionManager pageId="switches" enabled={true} />

      <AddSwitchModal
        open={isOpen}
        onClose={handleCloseModal}
        onAddSwitch={handleAddSwitch}
        userId={session.user.uuid}
      />

      <StyledContainer>
        <LongTitle> Switches Inventory</LongTitle>

        <FiltersContainer>
          <FilterGroup ref={manufacturerScrollRef}>
            {[
              "all",
              ...new Set(switches?.map((sw) => sw.manufacturer) || []),
            ].map((manufacturer) => (
              <FilterPill
                key={manufacturer}
                $isSelected={selectedManufacturers.includes(manufacturer)}
                onClick={() => handleManufacturerSelect(manufacturer)}
              >
                {manufacturer === "all" ? "All Manufacturers" : manufacturer}
              </FilterPill>
            ))}
          </FilterGroup>

          <FilterGroup ref={typeScrollRef}>
            {["all", "linear", "tactile", "clicky"].map((type) => (
              <FilterPill
                key={type}
                $isSelected={typeFilter === type}
                onClick={() => handleTypeSelect(type)}
              >
                {type === "all"
                  ? "All Types"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </FilterPill>
            ))}
          </FilterGroup>
        </FiltersContainer>

        <CardContainer $itemCount={filteredSwitches?.length || 0}>
          {filteredSwitches && filteredSwitches.length > 0 ? (
            <SwitchGrid $itemCount={filteredSwitches.length}>
              <InventoryList
                data={filteredSwitches}
                isEditMode={isEditMode}
                onDelete={handleDeleteSwitch}
                ItemComponent={SwitchCard}
              />
            </SwitchGrid>
          ) : (
            <EmptyStateMessage>
              <p>No Switches added yet.</p>
              <p>Click the ➕ button to add switches to your inventory</p>
            </EmptyStateMessage>
          )}
        </CardContainer>
      </StyledContainer>

      <AddButtonMUI
        onOpenModal={handleOpenModal}
        isEditMode={isEditMode}
        itemType="Switch"
      />
      <BackButtonMUI href="/" />
    </>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 25px;
`;

const CardContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
`;

const SwitchGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  position: relative;

  /* Apply responsive grid based on item count */
  @media (min-width: 600px) {
    grid-template-columns: ${(props) =>
      props.$itemCount === 1 ? "1fr" : "repeat(4, 1fr)"};
    justify-items: ${(props) => (props.$itemCount === 1 ? "center" : "start")};
  }
`;

const StyledInput = styled.input`
  width: auto;
  position: absolute;
  right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  top: 80px;
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

const LongTitle = styled.h1`
  @media screen and (max-width: 390px) {
    font-size: 28px;
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

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  position: sticky;
  top: 40px;
  z-index: 100;
  padding: 10px 0;
`;

const FilterGroup = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  padding: 5px 15px;
  gap: 10px;
  align-items: center;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
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
