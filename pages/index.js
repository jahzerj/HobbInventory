import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Card,
  CardMedia,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import ProfileButtonMUI from "@/components/SharedComponents/ProfileButtonMUI";
import { useTheme, useThemeProps } from "@mui/material/styles";
import { ThemeContext } from "./_app"; // Import ThemeContext to check theme style
import { useContext } from "react"; // Add useContext

export default function InventoryHub() {
  const theme = useTheme();
  const themeContext = useContext(ThemeContext); // Access the theme context
  const { data: session, status } = useSession();

  // Function to clear scroll position for a specific inventory page
  const handleNavigation = (pageId) => {
    sessionStorage.removeItem(`scrollPosition_${pageId}`);
  };

  // Show loading state
  if (status === "loading") {
    return null;
  }

  // If user is not authenticated, show splash screen
  if (!session) {
    return (
      <Grid container sx={{ minHeight: "100vh" }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              position: "relative",
              height: {
                xs: "50vh",
                sm: "100vh",
              },
            }}
          >
            <Image
              src="https://res.cloudinary.com/dgn86s1e2/image/upload/v1745845655/F1_wk1fpp.jpg"
              alt="F1-8x ISO-DE GMK Dualshot"
              fill
              sizes="(max-width: 599px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: {
                xs: "50vh",
                sm: "100vh",
              },
              p: 3,
            }}
          >
            <Typography variant="h3" color="primary" gutterBottom>
              HobbInventory
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              gutterBottom
              sx={{ mb: 4 }}
            >
              The one stop shop for all your hobby needs
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => signIn()}
            >
              Sign in
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  }

  // URLs for various theme modes and styles
  // Default theme images (light/dark)
  const keycapsImageLight =
    "https://res.cloudinary.com/dgn86s1e2/image/upload/v1747596336/keycaps_WB_cuvxvh.png";
  const keycapsImageDark =
    "https://res.cloudinary.com/dgn86s1e2/image/upload/v1747596374/keycaps_BW_invert_cnxbr8.png";
  const switchesImageLight =
    "https://res.cloudinary.com/dgn86s1e2/image/upload/v1747596341/Switches_WB_juwdf7.png";
  const switchesImageDark =
    "https://res.cloudinary.com/dgn86s1e2/image/upload/v1747596381/Switches_BW_invert_mcs5ec.png";
  const keyboardsImageLight =
    "https://res.cloudinary.com/dgn86s1e2/image/upload/v1747596347/keyboard_WB_lguoy5.png";
  const keyboardsImageDark =
    "https://res.cloudinary.com/dgn86s1e2/image/upload/v1747596389/keyboard_BW_invert_pwkcam.png";

  // Kandinsky theme images (same for both light/dark)
  const keycapsImageKandinsky =
    "https://res.cloudinary.com/dgn86s1e2/image/upload/v1747596323/keycaps_JJ_dmqh3g.png";
  const switchesImageKandinsky =
    "https://res.cloudinary.com/dgn86s1e2/image/upload/v1747596325/Switches_JJ_oi7mnp.png";
  const keyboardsImageKandinsky =
    "https://res.cloudinary.com/dgn86s1e2/image/upload/v1747596330/keyboard_JJ_fuakuc.png";

  // Hub view for authenticated users
  return (
    <>
      <ProfileButtonMUI />
      <Container
        maxWidth="md"
        sx={{
          py: { xs: 1, sm: 2, md: 4 },
          px: { xs: 1, sm: 2 },
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: "1.7rem", sm: "2.125rem" },
            mt: { xs: 1, sm: 2 },
            mb: { xs: 1, sm: 2 },
          }}
        >
          Inventory Hub
        </Typography>

        <Stack
          spacing={{ xs: 1.5, sm: 2, md: 4 }}
          alignItems="center"
          sx={{
            flex: 1,
            justifyContent: "space-evenly",
          }}
        >
          {[
            {
              title: "KEYCAPS",
              lightImg: keycapsImageLight,
              darkImg: keycapsImageDark,
              kandinskyImg: keycapsImageKandinsky,
              link: "/inventories/keycaps",
              pageId: "keycaps",
            },
            {
              title: "SWITCHES",
              lightImg: switchesImageLight,
              darkImg: switchesImageDark,
              kandinskyImg: switchesImageKandinsky,
              link: "/inventories/switches",
              pageId: "switches",
            },
            {
              title: "KEYBOARD KITS",
              lightImg: keyboardsImageLight,
              darkImg: keyboardsImageDark,
              kandinskyImg: keyboardsImageKandinsky,
              link: "/inventories/keyboards",
              pageId: "keyboards",
            },
          ].map((item) => (
            <Box key={item.title} sx={{ width: "100%", textAlign: "center" }}>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                  mb: { xs: 0.5, sm: 1 },
                }}
              >
                {item.title}
              </Typography>
              <Link
                href={item.link}
                onClick={() => handleNavigation(item.pageId)}
                style={{ textDecoration: "none" }}
              >
                <Card
                  sx={{
                    // Square cards at all screen sizes
                    width: { xs: "26vh", sm: 280, md: 320 },
                    height: { xs: "26vh", sm: 280, md: 320 },
                    // Added min-width/height to ensure minimum size
                    minWidth: { xs: 180, sm: 280, md: 320 },
                    minHeight: { xs: 180, sm: 280, md: 320 },
                    // Added max-width/height to prevent them from being too large
                    maxWidth: { xs: 280, sm: 280, md: 320 },
                    maxHeight: { xs: 280, sm: 280, md: 320 },
                    borderRadius: 3,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    }}
                    image={
                      // Check if using Kandinsky theme first, regardless of light/dark mode
                      themeContext?.themeStyle === "kandinsky"
                        ? item.kandinskyImg
                        : // If not Kandinsky, then follow light/dark mode selection
                        theme.palette.mode === "dark"
                        ? item.darkImg
                        : item.lightImg
                    }
                    alt={item.title}
                  />
                </Card>
              </Link>
            </Box>
          ))}
        </Stack>
      </Container>
    </>
  );
}
