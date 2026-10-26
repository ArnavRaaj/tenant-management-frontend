"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Alert,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Skeleton,
  useTheme,
} from "@mui/material";
import {
  Line,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MONTHS } from "@/constants/date";
import { AppDispatch, RootState } from "@/store/store";
import { fetchDashboardStats } from "@/store/dashboardSlice";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PieChartIcon from "@mui/icons-material/PieChart";
import { useSnackbar } from "@/components/SnackbarProvider";

const PIE_COLORS = ["#3575f0", "#16a34a", "#d97706", "#7c3aed", "#dc2626"];

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color}14 0%, ${color}06 100%)`,
        border: `1px solid ${color}22`,
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "transform 0.15s, box-shadow 0.15s",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2.5,
          flexShrink: 0,
          background: `linear-gradient(135deg, ${color}28, ${color}18)`,
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const muiTheme = useTheme();
  const { showError } = useSnackbar();
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

  useEffect(() => {
    if (isError && message) {
      showError(message);
    }
  }, [isError, message, showError]);

  if (isError) return <Alert severity="error">{message}</Alert>;

  const totalRent = monthlyRentBreakdown.reduce(
    (acc: number, cur: any) => acc + cur.totalRent,
    0,
  );
  const currentMonthTotal = floorRentBreakdown.reduce(
    (acc: number, cur: any) => acc + cur.totalRent,
    0,
  );

  const customTooltipStyle = {
    backgroundColor: muiTheme.palette.background.paper,
    border: `1px solid ${muiTheme.palette.divider}`,
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    fontSize: 13,
  };

  return (
    <Box>
      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Rent collection overview and analytics
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {MONTHS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
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
              {[2024, 2025, 2026, 2027].map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Stat cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 2.5,
          mb: 4,
        }}
      >
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={100}
              sx={{ borderRadius: 3 }}
            />
          ))
        ) : (
          <>
            <StatCard
              label={`${selectedMonth} ${selectedYear} — Floor Total`}
              value={`₹${currentMonthTotal.toLocaleString()}`}
              icon={<AccountBalanceIcon />}
              color="#3575f0"
            />
            <StatCard
              label="All-Time Rent Collected"
              value={`₹${totalRent.toLocaleString()}`}
              icon={<TrendingUpIcon />}
              color="#16a34a"
            />
            <StatCard
              label="Active Months Tracked"
              value={String(monthlyRentBreakdown.length)}
              icon={<PieChartIcon />}
              color="#7c3aed"
            />
          </>
        )}
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Line Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Rent Collection
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={2}
          >
            All-time rent revenue across months
          </Typography>
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              height={280}
              sx={{ borderRadius: 2 }}
            />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={monthlyRentBreakdown}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={muiTheme.palette.divider}
                  vertical={false}
                />
                <XAxis
                  dataKey="monthStr"
                  tick={{ fontSize: 11, fill: muiTheme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: muiTheme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(v: any) => [`₹${v.toLocaleString()}`, "Rent"]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="totalRent"
                  name="Rent (₹)"
                  stroke="#3575f0"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#3575f0" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Paper>

        {/* Pie Chart */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Floor-wise Collection
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={2}
          >
            {selectedMonth} {selectedYear} — rent breakdown by floor
          </Typography>
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              height={280}
              sx={{ borderRadius: 2 }}
            />
          ) : floorRentBreakdown.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 280,
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">
                No data for {selectedMonth} {selectedYear}
              </Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={floorRentBreakdown}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="totalRent"
                  nameKey="floorStr"
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {floorRentBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(v: any) => [`₹${v.toLocaleString()}`, "Rent"]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
