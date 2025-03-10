import InventoryCard from "@/components/KeycapComponents/InventoryCard";
import Link from "next/link";
import AddButton from "@/components/KeycapComponents/AddButton";
import Modal from "@/components/KeycapComponents/Modal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import EditInventoryButton from "@/components/KeycapComponents/EditInventoryButton";
import { AttentionSeeker } from "react-awesome-reveal";
import MenuIcon from "@/components/icons/MenuIcon";

export default function Keycaps() {
  const [isOpen, setIsOpen] = useState(false);
  const [userKeycaps, setUserKeycaps] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [colorFilter, setColorFilter] = useState("all");
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

  const getFilteredKeycaps = (keycapsData, selectedColor) => {
    if (!keycapsData) return [];
    if (selectedColor === "all") return keycapsData;

    return keycapsData.filter((keycap) =>
      keycap.selectedColors?.includes(selectedColor)
    );
  };

  const filteredKeycaps = getFilteredKeycaps(keycaps, colorFilter);

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

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onAddKeycap={handleAddKeycap}
      />

      <StyledContainer>
        <h1>Keycap Inventory</h1>

        <StyledInput
          as="select"
          value={colorFilter}
          onChange={(event) => setColorFilter(event.target.value)}
        >
          <option value="all">All Colors</option>
          {Array.from(
            new Set(keycaps?.flatMap((keycap) => keycap.selectedColors || []))
          ).map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </StyledInput>

        <CardContainer>
          {filteredKeycaps?.length ? (
            isEditMode ? (
              <AttentionSeeker effect="shake">
                <InventoryCard
                  data={filteredKeycaps}
                  isEditMode={isEditMode}
                  onDelete={handleDeleteKeycap}
                />
              </AttentionSeeker>
            ) : (
              <InventoryCard
                data={filteredKeycaps}
                isEditMode={isEditMode}
                onDelete={handleDeleteKeycap}
              />
            )
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
  margin-top: 60px; // Creates space for the dropdown
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
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

const StyledInput = styled.input`
  width: auto;
  position: absolute;
  right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  top: 80px; // Adjust this value to position the dropdown in the space
`;
