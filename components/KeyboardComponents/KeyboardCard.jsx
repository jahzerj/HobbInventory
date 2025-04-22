import styled, { keyframes } from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const photos = keyboardObj.renders ?? [];

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
        <KeyboardName>{keyboardObj.name}</KeyboardName>
        <LayoutLabel>
          {itemObj.layout} {itemObj.blocker}
        </LayoutLabel>
      </DesignerNameContainer>
    </StyledCard>
  );
}

const StyledCard = styled.li`
  position: relative;
  width: 80%;
  height: 315px;
  margin: 10px;
  min-width: 360px;
  border: 0 solid white;
  border-bottom-width: 7rem;
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
  height: calc(100% - 0.1rem);
  display: flex;
  flex-direction: column;
  border-radius: 30px 30px 0 0;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
  z-index: 1;
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 0.1rem);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  border-radius: 30px 30px 0 0;
  overflow: hidden;

  img {
    object-fit: cover;
    border-radius: 30px 30px 0 0;
  }
  background-color: transparent;
`;

const DesignerNameContainer = styled.div`
  position: absolute;
  bottom: -90px;
  left: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  z-index: 1;
`;

const DesignerName = styled.p`
  font-size: 0.6rem;
  color: #666;
  margin: 0;
  font-weight: 500;
`;

const KeyboardName = styled.h3`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  font-weight: 600;
`;

const LayoutLabel = styled.div`
  font-size: 0.8rem;
  color: #444;
  font-weight: 400;
  margin: 0;
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 3;
  padding: 2px 8px;
  border-radius: 10px;
`;

const Dot = styled.span`
  font-size: 1.2rem;
  margin: 0 3px;
  cursor: pointer;
  color: ${(props) => (props.$active ? "white" : "rgba(255, 255, 255, 0.5)")};
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 70%;
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
  height: 35px;
  width: 35px;
  cursor: pointer;
  z-index: 1000;
  align-items: center;

  &:hover {
    background-color: rgb(162, 24, 24);
  }
`;
