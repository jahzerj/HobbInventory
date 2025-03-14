import Link from "next/link";
import AddButtton from "@/components/SwitchComponents/AddButton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Modal from "@/components/SwitchComponents/Modal";
import useSWR from "swr";
import { nanoid } from "nanoid";
import SwitchInventoryCard from "@/components/SwitchComponents/SwitchInventoryCard";
import EditInventoryButton from "@/components/KeycapComponents/EditInventoryButton";
import MenuIcon from "@/components/icons/MenuIcon";

export default function Switches() {
  const [isOpen, setIsOpen] = useState(false);
  const userId = "guest_user";
  const [isEditMode, setIsEditMode] = useState(false);
  const [userSwitches, setUserSwitches] = useState([]);

  const {
    data: switches,
    error,
    mutate,
  } = useSWR(`/api/inventories/userswitches?userId=${userId}`);

  useEffect(() => {
    if (switches) {
      setUserSwitches(switches);
    }
  }, [switches]);

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

    setUserSwitches((prevSwitches) =>
      prevSwitches.filter((s) => s._id !== switchId)
    );

    try {
      const response = await fetch("/api/inventories/userswitches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, switchId }),
      });

      if (response.ok) {
        await mutate();
      } else {
        console.error("Failed to delete switch:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting switch.", error);
    }
  };

  if (error) return <p>Error loading switches</p>;
  if (!switches) return <p>Loading...</p>;

  return (
    <>
      <HomeBurger href="/">
        {" "}
        <MenuIcon />{" "}
      </HomeBurger>
      <NewDiv>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onAddSwitch={handleAddSwitch}
        />
        <Container>
          <h1>Switches Inventory</h1>
          <SwitchGrid>
            <SwitchInventoryCard
              switches={switches}
              isEditMode={isEditMode}
              onDelete={handleDeleteSwitch}
            />
          </SwitchGrid>
        </Container>

        <AddButtton
          onOpenModal={() => setIsOpen(true)}
          isEditMode={isEditMode}
        />
        <EditInventoryButton
          isEditMode={isEditMode}
          onToggleEdit={() => setIsEditMode((prevMode) => !prevMode)}
        />
      </NewDiv>
    </>
  );
}
const Container = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SwitchGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;
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

const NewDiv = styled.div`
  padding: 10px;
`;
