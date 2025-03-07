import Link from "next/link";
import AddButtton from "@/components/SwitchComponents/AddButton";
import styled from "styled-components";
import { useState } from "react";
import Modal from "@/components/SwitchComponents/Modal";
import useSWR from "swr";
import Image from "next/image";
import { nanoid } from "nanoid";

export default function Switches() {
  const [isOpen, setIsOpen] = useState(false);
  const userId = "guest_user";
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
          {switches.length > 0 ? (
            switches.map((switchObj) => (
              <SwitchCard key={switchObj._id}>
                <SwitchTypeLabel>{switchObj.switchType}</SwitchTypeLabel>
                <StyledSwitchImage
                  src={switchObj.image}
                  alt={switchObj.name}
                  width={100}
                  height={100}
                  priority
                />
                <p>{switchObj.manufacturer}</p>
                <p>
                  <strong>{switchObj.name}</strong>
                </p>
              </SwitchCard>
            ))
          ) : (
            <p> No Switches added yet.</p>
          )}
        </SwitchGrid>
      </Container>

      <AddButtton onOpenModal={() => setIsOpen(true)} />
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

const SwitchCard = styled.li`
  display: flex;
  flex-direction: column;
  background-color: lightgrey;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 10px 5px 5px grey;
  text-align: center;
  width: 100%;
  max-width: 200px;
  img {
    width: 100%;
    height: auto;
    border-radius: 5px;
  }
`;

const StyledSwitchImage = styled(Image)`
  border: solid 1px black;
`;

const SwitchTypeLabel = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #555;
  margin-top: 5px;
`;
