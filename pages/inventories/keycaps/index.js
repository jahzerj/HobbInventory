import InventoryCard from "@/components/InventoryCard";
import Link from "next/link";
import AddButton from "@/components/AddButton";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import EditInventoryButton from "@/components/EditInventoryButton";
import { AttentionSeeker } from "react-awesome-reveal";

export default function Keycaps() {
  const [isOpen, setIsOpen] = useState(false);
  const [userKeycaps, setUserKeycaps] = useState([]);
  const userId = "guest_user";
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleDeleteKeycap = async (keycapSetId, event) => {
    event.stopPropagation();

    console.log("Keycap:", userKeycaps);

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this keycapset?\n\n" +
        "This will permanently remove:\n" +
        "• This keycapset\n" +
        "• Selected kits\n" +
        "• Selected colors\n" +
        "• Any personal notes that you have added"
    );
    if (!confirmDelete) return;

    // Remove from UI
    setUserKeycaps((prevKeycaps) =>
      prevKeycaps.filter((id) => id !== keycapSetId)
    );
    console.log("keycapsetId: ", keycapSetId);

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
          isEditMode ? (
            <AttentionSeeker effect="shake">
              <InventoryCard
                data={data}
                isEditMode={isEditMode}
                onDelete={handleDeleteKeycap}
              />
            </AttentionSeeker>
          ) : (
            <InventoryCard
              data={data}
              isEditMode={isEditMode}
              onDelete={handleDeleteKeycap}
            />
          )
        ) : (
          <>
            <p>You have no keycaps in your inventory!</p>
            <p>Click the ➕ button to add a keycap set</p>
          </>
        )}
      </StyledContainer>
      <AddButton onOpenModal={() => setIsOpen(true)} />
      <EditInventoryButton
        isEditMode={isEditMode}
        onToggleEdit={() => {
          if (isEditMode) {
            setIsEditMode(false);
          } else {
            setIsEditMode(true);
          }
        }}
      />
    </>
  );
}

const StyledContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
