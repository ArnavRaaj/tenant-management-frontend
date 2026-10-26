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
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(26,86,232,0.15) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
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
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            minHeight: { md: 620 },
          }}
        >
          {/* ── Left Side: Brand & Showcase ── */}
          <Box
            sx={{
              p: { xs: 4, sm: 5, md: 6 },
              background:
                "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
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
                  <ApartmentIcon sx={{ color: "#fff", fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} color="#fff">
                  TenantAdmin
                </Typography>
              </Box>

              <Chip
                icon={<SecurityOutlinedIcon sx={{ fontSize: "15px !important", color: "#38bdf8 !important" }} />}
                label="Verified Property Management Portal"
                size="small"
                sx={{
                  bgcolor: "rgba(56, 189, 248, 0.1)",
                  color: "#7dd3fc",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  fontWeight: 600,
                  mb: 2.5,
                }}
              />

              <Typography
                variant="h4"
                fontWeight={800}
                color="#ffffff"
                sx={{ lineHeight: 1.25, mb: 2 }}
              >
                Welcome Back to Your{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #60a5fa, #38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Property Center
                </Box>
              </Typography>

              <Typography variant="body2" color="#94a3b8" lineHeight={1.65} sx={{ mb: 4 }}>
                Sign in to manage flats, review active tenant rent ledgers,
                record payments, and delegate operations to your property team.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 18 }} />
                  <Typography variant="body2" color="#cbd5e1">
                    Multi-building flat inventory & vacancy matrix
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 18 }} />
                  <Typography variant="body2" color="#cbd5e1">
                    Encrypted Aadhaar & tenant document vault
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <CheckCircleOutlineIcon sx={{ color: "#10b981", fontSize: 18 }} />
                  <Typography variant="body2" color="#cbd5e1">
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
                bgcolor: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <Rating value={5} readOnly size="small" sx={{ mb: 1 }} />
              <Typography variant="caption" color="#cbd5e1" fontStyle="italic" display="block">
                &ldquo;TenantAdmin automated our monthly rent reconciliations across 4 residential complexes in days.&rdquo;
              </Typography>
              <Typography variant="caption" color="#64748b" fontWeight={600} sx={{ mt: 0.5, display: "block" }}>
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
              bgcolor: "#0f172a",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Button
                variant="text"
                size="small"
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
                Sign In to Portal
              </Typography>
              <Typography variant="body2" color="#94a3b8" sx={{ mt: 0.5 }}>
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
                      <MailOutlineIcon fontSize="small" sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
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
                      <LockOutlinedIcon fontSize="small" sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                        sx={{ color: "#94a3b8" }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
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
                    color: "#60a5fa",
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
                <Typography variant="body2" color="#94a3b8">
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="text"
                    size="small"
                    id="login-create-account-btn"
                    onClick={() => router.push("/signup")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      color: "#60a5fa",
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
