// Font imports
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useMemo, createContext } from "react";
import Head from "next/head";

// Create context for theme mode
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // Add state for mode
  const [mode, setMode] = useState("light");

  // Create color mode toggle context
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  // Create theme based on current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "light" ? "#ccc" : "#333",
            paper: mode === "light" ? "#fff" : "#424242",
          },
        },
      }),
    [mode]
  );

  return (
    <SessionProvider session={session}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

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
                content="initial-scale=1, width=device-width"
              />
            </Head>
            <Component {...pageProps} />
          </SWRConfig>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </SessionProvider>
  );
}
