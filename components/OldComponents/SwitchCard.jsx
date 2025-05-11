import styled, { keyframes } from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import DeleteIcon from "../icons/DeleteIcon";

export default function SwitchCard({
  itemObj,
  isEditMode,
  onDelete,
  isPreview = false,
}) {
  const router = useRouter();

  // Rename for clarity about what we're working with
  const switchObj = itemObj;

  const formatQuantity = (quantity) => {
    const num = parseInt(quantity) || 0;
    if (num > 9999) {
      return "9999+";
    }
    return num;
  };

  const formatSwitchType = (type) => {
    if (!type) return "";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  return (
    <StyledSwitchCard
      onClick={
        !isPreview
          ? () => router.push(`/inventories/switches/${switchObj._id}`)
          : undefined
      }
      isPreview={isPreview}
    >
      {switchObj.image ? (
        <>
          <QuantityBubble>{formatQuantity(switchObj.quantity)}</QuantityBubble>
          {isEditMode && (
            <DeleteInventoryItemButton
              onClick={(event) => onDelete(switchObj._id, event)}
              aria-label="Delete Switch Button"
            >
              <DeleteIcon />
            </DeleteInventoryItemButton>
          )}
          <ImageContainer>
            <StyledSwitchImage
              src={switchObj.image}
              alt={switchObj.name}
              width={100}
              height={100}
              priority
              style={{ objectFit: "cover" }}
            />
          </ImageContainer>
          <TextContainer>
            <p>{switchObj.manufacturer}</p>
            <p>
              <strong>{switchObj.name}</strong>
            </p>
          </TextContainer>
          <SwitchTypeLabel>
            {formatSwitchType(switchObj.switchType)}
          </SwitchTypeLabel>
        </>
      ) : (
        <>
          <ImageContainer className="shimmer">
            <ShimmerEffect />
          </ImageContainer>
          <TextContainer>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
          </TextContainer>
          <SwitchTypeLabel>&nbsp;</SwitchTypeLabel>
        </>
      )}
    </StyledSwitchCard>
  );
}

const StyledSwitchCard = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  align-items: center;
  border-radius: 16px;
  margin-top: 5px;
  padding: 12px;
  padding-bottom: 25px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-bottom-width: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 200px;

  &:hover {
    scale: ${({ isPreview }) => (isPreview ? 1 : 1.02)};
  }

  cursor: ${({ isPreview }) => (isPreview ? "default" : "pointer")};
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: #f8f8f8;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StyledSwitchImage = styled(Image)`
  border-radius: 4px;
`;

const TextContainer = styled.div`
  width: 100%;
  padding: 8px;
  background: white;
  border-radius: 6px;
`;

const SwitchTypeLabel = styled.div`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 12px;
  font-size: 12px;
  font-weight: bold;
  color: black;
  background: white;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const DeleteInventoryItemButton = styled.button`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
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

const QuantityBubble = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: darkgrey;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  z-index: 2;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  transition: transform 0.2s ease;
  ${StyledSwitchCard}:hover & {
    transform: scale(1.1);
  }
`;

const shimmerAnimation = keyframes`
  to {
    background-position: 200px 0;
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
    background-size: 200px 100%;
    background-position: -200px 0;
    background-repeat: no-repeat;
    animation: ${shimmerAnimation} 1.5s infinite;
  }
`;
