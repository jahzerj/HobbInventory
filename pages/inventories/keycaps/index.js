import InventoryCard from "@/components/InventoryCard";
import Link from "next/link";
import AddButton from "@/components/AddButton";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

export default function Keycaps() {
  const [isOpen, setIsOpen] = useState(false);
  const [userKeycaps, setUserKeycaps] = useState([]);
  const userId = "guest_user";
  const [isEditMode, setIsEditMode] = useState(false);

  // isEditMode = true;

  //Fetch user keycaps
  const { data, error, mutate } = useSWR(
    `/api/inventories/userkeycaps?userId=${userId}`
  );

  useEffect(() => {
    if (data) {
      setUserKeycaps(data.map((keycap) => keycap._id));
    }
  }, [data]);

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

  if (error) return <p> Error loading keycaps...</p>;
  if (!data) return <p> Loading keycaps....</p>;

  return (
    <>
      <Link href="/">Back to Hub</Link>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onAddKeycap={handleAddKeycap}
      />

      <StyledContainer>
        <h1>Keycap Inventory</h1>
        {data?.length ? (
          <InventoryCard data={data} />
        ) : (
          <>
            <p> You have no keycaps in your inventory!</p>
            <p> Click the ➕ button to add a keycap set</p>
          </>
        )}
      </StyledContainer>
      <AddButton onOpenModal={() => setIsOpen(true)} />
      <button> Words </button>
    </>
  );
}

const StyledContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
