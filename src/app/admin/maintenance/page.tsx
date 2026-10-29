"use client";

import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { useSnackbar } from "@/components/SnackbarProvider";
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
  Stack,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import AddIcon from "@mui/icons-material/Add";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import HandymanIcon from "@mui/icons-material/Handyman";
import KitchenIcon from "@mui/icons-material/Kitchen";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";

const CATEGORIES = [
  "ALL",
  "PLUMBING",
  "ELECTRICAL",
  "CARPENTRY",
  "APPLIANCE",
  "CIVIL",
  "OTHER",
];

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case "PLUMBING":
      return <PlumbingIcon sx={{ fontSize: 16 }} />;
    case "ELECTRICAL":
      return <ElectricalServicesIcon sx={{ fontSize: 16 }} />;
    case "CARPENTRY":
      return <HandymanIcon sx={{ fontSize: 16 }} />;
    case "APPLIANCE":
      return <KitchenIcon sx={{ fontSize: 16 }} />;
    default:
      return <HomeRepairServiceIcon sx={{ fontSize: 16 }} />;
  }
};

const getUrgencyChip = (urgency: string) => {
  switch (urgency) {
    case "EMERGENCY":
      return (
        <Chip
          size="small"
          label="EMERGENCY"
          color="error"
          sx={{ fontWeight: "bold", fontSize: "0.7rem", height: 22 }}
        />
      );
    case "HIGH":
      return (
        <Chip
          size="small"
          label="HIGH PRIORITY"
          color="warning"
          sx={{ fontWeight: "bold", fontSize: "0.7rem", height: 22 }}
        />
      );
    case "LOW":
      return (
        <Chip
          size="small"
          label="LOW"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22 }}
        />
      );
    default:
      return (
        <Chip
          size="small"
          label="NORMAL"
          color="info"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22 }}
        />
      );
  }
};

const getStatusChip = (status: string) => {
  switch (status) {
    case "OPEN":
      return (
        <Chip
          size="small"
          label="Action Needed"
          color="error"
          variant="filled"
          sx={{ fontWeight: "bold", fontSize: "0.72rem" }}
        />
      );
    case "IN_PROGRESS":
      return (
        <Chip
          size="small"
          label="In Progress"
          color="info"
          variant="filled"
          sx={{ fontWeight: "bold", fontSize: "0.72rem" }}
        />
      );
    case "RESOLVED":
      return (
        <Chip
          size="small"
          label="Resolved"
          color="success"
          variant="filled"
          sx={{ fontWeight: "bold", fontSize: "0.72rem" }}
        />
      );
    default:
      return (
        <Chip
          size="small"
          label="Closed"
          variant="outlined"
          sx={{ fontWeight: "bold", fontSize: "0.72rem" }}
        />
      );
  }
};

export default function MaintenancePage() {
  const { showSuccess, showError } = useSnackbar();

  // Data states
  const [tickets, setTickets] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Open, 2: In Progress, 3: Resolved
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Create Ticket Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newTicket, setNewTicket] = useState({
    tenantId: "",
    description: "",
  });

  // Update Status Dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [statusForm, setStatusForm] = useState({
    status: "IN_PROGRESS",
    assignedVendorNotes: "",
    resolutionNotes: "",
  });

  // Fetch tickets and active tenants
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, tenantsRes] = await Promise.all([
        api.get("/maintenance/tickets"),
        api.get("/tenants"),
      ]);

      if (ticketsRes.data?.data) {
        setTickets(ticketsRes.data.data);
      }
      if (Array.isArray(tenantsRes.data)) {
        setTenants(tenantsRes.data);
      }
    } catch (err: any) {
      showError(err, "Failed to load maintenance tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter logic
  const filteredTickets = tickets.filter((t) => {
    // Tab filter
    if (activeTab === 1 && t.status !== "OPEN") return false;
    if (activeTab === 2 && t.status !== "IN_PROGRESS") return false;
    if (activeTab === 3 && t.status !== "RESOLVED") return false;

    // Category filter
    if (selectedCategory !== "ALL" && t.category !== selectedCategory)
      return false;

    return true;
  });

  // Summary Metrics
  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;
  const urgentCount = tickets.filter(
    (t) =>
      (t.urgency === "EMERGENCY" || t.urgency === "HIGH") &&
      t.status !== "RESOLVED" &&
      t.status !== "CLOSED",
  ).length;

  // Handle Create Ticket
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.tenantId) {
      showError("Please select a tenant");
      return;
    }
    if (!newTicket.description.trim()) {
      showError("Please enter issue description");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/maintenance/tickets", newTicket);
      showSuccess(
        `Ticket #${res.data?.ticket?.ticketNumber} logged & AI categorized as ${res.data?.ticket?.category}!`,
      );
      setCreateDialogOpen(false);
      setNewTicket({ tenantId: "", description: "" });
      fetchData();
    } catch (err: any) {
      showError(err, "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Status Dialog
  const handleOpenStatus = (ticket: any) => {
    setSelectedTicket(ticket);
    setStatusForm({
      status: ticket.status || "IN_PROGRESS",
      assignedVendorNotes: ticket.assignedVendorNotes || "",
      resolutionNotes: ticket.resolutionNotes || "",
    });
    setStatusDialogOpen(true);
  };

  // Submit Status Update
  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setUpdating(true);
    try {
      const res = await api.patch(
        `/maintenance/tickets/${selectedTicket._id}/status`,
        statusForm,
      );

      showSuccess(`Ticket #${selectedTicket.ticketNumber} status updated!`);
      setStatusDialogOpen(false);
      fetchData();

      // Offer to notify tenant via WhatsApp
      if (res.data?.whatsappUpdateUrl) {
        window.open(res.data.whatsappUpdateUrl, "_blank");
      }
    } catch (err: any) {
      showError(err, "Failed to update ticket status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* ── Top Header ── */}
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
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ letterSpacing: -0.5 }}
          >
            Maintenance & Repairs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-Categorized Issue Tracking & Zero-Friction Tenant Support
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ borderRadius: 2, px: 2.5, py: 1, fontWeight: 600 }}
        >
          Log Ticket
        </Button>
      </Box>

      {/* ── Metric Summary Cards ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 3,
            borderLeft: "5px solid",
            borderColor: "error.main",
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            OPEN (ACTION NEEDED)
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 0.5 }}>
            {openCount}
          </Typography>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 3,
            borderLeft: "5px solid",
            borderColor: "warning.main",
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            HIGH / EMERGENCY PRIORITY
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mt: 0.5, color: urgentCount > 0 ? "error.main" : "inherit" }}
          >
            {urgentCount}
          </Typography>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 3,
            borderLeft: "5px solid",
            borderColor: "info.main",
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            IN PROGRESS
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 0.5 }}>
            {inProgressCount}
          </Typography>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 3,
            borderLeft: "5px solid",
            borderColor: "success.main",
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            RESOLVED
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mt: 0.5, color: "success.main" }}
          >
            {resolvedCount}
          </Typography>
        </Paper>
      </Box>

      {/* ── Tabs & Category Filter ── */}
      <Paper elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            px: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`All (${tickets.length})`} />
            <Tab label={`Open (${openCount})`} />
            <Tab label={`In Progress (${inProgressCount})`} />
            <Tab label={`Resolved (${resolvedCount})`} />
          </Tabs>

          <TextField
            select
            size="small"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ minWidth: 150, my: 1 }}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat === "ALL" ? "All Categories" : cat}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* ── Ticket Grid ── */}
        <Box sx={{ p: 2.5 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredTickets.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <CheckCircleOutlineIcon
                sx={{ fontSize: 56, color: "text.disabled", mb: 1 }}
              />
              <Typography variant="h6" color="text.secondary">
                No tickets matching this filter!
              </Typography>
              <Typography variant="body2" color="text.disabled">
                All flat maintenance issues are resolved or no requests logged.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredTickets.map((ticket) => (
                <Card
                  key={ticket._id}
                  variant="outlined"
                  sx={{
                    borderRadius: 2.5,
                    borderLeft: "6px solid",
                    borderColor:
                      ticket.urgency === "EMERGENCY"
                        ? "error.main"
                        : ticket.urgency === "HIGH"
                          ? "warning.main"
                          : ticket.status === "RESOLVED"
                            ? "success.main"
                            : "primary.main",
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Chip
                          icon={getCategoryIcon(ticket.category)}
                          label={ticket.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: "bold", fontSize: "0.72rem" }}
                        />
                        {getUrgencyChip(ticket.urgency)}
                        {getStatusChip(ticket.status)}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontFamily: "monospace" }}
                        >
                          #{ticket.ticketNumber}
                        </Typography>
                      </Stack>

                      <Typography variant="caption" color="text.secondary">
                        {new Date(ticket.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </Typography>
                    </Box>

                    {/* Title & Description */}
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ mb: 0.5 }}
                    >
                      {ticket.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {ticket.description}
                    </Typography>

                    {/* Flat & Tenant metadata */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1.5,
                        pt: 1.5,
                        borderTop: (t) => `1px dashed ${t.palette.divider}`,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          Flat {ticket.flat?.flatNumber || "N/A"} •{" "}
                          {ticket.tenant?.name || "Occupant"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ticket.flat?.buildingName} • +91{" "}
                          {ticket.tenant?.contactNumber}
                        </Typography>
                      </Box>

                      {/* Action buttons */}
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditNoteIcon />}
                          onClick={() => handleOpenStatus(ticket)}
                          sx={{ textTransform: "none", fontWeight: 600 }}
                        >
                          Update Status
                        </Button>

                        <Tooltip title="Send WhatsApp status or message to tenant">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => {
                              const phone = (
                                ticket.tenant?.contactNumber || ""
                              ).replace(/\D/g, "");
                              const msg = encodeURIComponent(
                                `Hi ${ticket.tenant?.name || ""}, update regarding your Ticket #${ticket.ticketNumber} (${ticket.title}): Status is currently ${ticket.status}.`,
                              );
                              window.open(
                                `https://wa.me/91${phone}?text=${msg}`,
                                "_blank",
                              );
                            }}
                            sx={{ border: "1px solid", borderColor: "success.main" }}
                          >
                            <WhatsAppIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>

                    {/* Assigned Vendor Notes (if any) */}
                    {ticket.assignedVendorNotes && (
                      <Box
                        sx={{
                          mt: 1.5,
                          p: 1.25,
                          borderRadius: 1.5,
                          bgcolor: (t) =>
                            t.palette.mode === "dark"
                              ? "rgba(255,255,255,0.03)"
                              : "rgba(0,0,0,0.02)",
                          borderLeft: "3px solid",
                          borderColor: "info.main",
                        }}
                      >
                        <Typography variant="caption" fontWeight="bold">
                          Manager / Vendor Note:
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          {ticket.assignedVendorNotes}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>

      {/* ── Dialog: Log New Ticket (Manual Add) ── */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Log Maintenance Complaint
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter the tenant and complaint description. AI will automatically
              categorize the trade and urgency!
            </Typography>

            <TextField
              select
              fullWidth
              label="Select Tenant / Flat"
              value={newTicket.tenantId}
              onChange={(e) =>
                setNewTicket({ ...newTicket, tenantId: e.target.value })
              }
              sx={{ mb: 2.5 }}
              required
            >
              {tenants.map((t: any) => (
                <MenuItem key={t._id} value={t._id}>
                  {t.name} — Flat {t.flat?.flatNumber || "N/A"}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Issue Description (Hinglish / Hindi / English)"
              placeholder="e.g. Bathroom me flush pipe leak kar raha hai aur continuous paani beh raha hai."
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket({ ...newTicket, description: e.target.value })
              }
              required
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setCreateDialogOpen(false)}
              color="inherit"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <BuildIcon />
                )
              }
              sx={{ px: 3, fontWeight: 600 }}
            >
              {submitting ? "Analyzing & Logging..." : "Create Ticket"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── Dialog: Update Ticket Status ── */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form onSubmit={handleStatusSubmit}>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Update Ticket Status
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusForm.status}
              onChange={(e) =>
                setStatusForm({ ...statusForm, status: e.target.value })
              }
              sx={{ mb: 2 }}
            >
              <MenuItem value="OPEN">Action Needed (Open)</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="RESOLVED">Resolved ✅</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Assigned Vendor / Internal Notes"
              placeholder="e.g. Called Ramesh Electrician, arriving at 5 PM"
              value={statusForm.assignedVendorNotes}
              onChange={(e) =>
                setStatusForm({
                  ...statusForm,
                  assignedVendorNotes: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Resolution Notes for Tenant"
              placeholder="e.g. Washer replaced, leak fixed"
              value={statusForm.resolutionNotes}
              onChange={(e) =>
                setStatusForm({
                  ...statusForm,
                  resolutionNotes: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setStatusDialogOpen(false)}
              color="inherit"
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updating}
              sx={{ px: 3, fontWeight: 600 }}
            >
              {updating ? "Saving..." : "Save & Notify Tenant"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

