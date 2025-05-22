import {
  Box,
  Button,
  Container,
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
import useMediaQuery from "@mui/material/useMediaQuery";
import Head from "next/head";

export default function InventoryHub() {
  const theme = useTheme();
  const themeContext = useContext(ThemeContext); // Access the theme context
  const { data: session, status } = useSession();

  // Function to clear scroll position for a specific inventory page
  const handleNavigation = (pageId) => {
    sessionStorage.removeItem(`scrollPosition_${pageId}`);
  };

  const isMediumScreen = useMediaQuery(
    "(min-width: 768px) and (max-width: 1024px)"
  );
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const isLargeScreen = useMediaQuery(
    "(min-width: 1000px) and (orientation: landscape)"
  );

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
      <Head>
        <title>Inventory Hub</title>
        <meta
          name="description"
          content="Landing Page for all your inventory needs"
        />
      </Head>
      <ProfileButtonMUI />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Inventory Hub
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isLargeScreen && !isPortrait ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            flexWrap: "wrap",
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
            <Box
              key={item.title}
              sx={{
                textAlign: "center",
                width: {
                  xs: "100%",
                  sm: "80%",
                  md: "40%",
                  lg: "30%",
                },
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                {item.title}
              </Typography>
              <Card sx={{ borderRadius: 3 }}>
                <Link
                  href={item.link}
                  onClick={() => handleNavigation(item.pageId)}
                  style={{ display: "block" }}
                >
                  <CardMedia
                    component="img"
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
                    sx={{
                      width: "100%",
                      aspectRatio: 1,
                      objectFit: "contain",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />
                </Link>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
}
