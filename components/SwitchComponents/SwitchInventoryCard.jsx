import styled from "styled-components";
import Image from "next/image";
import DeleteIcon from "../icons/DeleteIcon";

export default function SwitchInventoryCard({
  switches,
  isEditMode,
  onDelete,
}) {
  return switches.length > 0 ? (
    switches.map((switchObj) => (
      <SwitchCard key={switchObj._id}>
        {isEditMode && (
          <DeleteInventoryItemButton
            onClick={(event) => onDelete(switchObj._id, event)}
            aria-label="Delete Switch Button"
          >
            <DeleteIcon />
          </DeleteInventoryItemButton>
        )}
        <SwitchTypeLabel>{switchObj.switchType}</SwitchTypeLabel>
        <StyledSwitchImage
          src={switchObj.image}
          alt={switchObj.name}
          width={100}
          height={100}
          priority
        />
        <p>{switchObj.manufacturer}</p>
        <p>
          <strong>{switchObj.name}</strong>
        </p>
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
  background-color: lightgrey;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 10px 5px 5px grey;
  text-align: center;
  width: 100%;
  max-width: 200px;
  img {
    width: 100%;
    height: auto;
    border-radius: 5px;
  }
`;

const StyledSwitchImage = styled(Image)`
  border: solid 1px black;
`;

const SwitchTypeLabel = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #555;
  margin-top: 5px;
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

  &:hover {
    background-color: rgb(162, 24, 24);
  }
`;
