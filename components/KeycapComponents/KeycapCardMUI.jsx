import { useState } from "react";
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
  Chip,
  Skeleton,
} from "@mui/material";
import { styled as muiStyled } from "@mui/material/styles";
import R1Icon from "../icons/R1Icon";
import { alpha } from "@mui/material/styles";

// Navigation dot styling - Updated to match original design
const Dot = muiStyled(Box)(({ theme, active }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: active ? "white" : "rgba(255,255,255,0.5)",
  margin: "0 4px",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  boxShadow: "0 1px 3px rgba(0,0,0,0.3)", // Add shadow for better visibility
}));

// Styled SVG wrapper for colored icons with improved visibility for light colors
const ColoredIconWrapper = muiStyled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  height: 20,
  margin: "0 2px",
}));

export default function KeycapCardMUI({ keycap }) {
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);

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

  if (!keycap) return null;

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
    return (
      <Card
        variant="outlined"
        sx={{
          width: { xs: "95%", sm: "100%" },
          minWidth: 300,
          maxWidth: 550,
          m: 2,
          borderRadius: 4,
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
          position: "relative",
        }}
      >
        <Skeleton
          variant="rectangular"
          height={240}
          animation="wave"
          sx={{ borderRadius: "16px 16px 0 0" }}
        />
        <CardContent>
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="text" width="50%" />
        </CardContent>

        {/* Color chips skeleton */}
        <Box
          sx={(theme) => ({
            position: "absolute",
            bottom: 55,
            right: 8,
            height: 28,
            width: 100, // Approximate width for 4-5 color chips
            bgcolor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha(theme.palette.background.paper, 0.9),
            borderRadius: 3,
            boxShadow: `inset 0px 1px 3px ${alpha(
              theme.palette.common.black,
              0.2
            )}, 
                      inset 0px 1px 2px ${alpha(
                        theme.palette.common.black,
                        0.1
                      )}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            overflow: "hidden",
            zIndex: 2,
          })}
        >
          <Skeleton
            variant="rectangular"
            height="100%"
            width="100%"
            animation="wave"
            sx={{
              borderRadius: 3,
              bgcolor: (theme) => alpha(theme.palette.action.disabled, 0.2),
            }}
          />
        </Box>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      {...swipeHandlers}
      onClick={handleCardClick}
      sx={{
        width: { xs: "95%", sm: "100%" },
        minWidth: 300,
        maxWidth: 550, // Max width for the card itself
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
                  active={index === imageIndex}
                  onClick={(e) => {
                    e.stopPropagation();
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
