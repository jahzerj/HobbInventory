import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

export default function AddButton({ onOpenModal, isEditMode, itemType }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRef = useRef(null);

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
      aria-label={`Add ${itemType} Button`}
      $isEditMode={isEditMode}
    >
      {isExpanded ? ` Add ${itemType} +` : "+"}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  background-color: #007bff;
  opacity: ${(props) => (props.$isEditMode ? "0.5" : "1")};
  cursor: ${(props) => (props.$isEditMode ? "not-allowed" : "pointer")};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.$isExpanded ? "16px" : "24px")};
  font-weight: bold;
  border-radius: ${(props) => (props.$isExpanded ? "8px" : "50%")};
  width: ${(props) => (props.$isExpanded ? "160px" : "45px")};
  height: 45px;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
  padding: ${(props) => (props.$isExpanded ? "0 15px" : "0")};

  &:hover {
    background-color: #0056b3;
  }
`;
