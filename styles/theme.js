import { createTheme } from "@mui/material/styles";

// High Contrast Themes (default MUI with specific mode)
export const highContrastLightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export const highContrastDarkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// Simplified Kandinsky Themes
export const kandinskyLightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f2ecdf", // canvas-like cream tone
      paper: "#f2ecdf",
    },
    primary: {
      main: "#264b87", // deep blue
    },
    secondary: {
      main: "#d73636", // muted red
    },
    warning: {
      main: "#e6b800", // golden yellow
    },
    text: {
      primary: "#1c1c1c", // high contrast black
      secondary: "#4f4f4f",
    },
  },
  typography: {
    fontFamily: "DM Sans, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      textTransform: "uppercase",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.05em",
    },
  },
});

export const kandinskyDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1a1814", // dark tone based on light theme
      paper: "#242020",
    },
    primary: {
      main: "#4670ab", // lighter blue for dark mode
    },
    secondary: {
      main: "#e65c5c", // brighter red for dark mode
    },
    warning: {
      main: "#ffd333", // brighter yellow for dark mode
    },
    text: {
      primary: "#f5f5f5", // light text for dark mode
      secondary: "#b8b8b8",
    },
  },
  typography: {
    fontFamily: "DM Sans, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      textTransform: "uppercase",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.05em",
    },
  },
});

// // Bauhaus Themes
// export const bauhausLightTheme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#0057A0", // deep blue
//     },
//     secondary: {
//       main: "#D62828", // bold red
//     },
//     warning: {
//       main: "#FFD700", // primary yellow
//     },
//     background: {
//       default: "#FAFAF5", // soft, off-white
//       paper: "#E0E0E0", // gray surface for cards
//     },
//     text: {
//       primary: "#1C1C1C",
//       secondary: "#3A3A3A",
//     },
//   },
//   typography: {
//     fontFamily: '"Bauhaus 93", "Futura", "Helvetica", sans-serif',
//     h1: {
//       fontWeight: 700,
//       letterSpacing: "0.05em",
//     },
//     body1: {
//       letterSpacing: "0.03em",
//     },
//   },
//   shape: {
//     borderRadius: 4,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           borderRadius: 4,
//           fontWeight: "bold",
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "#E0E0E0",
//         },
//       },
//     },
//   },
// });

// export const bauhausDarkTheme = createTheme({
//   palette: {
//     mode: "dark",
//     primary: {
//       main: "#0057A0", // deep blue
//     },
//     secondary: {
//       main: "#D62828", // bold red
//     },
//     warning: {
//       main: "#FFD700", // primary yellow
//     },
//     background: {
//       default: "#121212",
//       paper: "#1E1E1E",
//     },
//     text: {
//       primary: "#FFFFFF",
//       secondary: "#B0B0B0",
//     },
//   },
//   typography: {
//     fontFamily: '"Bauhaus 93", "Futura", "Helvetica", sans-serif',
//     h1: {
//       fontWeight: 700,
//       letterSpacing: "0.05em",
//     },
//     body1: {
//       letterSpacing: "0.03em",
//     },
//   },
//   shape: {
//     borderRadius: 4,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           borderRadius: 4,
//           fontWeight: "bold",
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "#1E1E1E",
//         },
//       },
//     },
//   },
// });
