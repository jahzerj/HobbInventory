import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Skeleton,
} from "@mui/material";
import R1Icon from "../icons/R1Icon";
import { alpha } from "@mui/material/styles";

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

export default function KeycapCardMUI({ keycap }) {
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // Move all hooks to the top level before any conditionals
  useEffect(() => {
    // Only set up timer if card is hovered AND there are multiple images
    if (isHovered && keycap?.kits && keycap.selectedKits) {
      const selectedKitData =
        keycap.kits
          ?.filter((kit) => (keycap.selectedKits || []).includes(kit.name))
          ?.map((kit) => ({
            name: kit.name,
            pic: kit.image || "/no_image_available.jpg",
          })) || [];

      if (selectedKitData.length > 1) {
        // Set up a timer to change the image every 2 seconds
        timerRef.current = setInterval(() => {
          setImageIndex((prev) => (prev + 1) % selectedKitData.length);
        }, 2000);
      }
    }

    // Clean up timer when component unmounts or when hover state changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isHovered, keycap]);

  // When we navigate away, clear the timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Swipe handlers for touch interfaces - moved before any conditional returns
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (keycap?.kits?.length > 1) {
        setImageIndex(
          (prev) =>
            (prev + 1) %
            (keycap.kits.filter((kit) =>
              (keycap.selectedKits || []).includes(kit.name)
            ).length || 1)
        );
      }
    },
    onSwipedRight: () => {
      if (keycap?.kits?.length > 1) {
        const kitCount =
          keycap.kits.filter((kit) =>
            (keycap.selectedKits || []).includes(kit.name)
          ).length || 1;
        setImageIndex((prev) => (prev - 1 + kitCount) % kitCount);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
  });

  // Now handle conditional returns after all hooks
  if (!keycap) return null;

  // Show loading skeleton if keycap is in loading state
  if (keycap.isLoading) {
    return (
      <Card
        variant="outlined"
        sx={{
          width: { xs: "95%", sm: "100%" },
          minWidth: 300,
          maxWidth: 550,
          m: 2,
          borderRadius: 4,
          position: "relative",
        }}
      >
        <CardMedia
          component="div"
          sx={{
            height: 240,
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        </CardMedia>

        <CardContent>
          <Skeleton variant="text" width="70%" height={32} />
          <Skeleton variant="text" width="40%" height={24} />

          {/* Skeleton for color chips */}
          <Box
            sx={{
              position: "absolute",
              bottom: 55,
              right: 8,
              display: "flex",
            }}
          >
            <Skeleton variant="rounded" width={100} height={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const selectedKits = keycap.selectedKits || [];

  // Get kit data with images
  const selectedKitData =
    keycap.kits
      ?.filter((kit) => selectedKits.includes(kit.name))
      ?.map((kit) => ({
        name: kit.name,
        pic: kit.image || "/no_image_available.jpg",
      })) || [];

  // Determine if we should show navigation dots
  const hasMultipleImages = selectedKitData.length > 1;

  // Handle card click navigation
  const handleCardClick = () => {
    router.push(`/inventories/keycaps/${keycap._id}`);
  };

  // If no kit data, show loading state
  if (selectedKitData.length === 0) {
    return null;
  }

  return (
    <Card
      variant="outlined"
      {...swipeHandlers}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: { xs: "95%", sm: "100%" },
        minWidth: 300,
        maxWidth: 550,
        m: 2,
        borderRadius: 4,
        cursor: "pointer",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
        },
        position: "relative",
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 240,
          position: "relative",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={selectedKitData[imageIndex].pic}
            alt={selectedKitData[imageIndex].name}
            fill
            style={{
              objectFit: "cover",
              objectPosition: "top center",
            }}
            priority
          />

          {/* Navigation dots */}
          {hasMultipleImages && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              {selectedKitData.map((_, index) => (
                <Dot
                  key={index}
                  $active={index === imageIndex}
                  onClick={(event) => {
                    event.stopPropagation();
                    setImageIndex(index);
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </CardMedia>

      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {keycap.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {selectedKitData[imageIndex].name}
        </Typography>
      </CardContent>

      {/* Color chips */}
      {keycap.selectedColors && keycap.selectedColors.length > 0 && (
        <Box
          sx={(theme) => ({
            position: "absolute",
            bottom: 55,
            right: 8,
            px: 0.3,
            py: 0.3,
            bgcolor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha(theme.palette.background.paper, 0.9),
            borderRadius: 3,
            display: "flex",
            boxShadow: `inset 0px 1px 3px ${alpha(
              theme.palette.common.black,
              0.2
            )}, 
                      inset 0px 1px 2px ${alpha(
                        theme.palette.common.black,
                        0.1
                      )}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            zIndex: 2,

            // Old styling (commented out for future reference)
            // bgcolor: "white",
            // boxShadow: 1,
            // border: "1px solid rgba(0,0,0,0.1)",
          })}
        >
          <Stack direction="row" spacing={0.5}>
            {keycap.selectedColors.map((color, index) => (
              <ColoredIconWrapper key={index}>
                <R1Icon color={color.toLowerCase()} />
              </ColoredIconWrapper>
            ))}
          </Stack>
        </Box>
      )}
    </Card>
  );
}

// Styled SVG wrapper for colored icons with improved visibility for light colors
const ColoredIconWrapper = ({ children }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
      margin: "0 2px",
    }}
  >
    {children}
  </Box>
);
