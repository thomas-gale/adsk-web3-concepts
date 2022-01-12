import { createTheme } from "@mui/material/styles";

// Reference: https://git.autodesk.com/GES/techx-react/blob/development/src/theme/techxTheme.js
export const adskThemeExtras = {
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      html {
         -webkit-font-smoothing: auto;
         font-size: 14px;
         line-height: 1.5;
       }
     `,
    },
  },
  adskPalette: {
    darkSlate: {
      main: "#666666",
    },
    darkSky: {
      main: "#333333",
    },
    lightSlate: {
      main: "#cccccc",
    },
    accentColors: {
      clay: "#d74e26",
      plant: "#2bc275",
      iris: "#5f60ff",
      gold: "#ffc21a",
    },
  },
};

export const theme = createTheme({
  typography: {
    fontFamily: ["ArtifaktElement", "sans-serif"].join(","),
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: adskThemeExtras.adskPalette.accentColors.gold,
    },
    error: {
      main: adskThemeExtras.adskPalette.accentColors.clay,
    },
  },
});
