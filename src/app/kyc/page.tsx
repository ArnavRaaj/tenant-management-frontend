"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, CircularProgress, Typography, Container, Paper, Alert } from "@mui/material";

function KycQueryRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  React.useEffect(() => {
    if (token) {
      router.replace(`/kyc/${token}`);
    }
  }, [token, router]);

  if (!token) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="xs">
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Verification Token Missing
            </Alert>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Please access this link directly from the onboarding invitation message received on your
              WhatsApp.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        Redirecting to secure verification portal...
      </Typography>
    </Box>
  );
}

export default function KycPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      }
    >
      <KycQueryRedirect />
    </Suspense>
  );
}

