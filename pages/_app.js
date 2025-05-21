// Font imports
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// DM Sans for the Kandinsky theme
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";

import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useMemo, createContext, useEffect } from "react";
import Head from "next/head";
import { Box } from "@mui/material";
import {
  highContrastLightTheme,
  highContrastDarkTheme,
  kandinskyLightTheme,
  kandinskyDarkTheme,
} from "../styles/theme";

// Create context for theme settings
export const ThemeContext = createContext({
  toggleColorMode: () => {},
  toggleThemeStyle: () => {},
  themeStyle: "highContrast",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // Initialize state with default values
  const [mode, setMode] = useState("light");
  const [themeStyle, setThemeStyle] = useState("highContrast"); // "highContrast" or "kandinsky"

  // Load theme preferences from localStorage on initial render (client-side only)
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    }

    const savedThemeStyle = localStorage.getItem("themeStyle");
    if (savedThemeStyle) {
      setThemeStyle(savedThemeStyle);
    }
  }, []);

  // Create theme context with both toggles
  const themeContext = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode);
          return newMode;
        });
      },
      toggleThemeStyle: () => {
        setThemeStyle((prevStyle) => {
          const newStyle =
            prevStyle === "highContrast" ? "kandinsky" : "highContrast";
          localStorage.setItem("themeStyle", newStyle);
          return newStyle;
        });
      },
      themeStyle,
    }),
    [themeStyle]
  );

  // Select the appropriate theme based on both mode and style
  const theme = useMemo(() => {
    if (themeStyle === "highContrast") {
      return mode === "light" ? highContrastLightTheme : highContrastDarkTheme;
    } else {
      return mode === "light" ? kandinskyLightTheme : kandinskyDarkTheme;
    }
  }, [mode, themeStyle]);

  return (
    <SessionProvider session={session}>
      <ThemeContext.Provider value={themeContext}>
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
      </ThemeContext.Provider>
    </SessionProvider>
  );
}
