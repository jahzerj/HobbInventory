import InventoryCard from "@/components/InventoryCard";
import Link from "next/link";
import AddButton from "@/components/AddButton";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Keycaps() {
  const [isOpen, setIsOpen] = useState(false);
  const [userKeycaps, setUserKeycaps] = useState([]);
  const userId = "guest_user";

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
  const handleAddKeycap = async (keycapId) => {
    if (!userKeycaps.includes(keycapId)) {
      const updatedKeycaps = [...userKeycaps, keycapId];
      setUserKeycaps(updatedKeycaps);

      //Save the update in DB
      const response = await fetch("/api/inventories/userkeycaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keycapId }),
      });
      if (response.ok) {
        mutate();
      } else {
        console.log("Failed to add keycap:", await response.json());
      }
    }
  };

  if (error) return <p> Error loading keycaps...</p>;
  if (!data) return <p> Loading keycaps....</p>;

  return (
    <>
      <Link href="/">Back to Hub</Link>
      <h1>Keycap Inventory</h1>

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
    </>
  );
}
