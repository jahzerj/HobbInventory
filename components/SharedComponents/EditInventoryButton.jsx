import styled from "styled-components";
import EditButtonIcon from "../icons/EditButtonIcon";
import CancelIcon from "../icons/CancelIcon";

export default function EditInventoryButton({ isEditMode, onToggleEdit }) {
  return (
    <StyledButton $isEditMode={isEditMode} onClick={onToggleEdit}>
      {isEditMode ? (
        <>
          <CancelIcon /> Close Edit Mode
        </>
      ) : (
        <EditButtonIcon aria-label="Edit Button" />
      )}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  background-color: ${(props) => (props.$isEditMode ? "#ff4d4d" : "#007bff")};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.$isEditMode ? "16px" : "24px")};
  font-weight: bold;
  border-radius: ${(props) => (props.$isEditMode ? "8px" : "50%")};
  width: ${(props) => (props.$isEditMode ? "180px" : "45px")};
  height: 45px;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
  padding: ${(props) => (props.$isEditMode ? "0 15px" : "0")};

  &:hover {
    background-color: ${(props) =>
      props.$isEditMode ? "rgb(162, 24, 24)" : "#0056b3"};
  }
`;
