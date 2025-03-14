import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import DeleteIcon from "../icons/DeleteIcon";

export default function SwitchInventoryCard({
  switches,
  isEditMode,
  onDelete,
}) {
  const router = useRouter();
  return switches.length > 0 ? (
    switches.map((switchObj) => (
      <SwitchCard
        key={switchObj._id}
        onClick={() => router.push(`/inventories/switches/${switchObj._id}`)}
      >
        <QuantityBubble>{switchObj.quantity || 0}</QuantityBubble>
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
          />
        </ImageContainer>
        <TextContainer>
          <p>{switchObj.manufacturer}</p>
          <p>
            <strong>{switchObj.name}</strong>
          </p>
        </TextContainer>
        <SwitchTypeLabel>{switchObj.switchType}</SwitchTypeLabel>
      </SwitchCard>
    ))
  ) : (
    <>
      <p> No Switches added yet.</p>
      <p>Click the ➕ button to add switches to your inventory </p>
    </>
  );
}

const SwitchCard = styled.li`
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
    scale: 1.02;
  }
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

  transition: transform 0.2s ease;
  ${SwitchCard}:hover & {
    transform: scale(1.1);
  }
`;
