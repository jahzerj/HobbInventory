import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import DeleteIcon from "../icons/DeleteIcon";

export default function KeycapCard({
  itemObj,
  fullItemData,
  isEditMode,
  onDelete,
}) {
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);

  // Rename for domain clarity
  const keycapObj = itemObj;
  const fullKeycapData = fullItemData;

  const selectedKits = keycapObj.selectedKits ?? [];

  // Get kit data with both image and name in the same order
  const selectedKitData =
    fullKeycapData?.kits?.[0]?.price_list
      ?.filter((kit) => selectedKits.includes(kit.name))
      ?.map((kit) => ({
        name: kit.name,
        pic: kit.pic || "/no_image_available.jpg",
      })) ?? [];

  // Determine if we should show navigation elements
  const hasMultipleImages = selectedKitData.length > 1;

  const handleNextImage = () => {
    if (!hasMultipleImages) return;
    setImageIndex((prevIndex) => (prevIndex + 1) % selectedKitData.length);
  };

  const handlePrevImage = () => {
    if (!hasMultipleImages) return;
    setImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + selectedKitData.length) % selectedKitData.length
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextImage(),
    onSwipedRight: () => handlePrevImage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
    delta: 10,
    touchAction: "none",
  });

  const cardProps = hasMultipleImages ? swipeHandlers : {};

  const handleCardClick = () => {
    router.push(`/inventories/keycaps/${keycapObj.keycapSetId._id}`);
  };

  return (
    <StyledCard {...cardProps} onClick={handleCardClick}>
      {selectedKitData.length > 0 ? (
        <>
          <ImageWrapper>
            <Image
              src={selectedKitData[imageIndex].pic}
              alt={selectedKitData[imageIndex].name}
              fill
              style={{ objectFit: "cover" }}
              priority
              draggable={false}
            />
          </ImageWrapper>
          <CardContent>
            <div>
              <CardTitle>{keycapObj.keycapSetId?.name}</CardTitle>

              {/* Dots moved below title */}
              {hasMultipleImages && (
                <DotsContainer>
                  {selectedKitData.map((_, index) => (
                    <Dot
                      key={index}
                      $active={index === imageIndex}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setImageIndex(index);
                      }}
                    >
                      •
                    </Dot>
                  ))}
                </DotsContainer>
              )}
            </div>

            {/* Only show carousel buttons if there are multiple images */}
            {hasMultipleImages && (
              <>
                <CarouselButton
                  className="prev"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handlePrevImage();
                  }}
                >
                  ←
                </CarouselButton>
                <CarouselButton
                  className="next"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleNextImage();
                  }}
                >
                  →
                </CarouselButton>
              </>
            )}

            <div>
              <KitName>{selectedKitData[imageIndex].name}</KitName>
            </div>
          </CardContent>
        </>
      ) : (
        <p>No Image available</p>
      )}
      {isEditMode && (
        <DeleteInventoryItemButton
          onClick={(event) => onDelete(keycapObj.keycapSetId._id, event)}
          aria-label="Delete Keycap Button"
        >
          <DeleteIcon />
        </DeleteInventoryItemButton>
      )}
      <ColorDotsList $isEmpty={(keycapObj.selectedColors || []).length === 0}>
        {(keycapObj.selectedColors || []).map((color, index) => (
          <ColorDotItem key={index} $color={color}>
            •
          </ColorDotItem>
        ))}
      </ColorDotsList>
    </StyledCard>
  );
}

const StyledCard = styled.li`
  position: relative;
  width: 80%;
  height: 315px;
  margin: 10px;
  min-width: 360px;
  max-width: 600px;
  border: 2px solid white;
  border-bottom-width: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  cursor: pointer;
  overflow: visible;
  background-color: white;
  padding-bottom: 25px;
  list-style: none;
  touch-action: pan-y;
  user-select: none;

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
  padding: 10px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
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

const ColorDotsList = styled.div`
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 6px;
  padding-bottom: 8px;
  font-size: 12px;
  color: black;
  font-weight: bold;
  background: lightgray;
  border-radius: 12px;
  border: 2px solid white;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 3px;
  align-items: center;
  z-index: 2;
  min-width: 80px;
  justify-content: center;
  height: 24px;
`;

const ColorDotItem = styled.span`
  font-size: 1.5rem;
  color: ${(props) => props.$color?.toLowerCase() || "#ccc"};
  line-height: 0.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  border-radius: 30px;
  overflow: hidden;

  img {
    object-fit: cover;
    border-radius: 30px;
  }
  background-color: transparent;
`;

const KitName = styled.p`
  text-align: center;
  font-size: 1.1rem;
  margin: 5px 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const DotsContainer = styled.div`
  margin-top: -8px;
  text-align: center;
  z-index: 3;
  padding: 2px 8px;
  border-radius: 10px;
`;

const Dot = styled.span`
  font-size: 1.2rem;
  margin: 0 3px;
  cursor: pointer;
  color: ${(props) => (props.$active ? "white" : "#ccc")};
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
  top: 1%;
  right: 2%;
  color: white;
  background: #ff4d4d;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;

  &:hover {
    background-color: rgb(162, 24, 24);
  }
`;
