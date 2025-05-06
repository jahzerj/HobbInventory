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
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "./_app";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import LogoutIcon from "@mui/icons-material/Logout";

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
  const colorMode = useContext(ColorModeContext);

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
              border: 3,
              borderColor: "primary.main",
            }}
          />
        )}

        <Typography variant="h5" gutterBottom>
          {session.user.name || session.user.email}
        </Typography>

        <Box sx={{ overflow: "auto", width: "100%", mb: 3 }}>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              px: 2,
            }}
          >
            <Grid
              item
              component={Link}
              href="/inventories/keycaps"
              sx={{
                textDecoration: "none",
                textAlign: "center",
                width: 80,
              }}
            >
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography variant="h5" color="primary.main">
                  {keycapCount}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Keycaps
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              component={Link}
              href="/inventories/switches"
              sx={{
                textDecoration: "none",
                textAlign: "center",
                width: 80,
              }}
            >
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography variant="h5" color="primary.main">
                  {switchCount}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Switches
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              component={Link}
              href="/inventories/keyboards"
              sx={{
                textDecoration: "none",
                textAlign: "center",
                width: 80,
              }}
            >
              <Paper elevation={0} sx={{ p: 1 }}>
                <Typography variant="h5" color="primary.main">
                  {keyboardCount}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Keyboards
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Stack spacing={2} width="100%" maxWidth={250}>
          <Button
            variant="contained"
            color="secondary"
            onClick={colorMode.toggleColorMode}
            fullWidth
          >
            {theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>

          <Button
            variant="contained"
            color="error"
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
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <KeyboardReturnIcon />
      </Fab>
    </Container>
  );
}
