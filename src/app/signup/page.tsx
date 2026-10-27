"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { register, reset } from "@/store/authSlice";
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
  Chip,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useSnackbar } from "@/components/SnackbarProvider";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showSuccess, showError } = useSnackbar();
  const [passwordCriteria, setPasswordCriteria] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    length: false,
  });

  const { name, email, password, confirmPassword } = formData;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth,
  );
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === "dark";

  useEffect(() => {
    if (isSuccess) {
      showSuccess("Superadmin account registered! Please verify your email with the OTP code.");
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      dispatch(reset());
    } else if (isError && message) {
      showError(message);
    }
  }, [isSuccess, isError, message, router, email, dispatch, showSuccess, showError]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordCriteria({
        lowercase: /[a-z]/.test(value),
        uppercase: /[A-Z]/.test(value),
        number: /\d/.test(value),
        special: /[@$!%*?&]/.test(value),
        length: value.length >= 8,
      });
    }
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      showError("Please enter your work email address.");
      return;
    }
    if (!isPasswordValid) {
      showError("Password does not meet all security requirements.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match!");
      return;
    }
    dispatch(register({ name: name.trim(), email: email.trim(), password }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const renderCriterion = (isValid: boolean, text: string) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
      }}
    >
      {isValid ? (
        <CheckCircleOutlineIcon sx={{ fontSize: 15, color: "success.main" }} />
      ) : (
        <RadioButtonUncheckedIcon sx={{ fontSize: 15, color: "text.disabled" }} />
      )}
      <Typography
        variant="caption"
        sx={{
          color: isValid ? "success.main" : "text.secondary",
          fontWeight: isValid ? 600 : 400,
          fontSize: "0.75rem",
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
        transition: "background-color 0.25s ease",
      }}
    >
      {/* Background radial glow orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "340px", sm: "600px", md: "900px" },
          height: { xs: "280px", sm: "450px" },
          background: isDark
            ? "radial-gradient(circle, rgba(26,86,232,0.18) 0%, rgba(139,92,246,0.1) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.05) 45%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            overflow: "hidden",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            boxShadow: 3,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
            minHeight: { md: 680 },
          }}
        >
          {/* ── Left Side: Brand & Superadmin Tier Showcase ── */}
          <Box
            sx={{
              p: { xs: 4, sm: 5, md: 6 },
              background: isDark
                ? "linear-gradient(135deg, rgba(30, 41, 59, 0.92) 0%, rgba(15, 23, 42, 0.98) 100%)"
                : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderRight: { md: 1 },
              borderColor: { md: "divider" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {/* Logo / Link back to home */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  mb: 3.5,
                }}
                onClick={() => router.push("/")}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #1a56e8, #3b82f6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(26,86,232,0.4)",
                  }}
                >
                  <ApartmentIcon sx={{ color: "primary.contrastText", fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} sx={{ color: "text.primary" }}>
                  TenantAdmin
                </Typography>
              </Box>

              <Chip
                icon={
                  <AdminPanelSettingsOutlinedIcon
                    sx={{ fontSize: "16px !important", color: "primary.main !important" }}
                  />
                }
                label="Default Role: Organization Superadmin"
                size="small"
                sx={{
                  bgcolor: "action.hover",
                  color: "primary.main",
                  border: 1,
                  borderColor: "divider",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  mb: 2.5,
                  px: 0.5,
                }}
              />

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ lineHeight: 1.2, mb: 2, color: "text.primary" }}
              >
                Launch Your Property Management{" "}
                <Box
                  component="span"
                  sx={{
                    background: isDark
                      ? "linear-gradient(135deg, #60a5fa, #38bdf8)"
                      : "linear-gradient(135deg, #1d4ed8, #0284c7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Organization
                </Box>
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.65, mb: 4 }}
              >
                Register as an organization Superadmin to manage unlimited residential
                units, store encrypted Aadhaar KYC, monitor rent cash flows, and delegate
                complex operations to team managers.
              </Typography>

              {/* Value checklist */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <CheckCircleOutlineIcon
                    sx={{ color: "success.main", fontSize: 20, mt: 0.2 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                      Strict Organization Scoping
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Flats, tenants, and revenue ledgers are isolated strictly to your organization.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <CheckCircleOutlineIcon
                    sx={{ color: "success.main", fontSize: 20, mt: 0.2 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                      Encrypted Aadhaar & Document Vault
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Bank-grade AES-256 encryption protects all resident identity papers.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <CheckCircleOutlineIcon
                    sx={{ color: "success.main", fontSize: 20, mt: 0.2 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                      Delegated Admin Invitations
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Invite staff or co-owners to assist with rent collections and move-ins.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <ShieldOutlinedIcon
                    sx={{ color: "info.main", fontSize: 20, mt: 0.2 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ color: "text.primary" }}>
                      Verified Email OTP Security
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Instant 6-digit one-time password code confirms genuine ownership.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Bottom Guarantee Badge */}
            <Box
              sx={{
                mt: 5,
                p: 2.25,
                borderRadius: "14px",
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "success.main",
                  flexShrink: 0,
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 700, display: "block" }}>
                  14-Day Free Evaluation
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Full Superadmin access • No credit card required • Instant OTP activation
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Right Side: Signup Form ── */}
          <Box
            sx={{
              p: { xs: 4, sm: 5, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Button
                variant="text"
                size="small"
                id="signup-back-home-btn"
                startIcon={<ArrowBackIcon fontSize="small" />}
                onClick={() => router.push("/")}
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 600,
                  p: 0,
                  mb: 2,
                  "&:hover": { color: "text.primary", bgcolor: "transparent" },
                }}
              >
                Back to Home
              </Button>

              <Typography variant="h5" fontWeight={800} sx={{ color: "text.primary" }}>
                Create Superadmin Account
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                Enter your details to generate your portfolio and verify your email
              </Typography>
            </Box>

            {isError && (
              <Alert
                severity="error"
                id="signup-error-alert"
                sx={{ width: "100%", mb: 3, borderRadius: 2 }}
              >
                {message}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit} id="signup-form">
              <TextField
                margin="dense"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={onChange}
                placeholder="e.g. Rahul Sharma"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1.5,
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

              <TextField
                margin="dense"
                required
                fullWidth
                id="email"
                label="Work Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
                placeholder="e.g. rahul@propmanagement.com"
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
                  mb: 1.5,
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

              <TextField
                margin="dense"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={onChange}
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
                        onClick={handleTogglePassword}
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
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={onChange}
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
                        onClick={handleToggleConfirmPassword}
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
                id="signup-submit-btn"
                disabled={
                  isLoading || !isPasswordValid || password !== confirmPassword
                }
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
                {isLoading
                  ? "Creating Account..."
                  : "Create Superadmin Account & Verify Email"}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2.5 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Already have an account?{" "}
                  <Button
                    variant="text"
                    size="small"
                    id="signup-to-login-btn"
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
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
