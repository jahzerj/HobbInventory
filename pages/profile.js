import { useEffect, useContext } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Fab,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ThemeContext } from "./_app";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import LogoutIcon from "@mui/icons-material/Logout";
import PaletteIcon from "@mui/icons-material/Palette";
import Head from "next/head";

export default function Profile() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const router = useRouter();

  // Get theme and colorMode from context
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);

  // Fetch counts for each inventory type
  const { data: keycaps } = useSWR("/api/inventories/userkeycaps");
  const { data: switches } = useSWR("/api/inventories/userswitches");
  const { data: keyboards } = useSWR("/api/inventories/userkeyboards");

  useEffect(() => {
    // Redirect if not authenticated or during loading
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!session) return null;

  const keycapCount = keycaps?.length ?? 0;
  const switchCount = switches?.length ?? 0;
  const keyboardCount = keyboards?.length ?? 0;

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta
          name="description"
          content="View profile, inventory statistics, change theme, logout"
        />
      </Head>
      <Container maxWidth="sm">
        <Card
          sx={{
            mt: 5,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {session.user.image && (
            <Avatar
              src={session.user.image}
              alt="User Avatar"
              sx={{
                width: 100,
                height: 100,
                mb: 2,
              }}
            />
          )}

          <Typography variant="h5" gutterBottom>
            {session.user.name || session.user.email}
          </Typography>

          <Box
            sx={{
              width: "100%",
              mb: 3,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            {[
              {
                href: "/inventories/keycaps",
                count: keycapCount,
                label: "Keycaps",
              },
              {
                href: "/inventories/switches",
                count: switchCount,
                label: "Switches",
              },
              {
                href: "/inventories/keyboards",
                count: keyboardCount,
                label: "Keyboards",
              },
            ].map(({ href, count, label }) => (
              <Box
                key={label}
                component={Link}
                href={href}
                sx={{
                  textDecoration: "none",
                  textAlign: "center",
                  flex: "1 1 0",
                  minWidth: 0,
                  maxWidth: 100,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    border: (theme) => `2px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    backgroundColor: (theme) => theme.palette.background.paper,
                    minWidth: 0,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Typography variant="h5" color="text.primary">
                    {count}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: "0.90rem" }}
                  >
                    {label}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          <Stack spacing={2} width="100%" maxWidth={250}>
            <Button
              variant="contained"
              color="secondary"
              onClick={themeContext.toggleColorMode}
              fullWidth
            >
              {theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<PaletteIcon />}
              onClick={themeContext.toggleThemeStyle}
              fullWidth
            >
              {themeContext.themeStyle === "highContrast"
                ? "Primary Colors Theme"
                : "High Contrast Theme"}
            </Button>

            <Button
              variant="contained"
              color="warning"
              startIcon={<LogoutIcon />}
              onClick={() => signOut()}
              fullWidth
            >
              Sign out
            </Button>
          </Stack>
        </Card>

        <Fab
          color="primary"
          aria-label="home"
          onClick={() => router.push("/")}
          size="medium"
          sx={{
            position: "fixed",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <KeyboardReturnIcon />
        </Fab>
      </Container>
    </>
  );
}
