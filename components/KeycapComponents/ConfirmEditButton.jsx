import styled from "styled-components";
import ConfirmEditIcon from "../icons/ConfirmEditIcon";

export default function ConfirmEditButton({ isEditMode, onSaveChanges }) {
  return (
    <StyledButton $isEditMode={isEditMode} onClick={onSaveChanges}>
      <ConfirmEditIcon /> Confirm Edits
    </StyledButton>
  );
}

const StyledButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  height: 50px;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
  padding: 0 15px;

  &:hover {
    background-color: #218838;
  }
`;
