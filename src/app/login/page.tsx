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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      // You could use a toast here
    }

    if (isSuccess || user) {
      router.push("/dashboard");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, router, dispatch]);

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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #eef5ff 0%, #f0f4f8 50%, #e8f4ff 100%)",
        px: 2,
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
            transition: "box-shadow 0.25s",
            "&:hover": {
              boxShadow:
                "0 16px 48px rgba(26,86,232,0.18), 0 4px 12px rgba(0,0,0,0.08)",
            },
          }}
        >
          {/* Header icon */}
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
              Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Tenant Management System
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={password}
              onChange={onChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 1,
                height: 50,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #1a56e8, #3575f0)",
                boxShadow: "0 4px 16px rgba(26,86,232,0.38)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #1441d4, #1a56e8)",
                  boxShadow: "0 6px 22px rgba(26,86,232,0.48)",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
