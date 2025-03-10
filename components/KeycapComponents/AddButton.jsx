import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

export default function AddButtton({ onOpenModal, isEditMode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRef = useRef(null);

  //Handle click outside the collapse the button

  useEffect(() => {
    const handleCloseExpandedButton = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      window.addEventListener("click", handleCloseExpandedButton);
    }

    return () => {
      window.removeEventListener("click", handleCloseExpandedButton);
    };
  }, [isExpanded]);

  //Button click behaivor

  const handleClick = () => {
    if (isEditMode) return;

    if (window.innerWidth > 768) {
      onOpenModal(); // large screens modal opens
    } else {
      isExpanded ? onOpenModal() : setIsExpanded(true);
    }
  };

  return (
    <StyledButton
      ref={buttonRef}
      $isExpanded={isExpanded}
      onClick={handleClick}
      aria-label="Add Keycaps Button"
      $isEditMode={isEditMode}
    >
      {isExpanded ? " Add keycaps +" : "+"}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  background-color: ${(props) => (props.$isEditMode ? "#ccc" : "#007bff")};
  cursor: ${(props) => (props.$isEditMode ? "not-allowed" : "pointer")};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.$isExpanded ? "16px" : "24px")};
  font-weight: bold;
  border-radius: ${(props) => (props.$isExpanded ? "8px" : "50%")};
  width: ${(props) => (props.$isExpanded ? "160px" : "50px")};
  height: 50px;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
  padding: ${(props) => (props.$isExpanded ? "0 15px" : "0")};

  &:hover {
    background-color: ${(props) => (props.$isEditMode ? "#ccc" : "#0056b3")};
  }
`;
