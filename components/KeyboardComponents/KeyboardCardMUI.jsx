import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import {
  Card,
  CardContent,
  Box,
  Typography,
  useTheme,
  Paper,
  Skeleton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

// Exact Dot component from KeycapCardMUI
const Dot = ({ $active, onClick }) => {
  return (
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: $active ? "white" : "rgba(255,255,255,0.5)",
        margin: "0 4px",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }}
      onClick={onClick}
    />
  );
};

export default function KeyboardCardMUI({ itemObj }) {
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);
  const theme = useTheme();

  // Rename for domain clarity
  const keyboardObj = itemObj;

  // Get the photos array, with a fallback to empty array
  const photos = keyboardObj.renders ?? [];

  // Determine if we should show navigation elements
  const hasMultipleImages = photos.length > 1;

  // Setup auto-switching on hover
  useEffect(() => {
    if (isHovered && hasMultipleImages) {
      timerRef.current = setInterval(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, 2000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isHovered, hasMultipleImages, photos.length]);

  const handleNextImage = () => {
    if (!hasMultipleImages) return;
    setImageIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrevImage = () => {
    if (!hasMultipleImages) return;
    setImageIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextImage(),
    onSwipedRight: () => handlePrevImage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
    delta: 10,
    touchAction: "none",
  });

  const cardProps = hasMultipleImages ? swipeHandlers : {};

  const handleCardClick = () => {
    router.push(`/inventories/keyboards/${keyboardObj._id}`);
  };

  if (itemObj.isLoading) {
    return (
      <Paper
        sx={{
          width: "100%",
          maxWidth: 480,
          m: 1,
          p: 0,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <Box sx={{ height: 200, bgcolor: "grey.300", width: "100%" }} />
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="80%" height={32} />
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
      </Paper>
    );
  }

  return (
    <Card
      variant="outlined"
      {...cardProps}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        width: { xs: "80%", sm: 500 },
        height: 315,
        m: 1.25,
        minWidth: 360,
        borderRadius: 4,
        cursor: "pointer",
        overflow: "visible",
        bgcolor: theme.palette.background.paper,
        pb: 3,
        boxShadow: theme.shadows[1],
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
        },
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderBottom: `7rem solid ${theme.palette.background.paper}`,
        touchAction: "pan-y",
        userSelect: "none",
      }}
    >
      {photos.length > 0 ? (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "calc(100% - 0.1rem)",
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
              borderRadius: "16px 16px 0 0",
              overflow: "hidden",
            }}
          >
            <Image
              src={photos[imageIndex]}
              alt={`${keyboardObj.name} photo ${imageIndex + 1}`}
              fill
              sizes="(min-width: 600px) 500px, 80vw"
              style={{ objectFit: "cover" }}
              priority
              draggable={false}
            />
          </Box>
          <CardContent sx={{ position: "relative", height: "100%", p: 0 }}>
            {hasMultipleImages && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -10,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                {photos.map((_, index) => (
                  <Dot
                    key={index}
                    $active={index === imageIndex}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setImageIndex(index);
                    }}
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "calc(100% - 0.1rem)",
            backgroundColor: theme.palette.grey[300],
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, transparent 0%, ${theme.palette.background.paper} 50%, transparent 100%)`,
              backgroundSize: "315px 100%",
              backgroundPosition: "-315px 0",
              backgroundRepeat: "no-repeat",
              animation: "shimmer 1.5s infinite",
            },
            "@keyframes shimmer": {
              to: {
                backgroundPosition: "315px 0",
              },
            },
          }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          bottom: -90,
          left: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0.5,
          zIndex: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: "0.6rem",
            m: 0,
          }}
        >
          {keyboardObj.designer}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: "1.8rem",
            m: 0,
          }}
        >
          {keyboardObj.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 400,
            fontSize: "0.8rem",
            m: 0,
          }}
        >
          {itemObj.layout} {itemObj.blocker}
        </Typography>
      </Box>
    </Card>
  );
}
