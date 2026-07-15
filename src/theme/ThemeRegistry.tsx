'use client';

import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useMemo, useEffect, useState } from 'react';
import { initializeTheme } from '@/store/themeSlice';

const BRAND = {
  50:  '#eef5ff',
  100: '#d9eaff',
  200: '#bcd8ff',
  300: '#8dbeff',
  400: '#5999ff',
  500: '#3575f0',
  600: '#1a56e8',
  700: '#1641d4',
  800: '#1836ac',
  900: '#193187',
};

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(initializeTheme());
    setMounted(true);
  }, [dispatch]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: BRAND[600],
            light: BRAND[400],
            dark: BRAND[800],
            contrastText: '#fff',
          },
          secondary: {
            main: '#7c3aed',
            contrastText: '#fff',
          },
          success: { main: '#16a34a', light: '#dcfce7', dark: '#166534' },
          warning: { main: '#d97706', light: '#fef3c7', dark: '#92400e' },
          error:   { main: '#dc2626', light: '#fee2e2', dark: '#991b1b' },
          info:    { main: '#0284c7', light: '#e0f2fe', dark: '#075985' },
          background: {
            default: mode === 'light' ? '#f0f4f8' : '#0f1117',
            paper:   mode === 'light' ? '#ffffff'  : '#1a1d27',
          },
          text: {
            primary:   mode === 'light' ? '#0f172a' : '#f1f5f9',
            secondary: mode === 'light' ? '#475569' : '#94a3b8',
          },
          divider: mode === 'light' ? '#e2e8f0' : '#2d3348',
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 800 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 700, fontSize: '1.625rem' },
          h5: { fontWeight: 600, fontSize: '1.25rem'  },
          h6: { fontWeight: 600, fontSize: '1.05rem'  },
          body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
          body2: { fontSize: '0.8125rem', lineHeight: 1.6 },
          caption: { fontSize: '0.75rem' },
          button: { fontWeight: 600, letterSpacing: '0.01em' },
        },
        shape: { borderRadius: 10 },
        shadows: [
          'none',
          '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)',
          '0 8px 16px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)',
          '0 12px 24px rgba(0,0,0,0.07), 0 6px 12px rgba(0,0,0,0.05)',
          '0 16px 32px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.05)',
          '0 20px 40px rgba(0,0,0,0.09)',
          '0 24px 48px rgba(0,0,0,0.10)',
          '0 28px 56px rgba(0,0,0,0.11)',
          '0 32px 64px rgba(0,0,0,0.12)',
          '0 36px 72px rgba(0,0,0,0.13)',
          '0 40px 80px rgba(0,0,0,0.14)',
          '0 44px 88px rgba(0,0,0,0.15)',
          '0 48px 96px rgba(0,0,0,0.16)',
          '0 52px 104px rgba(0,0,0,0.17)',
          '0 56px 112px rgba(0,0,0,0.18)',
          '0 60px 120px rgba(0,0,0,0.19)',
          '0 64px 128px rgba(0,0,0,0.20)',
          '0 68px 136px rgba(0,0,0,0.21)',
          '0 72px 144px rgba(0,0,0,0.22)',
          '0 76px 152px rgba(0,0,0,0.23)',
          '0 80px 160px rgba(0,0,0,0.24)',
          '0 84px 168px rgba(0,0,0,0.25)',
          '0 88px 176px rgba(0,0,0,0.26)',
          '0 92px 184px rgba(0,0,0,0.27)',
        ] as any,
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: { scrollBehavior: 'smooth' },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
                transition: 'background 0.18s, transform 0.12s',
                '&:active': { transform: 'scale(0.98)' },
              },
              containedPrimary: {
                background: `linear-gradient(135deg, ${BRAND[600]} 0%, ${BRAND[700]} 100%)`,
                '&:hover': { background: `linear-gradient(135deg, ${BRAND[700]} 0%, ${BRAND[800]} 100%)` },
              },
              sizeMedium: { padding: '8px 20px' },
              sizeSmall:  { padding: '5px 14px', fontSize: '0.8125rem' },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 14,
                boxShadow: mode === 'light'
                  ? '0 2px 8px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04)'
                  : '0 4px 16px rgba(0,0,0,0.4)',
                border: `1px solid ${mode === 'light' ? '#e8edf3' : '#2a2f42'}`,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 14,
                backgroundImage: 'none',
              },
              elevation1: {
                boxShadow: mode === 'light'
                  ? '0 1px 4px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)'
                  : '0 2px 8px rgba(0,0,0,0.4)',
              },
              elevation2: {
                boxShadow: mode === 'light'
                  ? '0 2px 8px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.05)'
                  : '0 4px 16px rgba(0,0,0,0.4)',
              },
              elevation3: {
                boxShadow: mode === 'light'
                  ? '0 4px 16px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.05)'
                  : '0 8px 24px rgba(0,0,0,0.5)',
              },
            },
          },
          MuiTableContainer: {
            styleOverrides: {
              root: { borderRadius: 14, overflow: 'hidden' },
            },
          },
          MuiTable: {
            styleOverrides: {
              root: { borderCollapse: 'separate', borderSpacing: 0 },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {},
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                transition: 'background 0.12s',
                '&:hover': {
                  backgroundColor: mode === 'light'
                    ? alpha(BRAND[600], 0.04)
                    : alpha(BRAND[400], 0.06),
                },
                '&.MuiTableRow-head:hover': { backgroundColor: 'inherit' },
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottom: `1px solid ${mode === 'light' ? '#f0f4f8' : '#23283a'}`,
                padding: '13px 16px',
                fontSize: '0.875rem',
              },
              head: {
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: mode === 'light' ? '#64748b' : '#94a3b8',
                backgroundColor: mode === 'light' ? '#f8fafc' : '#1e2230',
                borderBottom: `2px solid ${mode === 'light' ? '#e2e8f0' : '#2d3348'}`,
                padding: '12px 16px',
                '&:first-of-type': { paddingLeft: 24 },
                '&:last-of-type':  { paddingRight: 24 },
              },
              body: {
                '&:first-of-type': { paddingLeft: 24 },
                '&:last-of-type':  { paddingRight: 24 },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: 8,
              },
              sizeSmall: { height: 24, fontSize: '0.7rem' },
            },
          },
          MuiTextField: {
            defaultProps: { size: 'small' },
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 9,
                  transition: 'box-shadow 0.18s',
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 3px ${alpha(BRAND[500], 0.18)}`,
                  },
                },
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 18,
                boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              indicator: {
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: `linear-gradient(90deg, ${BRAND[500]}, ${BRAND[400]})`,
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                minHeight: 48,
                color: mode === 'light' ? '#64748b' : '#94a3b8',
                '&.Mui-selected': {
                  color: mode === 'light' ? BRAND[700] : BRAND[300],
                },
              },
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                borderRadius: 8,
                fontSize: '0.775rem',
                backgroundColor: mode === 'light' ? '#1e293b' : '#334155',
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: { borderRadius: 10, fontWeight: 500 },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: { borderColor: mode === 'light' ? '#e8edf3' : '#2a2f42' },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: { borderRadius: 10 },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: 9,
                transition: 'background 0.14s, transform 0.1s',
                '&:active': { transform: 'scale(0.9)' },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              outlined: { borderRadius: 9 },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ visibility: mounted ? 'visible' : 'hidden', display: 'contents' }}>
        {children}
      </div>
    </ThemeProvider>
  );
}
