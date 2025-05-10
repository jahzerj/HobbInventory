import { useRouter } from "next/router";
import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
} from "@mui/material";

export default function SwitchCardMUI({ itemObj, isPreview = false }) {
  const router = useRouter();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const switchObj = itemObj;

  if (!switchObj) return null;

  const formatQuantity = (quantity) => {
    const num = parseInt(quantity) || 0;
    if (num > 9999) return "9999+";
    return num;
  };

  const formatSwitchType = (type) => {
    if (!type) return "";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const handleClick = () => {
    if (!isPreview) {
      router.push(`/inventories/switches/${switchObj._id}`);
    }
  };

  const handleDelete = (event) => {
    e.stopPropagation();
    onDelete && onDelete(switchObj._id, event);
  };

  return (
    <Card
      variant="outlined"
      onClick={handleClick}
      sx={{
        width: "100%",
        maxWidth: { xs: 160, sm: 170 },
        borderRadius: 2,
        cursor: isPreview ? "default" : "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: isPreview ? "none" : "translateY(-4px)",
          boxShadow: isPreview ? 1 : 3,
        },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        m: 1,
      }}
    >
      {/* Quantity Chip */}
      <Chip
        label={formatQuantity(switchObj.quantity)}
        size="small"
        color="default"
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 1,
          fontSize: "0.75rem",
          fontWeight: "bold",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "white",
        }}
      />

      {/* Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 120,
          backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {switchObj.image ? (
          <>
            <Image
              src={switchObj.image}
              alt={switchObj.name}
              width={100}
              height={100}
              style={{
                objectFit: "contain",
                margin: "0 auto",
              }}
              priority
            />
            {/* Dark overlay for dark mode */}
            {isDarkMode && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.1)",
                  zIndex: 1,
                  pointerEvents: "none", // Makes sure clicks pass through
                }}
              />
            )}
          </>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: isDarkMode ? "#424242" : "#e0e0e0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              No Image
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          component="div"
          noWrap
        >
          {switchObj.manufacturer}
        </Typography>

        <Typography
          variant="subtitle2"
          component="div"
          fontWeight="bold"
          noWrap
          sx={{ mb: 1 }}
        >
          {switchObj.name}
        </Typography>

        {/* Switch Type Chip */}
        <Chip
          label={formatSwitchType(switchObj.switchType)}
          size="small"
          sx={{
            width: "100%",
            fontSize: "0.7rem",
            backgroundColor:
              switchObj.switchType?.toLowerCase() === "linear"
                ? isDarkMode
                  ? "#1b5e20"
                  : "#a5d6a7"
                : switchObj.switchType?.toLowerCase() === "tactile"
                ? isDarkMode
                  ? "#0d47a1"
                  : "#90caf9"
                : switchObj.switchType?.toLowerCase() === "clicky"
                ? isDarkMode
                  ? "#e65100"
                  : "#ffcc80"
                : isDarkMode
                ? "#616161"
                : "#e0e0e0",
            color: isDarkMode ? "#fff" : "#333",
            fontWeight: "500",
          }}
        />
      </CardContent>
    </Card>
  );
}
