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
    <p> No Switches added yet.</p>
  );
}

const SwitchCard = styled.li`
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
