import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import DeleteIcon from "../icons/DeleteIcon";
import { useState } from "react";
import useSWR from "swr";

export default function InventoryCard({ data, isEditMode, onDelete }) {
  const router = useRouter();
  const { data: keycapsData } = useSWR("/api/inventories/keycaps");

  const [imageIndexes, setImageIndexes] = useState({});

  const handleNextImage = (keycapId, totalImages) => {
    setImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[keycapId] ?? 0;
      const newIndex = (currentIndex + 1) % totalImages;
      return {
        ...prevIndexes,
        [keycapId]: newIndex,
      };
    });
  };

  const handlePrevImage = (keycapId, totalImages) => {
    setImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[keycapId] ?? 0;
      const newIndex = (currentIndex - 1 + totalImages) % totalImages;
      return {
        ...prevIndexes,
        [keycapId]: newIndex,
      };
    });
  };

  return data.map((keycapObj) => {
    const selectedKits = keycapObj.selectedKits ?? [];

    // Find the matching keycapset from keycapsData
    const fullKeycapData = keycapsData?.find(
      (keycap) => keycap._id === keycapObj.keycapSetId._id
    );

    // Get kit images using the full keycap data (same as Modal)
    const selectedKitImages =
      fullKeycapData?.kits?.[0]?.price_list
        ?.filter((kit) => selectedKits.includes(kit.name))
        ?.map((kit) => kit.pic || "/no_image_available.jpg") ?? [];

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
          <>
            <ImageCarousel>
              <CarouselButton
                className="prev"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handlePrevImage(keycapObj._id, selectedKitImages.length);
                }}
              >
                ←
              </CarouselButton>
              <ImageWrapper>
                <Image
                  src={selectedKitImages[currentImageIndex]}
                  alt={`Kit ${currentImageIndex + 1}`}
                  width={320}
                  height={180}
                  style={{ objectFit: "cover" }}
                  priority
                />
              </ImageWrapper>
              <CarouselButton
                className="next"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleNextImage(keycapObj._id, selectedKitImages.length);
                }}
              >
                →
              </CarouselButton>
            </ImageCarousel>
            <KitName>{selectedKits[currentImageIndex]}</KitName>
            <DotsContainer>
              {selectedKitImages.map((_, index) => (
                <Dot
                  key={index}
                  $active={index === currentImageIndex}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setImageIndexes((prev) => ({
                      ...prev,
                      [keycapObj._id]: index,
                    }));
                  }}
                >
                  •
                </Dot>
              ))}
            </DotsContainer>
          </>
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
  height: 300px;
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
  justify-content: center;
  gap: 10px;
  width: 100%;
  position: relative;
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
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

const DotsContainer = styled.div`
  text-align: center;
  margin-top: 5px;
`;

const Dot = styled.span`
  font-size: 1.2rem;
  margin: 0 3px;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#007bff" : "#ccc")};
`;

const KitName = styled.p`
  text-align: center;
  font-size: 1.1rem;
  margin-top: 5px;
  color: #666;
`;
