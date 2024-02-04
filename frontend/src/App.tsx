import './App.css';
import { RouterProvider } from 'react-router-dom';
import Router from './Router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createContext, useEffect, useMemo, useState } from 'react';
import { PaletteMode } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

const getTheme = (mode: string) => createTheme({
  palette: {
    mode: mode as PaletteMode ,
    primary: {
      main: "#b91c1c",
      light: "#ef4444",
      dark: "#7f1d1d",
    },
    secondary: {
      main: "#6d28d9",
      light: "#c084fc",
      dark: "#581c87",
    },
    background: {
      paper: mode === "dark" ? "#0a0a0a" : "#fafafa",
      default: mode === "dark" ? "#262626" : "#e5e5e5",
    },
    text: {
      primary: mode === "dark" ? "#e5e5e5" : "#262626",
      secondary: mode === "dark" ? "#a3a3a3" : "#525252",
      disabled: mode === "dark" ? "#d4d4d4" : "#404040",
    },
    info: {
      main: "#1d4ed8",
      light: "#3b82f6",
      dark: "#1e3a8a",
    },
    error: {
      main: "#b91c1c",
      light: "#f87171",
      dark: "#7f1d1d",
    }
  },
});

function App() {
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "dark");

  useEffect(() => {
    document.body.classList.toggle("light-theme", mode === "light");
  }, []);

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => {
        const newMode = prevMode === "light" ? "dark" : "light";
        localStorage.setItem("themeMode", newMode);
        document.body.classList.toggle("light-theme", newMode === "light");
        return newMode;
      });
    }
  }), []);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={Router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
export { ColorModeContext };
