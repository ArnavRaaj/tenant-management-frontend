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

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  useEffect(() => {
    if (isSuccess) {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      dispatch(reset());
    }
  }, [isSuccess, router, email, dispatch]);

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
    if (!isPasswordValid) return;
    if (password !== confirmPassword) {
      return;
    }
    dispatch(register({ name, email, password }));
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
        <CheckCircleOutlineIcon sx={{ fontSize: 15, color: "#10b981" }} />
      ) : (
        <RadioButtonUncheckedIcon sx={{ fontSize: 15, color: "#64748b" }} />
      )}
      <Typography
        variant="caption"
        sx={{
          color: isValid ? "#86efac" : "#94a3b8",
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
        bgcolor: "#070b14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3, md: 5 },
        position: "relative",
      }}
    >
      {/* Background radial glow orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px",
          height: "450px",
          background:
            "radial-gradient(circle, rgba(26,86,232,0.18) 0%, rgba(139,92,246,0.1) 45%, transparent 70%)",
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
            bgcolor: "#0f172a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
            minHeight: { md: 680 },
          }}
        >
          {/* ── Left Side: Brand & Superadmin Tier Showcase ── */}
          <Box
            sx={{
              p: { xs: 4, sm: 5, md: 6 },
              background:
                "linear-gradient(135deg, rgba(30, 41, 59, 0.92) 0%, rgba(15, 23, 42, 0.98) 100%)",
              borderRight: { md: "1px solid rgba(255, 255, 255, 0.08)" },
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
                  <ApartmentIcon sx={{ color: "#fff", fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} color="#fff">
                  TenantAdmin
                </Typography>
              </Box>

              <Chip
                icon={
                  <AdminPanelSettingsOutlinedIcon
                    sx={{ fontSize: "16px !important", color: "#60a5fa !important" }}
                  />
                }
                label="Default Role: Organization Superadmin"
                size="small"
                sx={{
                  bgcolor: "rgba(59, 130, 246, 0.15)",
                  color: "#93c5fd",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  mb: 2.5,
                  px: 0.5,
                }}
              />

              <Typography
                variant="h4"
                fontWeight={800}
                color="#ffffff"
                sx={{ lineHeight: 1.2, mb: 2 }}
              >
                Launch Your Property Management{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #60a5fa, #38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Organization
                </Box>
              </Typography>

              <Typography
                variant="body2"
                color="#94a3b8"
                lineHeight={1.65}
                sx={{ mb: 4 }}
              >
                Register as an organization Superadmin to manage unlimited residential
                units, store encrypted Aadhaar KYC, monitor rent cash flows, and delegate
                complex operations to team managers.
              </Typography>

              {/* Value checklist */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <CheckCircleOutlineIcon
                    sx={{ color: "#10b981", fontSize: 20, mt: 0.2 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="#f1f5f9">
                      Strict Organization Scoping
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      Flats, tenants, and revenue ledgers are isolated strictly to your organization.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <CheckCircleOutlineIcon
                    sx={{ color: "#10b981", fontSize: 20, mt: 0.2 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="#f1f5f9">
                      Encrypted Aadhaar & Document Vault
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      Bank-grade AES-256 encryption protects all resident identity papers.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <CheckCircleOutlineIcon
                    sx={{ color: "#10b981", fontSize: 20, mt: 0.2 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="#f1f5f9">
                      Delegated Admin Invitations
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      Invite staff or co-owners to assist with rent collections and move-ins.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <ShieldOutlinedIcon
                    sx={{ color: "#38bdf8", fontSize: 20, mt: 0.2 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="#f1f5f9">
                      Verified Email OTP Security
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
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
                bgcolor: "rgba(15, 23, 42, 0.65)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
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
                  bgcolor: "rgba(16, 185, 129, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10b981",
                  flexShrink: 0,
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="#f1f5f9" fontWeight={700} display="block">
                  14-Day Free Evaluation
                </Typography>
                <Typography variant="caption" color="#64748b">
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
              bgcolor: "#0f172a",
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
                  color: "#94a3b8",
                  textTransform: "none",
                  fontWeight: 600,
                  p: 0,
                  mb: 2,
                  "&:hover": { color: "#ffffff", bgcolor: "transparent" },
                }}
              >
                Back to Home
              </Button>

              <Typography variant="h5" fontWeight={800} color="#ffffff">
                Create Superadmin Account
              </Typography>
              <Typography variant="body2" color="#94a3b8" sx={{ mt: 0.5 }}>
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
                        sx={{ color: "#64748b" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    color: "#ffffff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": { color: "#94a3b8" },
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
                        sx={{ color: "#64748b" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    color: "#ffffff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": { color: "#94a3b8" },
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
                        sx={{ color: "#64748b" }}
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
                        sx={{ color: "#94a3b8" }}
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
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    color: "#ffffff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": { color: "#94a3b8" },
                }}
              />

              {/* Password criteria checklist */}
              <Box
                sx={{
                  bgcolor: "rgba(15, 23, 42, 0.6)",
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.06)",
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
                        sx={{ color: "#64748b" }}
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
                        sx={{ color: "#94a3b8" }}
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
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    color: "#ffffff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": { color: "#94a3b8" },
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
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Superadmin Account & Verify Email"
                )}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2.5 }}>
                <Typography variant="body2" color="#94a3b8">
                  Already have an account?{" "}
                  <Button
                    variant="text"
                    size="small"
                    id="signup-to-login-btn"
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
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
