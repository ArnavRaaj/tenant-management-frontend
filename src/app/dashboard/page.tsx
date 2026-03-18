"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  FormControl,
  CircularProgress,
} from "@mui/material";
import {
  Pie,
  Cell,
  Line,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  PieChart,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { MONTHS } from "@/constants/date";
import { AppDispatch, RootState } from "@/store/store";
import { fetchDashboardStats } from "@/store/dashboardSlice";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    monthlyRentBreakdown,
    floorRentBreakdown,
    isLoading,
    isError,
    message,
  } = useSelector((state: RootState) => state.dashboard);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" }),
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(fetchDashboardStats({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{message}</Alert>;
  }

  // Calculate total monthly rent received across all months
  const totalRent = monthlyRentBreakdown.reduce(
    (acc: number, curr: any) => acc + curr.totalRent,
    0,
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Dashboard
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {MONTHS.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Box>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <Typography variant="h6">{selectedMonth} Rent Collected</Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1 }}>
              ₹{totalRent.toLocaleString()}
            </Typography>
          </Paper>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        <Box>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              {selectedMonth} Rent Collection
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={monthlyRentBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthStr" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalRent"
                  name="Rent (₹)"
                  stroke="#1976d2"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Box>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Rent by Floor ({selectedMonth})
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={floorRentBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="totalRent"
                  nameKey="floorStr"
                  label={(entry: any) => `${entry.floorStr}: ₹${entry.value}`}
                >
                  {floorRentBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₹${value}`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
