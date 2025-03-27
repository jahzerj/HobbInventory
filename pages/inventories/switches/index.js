import Link from "next/link";
import AddButtton from "@/components/SwitchComponents/AddButton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import AddSwitchModal from "@/components/SwitchComponents/AddSwitchModal";
import useSWR from "swr";
import { nanoid } from "nanoid";
import EditInventoryButton from "@/components/KeycapComponents/EditInventoryButton";
import MenuIcon from "@/components/icons/MenuIcon";
import InventoryList from "@/components/SharedComponents/InventoryList";
import SwitchCard from "@/components/SwitchComponents/SwitchCard";

export default function Switches() {
  const [isOpen, setIsOpen] = useState(false);
  const userId = "guest_user";
  const [isEditMode, setIsEditMode] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  const {
    data: switches,
    error,
    mutate,
  } = useSWR(`/api/inventories/userswitches?userId=${userId}`);

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
        body: JSON.stringify({ userId, switchId }),
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

  const getFilteredSwitches = (switches, typeFilter) => {
    if (!switches) return [];
    if (typeFilter === "all") return switches;

    return switches.filter(
      (switchItem) =>
        switchItem.switchType.toLowerCase() === typeFilter.toLowerCase()
    );
  };

  const filteredSwitches = getFilteredSwitches(switches, typeFilter);

  if (error) return <p>Error loading switches</p>;
  if (!switches)
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

      <AddSwitchModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onAddSwitch={handleAddSwitch}
      />

      <StyledContainer>
        <LongTitle> Switches Inventory</LongTitle>

        <StyledInput
          as="select"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          <option value="all">All Types</option>
          <option value="linear">Linear</option>
          <option value="tactile">Tactile</option>
          <option value="clicky">Clicky</option>
        </StyledInput>

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

      <AddButtton onOpenModal={() => setIsOpen(true)} isEditMode={isEditMode} />
      <EditInventoryButton
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode((prevMode) => !prevMode)}
      />
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
  margin-top: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SwitchGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;
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
