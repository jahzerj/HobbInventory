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

        <Image
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
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  background-color: lightgrey;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  padding-bottom: 25px;
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

const SwitchTypeLabel = styled.p`
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translate(-50%);
  padding: 4px 12px;
  font-size: 12px;
  font-weight: bold;
  color: black;
  background-color: white;
  margin-top: 5px;
  border: solid 1px black;
  border-radius: 15px;
  text-transform: capitalize;
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
