import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import DeleteIcon from "../icons/DeleteIcon";
import { useState } from "react";

export default function InventoryCard({ data, isEditMode, onDelete }) {
  const router = useRouter();

  const [imageIndexes, setImageIndexes] = useState({});

  const handleNextImage = (keycapId, totalImages) => {
    setImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [keycapId]:
        prevIndexes[keycapId] === totalImages - 1
          ? 0
          : prevIndexes[keycapId] + 1,
    }));
  };

  const handlePrevImage = (keycapId, totalImages) => {
    setImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [keycapId]:
        prevIndexes[keycapId] === 0
          ? totalImages - 1
          : prevIndexes[keycapId] - 1,
    }));
  };

  return data.map((keycapObj) => {
    const selectedKits = keycapObj.selectedKits ?? [];
    const selectedKitImages = keycapObj.keycapSetId?.kits
      ?.filter((kit) => selectedKits.includes(kit.name)) // ✅ Only show selected kits
      ?.map((kit) => kit.pic || "/no-image-available.jpg"); // ✅ Ensure placeholder

    //retrieve current image for this specific keycapObj
    const currentImageIndex = imageIndexes[keycapObj._id] || 0;

    return (
      <StyledCard
        key={keycapObj._id}
        onClick={() =>
          router.push(`/inventories/keycaps/${keycapObj.keycapSetId._id}`)
        }
      >
        {isEditMode && (
          <DeleteInventoryItemButton
            onClick={(event) => onDelete(keycapObj.keycapSetId._id, event)}
            aria-label="Delete Keycap Button"
          >
            <DeleteIcon />
          </DeleteInventoryItemButton>
        )}
        <h3>{keycapObj.keycapSetId?.name}</h3>
        {selectedKitImages.length > 0 ? (
          <ImageCarousel>
            <button
              onClick={(event) => {
                event.stopPropagation();
                handlePrevImage(keycapObj._id, selectedKitImages.length);
              }}
            >
              &lt;
            </button>
            <ImageWrapper>
              <Image
                src={selectedKitImages[currentImageIndex]}
                alt={`Kit ${currentImageIndex + 1}`}
                width={320}
                height={180}
                priority
              />
            </ImageWrapper>
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleNextImage(keycapObj._id, selectedKitImages.length);
              }}
            >
              &gt;
            </button>
          </ImageCarousel>
        ) : (
          <p> No Image available</p>
        )}
      </StyledCard>
    );
  });
}

const StyledCard = styled.li`
  position: relative;
  background-color: lightgrey;
  width: 80%;
  min-width: 350px;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  margin: 10px;
  height: 250px;
  justify-content: space-around;
  box-shadow: 10px 5px 5px grey;
  cursor: pointer;

  @media (min-width: 600px) {
    width: 50%;
  }

  &:hover {
    scale: 1.05;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 320px;
  position: relative;
  overflow: hidden;
  border-radius: 10px;

  aspect-ratio: 16 / 9;

  @media (max-width: 320px) {
    width: 90%;
  }
`;

const ImageCarousel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

const DeleteInventoryItemButton = styled.button`
  display: flex;
  position: absolute;
  top: 5%;
  right: 5%;
  color: white;
  background: #ff4d4d;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: rgb(162, 24, 24);
  }
`;
