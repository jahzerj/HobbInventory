// Font imports
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const fetcher = (url) => fetch(url).then((r) => r.json());

const theme = createTheme({
  // Customize the theme to match your global styles
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#ccc",
        },
      },
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SWRConfig
          value={{
            fetcher: async (...args) => {
              const response = await fetch(...args);
              if (!response.ok) {
                throw new Error(`Request with ${JSON.stringify(args)} failed.`);
              }
              return await response.json();
            },
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </ThemeProvider>
    </SessionProvider>
  );
}
