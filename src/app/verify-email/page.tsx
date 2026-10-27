"use client";

import { useState, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
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
    <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3.5, sm: 5 },
          width: "100%",
          borderRadius: "24px",
          bgcolor: "#0f172a",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
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
              color: "#94a3b8",
              textTransform: "none",
              fontWeight: 600,
              p: 0,
              "&:hover": { color: "#ffffff", bgcolor: "transparent" },
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
              <ApartmentIcon sx={{ color: "#fff", fontSize: 16 }} />
            </Box>
            <Typography variant="body2" fontWeight={800} color="#fff">
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
            <MarkEmailReadOutlinedIcon sx={{ color: "#fff", fontSize: 32 }} />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            fontWeight={800}
            color="#ffffff"
            sx={{ letterSpacing: "-0.5px", textAlign: "center" }}
          >
            Verify Your Email
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: "#94a3b8", textAlign: "center", maxWidth: 360 }}
          >
            We&apos;ve sent a 6-digit OTP code to{" "}
            <Box component="span" sx={{ color: "#60a5fa", fontWeight: 700 }}>
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
          <Box sx={{ mb: 3.5, mt: 1 }}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: "48px",
                height: "56px",
                margin: "0 6px",
                fontSize: "1.5rem",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                textAlign: "center",
                fontWeight: "700",
                color: "#ffffff",
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
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
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
                color: "#60a5fa",
                p: 0,
                minWidth: 0,
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
                "&.Mui-disabled": {
                  color: "#64748b",
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
                background: "rgba(255, 255, 255, 0.12)",
                color: "rgba(255, 255, 255, 0.35)",
              },
            }}
            startIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {isLoading
              ? "Verifying Account..."
              : "Verify Account & Access Dashboard"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Back to{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => router.push("/login")}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#60a5fa",
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
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#070b14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 5 },
        position: "relative",
      }}
    >
      {/* Background glow orb */}
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "350px",
          background:
            "radial-gradient(circle, rgba(26,86,232,0.18) 0%, rgba(139,92,246,0.1) 45%, transparent 70%)",
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
