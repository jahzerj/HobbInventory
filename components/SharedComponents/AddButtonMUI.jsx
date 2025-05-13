import { useState, useRef } from "react";
import { Fab, Zoom } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function AddButtonMUI({ onOpenModal, isEditMode, itemType }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleClick = () => {
    if (isEditMode) return;

    if (isMobile) {
      if (isExpanded) {
        onOpenModal();
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    } else {
      onOpenModal(); // Directly open modal on larger screens
    }
  };

  // Click outside to collapse on mobile
  const handleClickOutside = (event) => {
    if (
      isExpanded &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsExpanded(false);
    }
  };

  // Add/remove event listener only when needed
  if (isExpanded) {
    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }

  return (
    <Zoom in={true}>
      <Fab
        ref={buttonRef}
        color="primary"
        onClick={handleClick}
        aria-label={`Add ${itemType} Button`}
        size="medium"
        variant={isExpanded && isMobile ? "extended" : "circular"}
        disabled={isEditMode}
        sx={{
          position: "fixed",
          bottom: 10,
          right: 8,
          zIndex: 1000,
          opacity: isEditMode ? 0.5 : 1,
          transition: "all 0.3s ease-in-out",
          minHeight: 48,
        }}
      >
        {isExpanded && isMobile ? (
          `Add ${itemType}`
        ) : (
          <AddIcon sx={{ pointerEvents: "none" }} />
        )}
      </Fab>
    </Zoom>
  );
}
