import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

export default function AddButtton({ onOpenModal }) {
  const [expanded, setExpanded] = useState(false);
  const buttonRef = useRef(null);

  //Handle click outside the collapse the button

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    if (expanded) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [expanded]);

  //Handle button click

  const handleClick = () => {
    if (expanded) {
      onOpenModal(); // Open the modal on the second click
    } else {
      setExpanded(true); // Expand on the first click
    }
  };

  return (
    <StyledButton ref={buttonRef} expanded={expanded} onClick={handleClick}>
      {expanded ? "+ Add keycaps" : "+"}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.expanded ? "16px" : "24px")};
  font-weight: bold;
  border-radius: ${(props) => (props.expanded ? "8px" : "50%")};
  width: ${(props) => (props.expanded ? "160px" : "50px")};
  height: 50px;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
  padding: ${(props) => (props.expanded ? "0 15px" : "0")};

  &:hover {
    background-color: #0056b3;
  }
`;
