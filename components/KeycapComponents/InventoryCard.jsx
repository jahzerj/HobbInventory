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

    // Get kit data with both image and name in the same order

    const selectedKitData =
      fullKeycapData?.kits?.[0]?.price_list
        ?.filter((kit) => selectedKits.includes(kit.name))
        ?.map((kit) => ({
          name: kit.name,
          pic: kit.pic || "/no_image_available.jpg",
        })) ?? [];

    //retrieve current image for this specific keycapObj
    const currentImageIndex = imageIndexes[keycapObj._id] || 0;

    return (
      <StyledCard
        key={keycapObj._id}
        onClick={() =>
          router.push(`/inventories/keycaps/${keycapObj.keycapSetId._id}`)
        }
      >
        {selectedKitData.length > 0 ? (
          <>
            <ImageWrapper>
              <Image
                src={selectedKitData[currentImageIndex].pic}
                alt={selectedKitData[currentImageIndex].name}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </ImageWrapper>
            <CardContent>
              <CardTitle>{keycapObj.keycapSetId?.name}</CardTitle>
              <CarouselButton
                className="prev"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handlePrevImage(keycapObj._id, selectedKitData.length);
                }}
              >
                ←
              </CarouselButton>
              <CarouselButton
                className="next"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleNextImage(keycapObj._id, selectedKitData.length);
                }}
              >
                →
              </CarouselButton>
              <div>
                <KitName>{selectedKitData[currentImageIndex].name}</KitName>
                <DotsContainer>
                  {selectedKitData.map((_, index) => (
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
              </div>
            </CardContent>
          </>
        ) : (
          <p> No Image available</p>
        )}
        {isEditMode && (
          <DeleteInventoryItemButton
            onClick={(event) => onDelete(keycapObj.keycapSetId._id, event)}
            aria-label="Delete Keycap Button"
          >
            <DeleteIcon />
          </DeleteInventoryItemButton>
        )}
      </StyledCard>
    );
  });
}

const StyledCard = styled.li`
  position: relative;
  width: 80%;
  height: 300px;
  margin: 10px;
  min-width: 360px;
  max-width: 600px;

  border-radius: 30px;
  cursor: pointer;
  overflow: hidden;

  @media (min-width: 600px) {
    width: 500px;
  }

  &:hover {
    scale: 1.05;
  }
`;

const CardContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0) 30%,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.4) 100%
  );
  z-index: 1;
`;
const CardTitle = styled.h3`
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  border-radius: 30px;

  img {
    object-fit: cover;
  }
`;
const KitName = styled.p`
  text-align: center;
  font-size: 1.1rem;
  margin: 5px 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
