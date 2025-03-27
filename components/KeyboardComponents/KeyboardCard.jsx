import styled, { keyframes } from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import DeleteIcon from "../icons/DeleteIcon";

// Move the keyframes and ShimmerEffect outside the component
const shimmerAnimation = keyframes`
  to {
    background-position: 315px 0;
  }
`;

const ShimmerEffect = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #ddd;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      #fff 50%,
      transparent 100%
    );
    background-size: 315px 100%;
    background-position: -315px 0;
    background-repeat: no-repeat;
    animation: ${shimmerAnimation} 1.5s infinite;
  }
`;

export default function KeyboardCard({ itemObj, isEditMode, onDelete }) {
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);

  // Rename for domain clarity
  const keyboardObj = itemObj;

  // Get the photos array, with a fallback to empty array
  const photos = keyboardObj.photos ?? [];

  // Determine if we should show navigation elements
  const hasMultipleImages = photos.length > 1;

  const handleNextImage = () => {
    if (!hasMultipleImages) return;
    setImageIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrevImage = () => {
    if (!hasMultipleImages) return;
    setImageIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
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
    router.push(`/inventories/keyboards/${keyboardObj._id}`);
  };

  return (
    <StyledCard {...cardProps} onClick={handleCardClick}>
      {photos.length > 0 ? (
        <>
          <ImageWrapper>
            <Image
              src={photos[imageIndex]}
              alt={`${keyboardObj.name} photo ${imageIndex + 1}`}
              fill
              sizes="(min-width: 600px) 500px, 80vw"
              style={{ objectFit: "cover" }}
              priority
              draggable={false}
            />
          </ImageWrapper>
          <CardContent>
            <div>
              <CardTitle>{keyboardObj.name}</CardTitle>

              {hasMultipleImages && (
                <DotsContainer>
                  {photos.map((_, index) => (
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
          </CardContent>
        </>
      ) : (
        <>
          <ImageWrapper className="shimmer">
            <ShimmerEffect />
          </ImageWrapper>
          <CardContent>
            <div>
              <CardTitle>&nbsp;</CardTitle>
            </div>
          </CardContent>

          <DesignerNameContainer>
            <DesignerName>&nbsp;</DesignerName>
          </DesignerNameContainer>
        </>
      )}
      {isEditMode && (
        <DeleteInventoryItemButton
          onClick={(event) => onDelete(keyboardObj._id, event)}
          aria-label="Delete Keyboard Button"
        >
          <DeleteIcon />
        </DeleteInventoryItemButton>
      )}
      <DesignerNameContainer>
        <DesignerName>{keyboardObj.designer}</DesignerName>
      </DesignerNameContainer>
      <LayoutLabel>
        {itemObj.layout} {itemObj.blocker}
      </LayoutLabel>
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
  border: 0 solid white;
  border-bottom-width: 6rem;
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
  height: calc(100% - 1rem);
  display: flex;
  flex-direction: column;
  border-radius: 30px 30px 0 0;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0) 30%
  );
  z-index: 1;
`;

const CardTitle = styled.h3`
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
`;

const LayoutLabel = styled.div`
  position: absolute;
  bottom: -10px;
  left: 10px;
  padding: 2px 12px;
  font-size: 12px;
  color: black;
  font-weight: bold;

  min-width: 80px;
  text-align: center;
  white-space: nowrap;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 1rem);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  border-radius: 30px 30px 0 0;
  overflow: hidden;

  img {
    object-fit: cover;
    border-radius: 30px 30px 0 0;
  }
  background-color: transparent;
`;

const DesignerName = styled.p`
  text-align: center;
  font-size: 1.1rem;
  margin: 5px 0;
  color: #333;
  text-shadow: none;
  font-weight: 500;
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

const DesignerNameContainer = styled.div`
  position: absolute;
  bottom: -40px;
  left: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  background: transparent;
  padding: 0;
  z-index: 1;
`;
