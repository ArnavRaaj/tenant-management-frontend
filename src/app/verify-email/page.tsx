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
import OTPInput from "react-otp-input";
import Link from "next/link";

function VerifyEmailForm() {
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth,
  );

  // Clear any stale isSuccess from the register action on mount
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    // Only navigate when user object is set (verifyEmail sets it, register does not)
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    dispatch(verifyEmail({ email, otp }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          width: "100%",
          borderRadius: "18px",
          boxShadow:
            "0 8px 32px rgba(26,86,232,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid rgba(26,86,232,0.10)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1a56e8, #3575f0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              boxShadow: "0 4px 16px rgba(26,86,232,0.38)",
            }}
          >
            <MarkEmailReadOutlinedIcon sx={{ color: "#fff", fontSize: 26 }} />
          </Box>

          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              letterSpacing: "-0.3px",
            }}
          >
            Verify Your Email
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: "center" }}
          >
            We&apos;ve sent a 6-digit OTP to <br />
            <strong>{email}</strong>
          </Typography>
        </Box>

        {isError && (
          <Alert
            severity="error"
            sx={{ width: "100%", mb: 2, borderRadius: 2 }}
          >
            {message}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ mb: 4, mt: 2 }}>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: "45px",
                height: "55px",
                margin: "0 4px",
                fontSize: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #c4c4c4",
                textAlign: "center",
                fontWeight: "600",
                color: "#333",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              containerStyle={{
                display: "flex",
                justifyContent: "center",
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading || otp.length !== 6}
            sx={{
              mb: 2,
              height: 50,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #1a56e8, #3575f0)",
              boxShadow: "0 4px 16px rgba(26,86,232,0.38)",
              "&:hover": {
                background: "linear-gradient(135deg, #1441d4, #1a56e8)",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Verify Account"
            )}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2">
              <Link
                href="/login"
                style={{
                  color: "#1a56e8",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Back to Sign In
              </Link>
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #eef5ff 0%, #f0f4f8 50%, #e8f4ff 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Suspense fallback={<CircularProgress />}>
        <VerifyEmailForm />
      </Suspense>
    </Box>
  );
}
