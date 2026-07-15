'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchTenants } from '@/store/tenantSlice';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import {
  Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, CircularProgress, Alert, Button, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  IconButton, Tabs, Tab, Switch, FormControlLabel, Stack, Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HistoryIcon from '@mui/icons-material/History';

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function TenantsOverview() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { tenants, isLoading, isError, message } = useSelector((state: RootState) => state.tenants);

  const [activeTab, setActiveTab] = useState(0);
  const [rentDueOnly, setRentDueOnly] = useState(false);

  // Receive Rent dialog
  const [rentDialogOpen, setRentDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [rentData, setRentData] = useState({
    amountPaid: '',
    rentMonth: new Date().toLocaleString('default', { month: 'long' }),
    rentYear: new Date().getFullYear().toString(),
  });
  const [submitting, setSubmitting] = useState(false);

  // History dialog
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryTenant, setSelectedHistoryTenant] = useState<any>(null);

  const loadTenants = (tab = activeTab, rentDue = rentDueOnly) => {
    if (tab === 0) dispatch(fetchTenants(rentDue ? { rentDue: true } : undefined));
    else dispatch(fetchTenants({ status: 'past' }));
  };

  useEffect(() => { loadTenants(); }, []);// eslint-disable-line

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setRentDueOnly(false);
    if (newValue === 0) dispatch(fetchTenants());
    else dispatch(fetchTenants({ status: 'past' }));
  };

  const handleRentDueToggle = (checked: boolean) => {
    setRentDueOnly(checked);
    dispatch(fetchTenants(checked ? { rentDue: true } : undefined));
  };

  const handleOpenRentDialog = (tenant: any) => {
    setSelectedTenant(tenant);
    setRentData((prev) => ({ ...prev, amountPaid: tenant.monthlyRent.toString() }));
    setRentDialogOpen(true);
  };

  const handleRentSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post(`/tenants/${selectedTenant._id}/rent`, {
        amountPaid: Number(rentData.amountPaid),
        rentMonth: rentData.rentMonth,
        rentYear: Number(rentData.rentYear),
      });
      loadTenants(activeTab, rentDueOnly);
      setRentDialogOpen(false);
    } catch { alert('Failed to record rent payment.'); }
    finally { setSubmitting(false); }
  };

  const handleOpenHistory = async (tenant: any) => {
    setSelectedHistoryTenant(tenant);
    setHistoryDialogOpen(true);
    setHistoryLoading(true);
    try {
      const { data } = await api.get(`/tenants/${tenant._id}/rent`);
      setHistoryData(data);
    } catch { alert('Could not fetch rent history.'); }
    finally { setHistoryLoading(false); }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (isError) return <Alert severity="error">{message}</Alert>;

  const rentDueCount = activeTab === 0 ? tenants.filter((t: any) => t.pendingBalance > 0).length : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">Tenants</Typography>
        {activeTab === 0 && rentDueCount > 0 && (
          <Chip
            icon={<WarningAmberIcon />}
            label={`${rentDueCount} rent due`}
            color="error"
            variant="outlined"
          />
        )}
      </Box>

      {/* Tabs: Active / Past */}
      <Paper elevation={3} sx={{ borderRadius: 3, mb: 0 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Active Tenants" />
          <Tab label={<Stack direction="row" spacing={0.5} alignItems="center"><HistoryIcon fontSize="small" /><span>Past Tenants</span></Stack>} />
        </Tabs>

        {/* Active tab toolbar */}
        {activeTab === 0 && (
          <Box sx={{ px: 3, py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={rentDueOnly}
                  onChange={(e) => handleRentDueToggle(e.target.checked)}
                  color="error"
                />
              }
              label={
                <Typography variant="body2" color={rentDueOnly ? 'error.main' : 'text.secondary'} fontWeight={rentDueOnly ? 'bold' : 'normal'}>
                  Rent Due Only
                </Typography>
              }
            />
            <Typography variant="caption" color="text.secondary">
              {tenants.length} tenant{tenants.length !== 1 ? 's' : ''} shown
            </Typography>
          </Box>
        )}

        <Box sx={{ p: 0 }}>
          {/* ── Active Tenants ── */}
          <TabPanel value={activeTab} index={0}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Flat</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monthly Rent</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Pending Balance</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Since</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenants.map((tenant: any) => (
                    <TableRow key={tenant._id} sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      bgcolor: tenant.pendingBalance > 0 ? 'error.50' : 'inherit',
                    }}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">{tenant.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tenant.contactNumber ? `+91 ${tenant.contactNumber}` : 'No contact'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={`Flat ${tenant.flat?.flatNumber || 'N/A'}`} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>₹{tenant.monthlyRent?.toLocaleString()}</TableCell>
                      <TableCell>
                        {tenant.pendingBalance > 0 ? (
                          <Typography color="error.main" fontWeight="bold">
                            ₹{tenant.pendingBalance.toLocaleString()}
                          </Typography>
                        ) : (
                          <Chip label="Cleared" color="success" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        {tenant.dateOfRenting ? new Date(tenant.dateOfRenting).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View rent history">
                            <IconButton color="info" size="small" onClick={() => handleOpenHistory(tenant)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Button variant="outlined" size="small" color="success" onClick={() => handleOpenRentDialog(tenant)}>
                            Receive Rent
                          </Button>
                          <Button variant="outlined" size="small" onClick={() => router.push(`/flats/${tenant.flat?._id}`)}>
                            Edit
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tenants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                        {rentDueOnly ? 'No tenants with pending balance 🎉' : 'No active tenants found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* ── Past Tenants ── */}
          <TabPanel value={activeTab} index={1}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'grey.700' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Flat</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monthly Rent</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Moved In</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Moved Out</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rent History</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenants.map((tenant: any) => (
                    <TableRow key={tenant._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">{tenant.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tenant.contactNumber ? `+91 ${tenant.contactNumber}` : 'No contact'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={`Flat ${tenant.flat?.flatNumber || 'N/A'}`} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>₹{tenant.monthlyRent?.toLocaleString()}</TableCell>
                      <TableCell>
                        {tenant.dateOfRenting ? new Date(tenant.dateOfRenting).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell>
                        {tenant.vacatedDate ? new Date(tenant.vacatedDate).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View rent history">
                          <IconButton color="info" size="small" onClick={() => handleOpenHistory(tenant)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tenants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                        No past tenants found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
      </Paper>

      {/* ── Receive Rent Dialog ── */}
      <Dialog open={rentDialogOpen} onClose={() => setRentDialogOpen(false)}>
        <DialogTitle>Receive Rent Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Recording rent for <strong>{selectedTenant?.name}</strong> (Flat {selectedTenant?.flat?.flatNumber})
          </Typography>
          <TextField autoFocus margin="dense" label="Amount Received (₹)" type="number" fullWidth variant="outlined"
            value={rentData.amountPaid} onChange={(e) => setRentData({ ...rentData, amountPaid: e.target.value })} sx={{ mb: 2 }} />
          <TextField select margin="dense" label="Month" fullWidth variant="outlined"
            value={rentData.rentMonth} onChange={(e) => setRentData({ ...rentData, rentMonth: e.target.value })} sx={{ mb: 2 }}>
            {MONTHS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
          <TextField margin="dense" label="Year" type="number" fullWidth variant="outlined"
            value={rentData.rentYear} onChange={(e) => setRentData({ ...rentData, rentYear: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRentDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleRentSubmit} variant="contained" color="success" disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : 'Save Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Rent History Dialog ── */}
      <Dialog open={historyDialogOpen} onClose={() => { setHistoryDialogOpen(false); setHistoryData([]); }} maxWidth="md" fullWidth>
        <DialogTitle>Payment History — {selectedHistoryTenant?.name}</DialogTitle>
        <DialogContent dividers>
          {historyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
          ) : historyData.length === 0 ? (
            <Typography align="center" sx={{ p: 4 }} color="text.secondary">No rent history found.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date Received</strong></TableCell>
                    <TableCell><strong>Month / Year</strong></TableCell>
                    <TableCell><strong>Paid (₹)</strong></TableCell>
                    <TableCell><strong>Monthly Rent</strong></TableCell>
                    <TableCell><strong>Balance</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.map((record: any) => {
                    const balance = selectedHistoryTenant?.monthlyRent - record.amountPaid;
                    return (
                      <TableRow key={record._id}>
                        <TableCell>{new Date(record.paymentDate).toLocaleDateString()}</TableCell>
                        <TableCell>{record.rentMonth} {record.rentYear}</TableCell>
                        <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>₹{record.amountPaid}</TableCell>
                        <TableCell>₹{selectedHistoryTenant?.monthlyRent}</TableCell>
                        <TableCell>
                          {balance > 0 ? (
                            <Typography color="error.main" variant="body2" fontWeight="bold">₹{balance} Pending</Typography>
                          ) : balance < 0 ? (
                            <Typography color="success.main" variant="body2" fontWeight="bold">₹{Math.abs(balance)} Extra</Typography>
                          ) : (
                            <Typography color="success.main" variant="body2">Settled</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setHistoryDialogOpen(false); setHistoryData([]); }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
