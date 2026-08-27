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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Link from "next/link";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  const { name, email, password, confirmPassword } = formData;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isSuccess && message?.includes("verify your email")) {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      dispatch(reset());
    }
  }, [isSuccess, message, router, email, dispatch]);

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
      alert("Passwords do not match!");
      return;
    }
    dispatch(register({ name, email, password }));
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
              <LockOutlinedIcon sx={{ color: "#fff", fontSize: 26 }} />
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
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Signup as a Superadmin
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

          <Box component="form" onSubmit={onSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={onChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={onChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={onChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      size="small"
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

            <Box sx={{ mt: 1, mb: 2, px: 1 }}>
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
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
              disabled={
                isLoading || !isPasswordValid || password !== confirmPassword
              }
              sx={{
                mt: 3,
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
                "Sign Up"
              )}
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  style={{
                    color: "#1a56e8",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
