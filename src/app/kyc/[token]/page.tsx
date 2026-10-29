"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { useSnackbar } from "@/components/SnackbarProvider";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SecurityIcon from "@mui/icons-material/Security";
import RefreshIcon from "@mui/icons-material/Refresh";

interface KycInfo {
  tenantName: string;
  flatNumber: string;
  floor: number | null;
  buildingName: string;
  kycStatus: string;
  isExpired: boolean;
}

export default function TenantKycPage() {
  const params = useParams();
  const token = (params?.token as string) || "";
  const { showSuccess, showError } = useSnackbar();

  // Page state
  const [loading, setLoading] = useState(true);
  const [kycInfo, setKycInfo] = useState<KycInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Step state: 1 = Aadhaar Input, 2 = OTP Input, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form inputs
  const [aadharNumber, setAadharNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [clientId, setClientId] = useState("");
  const [otpSentTo, setOtpSentTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verifiedData, setVerifiedData] = useState<any>(null);

  // Fetch token info on load
  useEffect(() => {
    if (!token) {
      setErrorMsg("No verification token provided. Please check the link from WhatsApp.");
      setLoading(false);
      return;
    }

    const fetchKycInfo = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/kyc/info/${token}`);
        if (res.data?.success && res.data?.data) {
          setKycInfo(res.data.data);
          if (res.data.data.kycStatus === "VERIFIED") {
            setStep(3);
            setVerifiedData({
              tenantName: res.data.data.tenantName,
              flatNumber: res.data.data.flatNumber,
              buildingName: res.data.data.buildingName,
              maskedAadhar: "Verified via Aadhaar",
            });
          }
        }
      } catch (err: any) {
        const msg =
          err.response?.data?.message ||
          "This verification link is invalid, has expired, or has already been used.";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchKycInfo();
  }, [token]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Format Aadhaar with spaces: "1234 5678 9012"
  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setAadharNumber(formatted);
  };

  // Step 1: Request Aadhaar OTP
  const handleGenerateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = aadharNumber.replace(/\s+/g, "");
    if (clean.length !== 12) {
      showError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await api.post("/kyc/generate-otp", {
        token,
        aadharNumber: clean,
      });

      if (res.data?.success) {
        setClientId(res.data.clientId);
        setOtpSentTo(res.data.otpSentTo || "your Aadhaar-linked mobile");
        setStep(2);
        setCountdown(60);
        showSuccess(res.data.message || "OTP sent successfully!");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to generate Aadhaar OTP";
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Submit OTP
  const handleSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      showError("Please enter the 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await api.post("/kyc/submit-otp", {
        token,
        otp: cleanOtp,
        clientId,
      });

      if (res.data?.success) {
        setVerifiedData(res.data.verifiedData);
        setStep(3);
        showSuccess("Aadhaar KYC verified successfully!");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid OTP. Please check and retry.";
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    const clean = aadharNumber.replace(/\s+/g, "");
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await api.post("/kyc/generate-otp", {
        token,
        aadharNumber: clean,
      });
      if (res.data?.success) {
        setClientId(res.data.clientId);
        setCountdown(60);
        setOtp("");
        showSuccess("New OTP sent to registered mobile");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to resend OTP";
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={44} thickness={4} />
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Verifying secure onboarding link...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 3, sm: 6 },
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs" sx={{ p: 0 }}>
        {/* Brand Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 54,
              height: 54,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              mb: 1.5,
              boxShadow: "0 6px 16px rgba(25, 118, 210, 0.25)",
            }}
          >
            <VerifiedUserIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
            Digital Tenant Onboarding
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Official UIDAI / DigiLocker Identity Verification
          </Typography>
        </Box>

        {/* Global Error Banner */}
        {errorMsg && step !== 3 && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Main Card */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            bgcolor: "background.paper",
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          {/* Tenant Details Banner (if available) */}
          {kycInfo && (
            <Box
              sx={{
                p: 1.75,
                mb: 3,
                borderRadius: 2,
                bgcolor: (t) =>
                  t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(25, 118, 210, 0.05)",
                border: (t) =>
                  `1px solid ${
                    t.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(25, 118, 210, 0.15)"
                  }`,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <PersonOutlineIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Welcome, {kycInfo.tenantName}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ApartmentIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Flat {kycInfo.flatNumber} • {kycInfo.buildingName}
                </Typography>
              </Stack>
            </Box>
          )}

          {/* STEP 1: Aadhaar Input */}
          {step === 1 && (
            <form onSubmit={handleGenerateOtp}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Enter Aadhaar Number
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
                Enter your 12-digit Aadhaar number to receive a one-time password (OTP) on your
                UIDAI-registered mobile.
              </Typography>

              <TextField
                fullWidth
                label="Aadhaar Number"
                placeholder="XXXX XXXX XXXX"
                value={aadharNumber}
                onChange={handleAadharChange}
                inputProps={{
                  inputMode: "numeric",
                  maxLength: 14, // 12 digits + 2 spaces
                  style: { letterSpacing: 2, fontSize: "1.1rem", fontWeight: 600 },
                }}
                disabled={isSubmitting}
                autoFocus
                sx={{ mb: 2 }}
              />

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                <LockOutlinedIcon sx={{ fontSize: 16, color: "success.main" }} />
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  First 8 digits are masked automatically for privacy & UIDAI compliance.
                </Typography>
              </Stack>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting || aadharNumber.replace(/\s+/g, "").length !== 12}
                sx={{
                  py: 1.25,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Aadhaar OTP"
                )}
              </Button>
            </form>
          )}

          {/* STEP 2: OTP Input */}
          {step === 2 && (
            <form onSubmit={handleSubmitOtp}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Verify Mobile OTP
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                Enter the 6-digit OTP sent to {otpSentTo}.
              </Typography>

              <TextField
                fullWidth
                label="6-Digit OTP"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputProps={{
                  inputMode: "numeric",
                  maxLength: 6,
                  style: {
                    letterSpacing: 8,
                    textAlign: "center",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                  },
                }}
                disabled={isSubmitting}
                autoFocus
                sx={{ mb: 2.5 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting || otp.trim().length !== 6}
                sx={{
                  py: 1.25,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "1rem",
                  mb: 2,
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Verify & Complete KYC"
                )}
              </Button>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pt: 1,
                }}
              >
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  sx={{ textTransform: "none" }}
                >
                  Change Aadhaar
                </Button>

                <Button
                  size="small"
                  variant="text"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isSubmitting}
                  startIcon={countdown === 0 ? <RefreshIcon /> : undefined}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </Button>
              </Box>
            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <Box sx={{ textAlign: "center", py: 1 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  bgcolor: "success.light",
                  color: "success.dark",
                  mb: 2,
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 44 }} />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "success.main" }}>
                KYC Completed!
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                Your identity has been verified successfully. Welcome to your new home!
              </Typography>

              {verifiedData && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    textAlign: "left",
                    bgcolor: (t) =>
                      t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                  }}
                >
                  <Stack spacing={1.2}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Tenant Name
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {verifiedData.tenantName}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Assigned Flat
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Flat {verifiedData.flatNumber} ({verifiedData.buildingName})
                      </Typography>
                    </Box>

                    <Divider />

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Aadhaar ID
                      </Typography>
                      <Chip
                        label={verifiedData.maskedAadhar}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600, height: 22 }}
                      />
                    </Box>
                  </Stack>
                </Paper>
              )}

              <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                Your property manager has received your verified confirmation. You can now close this
                window.
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Security Trust Footer */}
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 3, color: "text.secondary" }}
        >
          <SecurityIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
            256-Bit SSL Encrypted • Compliant with UIDAI Aadhaar Act 2016
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

