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
        {isEditMode && (
          <DeleteInventoryItemButton
            onClick={(event) => onDelete(switchObj._id, event)}
            aria-label="Delete Switch Button"
          >
            <DeleteIcon />
          </DeleteInventoryItemButton>
        )}
        <SwitchTypeLabel>{switchObj.switchType[0]}</SwitchTypeLabel>
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
  padding-top: 25px;
  box-shadow: 10px 5px 5px grey;
  text-align: center;
  width: 100%;
  max-width: 200px;
  img {
    width: 100%;
    height: auto;
    border-radius: 5px;
  }
  &:hover {
    scale: 1.05;
  }
`;

const StyledSwitchImage = styled(Image)``;

const SwitchTypeLabel = styled.p`
  position: absolute;
  top: 0px;
  left: 3px;
  font-size: 10px;
  font-weight: bold;
  color: black;
  margin-top: 5px;
  border: solid 1px black;
  border-radius: 50%;
  width: 15px;
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
