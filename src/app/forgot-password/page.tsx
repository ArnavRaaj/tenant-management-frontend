"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ApartmentIcon from "@mui/icons-material/Apartment";
import KeyIcon from "@mui/icons-material/Key";
import OTPInput from "react-otp-input";
import { useTheme } from "@mui/material/styles";
import api from "@/services/api";
import { useSnackbar } from "@/components/SnackbarProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const STEPS = ["Enter Email", "Verify & Reset", "Complete"];

export default function ForgotPasswordPage() {
  const theme = useTheme();
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === "dark";

  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // Password complexity checklist
  const [passwordCriteria, setPasswordCriteria] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    length: false,
  });

  // Resend countdown
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeStep === 1 && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [activeStep, countdown]);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setPasswordCriteria({
      lowercase: /[a-z]/.test(val),
      uppercase: /[A-Z]/.test(val),
      number: /\d/.test(val),
      special: /[@$!%*?&]/.test(val),
      length: val.length >= 8,
    });
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  // Step 0: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      const msg = "Please enter your registered email address.";
      setErrorMsg(msg);
      showError(msg);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password/send-otp", {
        email: cleanEmail,
      });
      const msg =
        response.data?.message || `A verification code was sent to ${cleanEmail}`;
      setInfoMsg(msg);
      showSuccess(msg);
      setActiveStep(1);
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send reset code. Please check your email and try again.";
      setErrorMsg(msg);
      showError(err, "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setErrorMsg("");
    setInfoMsg("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const response = await api.post("/auth/forgot-password/send-otp", {
        email: cleanEmail,
      });
      const msg =
        response.data?.message || `A fresh reset code was sent to ${cleanEmail}`;
      setInfoMsg(msg);
      showSuccess(msg);
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend code. Please try again shortly.";
      setErrorMsg(msg);
      showError(err, "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Submit new password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (otp.length !== 6) {
      const msg = "Please enter the 6-digit OTP code sent to your email.";
      setErrorMsg(msg);
      showError(msg);
      return;
    }
    if (!isPasswordValid) {
      const msg = "Password does not meet all security requirements.";
      setErrorMsg(msg);
      showError(msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = "Passwords do not match.";
      setErrorMsg(msg);
      showError(msg);
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const response = await api.post("/auth/forgot-password/reset-password", {
        email: cleanEmail,
        otp,
        newPassword: password,
      });
      const msg =
        response.data?.message ||
        "Password has been reset successfully. You can now log in.";
      setInfoMsg(msg);
      showSuccess(msg);
      setActiveStep(2);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to reset password. The OTP may be incorrect or expired.";
      setErrorMsg(msg);
      showError(err, "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const renderCriterion = (isValid: boolean, text: string) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
      }}
    >
      {isValid ? (
        <CheckCircleOutlineIcon sx={{ fontSize: 14, color: "success.main" }} />
      ) : (
        <RadioButtonUncheckedIcon
          sx={{ fontSize: 14, color: "text.disabled" }}
        />
      )}
      <Typography
        variant="caption"
        sx={{
          color: isValid ? "success.main" : "text.secondary",
          fontSize: "0.75rem",
          fontWeight: isValid ? 600 : 400,
        }}
      >
        {text}
      </Typography>
    </Box>
  );

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
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Background glow orb */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "320px", sm: "600px", md: "800px" },
          height: { xs: "250px", sm: "350px", md: "400px" },
          background: isDark
            ? "radial-gradient(circle, rgba(26,86,232,0.18) 0%, rgba(139,92,246,0.1) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(26,86,232,0.08) 0%, rgba(139,92,246,0.05) 45%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
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
              : "0 20px 40px rgba(15, 23, 42, 0.08)",
            transition: "all 0.3s ease",
          }}
        >
          {/* Header Bar */}
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
              onClick={() => router.push("/login")}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 600,
                p: 0,
                "&:hover": {
                  color: "primary.main",
                  bgcolor: "transparent",
                },
              }}
            >
              Back to Sign In
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
              <Typography
                variant="body2"
                fontWeight={800}
                sx={{ color: "text.primary" }}
              >
                TenantAdmin
              </Typography>
            </Box>
          </Box>

          {/* Stepper */}
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              "& .MuiStepLabel-label": {
                color: "text.secondary",
                fontSize: "0.78rem",
                "&.Mui-active": {
                  color: "primary.main",
                  fontWeight: 700,
                },
                "&.Mui-completed": { color: "success.main", fontWeight: 600 },
              },
              "& .MuiStepIcon-root": {
                color: "action.disabled",
                "&.Mui-active": { color: "primary.main" },
                "&.Mui-completed": { color: "success.main" },
              },
            }}
          >
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Header Icon & Title */}
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
                width: 60,
                height: 60,
                borderRadius: "50%",
                background:
                  activeStep === 2
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #1a56e8, #3575f0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow:
                  activeStep === 2
                    ? "0 4px 20px rgba(16, 185, 129, 0.4)"
                    : "0 4px 20px rgba(26, 86, 232, 0.4)",
              }}
            >
              {activeStep === 2 ? (
                <CheckCircleOutlineIcon sx={{ color: "primary.contrastText", fontSize: 32 }} />
              ) : activeStep === 1 ? (
                <KeyIcon sx={{ color: "primary.contrastText", fontSize: 28 }} />
              ) : (
                <LockResetIcon sx={{ color: "primary.contrastText", fontSize: 30 }} />
              )}
            </Box>

            <Typography
              component="h1"
              variant="h4"
              fontWeight={800}
              sx={{
                color: "text.primary",
                letterSpacing: "-0.5px",
                textAlign: "center",
                fontSize: { xs: "1.6rem", sm: "2.125rem" },
              }}
            >
              {activeStep === 0 && "Forgot Password?"}
              {activeStep === 1 && "Reset Your Password"}
              {activeStep === 2 && "Password Reset Complete"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.75,
                color: "text.secondary",
                textAlign: "center",
                maxWidth: 360,
              }}
            >
              {activeStep === 0 &&
                "Enter your registered email address and we'll send a 6-digit OTP code to verify your identity."}
              {activeStep === 1 && (
                <>
                  Enter the 6-digit OTP sent to{" "}
                  <Box
                    component="span"
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                    }}
                  >
                    {email}
                  </Box>{" "}
                  and your new password.
                </>
              )}
              {activeStep === 2 &&
                "Your password has been securely updated. You can now log into your account."}
            </Typography>
          </Box>

          {/* Alerts */}
          {errorMsg && (
            <Alert
              severity="error"
              id="forgot-password-error-alert"
              sx={{ width: "100%", mb: 3, borderRadius: 2 }}
            >
              {errorMsg}
            </Alert>
          )}

          {infoMsg && activeStep !== 2 && (
            <Alert
              severity="info"
              id="forgot-password-info-alert"
              sx={{ width: "100%", mb: 3, borderRadius: 2 }}
            >
              {infoMsg}
            </Alert>
          )}

          {/* ── STEP 0: Email Input ── */}
          {activeStep === 0 && (
            <Box
              component="form"
              onSubmit={handleRequestOtp}
              id="forgot-password-step0-form"
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    color: "text.primary",
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                id="forgot-password-send-otp-btn"
                disabled={loading || !email.trim()}
                startIcon={
                  loading ? <CircularProgress size={18} color="inherit" /> : undefined
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
                {loading ? "Sending Verification Code..." : "Send Verification Code"}
              </Button>
            </Box>
          )}

          {/* ── STEP 1: OTP & New Password ── */}
          {activeStep === 1 && (
            <Box
              component="form"
              onSubmit={handleResetPassword}
              id="forgot-password-step1-form"
            >
              {/* OTP Entry */}
              <Box sx={{ mb: 2.5, textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ display: "block", mb: 1.5 }}
                >
                  Enter 6-Digit OTP Code
                </Typography>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => <input {...props} />}
                  inputStyle={{
                    width: "min(44px, 11vw)",
                    height: "min(52px, 13vw)",
                    margin: "0 3px",
                    fontSize: "clamp(1.1rem, 3.8vw, 1.4rem)",
                    borderRadius: "10px",
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    textAlign: "center",
                    fontWeight: "700",
                    color: theme.palette.text.primary,
                    outline: "none",
                  }}
                  containerStyle={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </Box>

              {/* Resend Option */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  px: 1,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {!canResend
                    ? `Resend code in ${countdown}s`
                    : "Didn't receive code?"}
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  id="forgot-password-resend-btn"
                  disabled={!canResend || loading}
                  onClick={handleResendOtp}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.8rem",
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
                  Resend Code
                </Button>
              </Box>

              <TextField
                margin="dense"
                required
                fullWidth
                name="password"
                label="New Password"
                type={showPassword ? "text" : "password"}
                id="new-password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                        size="small"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    color: "text.primary",
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />

              {/* Password criteria checklist */}
              <Box
                sx={{
                  bgcolor: "action.hover",
                  p: 1.5,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0.75,
                  mb: 1.5,
                }}
              >
                {renderCriterion(
                  passwordCriteria.lowercase,
                  "Lowercase (a-z)",
                )}
                {renderCriterion(
                  passwordCriteria.uppercase,
                  "Uppercase (A-Z)",
                )}
                {renderCriterion(passwordCriteria.number, "Number (0-9)")}
                {renderCriterion(
                  passwordCriteria.special,
                  "Special (@$!%*?&)",
                )}
                <Box sx={{ gridColumn: "span 2" }}>
                  {renderCriterion(
                    passwordCriteria.length,
                    "At least 8 characters in length",
                  )}
                </Box>
              </Box>

              <TextField
                margin="dense"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword !== "" && password !== confirmPassword}
                helperText={
                  confirmPassword !== "" && password !== confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        edge="end"
                        size="small"
                        sx={{ color: "text.secondary" }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    color: "text.primary",
                    "& fieldset": { borderColor: "divider" },
                    "&:hover fieldset": { borderColor: "primary.main" },
                  },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                id="forgot-password-submit-btn"
                disabled={
                  loading ||
                  otp.length !== 6 ||
                  !isPasswordValid ||
                  password !== confirmPassword
                }
                startIcon={
                  loading ? <CircularProgress size={18} color="inherit" /> : undefined
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
                {loading ? "Resetting Password..." : "Reset Password & Save"}
              </Button>
            </Box>
          )}

          {/* ── STEP 2: Success Confirmation ── */}
          {activeStep === 2 && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Your account password has been updated successfully. You can now
                sign into your portal using your new credentials.
              </Typography>

              <Button
                fullWidth
                variant="contained"
                id="forgot-password-login-btn"
                onClick={() => router.push("/login")}
                sx={{
                  height: 50,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 700,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #059669, #047857)",
                  },
                }}
              >
                Proceed to Sign In
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
