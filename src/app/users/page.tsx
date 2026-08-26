"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
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
  Alert
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

  useEffect(() => {
    // If not superadmin, redirect to dashboard
    if (user && (user as any).role !== "superadmin") {
      router.push("/");
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
    setInviteLoading(true);
    setInviteError("");
    setInviteSuccess("");
    try {
      await api.post("/users/invite", inviteData);
      setInviteSuccess("Invitation sent successfully!");
      setInviteData({ name: "", email: "" });
      fetchAdmins();
      setTimeout(() => {
        setInviteModalOpen(false);
        setInviteSuccess("");
      }, 2000);
    } catch (err: any) {
      setInviteError(err.response?.data?.message || "Failed to send invitation");
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', display: 'flex', alignItems: 'center' }}>
            <AdminPanelSettingsOutlinedIcon sx={{ mr: 1, fontSize: 32 }} />
            Admin Users
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddAltOutlinedIcon />}
            onClick={() => setInviteModalOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #1a56e8, #3575f0)',
              boxShadow: '0 4px 12px rgba(26,86,232,0.3)',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            Invite Admin
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
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
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No admin users found. Invite someone to get started!
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin._id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Chip label="Admin" size="small" color="primary" variant="outlined" />
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

        {/* Invite Modal */}
        <Dialog open={inviteModalOpen} onClose={() => setInviteModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, color: '#1a237e' }}>Invite New Admin</DialogTitle>
          <Box component="form" onSubmit={handleInviteSubmit}>
            <DialogContent dividers>
              {inviteError && <Alert severity="error" sx={{ mb: 2 }}>{inviteError}</Alert>}
              {inviteSuccess && <Alert severity="success" sx={{ mb: 2 }}>{inviteSuccess}</Alert>}
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The invited user will receive an email link to set their password and gain access to the system as an admin.
              </Typography>
              
              <TextField
                autoFocus
                required
                margin="dense"
                label="Full Name"
                fullWidth
                value={inviteData.name}
                onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                required
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, px: 3 }}>
              <Button onClick={() => setInviteModalOpen(false)} color="inherit" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={inviteLoading || !inviteData.name || !inviteData.email}
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none', 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1a56e8, #3575f0)',
                }}
              >
                {inviteLoading ? <CircularProgress size={20} color="inherit" /> : 'Send Invite'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Container>
    </>
  );
}
