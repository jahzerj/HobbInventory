import Link from "next/link";
import AddButtton from "@/components/SwitchComponents/AddButton";
import styled from "styled-components";
import { useState } from "react";
import Modal from "@/components/SwitchComponents/Modal";
import useSWR from "swr";
import Image from "next/image";
import { nanoid } from "nanoid";
import SwitchInventoryCard from "@/components/SwitchComponents/SwitchInventoryCard";
import EditInventoryButton from "@/components/KeycapComponents/EditInventoryButton";

export default function Switches() {
  const [isOpen, setIsOpen] = useState(false);
  const userId = "guest_user";
  const [isEditMode, setIsEditMode] = useState(false);
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

  if (error) return <p>Error loading switches</p>;
  if (!switches) return <p>Loading...</p>;

  return (
    <>
      <Link href="/"> ← Back to Hub</Link>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onAddSwitch={handleAddSwitch}
      />
      <Container>
        <h1>Switches Inventory</h1>
        <SwitchGrid>
          <SwitchInventoryCard switches={switches} />
        </SwitchGrid>
      </Container>

      <AddButtton onOpenModal={() => setIsOpen(true)} isEditMode={isEditMode} />
      <EditInventoryButton
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode((prevMode) => !prevMode)}
      />
    </>
  );
}
const Container = styled.div`
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
