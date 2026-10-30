"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

export default function AdminLoading() {
  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Header bar skeleton */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Skeleton variant="rounded" width={220} height={36} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" width={140} height={36} sx={{ borderRadius: 2 }} />
      </Box>

      {/* KPI Cards skeleton */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2.5,
          mb: 3.5,
        }}
      >
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={96}
            sx={{ borderRadius: 3 }}
          />
        ))}
      </Box>

      {/* Main card / table skeleton */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width={120} height={36} sx={{ borderRadius: 2 }} />
        </Box>
        <Stack spacing={2}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={52}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

