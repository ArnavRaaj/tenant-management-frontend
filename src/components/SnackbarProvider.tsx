"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Snackbar,
  Alert,
  AlertColor,
  Slide,
  SlideProps,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export type SnackbarSeverity = "success" | "error" | "info" | "warning";

export interface SnackbarOptions {
  severity?: SnackbarSeverity;
  duration?: number;
}

export interface SnackbarContextValue {
  showSnackbar: (
    message: string,
    options?: SnackbarOptions | SnackbarSeverity,
  ) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (error: any, fallbackMessage?: string) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(
  undefined,
);

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export const extractErrorMessage = (
  error: any,
  fallback = "An unexpected error occurred. Please try again.",
): string => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.message) return error.message;
  return fallback;
};

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [duration, setDuration] = useState(4500);

  const closeSnackbar = useCallback(() => {
    setOpen(false);
  }, []);

  const showSnackbar = useCallback(
    (message: string, options?: SnackbarOptions | SnackbarSeverity) => {
      let resolvedSeverity: AlertColor = "info";
      let resolvedDuration = 4500;

      if (typeof options === "string") {
        resolvedSeverity = options;
      } else if (options) {
        if (options.severity) resolvedSeverity = options.severity;
        if (options.duration) resolvedDuration = options.duration;
      }

      // Default longer time for error so user can read it
      if (resolvedSeverity === "error" && (!options || typeof options === "string" || !options.duration)) {
        resolvedDuration = 6000;
      }

      setMessage(message);
      setSeverity(resolvedSeverity);
      setDuration(resolvedDuration);
      setOpen(true);
    },
    [],
  );

  const showSuccess = useCallback(
    (msg: string, dur = 4000) => {
      showSnackbar(msg, { severity: "success", duration: dur });
    },
    [showSnackbar],
  );

  const showError = useCallback(
    (err: any, fallback = "Action failed. Please try again.") => {
      const msg = extractErrorMessage(err, fallback);
      showSnackbar(msg, { severity: "error", duration: 6000 });
    },
    [showSnackbar],
  );

  const showInfo = useCallback(
    (msg: string, dur = 4500) => {
      showSnackbar(msg, { severity: "info", duration: dur });
    },
    [showSnackbar],
  );

  const showWarning = useCallback(
    (msg: string, dur = 5000) => {
      showSnackbar(msg, { severity: "warning", duration: dur });
    },
    [showSnackbar],
  );

  const getAlertIcon = () => {
    switch (severity) {
      case "success":
        return <CheckCircleIcon sx={{ fontSize: 22, color: "primary.contrastText" }} />;
      case "error":
        return <ErrorOutlineIcon sx={{ fontSize: 22, color: "primary.contrastText" }} />;
      case "warning":
        return <WarningAmberOutlinedIcon sx={{ fontSize: 22, color: "primary.contrastText" }} />;
      default:
        return <InfoOutlinedIcon sx={{ fontSize: 22, color: "primary.contrastText" }} />;
    }
  };

  const getAlertBg = () => {
    switch (severity) {
      case "success":
        return "linear-gradient(135deg, #059669 0%, #10b981 100%)";
      case "error":
        return "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)";
      case "warning":
        return "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)";
      default:
        return "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)";
    }
  };

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        closeSnackbar,
      }}
    >
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={SlideTransition}
        sx={{
          zIndex: 99999,
          maxWidth: { xs: "90vw", sm: 440 },
          bottom: { xs: 20, sm: 28 },
          right: { xs: 16, sm: 28 },
        }}
      >
        <Alert
          onClose={closeSnackbar}
          icon={getAlertIcon()}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeSnackbar}
              sx={{ color: "primary.contrastText", opacity: 0.85, "&:hover": { opacity: 1 } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{
            width: "100%",
            background: getAlertBg(),
            color: "primary.contrastText",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            border: 1,
            borderColor: "divider",
            p: 1.5,
            alignItems: "center",
            "& .MuiAlert-message": {
              fontSize: "0.885rem",
              fontWeight: 600,
              color: "primary.contrastText",
              lineHeight: 1.45,
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
