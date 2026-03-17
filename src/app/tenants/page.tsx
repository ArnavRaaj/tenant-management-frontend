'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchTenants } from '@/store/tenantSlice';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';

export default function TenantsOverview() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { tenants, isLoading, isError, message } = useSelector(
    (state: RootState) => state.tenants
  );

  const [rentDialogOpen, setRentDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  
  const [rentData, setRentData] = useState({
    amountPaid: '',
    rentMonth: new Date().toLocaleString('default', { month: 'long' }),
    rentYear: new Date().getFullYear().toString(),
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTenants());
  }, [dispatch]);

  const handleOpenRentDialog = (tenant: any) => {
    setSelectedTenant(tenant);
    setRentData(prev => ({ ...prev, amountPaid: tenant.monthlyRent.toString() }));
    setRentDialogOpen(true);
  };

  const handleCloseRentDialog = () => {
    setRentDialogOpen(false);
    setSelectedTenant(null);
  };

  const handleRentSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post(`/tenants/${selectedTenant._id}/rent`, {
        amountPaid: Number(rentData.amountPaid),
        rentMonth: rentData.rentMonth,
        rentYear: Number(rentData.rentYear)
      });
      dispatch(fetchTenants()); // Refresh to get updated pending balances
      handleCloseRentDialog();
    } catch (error) {
      console.error('Error submitting rent:', error);
      alert('Failed to drop rent record');
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Active Tenants
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="tenants table">
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Flat/Floor</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rent</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Pending</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant: any) => (
              <TableRow key={tenant._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{tenant.name}</Typography>
                  <Typography variant="caption" color="text.secondary">+91 {tenant.aadharNumber.slice(-4)}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`Flat ${tenant.flat?.flatNumber || 'N/A'}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>₹{tenant.monthlyRent}</TableCell>
                <TableCell>
                  {tenant.pendingBalance > 0 ? (
                    <Typography color="error.main" fontWeight="bold">₹{tenant.pendingBalance}</Typography>
                  ) : (
                    <Typography color="success.main">Cleared</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    color="success" 
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenRentDialog(tenant)}
                  >
                    Receive Rent
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => router.push(`/flats/${tenant.flat._id}`)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {tenants.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No active tenants found. Assign a flat first.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Receive Rent Dialog */}
      <Dialog open={rentDialogOpen} onClose={handleCloseRentDialog}>
        <DialogTitle>Receive Rent Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Record rent for <strong>{selectedTenant?.name}</strong> (Flat {selectedTenant?.flat?.flatNumber})
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Amount Received (₹)"
            type="number"
            fullWidth
            variant="outlined"
            value={rentData.amountPaid}
            onChange={(e) => setRentData({...rentData, amountPaid: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Month"
            fullWidth
            variant="outlined"
            value={rentData.rentMonth}
            onChange={(e) => setRentData({...rentData, rentMonth: e.target.value})}
            sx={{ mb: 2 }}
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Year"
            type="number"
            fullWidth
            variant="outlined"
            value={rentData.rentYear}
            onChange={(e) => setRentData({...rentData, rentYear: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRentDialog} color="inherit">Cancel</Button>
          <Button onClick={handleRentSubmit} variant="contained" color="success" disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : 'Save Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
