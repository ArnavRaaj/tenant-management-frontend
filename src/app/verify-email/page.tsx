"use client";

import { useState, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { AppDispatch, RootState } from "@/store/store";
import { verifyEmail, reset } from "@/store/authSlice";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ApartmentIcon from "@mui/icons-material/Apartment";
import OTPInput from "react-otp-input";
import api from "@/services/api";
import { useSnackbar } from "@/components/SnackbarProvider";

function VerifyEmailForm() {
  const theme = useTheme();
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { showSuccess, showError } = useSnackbar();

  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user, isLoading, isError, message } = useSelector(
    (state: RootState) => state.auth,
  );
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === "dark";

  // Clear any stale isSuccess from the register action on mount
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (user) {
      showSuccess("Email verified successfully! Welcome to TenantAdmin.");
      router.push("/admin/dashboard");
    } else if (isError && message) {
      showError(message);
    }
  }, [user, isError, message, router, showSuccess, showError]);

  const handleResendCode = async () => {
    if (!canResend || resending || !email) return;
    setResending(true);
    setResendMessage("");
    setResendError("");

    try {
      const response = await api.post("/auth/resend-verify-email", { email });
      const msg = response.data?.message || "A fresh verification code has been sent.";
      setResendMessage(msg);
      showSuccess(msg);
      setResendCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend code. Please try again.";
      setResendError(msg);
      showError(err, "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      showError("Please enter the complete 6-digit verification code.");
      return;
    }
    dispatch(verifyEmail({ email, otp }));
  };

  return (
    <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, px: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          width: "100%",
          borderRadius: "24px",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          boxShadow: isDark
            ? "0 25px 60px rgba(0, 0, 0, 0.6)"
            : "0 20px 45px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Top bar with back link */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            variant="text"
            size="small"
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => router.push("/signup")}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
              p: 0,
              "&:hover": { color: "primary.main", bgcolor: "transparent" },
            }}
          >
            Back to Signup
          </Button>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #1a56e8, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ApartmentIcon sx={{ color: "primary.contrastText", fontSize: 16 }} />
            </Box>
            <Typography variant="body2" fontWeight={800} sx={{ color: "text.primary" }}>
              TenantAdmin
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3.5,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1a56e8, #38bdf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              boxShadow: "0 8px 24px rgba(26,86,232,0.45)",
            }}
          >
            <MarkEmailReadOutlinedIcon sx={{ color: "primary.contrastText", fontSize: 32 }} />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            fontWeight={800}
            sx={{ letterSpacing: "-0.5px", textAlign: "center", color: "text.primary" }}
          >
            Verify Your Email
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: "text.secondary", textAlign: "center", maxWidth: 360 }}
          >
            We&apos;ve sent a 6-digit OTP code to{" "}
            <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>
              {email || "your email address"}
            </Box>
            . Enter it below to activate your Superadmin workspace.
          </Typography>
        </Box>

        {(isError || resendError) && (
          <Alert
            severity="error"
            id="verify-email-error-alert"
            sx={{ width: "100%", mb: 3, borderRadius: 2 }}
          >
            {resendError || message}
          </Alert>
        )}

        {resendMessage && (
          <Alert
            severity="info"
            id="verify-email-success-alert"
            sx={{ width: "100%", mb: 3, borderRadius: 2 }}
          >
            {resendMessage}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={onSubmit}
          id="verify-email-form"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ mb: 3.5, mt: 1, width: "100%", overflowX: "auto", pb: 0.5 }}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: "min(46px, 11vw)",
                height: "min(54px, 13vw)",
                margin: "0 3px",
                fontSize: "1.35rem",
                borderRadius: "10px",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                textAlign: "center",
                fontWeight: "700",
                color: theme.palette.text.primary,
                outline: "none",
                transition: "all 0.2s ease",
              }}
              containerStyle={{
                display: "flex",
                justifyContent: "center",
              }}
            />
          </Box>

          {/* Resend Section */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              px: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {!canResend
                ? `Resend code in ${resendCountdown}s`
                : "Didn't receive code?"}
            </Typography>
            <Button
              size="small"
              variant="text"
              id="verify-email-resend-btn"
              disabled={!canResend || resending}
              onClick={handleResendCode}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.825rem",
                color: "primary.main",
                p: 0,
                minWidth: 0,
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
                "&.Mui-disabled": {
                  color: "action.disabled",
                },
              }}
            >
              {resending ? "Sending..." : "Resend Code"}
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            id="verify-email-submit-btn"
            disabled={isLoading || otp.length !== 6}
            startIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
            sx={{
              height: 50,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(135deg, #1a56e8, #3575f0)",
              boxShadow: "0 4px 20px rgba(26,86,232,0.45)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #1441d4, #1a56e8)",
                transform: "translateY(-1px)",
              },
              "&.Mui-disabled": {
                background: "action.disabledBackground",
                color: "action.disabled",
              },
            }}
          >
            {isLoading ? "Verifying..." : "Verify & Access Superadmin Workspace"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Already verified?{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => router.push("/login")}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "primary.main",
                  p: 0,
                  "&:hover": {
                    bgcolor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Sign In
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default function VerifyEmail() {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 5 },
        position: "relative",
        transition: "background-color 0.25s ease",
      }}
    >
      {/* Background glow orb */}
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "320px", sm: "700px" },
          height: { xs: "260px", sm: "350px" },
          background: isDark
            ? "radial-gradient(circle, rgba(26,86,232,0.18) 0%, rgba(139,92,246,0.1) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.05) 45%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Suspense fallback={<CircularProgress />}>
        <VerifyEmailForm />
      </Suspense>
    </Box>
  );
}
