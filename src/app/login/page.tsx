"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { login, reset } from "@/store/authSlice";
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
  Rating,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { useSnackbar } from "@/components/SnackbarProvider";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { showSuccess, showError } = useSnackbar();

  const { email, password } = formData;

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth,
  );
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === "dark";

  useEffect(() => {
    if (isSuccess || user) {
      showSuccess("Welcome back! Signed in successfully.");
      router.push("/admin/dashboard");
    } else if (isError && message) {
      showError(message);
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, router, dispatch, showSuccess, showError]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

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
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "340px", sm: "600px", md: "800px" },
          height: { xs: "280px", sm: "400px" },
          background: isDark
            ? "radial-gradient(circle, rgba(26,86,232,0.15) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)"
            : "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.05) 50%, transparent 70%)",
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
            boxShadow: isDark
              ? "0 25px 60px rgba(0, 0, 0, 0.6)"
              : "0 20px 45px rgba(0, 0, 0, 0.06)",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            minHeight: { md: 620 },
          }}
        >
          {/* ── Left Side: Brand & Showcase ── */}
          <Box
            sx={{
              p: { xs: 4, sm: 5, md: 6 },
              background: isDark
                ? "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)"
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
                  mb: 4,
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
                icon={<SecurityOutlinedIcon sx={{ fontSize: "15px !important", color: "info.main !important" }} />}
                label="Verified Property Management Portal"
                size="small"
                sx={{
                  bgcolor: "action.hover",
                  color: "info.main",
                  border: 1,
                  borderColor: "divider",
                  fontWeight: 600,
                  mb: 2.5,
                }}
              />

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ lineHeight: 1.25, mb: 2, color: "text.primary" }}
              >
                Welcome Back to Your{" "}
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
                  Property Center
                </Box>
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.65, mb: 4 }}
              >
                Sign in to manage flats, review active tenant rent ledgers,
                record payments, and delegate operations to your property team.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <CheckCircleOutlineIcon sx={{ color: "success.main", fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    Multi-building flat inventory & vacancy matrix
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <CheckCircleOutlineIcon sx={{ color: "success.main", fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    Encrypted Aadhaar & tenant document vault
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <CheckCircleOutlineIcon sx={{ color: "success.main", fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    Real-time monthly rent collection analytics
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Testimonial Quote */}
            <Box
              sx={{
                mt: 5,
                p: 2.5,
                borderRadius: "14px",
                bgcolor: "action.hover",
                border: 1,
                borderColor: "divider",
              }}
            >
              <Rating value={5} readOnly size="small" sx={{ mb: 1 }} />
              <Typography
                variant="caption"
                sx={{ color: "text.primary", fontStyle: "italic", display: "block" }}
              >
                &ldquo;TenantAdmin automated our monthly rent reconciliations across 4 residential complexes in days.&rdquo;
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, mt: 0.5, display: "block" }}>
                — Rajesh S., Senior Property Manager
              </Typography>
            </Box>
          </Box>

          {/* ── Right Side: Login Form ── */}
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
                startIcon={<ArrowBackIcon fontSize="small" />}
                onClick={() => router.push("/")}
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 600,
                  p: 0,
                  mb: 2,
                  "&:hover": { color: "primary.main", bgcolor: "transparent" },
                }}
              >
                Back to Home
              </Button>

              <Typography variant="h5" fontWeight={800} sx={{ color: "text.primary" }}>
                Sign In to Portal
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                Enter your verified credentials to access your organization
              </Typography>
            </Box>

            {isError && (
              <Alert
                severity="error"
                id="login-error-alert"
                sx={{ width: "100%", mb: 3, borderRadius: 2 }}
              >
                {message}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit} id="login-form">
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
                onChange={onChange}
                placeholder="you@domain.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
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
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
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

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, mb: 1.5 }}>
                <Button
                  variant="text"
                  size="small"
                  id="forgot-password-link"
                  onClick={() => router.push("/forgot-password")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.825rem",
                    color: "primary.main",
                    p: 0,
                    minWidth: 0,
                    "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                  }}
                >
                  Forgot your password?
                </Button>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                id="login-submit-btn"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
                sx={{
                  mt: 1,
                  mb: 2,
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
                }}
              >
                {isLoading ? "Signing In to Dashboard..." : "Sign In to Dashboard"}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="text"
                    size="small"
                    id="login-create-account-btn"
                    onClick={() => router.push("/signup")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      color: "primary.main",
                      p: 0,
                      "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                    }}
                  >
                    Register as Superadmin
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
