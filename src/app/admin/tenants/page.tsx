"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchTenants } from "@/store/tenantSlice";
import { useRouter } from "next/navigation";
import api from "@/services/api";
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
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Stack,
  Tooltip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HistoryIcon from "@mui/icons-material/History";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import EditIcon from "@mui/icons-material/Edit";

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function TenantsOverview() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { tenants, isLoading, isError, message } = useSelector(
    (state: RootState) => state.tenants,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperadmin = user?.role === "superadmin";

  const [activeTab, setActiveTab] = useState(0);
  const [rentDueOnly, setRentDueOnly] = useState(false);

  // Receive Rent dialog
  const [rentDialogOpen, setRentDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [rentData, setRentData] = useState({
    amountPaid: "",
    rentMonth: new Date().toLocaleString("default", { month: "long" }),
    rentYear: new Date().getFullYear().toString(),
  });
  const [submitting, setSubmitting] = useState(false);

  // History dialog
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryTenant, setSelectedHistoryTenant] = useState<any>(null);

  const loadTenants = (tab = activeTab, rentDue = rentDueOnly) => {
    if (tab === 0)
      dispatch(fetchTenants(rentDue ? { rentDue: true } : undefined));
    else dispatch(fetchTenants({ status: "past" }));
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setRentDueOnly(false);
    if (newValue === 0) dispatch(fetchTenants());
    else dispatch(fetchTenants({ status: "past" }));
  };

  const handleRentDueToggle = (checked: boolean) => {
    setRentDueOnly(checked);
    dispatch(fetchTenants(checked ? { rentDue: true } : undefined));
  };

  const handleOpenRentDialog = (tenant: any) => {
    setSelectedTenant(tenant);
    setRentData((prev) => ({
      ...prev,
      amountPaid: tenant.monthlyRent.toString(),
    }));
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
    } catch {
      alert("Failed to record rent payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenHistory = async (tenant: any) => {
    setSelectedHistoryTenant(tenant);
    setHistoryDialogOpen(true);
    setHistoryLoading(true);
    try {
      const { data } = await api.get(`/tenants/${tenant._id}/rent`);
      setHistoryData(data);
    } catch {
      alert("Could not fetch rent history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (isError) return <Alert severity="error">{message}</Alert>;

  const rentDueCount =
    activeTab === 0
      ? tenants.filter((t: any) => t.pendingBalance > 0).length
      : 0;
  const clearedCount =
    activeTab === 0
      ? tenants.filter((t: any) => !t.pendingBalance || t.pendingBalance <= 0)
          .length
      : 0;
  const totalPendingAmount =
    activeTab === 0
      ? tenants.reduce(
          (acc: number, t: any) =>
            acc + (t.pendingBalance > 0 ? t.pendingBalance : 0),
          0,
        )
      : 0;

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Tenants Directory
        </Typography>
        {activeTab === 0 && rentDueCount > 0 && (
          <Chip
            icon={<WarningAmberIcon />}
            label={`${rentDueCount} Tenant${rentDueCount !== 1 ? "s" : ""} Due (₹${totalPendingAmount.toLocaleString()})`}
            color="error"
            variant="filled"
            sx={{ fontWeight: "bold", px: 1, py: 2.5, borderRadius: 2 }}
          />
        )}
      </Box>

      {/* Summary Stats Grid (Only on Active Tab) */}
      {activeTab === 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2.5,
            mb: 4,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderLeft: "6px solid",
              borderColor: "primary.main",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "primary.light",
                display: "flex",
                color: "white",
              }}
            >
              <PeopleAltIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {tenants.length}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Active Tenants
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderLeft: "6px solid",
              borderColor: "success.main",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "success.light",
                display: "flex",
                color: "success.dark",
              }}
            >
              <CheckCircleOutlineIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {clearedCount}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Rent Cleared
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderLeft: "6px solid",
              borderColor: rentDueCount > 0 ? "error.main" : "text.disabled",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: rentDueCount > 0 ? "error.light" : "action.hover",
                display: "flex",
                color: rentDueCount > 0 ? "error.dark" : "text.secondary",
              }}
            >
              <ErrorOutlineIcon fontSize="large" />
            </Box>
            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={rentDueCount > 0 ? "error.main" : "text.primary"}
              >
                ₹{totalPendingAmount.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Total Pending ({rentDueCount} Due)
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Main Container */}
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
        {/* Navigation Tabs */}
        <Box sx={{ bgcolor: "background.paper", px: { xs: 2, md: 3 }, pt: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <PeopleAltIcon fontSize="small" />
                  <span>Active Tenants</span>
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <HistoryIcon fontSize="small" />
                  <span>Past Tenants</span>
                </Stack>
              }
            />
          </Tabs>
        </Box>

        {/* Active Tab Toolbar */}
        {activeTab === 0 && (
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2,
              bgcolor: "background.default",
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={rentDueOnly}
                  onChange={(e) => handleRentDueToggle(e.target.checked)}
                  color="error"
                />
              }
              label={
                <Typography
                  variant="body2"
                  color={rentDueOnly ? "error.main" : "text.primary"}
                  fontWeight={rentDueOnly ? "bold" : "medium"}
                >
                  Filter by Rent Due Only
                </Typography>
              }
            />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Showing <strong>{tenants.length}</strong> tenant
              {tenants.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        )}

        {/* ── Active Tenants Content ── */}
        <TabPanel value={activeTab} index={0}>
          {/* Desktop Table View */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Tenant Details</TableCell>
                    <TableCell>Assigned Flat</TableCell>
                    <TableCell align="right">Monthly Rent</TableCell>
                    <TableCell align="center">Payment Status</TableCell>
                    <TableCell>Move-in Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenants.map((tenant: any) => (
                    <TableRow
                      key={tenant._id}
                      hover
                      sx={{
                        bgcolor:
                          tenant.pendingBalance > 0
                            ? "rgba(220, 38, 38, 0.03)"
                            : "inherit",
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {tenant.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tenant.contactNumber
                            ? `+91 ${tenant.contactNumber}`
                            : "No contact info"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Flat ${tenant.flat?.flatNumber || "N/A"}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{
                            fontWeight: "bold",
                            borderRadius: 1.5,
                            px: 0.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        ₹{tenant.monthlyRent?.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        {tenant.pendingBalance > 0 ? (
                          <Chip
                            label={`₹${tenant.pendingBalance.toLocaleString()} Due`}
                            color="error"
                            size="small"
                            sx={{ fontWeight: "bold" }}
                          />
                        ) : (
                          <Chip
                            icon={
                              <CheckCircleOutlineIcon
                                style={{ fontSize: 16 }}
                              />
                            }
                            label="Cleared"
                            color="success"
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: "bold",
                              bgcolor: "success.light",
                              color: "success.dark",
                              borderColor: "transparent",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell color="text.secondary">
                        {tenant.dateOfRenting
                          ? new Date(tenant.dateOfRenting).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                          alignItems="center"
                        >
                          {isSuperadmin && (
                            <Tooltip title="Receive Rent">
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                startIcon={<PaymentIcon />}
                                onClick={() => handleOpenRentDialog(tenant)}
                                sx={{ px: 2, py: 0.75, borderRadius: 2 }}
                              >
                                Receive Rent
                              </Button>
                            </Tooltip>
                          )}
                          <Tooltip title="View Payment History">
                            <IconButton
                              color="info"
                              size="small"
                              onClick={() => handleOpenHistory(tenant)}
                              sx={{
                                border: "1px solid",
                                borderColor: "info.main",
                                p: 0.8,
                              }}
                            >
                              <HistoryIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Tenant / Flat">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() =>
                                router.push(`/admin/flats/${tenant.flat?._id}`)
                              }
                              sx={{
                                border: "1px solid",
                                borderColor: "primary.main",
                                p: 0.8,
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tenants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          gutterBottom
                        >
                          {rentDueOnly
                            ? "No tenants currently have a pending rent balance 🎉"
                            : "No active tenants found."}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          {rentDueOnly
                            ? "All tenant accounts are up to date!"
                            : "Assign tenants to flats to view them here."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Card View */}
          <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
            <Stack spacing={2.5}>
              {tenants.map((tenant: any) => (
                <Card
                  key={tenant._id}
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    borderLeft: "6px solid",
                    borderColor:
                      tenant.pendingBalance > 0 ? "error.main" : "success.main",
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1.5,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {tenant.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tenant.contactNumber
                            ? `+91 ${tenant.contactNumber}`
                            : "No contact info"}
                        </Typography>
                      </Box>
                      <Chip
                        label={`Flat ${tenant.flat?.flatNumber || "N/A"}`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Monthly Rent:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{tenant.monthlyRent?.toLocaleString()}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Payment Status:
                      </Typography>
                      {tenant.pendingBalance > 0 ? (
                        <Chip
                          label={`₹${tenant.pendingBalance.toLocaleString()} Due`}
                          color="error"
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      ) : (
                        <Chip
                          label="Cleared"
                          color="success"
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
                        />
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Move-in Date:
                      </Typography>
                      <Typography variant="body2">
                        {tenant.dateOfRenting
                          ? new Date(tenant.dateOfRenting).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
                      {isSuperadmin && (
                        <Button
                          fullWidth
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<PaymentIcon />}
                          onClick={() => handleOpenRentDialog(tenant)}
                        >
                          Receive Rent
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        color="info"
                        onClick={() => handleOpenHistory(tenant)}
                      >
                        History
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() =>
                          router.push(`/admin/flats/${tenant.flat?._id}`)
                        }
                      >
                        Edit
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
              {tenants.length === 0 && (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {rentDueOnly
                      ? "No tenants with pending balance 🎉"
                      : "No active tenants found."}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </TabPanel>

        {/* ── Past Tenants Content ── */}
        <TabPanel value={activeTab} index={1}>
          {/* Desktop Table View */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Tenant Details</TableCell>
                    <TableCell>Last Flat</TableCell>
                    <TableCell align="right">Monthly Rent</TableCell>
                    <TableCell>Moved In</TableCell>
                    <TableCell>Moved Out</TableCell>
                    <TableCell align="center">Rent History</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenants.map((tenant: any) => (
                    <TableRow key={tenant._id} hover>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {tenant.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tenant.contactNumber
                            ? `+91 ${tenant.contactNumber}`
                            : "No contact info"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Flat ${tenant.flat?.flatNumber || "N/A"}`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        ₹{tenant.monthlyRent?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {tenant.dateOfRenting
                          ? new Date(tenant.dateOfRenting).toLocaleDateString(
                              "en-IN",
                            )
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {tenant.vacatedDate
                          ? new Date(tenant.vacatedDate).toLocaleDateString(
                              "en-IN",
                            )
                          : "—"}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View rent history">
                          <Button
                            variant="outlined"
                            color="info"
                            size="small"
                            startIcon={<HistoryIcon />}
                            onClick={() => handleOpenHistory(tenant)}
                          >
                            View Records
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tenants.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ py: 6, color: "text.secondary" }}
                      >
                        No past tenants found in historical archives.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Card View for Past Tenants */}
          <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
            <Stack spacing={2}>
              {tenants.map((tenant: any) => (
                <Card key={tenant._id} elevation={2} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {tenant.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tenant.contactNumber
                            ? `+91 ${tenant.contactNumber}`
                            : "No contact info"}
                        </Typography>
                      </Box>
                      <Chip
                        label={`Flat ${tenant.flat?.flatNumber || "N/A"}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Monthly Rent:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{tenant.monthlyRent?.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Tenancy Period:
                      </Typography>
                      <Typography variant="body2">
                        {tenant.dateOfRenting
                          ? new Date(tenant.dateOfRenting).toLocaleDateString()
                          : "—"}{" "}
                        to{" "}
                        {tenant.vacatedDate
                          ? new Date(tenant.vacatedDate).toLocaleDateString()
                          : "—"}
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<HistoryIcon />}
                      onClick={() => handleOpenHistory(tenant)}
                      sx={{ mt: 1.5 }}
                    >
                      View Rent Records
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {tenants.length === 0 && (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    No past tenants found in archives.
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </TabPanel>
      </Paper>

      {/* ── Receive Rent Dialog ── */}
      <Dialog
        open={rentDialogOpen}
        onClose={() => setRentDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, fontWeight: "bold" }}>
          Receive Rent Payment
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{ bgcolor: "background.default", p: 2, borderRadius: 2, mb: 3 }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Tenant Information
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {selectedTenant?.name}
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight={500}>
              Flat {selectedTenant?.flat?.flatNumber} — Monthly Rent: ₹
              {selectedTenant?.monthlyRent?.toLocaleString()}
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Amount Received (₹)"
            type="number"
            fullWidth
            variant="outlined"
            value={rentData.amountPaid}
            onChange={(e) =>
              setRentData({ ...rentData, amountPaid: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              select
              margin="dense"
              label="Month"
              fullWidth
              variant="outlined"
              value={rentData.rentMonth}
              onChange={(e) =>
                setRentData({ ...rentData, rentMonth: e.target.value })
              }
            >
              {MONTHS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
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
              onChange={(e) =>
                setRentData({ ...rentData, rentYear: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRentDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleRentSubmit}
            variant="contained"
            color="success"
            disabled={submitting}
            startIcon={<PaymentIcon />}
            sx={{ px: 3 }}
          >
            {submitting ? <CircularProgress size={20} /> : "Save Payment"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Rent History Dialog ── */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => {
          setHistoryDialogOpen(false);
          setHistoryData([]);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Payment History — {selectedHistoryTenant?.name}
        </DialogTitle>
        <DialogContent dividers>
          {historyLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
              <CircularProgress />
            </Box>
          ) : historyData.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <HistoryIcon
                sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
              />
              <Typography color="text.secondary">
                No recorded rent payment transactions found for this tenant.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date Received</TableCell>
                    <TableCell>Month / Year</TableCell>
                    <TableCell align="right">Paid Amount</TableCell>
                    <TableCell align="right">Monthly Rent</TableCell>
                    <TableCell align="center">Balance Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyData.map((record: any) => {
                    const balance =
                      selectedHistoryTenant?.monthlyRent - record.amountPaid;
                    return (
                      <TableRow key={record._id} hover>
                        <TableCell sx={{ py: 1.5 }}>
                          {new Date(record.paymentDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: "medium" }}>
                          <strong>{record.rentMonth}</strong> {record.rentYear}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ color: "success.main", fontWeight: "bold" }}
                        >
                          ₹{record.amountPaid?.toLocaleString()}
                        </TableCell>
                        <TableCell align="right" color="text.secondary">
                          ₹
                          {selectedHistoryTenant?.monthlyRent?.toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          {balance > 0 ? (
                            <Chip
                              label={`₹${balance.toLocaleString()} Short`}
                              color="error"
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: "bold" }}
                            />
                          ) : balance < 0 ? (
                            <Chip
                              label={`₹${Math.abs(balance).toLocaleString()} Extra`}
                              color="info"
                              size="small"
                              sx={{ fontWeight: "bold" }}
                            />
                          ) : (
                            <Chip
                              label="Settled"
                              color="success"
                              size="small"
                              sx={{ fontWeight: "bold" }}
                            />
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
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => {
              setHistoryDialogOpen(false);
              setHistoryData([]);
            }}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
