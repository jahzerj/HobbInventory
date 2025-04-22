import { useState, useEffect, useRef } from "react";
import { Fab, Zoom } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function AddButtonMUI({ onOpenModal, isEditMode, itemType }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");

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

    if (!isMobile) {
      onOpenModal(); // large screens modal opens
    } else {
      isExpanded ? onOpenModal() : setIsExpanded(true);
    }
  };

  return (
    <Zoom in={true}>
      <Fab
        ref={buttonRef}
        color="primary"
        onClick={handleClick}
        aria-label={`Add ${itemType} Button`}
        sx={{
          position: "fixed",
          bottom: 10,
          right: 10,
          zIndex: 1000,
          opacity: isEditMode ? 0.5 : 1,
          width: isExpanded && isMobile ? 160 : 45,
          height: 45,
          minWidth: 45,
          borderRadius: isExpanded && isMobile ? 2 : "50%",
          pointerEvents: isEditMode ? "none" : "auto",
          transition: "all 0.3s ease-in-out",
          px: isExpanded && isMobile ? 2 : 0,
          boxSizing: "border-box",
        }}
      >
        {isExpanded && isMobile ? (
          ` Add ${itemType} +`
        ) : (
          <AddIcon sx={{ pointerEvents: "none" }} />
        )}
      </Fab>
    </Zoom>
  );
}
