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

// Navigation dot styling
const Dot = muiStyled(Box)(({ theme, active }) => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: active
    ? theme.palette.primary.main
    : theme.palette.grey[400],
  margin: "0 4px",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
}));

// Styled SVG wrapper for colored icons
const ColoredIconWrapper = muiStyled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
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
          width: { xs: "90%", sm: "70%", md: 500 },
          minWidth: 300,
          maxWidth: 600,
          m: 2,
          borderRadius: 4,
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
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
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      {...swipeHandlers}
      onClick={handleCardClick}
      sx={{
        width: { xs: "90%", sm: "70%", md: 500 },
        minWidth: 300,
        maxWidth: 600,
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
              objectPosition: "center",
            }}
            priority
          />
        </Box>
      </CardMedia>

      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {keycap.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {selectedKitData[imageIndex].name}
        </Typography>

        {/* Navigation dots */}
        {hasMultipleImages && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
      </CardContent>

      {/* Color chips */}
      {keycap.selectedColors && keycap.selectedColors.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 1,
            right: 1,
            p: 1,
            bgcolor: "background.paper",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "grey.300",
            display: "flex",
            boxShadow: 1,
          }}
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
