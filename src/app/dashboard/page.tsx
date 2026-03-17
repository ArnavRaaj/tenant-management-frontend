'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchDashboardStats } from '@/store/dashboardSlice';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    monthlyRentBreakdown,
    floorRentBreakdown,
    isLoading,
    isError,
    message
  } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{message}</Alert>;
  }

  // Calculate total monthly rent received across all months
  const totalRent = monthlyRentBreakdown.reduce((acc: number, curr: any) => acc + curr.totalRent, 0);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Box>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">Total Rent Collected</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
              ₹{totalRent.toLocaleString()}
            </Typography>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Box>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Rent Collection
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={monthlyRentBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthStr" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalRent" name="Rent (₹)" stroke="#1976d2" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Box>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Rent by Floor
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={floorRentBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="floorStr" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalRent" name="Rent (₹)" fill="#dc004e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
