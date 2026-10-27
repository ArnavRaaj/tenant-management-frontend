"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useSnackbar } from "@/components/SnackbarProvider";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

export default function UsersPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ name: "", email: "" });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");

  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    // If not superadmin, redirect to dashboard
    if (user && (user as any).role !== "superadmin") {
      router.push("/admin/dashboard");
    } else if (user) {
      fetchAdmins();
    }
  }, [user, router]);

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/users");
      setAdmins(res.data);
    } catch (err) {
      console.error("Failed to fetch admins", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData.name.trim() || !inviteData.email.trim()) {
      showError("Please provide both name and email.");
      return;
    }
    setInviteLoading(true);
    setInviteError("");
    setInviteSuccess("");
    try {
      await api.post("/users/invite", inviteData);
      const targetEmail = inviteData.email;
      showSuccess(`Invitation email successfully sent to ${targetEmail}!`);
      setInviteSuccess(`Invitation sent to ${targetEmail}!`);
      setInviteData({ name: "", email: "" });
      fetchAdmins();
      setTimeout(() => {
        setInviteModalOpen(false);
        setInviteSuccess("");
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to send invitation";
      setInviteError(msg);
      showError(err, "Failed to send admin invitation.");
    } finally {
      setInviteLoading(false);
    }
  };

  if (!user || (user as any).role !== "superadmin") {
    return null;
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              display: "flex",
              alignItems: "center",
            }}
          >
            <AdminPanelSettingsOutlinedIcon sx={{ mr: 1, fontSize: 32, color: "primary.main" }} />
            Admin Users
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddAltOutlinedIcon />}
            onClick={() => setInviteModalOpen(true)}
            sx={{
              background: "linear-gradient(135deg, #1a56e8, #3575f0)",
              boxShadow: "0 4px 12px rgba(26,86,232,0.3)",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Invite Admin
          </Button>
        </Box>

        {/* Desktop Table View */}
        <TableContainer
          component={Paper}
          elevation={1}
          sx={{
            display: { xs: "none", md: "block" },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    No admin users found. Invite someone to get started!
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{admin.name}</TableCell>
                    <TableCell color="text.secondary">{admin.email}</TableCell>
                    <TableCell>
                      <Chip
                        label="Admin"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {admin.isVerified ? (
                        <Chip label="Active" size="small" color="success" />
                      ) : (
                        <Chip label="Pending" size="small" color="warning" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Mobile Card View */}
        <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={30} />
            </Box>
          ) : admins.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No admin users found. Invite someone to get started!
              </Typography>
            </Paper>
          ) : (
            admins.map((admin) => (
              <Card
                key={admin._id}
                elevation={1}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {admin.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {admin.email}
                      </Typography>
                    </Box>
                    <Chip
                      label="Admin"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
                    {admin.isVerified ? (
                      <Chip label="Active" size="small" color="success" />
                    ) : (
                      <Chip label="Pending" size="small" color="warning" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        {/* Invite Modal */}
        <Dialog
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700, color: "text.primary" }}>
            Invite New Admin
          </DialogTitle>
          <Box component="form" onSubmit={handleInviteSubmit}>
            <DialogContent dividers>
              {inviteError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {inviteError}
                </Alert>
              )}
              {inviteSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {inviteSuccess}
                </Alert>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The invited user will receive an email link to set their
                password and gain access to the system as an admin.
              </Typography>

              <TextField
                autoFocus
                required
                margin="dense"
                label="Full Name"
                fullWidth
                value={inviteData.name}
                onChange={(e) =>
                  setInviteData({ ...inviteData, name: e.target.value })
                }
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                required
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                value={inviteData.email}
                onChange={(e) =>
                  setInviteData({ ...inviteData, email: e.target.value })
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, px: 3 }}>
              <Button
                onClick={() => setInviteModalOpen(false)}
                color="inherit"
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  inviteLoading || !inviteData.name.trim() || !inviteData.email.trim()
                }
                startIcon={
                  inviteLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #1a56e8, #3575f0)",
                }}
              >
                {inviteLoading ? "Sending Invite..." : "Send Invite"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </>
  );
}
