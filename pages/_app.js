// Font imports
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useMemo, createContext, useEffect } from "react";
import Head from "next/head";
import { Box } from "@mui/material";

// Create context for theme mode
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // Initialize mode state with a function to handle server-side rendering
  const [mode, setMode] = useState("light");

  // Load theme preference from localStorage on initial render (client-side only)
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  // Create color mode toggle context
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          // Save to localStorage when mode changes
          localStorage.setItem("themeMode", newMode);
          return newMode;
        });
      },
    }),
    []
  );

  // Create theme based on current mode - using default MUI theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // background: {
          //   default: mode === "light" ? "#ccc" : "#333",
          //   paper: mode === "light" ? "#fff" : "#424242",
          // },
        },
      }),
    [mode]
  );

  return (
    <SessionProvider session={session}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              maxWidth: "100vw",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <SWRConfig
              value={{
                fetcher: async (...args) => {
                  const response = await fetch(...args);
                  if (!response.ok) {
                    throw new Error(
                      `Request with ${JSON.stringify(args)} failed.`
                    );
                  }
                  return await response.json();
                },
              }}
            >
              <Head>
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
              </Head>
              <Component {...pageProps} />
            </SWRConfig>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </SessionProvider>
  );
}
