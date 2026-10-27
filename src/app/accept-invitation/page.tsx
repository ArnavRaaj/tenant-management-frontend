"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Link from "next/link";

function AcceptInvitationForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    length: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { showSuccess, showError } = useSnackbar();

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const { password, confirmPassword } = formData;
  const router = useRouter();

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      showError("Passwords do not match!");
      return;
    }
    if (!email || !token) {
      setErrorMsg("Invalid invitation link");
      showError("Invalid invitation link");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    try {
      await api.post("/users/accept-invitation", {
        email,
        token,
        password,
        confirmPassword,
      });
      setIsSuccess(true);
      showSuccess("Password set successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to accept invitation";
      setErrorMsg(msg);
      showError(err, "Failed to accept invitation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const renderCriterion = (isValid: boolean, text: string) => (
    <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
      <CheckCircleOutlineIcon
        sx={{
          fontSize: 16,
          color: isValid ? "success.main" : "text.disabled",
          mr: 1,
        }}
      />
      <Typography
        variant="caption"
        sx={{ color: isValid ? "success.main" : "text.secondary" }}
      >
        {text}
      </Typography>
    </Box>
  );

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          width: "100%",
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: 3,
          border: 1,
          borderColor: "divider",
          transition: "all 0.3s ease",
          position: "relative",
        }}
      >
        {/* Top bar with theme toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button
            component={Link}
            href="/login"
            variant="text"
            size="small"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.85rem",
              textTransform: "none",
              p: 0,
              "&:hover": { color: "text.primary", bgcolor: "transparent" },
            }}
          >
            ← Back to Login
          </Button>
        </Box>

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
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              boxShadow: 2,
            }}
          >
            <VpnKeyOutlinedIcon sx={{ color: "inherit", fontSize: 26 }} />
          </Box>

          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.3px",
            }}
          >
            Set Your Password
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Accepting invitation for {email}
          </Typography>
        </Box>

        {errorMsg && (
          <Alert
            severity="error"
            sx={{ width: "100%", mb: 2, borderRadius: 2 }}
          >
            {errorMsg}
          </Alert>
        )}

        {isSuccess && (
          <Alert
            severity="success"
            sx={{ width: "100%", mb: 2, borderRadius: 2 }}
          >
            Password set successfully! Redirecting to login...
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Create Password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={onChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
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
          />

          <Box
            sx={{
              mt: 1,
              mb: 2,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: "action.hover",
              border: 1,
              borderColor: "divider",
            }}
          >
            {renderCriterion(
              passwordCriteria.lowercase,
              "At least 1 lowercase letter (a...z)",
            )}
            {renderCriterion(
              passwordCriteria.uppercase,
              "At least 1 uppercase letter (A...Z)",
            )}
            {renderCriterion(
              passwordCriteria.number,
              "At least 1 number (0...9)",
            )}
            {renderCriterion(
              passwordCriteria.special,
              "At least 1 special character",
            )}
            {renderCriterion(
              passwordCriteria.length,
              "At least 8 characters in length",
            )}
          </Box>

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            error={confirmPassword !== "" && password !== confirmPassword}
            helperText={
              confirmPassword !== "" && password !== confirmPassword
                ? "Passwords do not match"
                : ""
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={
              isLoading ||
              !isPasswordValid ||
              password !== confirmPassword ||
              isSuccess
            }
            startIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
            sx={{
              mt: 3,
              mb: 2,
              height: 50,
              borderRadius: 2,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {isLoading ? "Setting Password..." : "Set Password"}
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Button
              component={Link}
              href="/login"
              variant="text"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
              }}
            >
              Back to Sign In
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default function AcceptInvitation() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        transition: "background-color 0.3s ease",
        px: 2,
        py: 4,
      }}
    >
      <Suspense fallback={<CircularProgress />}>
        <AcceptInvitationForm />
      </Suspense>
    </Box>
  );
}
