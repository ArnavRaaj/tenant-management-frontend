"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchTenants, markRentPaidLocally } from "@/store/tenantSlice";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useSnackbar } from "@/components/SnackbarProvider";
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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HistoryIcon from "@mui/icons-material/History";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SendIcon from "@mui/icons-material/Send";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PrintIcon from "@mui/icons-material/Print";

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

/** Formats tenant contact numbers safely and masks unexpected ciphertext gracefully */
const formatTenantContact = (contact?: string | null): string => {
  if (!contact) return "No contact info";
  if (contact.includes(":") && contact.length > 20) {
    return "Protected Contact";
  }
  const clean = contact.replace(/\D/g, "");
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return contact.startsWith("+") ? contact : `+91 ${contact}`;
};

/** Extracts valid 10-digit WhatsApp phone number or returns empty string */
const getValidWhatsAppPhone = (contact?: string | null): string => {
  if (!contact || contact.includes(":")) return "";
  const digits = contact.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

export default function TenantsOverview() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { tenants, isLoading, isError, message } = useSelector(
    (state: RootState) => state.tenants,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperadmin = user?.role === "superadmin";
  const { showSuccess, showError } = useSnackbar();

  const [activeTab, setActiveTab] = useState(0);
  const [rentDueOnly, setRentDueOnly] = useState(false);

  // Receive Rent dialog
  const [rentDialogOpen, setRentDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [rentData, setRentData] = useState({
    amountPaid: "",
    rentMonth: new Date().toLocaleString("default", { month: "long" }),
    rentYear: new Date().getFullYear().toString(),
    paymentMode: "CASH",
    referenceId: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [receiptInfo, setReceiptInfo] = useState<any>(null);

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
    const suggested = (tenant.pendingBalance > 0 ? tenant.pendingBalance : tenant.monthlyRent) || 0;
    setRentData({
      amountPaid: suggested.toString(),
      rentMonth: new Date().toLocaleString("default", { month: "long" }),
      rentYear: new Date().getFullYear().toString(),
      paymentMode: "CASH",
      referenceId: "",
      notes: "",
    });
    setRentDialogOpen(true);
  };

  const handleRentSubmit = async () => {
    if (!rentData.amountPaid || isNaN(Number(rentData.amountPaid)) || Number(rentData.amountPaid) <= 0) {
      showError("Please enter a valid payment amount greater than 0.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/tenants/${selectedTenant._id}/rent`, {
        amountPaid: Number(rentData.amountPaid),
        rentMonth: rentData.rentMonth,
        rentYear: Number(rentData.rentYear),
        paymentMode: rentData.paymentMode,
        referenceId: rentData.referenceId,
        notes: rentData.notes,
      });
      // Update Redux state immediately for dynamic instant UI response
      dispatch(
        markRentPaidLocally({
          tenantId: selectedTenant._id,
          amountPaid: Number(rentData.amountPaid),
          rentMonth: rentData.rentMonth,
          rentYear: Number(rentData.rentYear),
          remainingBalance: res.data?.remainingBalance,
        }),
      );

      showSuccess(
        `Rent payment of ₹${Number(rentData.amountPaid).toLocaleString()} recorded for ${selectedTenant?.name || "tenant"}!`,
      );
      loadTenants(activeTab, rentDueOnly);
      setRentDialogOpen(false);

      if (res.data?.receiptNumber) {
        setReceiptInfo({
          ...res.data,
          tenantName: selectedTenant.name,
          flatNumber: selectedTenant.flat?.flatNumber,
          contactNumber: selectedTenant.contactNumber,
        });
        setReceiptDialogOpen(true);
      }
    } catch (err: any) {
      showError(err, "Failed to record rent payment.");
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
    } catch (err: any) {
      showError(err, "Could not fetch rent history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleShareKyc = async (tenant: any) => {
    try {
      const res = await api.get(`/tenants/${tenant._id}/kyc-link`);
      const link = res.data?.kycLink;
      if (link) {
        try {
          if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(link);
            showSuccess("KYC Onboarding link copied to clipboard!");
          }
        } catch {
          // If browser clipboard permissions are denied, proceed without crashing
          showSuccess("Opening WhatsApp KYC invite...");
        }
        const phone = getValidWhatsAppPhone(tenant.contactNumber);
        const text = encodeURIComponent(
          `Welcome ${tenant.name}! Flat ${tenant.flat?.flatNumber || ""} onboarding ke liye bas 1 minute mein KYC complete karein: ${link}`
        );
        if (phone) {
          window.open(`https://wa.me/91${phone}?text=${text}`, "_blank");
        } else {
          window.open(`https://wa.me/?text=${text}`, "_blank");
        }
      }
    } catch (err: any) {
      showError(err, "Failed to generate KYC link");
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
                bgcolor: "action.selected",
                display: "flex",
                color: "primary.main",
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
                bgcolor: "action.hover",
                display: "flex",
                color: "success.main",
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
                bgcolor: rentDueCount > 0 ? "action.selected" : "action.hover",
                display: "flex",
                color: rentDueCount > 0 ? "error.main" : "text.secondary",
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
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
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
          {/* Desktop Responsive Table View */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <TableContainer
              component={Box}
              sx={{
                width: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "divider",
                  borderRadius: 3,
                },
              }}
            >
              <Table
                sx={{
                  minWidth: 840,
                  width: "100%",
                  "& .MuiTableCell-root": {
                    whiteSpace: "nowrap",
                    px: { xs: 1.5, md: 2 },
                    py: 1.75,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 220 }}>Tenant Details</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Assigned Flat</TableCell>
                    <TableCell align="right" sx={{ minWidth: 120 }}>Monthly Rent</TableCell>
                    <TableCell align="center" sx={{ minWidth: 130 }}>Payment Status</TableCell>
                    <TableCell sx={{ minWidth: 120 }}>Move-in Date</TableCell>
                    <TableCell align="right" sx={{ minWidth: 210 }}>Actions</TableCell>
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
                            ? "action.hover"
                            : "inherit",
                      }}
                    >
                      <TableCell sx={{ py: 1.75, minWidth: 220, maxWidth: 280 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.25 }}>
                          <Typography variant="body1" fontWeight="bold" noWrap sx={{ maxWidth: 170 }}>
                            {tenant.name}
                          </Typography>
                          {tenant.kycStatus === "VERIFIED" ? (
                            <Chip
                              size="small"
                              icon={<VerifiedUserIcon style={{ fontSize: 13 }} />}
                              label="KYC Verified"
                              color="success"
                              variant="outlined"
                              sx={{ fontWeight: 600, height: 20, fontSize: "0.68rem" }}
                            />
                          ) : (
                            <Tooltip title="Click to copy & send WhatsApp KYC invite">
                              <Chip
                                size="small"
                                icon={<SendIcon style={{ fontSize: 11 }} />}
                                label="KYC Pending"
                                color="warning"
                                onClick={() => handleShareKyc(tenant)}
                                sx={{
                                  fontWeight: 600,
                                  height: 20,
                                  fontSize: "0.68rem",
                                  cursor: "pointer",
                                  "&:hover": { opacity: 0.85 },
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 240,
                          }}
                        >
                          {formatTenantContact(tenant.contactNumber)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: 100 }}>
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
                      <TableCell align="right" sx={{ fontWeight: 600, minWidth: 120 }}>
                        ₹{tenant.monthlyRent?.toLocaleString()}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 130 }}>
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
                              bgcolor: "action.hover",
                              color: "success.main",
                              borderColor: "transparent",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell color="text.secondary" sx={{ minWidth: 120 }}>
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
                      <TableCell align="right" sx={{ minWidth: 210 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                          alignItems="center"
                          sx={{ flexWrap: "nowrap" }}
                        >
                          {isSuperadmin && (
                            tenant.isCurrentMonthPaid ? (
                              <Tooltip title={`Rent received for ${tenant.lastPaidMonth || "current month"} (Click to record extra/advance payment)`}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="success"
                                  startIcon={<CheckCircleOutlineIcon />}
                                  onClick={() => handleOpenRentDialog(tenant)}
                                  sx={{
                                    whiteSpace: "nowrap",
                                    px: 1.5,
                                    py: 0.75,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    borderColor: "success.main",
                                    bgcolor: (theme) =>
                                      theme.palette.mode === "dark"
                                        ? "rgba(46, 125, 50, 0.15)"
                                        : "rgba(46, 125, 50, 0.08)",
                                    "&:hover": {
                                      bgcolor: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? "rgba(46, 125, 50, 0.25)"
                                          : "rgba(46, 125, 50, 0.15)",
                                    },
                                  }}
                                >
                                  Rent Received
                                </Button>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Receive Rent">
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="success"
                                  startIcon={<PaymentIcon />}
                                  onClick={() => handleOpenRentDialog(tenant)}
                                  sx={{
                                    whiteSpace: "nowrap",
                                    px: 2,
                                    py: 0.75,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                  }}
                                >
                                  Receive Rent
                                </Button>
                              </Tooltip>
                            )
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
                                flexShrink: 0,
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
                                flexShrink: 0,
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

          {/* Mobile & Tablet Card View (Responsive 2-column grid on tablets) */}
          <Box
            sx={{
              display: { xs: "grid", md: "none" },
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
              p: { xs: 1.5, sm: 2 },
            }}
          >
            {tenants.map((tenant: any) => (
              <Card
                key={tenant._id}
                elevation={2}
                sx={{
                  borderRadius: 3,
                  borderLeft: "6px solid",
                  borderColor:
                    tenant.pendingBalance > 0 ? "error.main" : "success.main",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1.5,
                      gap: 1,
                    }}
                  >
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                        <Typography variant="h6" fontWeight="bold" noWrap sx={{ maxWidth: "100%" }}>
                          {tenant.name}
                        </Typography>
                        {tenant.kycStatus === "VERIFIED" ? (
                          <Chip
                            size="small"
                            icon={<VerifiedUserIcon style={{ fontSize: 13 }} />}
                            label="KYC Verified"
                            color="success"
                            variant="outlined"
                            sx={{ fontWeight: 600, height: 20, fontSize: "0.68rem" }}
                          />
                        ) : (
                          <Tooltip title="Click to copy & send WhatsApp KYC invite">
                            <Chip
                              size="small"
                              icon={<SendIcon style={{ fontSize: 11 }} />}
                              label="KYC Pending"
                              color="warning"
                              onClick={() => handleShareKyc(tenant)}
                              sx={{
                                fontWeight: 600,
                                height: 20,
                                fontSize: "0.68rem",
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatTenantContact(tenant.contactNumber)}
                      </Typography>
                    </Box>
                    <Chip
                      label={`Flat ${tenant.flat?.flatNumber || "N/A"}`}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: "bold", flexShrink: 0 }}
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
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Stack direction="row" spacing={1}>
                    {isSuperadmin && (
                      tenant.isCurrentMonthPaid ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleOutlineIcon />}
                          onClick={() => handleOpenRentDialog(tenant)}
                          sx={{
                            whiteSpace: "nowrap",
                            fontWeight: 600,
                            borderColor: "success.main",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(46, 125, 50, 0.15)"
                                : "rgba(46, 125, 50, 0.08)",
                            "&:hover": {
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(46, 125, 50, 0.25)"
                                  : "rgba(46, 125, 50, 0.15)",
                            },
                          }}
                        >
                          Rent Received
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<PaymentIcon />}
                          onClick={() => handleOpenRentDialog(tenant)}
                          sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
                        >
                          Receive Rent
                        </Button>
                      )
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      color="info"
                      onClick={() => handleOpenHistory(tenant)}
                      sx={{ minWidth: 70 }}
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
                      sx={{ minWidth: 60 }}
                    >
                      Edit
                    </Button>
                  </Stack>
                </Box>
              </Card>
            ))}
            {tenants.length === 0 && (
              <Box sx={{ gridColumn: "1 / -1", py: 6, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {rentDueOnly
                    ? "No tenants with pending balance 🎉"
                    : "No active tenants found."}
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* ── Past Tenants Content ── */}
        <TabPanel value={activeTab} index={1}>
          {/* Desktop Responsive Table View */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <TableContainer
              component={Box}
              sx={{
                width: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "divider",
                  borderRadius: 3,
                },
              }}
            >
              <Table
                sx={{
                  minWidth: 800,
                  width: "100%",
                  "& .MuiTableCell-root": {
                    whiteSpace: "nowrap",
                    px: { xs: 1.5, md: 2 },
                    py: 1.75,
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 220 }}>Tenant Details</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Last Flat</TableCell>
                    <TableCell align="right" sx={{ minWidth: 120 }}>Monthly Rent</TableCell>
                    <TableCell sx={{ minWidth: 120 }}>Moved In</TableCell>
                    <TableCell sx={{ minWidth: 120 }}>Moved Out</TableCell>
                    <TableCell align="center" sx={{ minWidth: 160 }}>Rent History</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenants.map((tenant: any) => (
                    <TableRow key={tenant._id} hover>
                      <TableCell sx={{ py: 1.75, minWidth: 220, maxWidth: 280 }}>
                        <Typography variant="body1" fontWeight="medium" noWrap sx={{ maxWidth: 200 }}>
                          {tenant.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 240,
                          }}
                        >
                          {formatTenantContact(tenant.contactNumber)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: 100 }}>
                        <Chip
                          label={`Flat ${tenant.flat?.flatNumber || "N/A"}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, minWidth: 120 }}>
                        ₹{tenant.monthlyRent?.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
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
                      <TableCell sx={{ minWidth: 120 }}>
                        {tenant.vacatedDate
                          ? new Date(tenant.vacatedDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 160 }}>
                        <Tooltip title="View rent history">
                          <Button
                            variant="outlined"
                            color="info"
                            size="small"
                            startIcon={<HistoryIcon />}
                            onClick={() => handleOpenHistory(tenant)}
                            sx={{ whiteSpace: "nowrap", fontWeight: 600 }}
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

          {/* Mobile & Tablet Card View for Past Tenants */}
          <Box
            sx={{
              display: { xs: "grid", md: "none" },
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
              p: { xs: 1.5, sm: 2 },
            }}
          >
            {tenants.map((tenant: any) => (
              <Card
                key={tenant._id}
                elevation={2}
                sx={{
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                      gap: 1,
                    }}
                  >
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" noWrap sx={{ maxWidth: "100%" }}>
                        {tenant.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatTenantContact(tenant.contactNumber)}
                      </Typography>
                    </Box>
                    <Chip
                      label={`Flat ${tenant.flat?.flatNumber || "N/A"}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: "bold", flexShrink: 0 }}
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
                        ? new Date(tenant.dateOfRenting).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}{" "}
                      to{" "}
                      {tenant.vacatedDate
                        ? new Date(tenant.vacatedDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </Typography>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="info"
                    size="small"
                    startIcon={<HistoryIcon />}
                    onClick={() => handleOpenHistory(tenant)}
                    sx={{ fontWeight: 600 }}
                  >
                    View Rent Records
                  </Button>
                </Box>
              </Card>
            ))}
            {tenants.length === 0 && (
              <Box sx={{ gridColumn: "1 / -1", py: 6, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  No past tenants found in archives.
                </Typography>
              </Box>
            )}
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
          {selectedTenant?.isCurrentMonthPaid && (
            <Alert
              severity="success"
              icon={<CheckCircleOutlineIcon fontSize="inherit" />}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              Current month rent ({selectedTenant?.lastPaidMonth || "this month"}) has already been recorded. You can still record an additional or advance payment below.
            </Alert>
          )}
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
          <TextField
            select
            margin="dense"
            label="Payment Mode"
            fullWidth
            variant="outlined"
            value={rentData.paymentMode}
            onChange={(e) =>
              setRentData({ ...rentData, paymentMode: e.target.value })
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="CASH">💵 Cash</MenuItem>
            <MenuItem value="DIRECT_UPI">📱 Direct UPI (GPay / PhonePe / Paytm)</MenuItem>
            <MenuItem value="BANK_TRANSFER">🏦 Bank Transfer / NEFT / IMPS</MenuItem>
            <MenuItem value="CHEQUE">📝 Cheque</MenuItem>
          </TextField>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
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

          <TextField
            margin="dense"
            label="Reference ID / Cheque / UTR (Optional)"
            placeholder="e.g. UTR128947291 or Cheque #00421"
            fullWidth
            variant="outlined"
            value={rentData.referenceId}
            onChange={(e) =>
              setRentData({ ...rentData, referenceId: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Notes / Remarks (Optional)"
            placeholder="e.g. Collected in person"
            fullWidth
            variant="outlined"
            value={rentData.notes}
            onChange={(e) =>
              setRentData({ ...rentData, notes: e.target.value })
            }
          />
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
            startIcon={
              submitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <PaymentIcon />
              )
            }
            sx={{ px: 3, fontWeight: 600 }}
          >
            {submitting ? "Recording Payment..." : "Save Payment"}
          </Button>
        </DialogActions>
      </Dialog>

            {/* ── Auto-Generated Digital Receipt Dialog ── */}
      <Dialog
        open={receiptDialogOpen}
        onClose={() => setReceiptDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle component="div" sx={{ textAlign: "center", pt: 2, pb: 1 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: "50%",
              bgcolor: "success.light",
              color: "success.dark",
              mb: 1,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" component="div" fontWeight="bold">
            Payment Recorded Successfully!
          </Typography>
          <Chip
            icon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
            label={receiptInfo?.receiptNumber || "RECEIPT"}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: "bold", mt: 1 }}
          />
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 1 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: (t) =>
                t.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
            }}
          >
            <Stack spacing={1.2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">Tenant</Typography>
                <Typography variant="body2" fontWeight="bold">{receiptInfo?.tenantName}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">Flat</Typography>
                <Typography variant="body2" fontWeight="bold">Flat {receiptInfo?.flatNumber}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">Amount Paid</Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">
                  ₹{receiptInfo?.amountPaid?.toLocaleString()}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">Payment Mode</Typography>
                <Chip
                  label={receiptInfo?.paymentMode?.replace("_", " ") || "CASH"}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
                />
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">Remaining Balance</Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={receiptInfo?.remainingBalance > 0 ? "error.main" : "success.main"}
                >
                  ₹{receiptInfo?.remainingBalance?.toLocaleString() || "0"}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, flexDirection: "column", gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<WhatsAppIcon />}
            onClick={() => {
              if (receiptInfo?.receiptText) {
                const phone = getValidWhatsAppPhone(receiptInfo.contactNumber);
                const url = phone
                  ? `https://wa.me/91${phone}?text=${encodeURIComponent(receiptInfo.receiptText)}`
                  : `https://wa.me/?text=${encodeURIComponent(receiptInfo.receiptText)}`;
                window.open(url, "_blank");
              }
            }}
            sx={{ fontWeight: "bold", borderRadius: 2 }}
          >
            Share Receipt on WhatsApp
          </Button>

          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{ borderRadius: 2 }}
            >
              Print Slip
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => setReceiptDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Done
            </Button>
          </Stack>
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
                    <TableCell>Mode</TableCell>
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
                        <TableCell>
                          <Chip
                            label={record.paymentMode?.replace("_", " ") || "CASH"}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem", height: 20, fontWeight: 600 }}
                          />
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
