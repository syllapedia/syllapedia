import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import Router from './Router';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const dark = createTheme ({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b91c1c',
      light: '#f87171',
      dark: '#7f1d1d',
    },
    secondary: {
      main: '#6d28d9',
      light: '#c084fc',
      dark: '#581c87',
    },
    background: {
      paper: '#0a0a0a',
      default: '#262626',
    },
    text: {
      primary: '#e5e5e5',
      secondary: '#a3a3a3',
      disabled: '#d4d4d4',
    },
    info: {
      main: '#1d4ed8',
      light: '#3b82f6',
      dark: '#1e3a8a',
    }
  },
});

function App() {

  return (
    <ThemeProvider theme={dark}>
      <RouterProvider router={Router} />
    </ThemeProvider>
  );
}

export default App;
