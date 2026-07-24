"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchFlats,
  createFlatThunk,
  deleteFlatThunk,
} from "@/store/flatSlice";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import AddressForm from "@/components/AddressForm";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
  Paper,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

const FLOOR_NAMES: { [key: number]: string } = {
  0: "Ground Floor",
  1: "First Floor",
  2: "Second Floor",
};

type StatusFilter = "all" | "vacant" | "occupied";

export default function FlatsOverview() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { flats, isLoading, isError, message } = useSelector(
    (state: RootState) => state.flats,
  );

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({ flatNumber: "", floor: "0" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  // Address state for Add Flat dialog
  const [flatAddressId, setFlatAddressId] = useState<string | null>(null);
  const [flatNewAddressData, setFlatNewAddressData] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchFlats());
  }, [dispatch]);

  const filteredFlats = useMemo(() => {
    if (statusFilter === "vacant")
      return flats.filter((f: any) => !f.currentTenant);
    if (statusFilter === "occupied")
      return flats.filter((f: any) => !!f.currentTenant);
    return flats;
  }, [flats, statusFilter]);

  const groupedFlats = useMemo(() => {
    const groups: { [key: number]: any[] } = {};
    filteredFlats.forEach((flat: any) => {
      if (!groups[flat.floor]) groups[flat.floor] = [];
      groups[flat.floor].push(flat);
    });
    Object.keys(groups).forEach((k) =>
      groups[parseInt(k)].sort(
        (a, b) => parseInt(a.flatNumber) - parseInt(b.flatNumber),
      ),
    );
    return groups;
  }, [filteredFlats]);

  const occupiedCount = flats.filter((f: any) => !!f.currentTenant).length;
  const vacantCount = flats.filter((f: any) => !f.currentTenant).length;

  const handleAddFlat = async () => {
    if (!addForm.flatNumber.trim()) {
      setAddError("Flat number is required.");
      return;
    }
    setAddLoading(true);
    setAddError("");
    try {
      // Create address first if new address data is provided
      let addressId = flatAddressId;
      if (!addressId && flatNewAddressData && flatNewAddressData.addressLine1) {
        const { data: createdAddress } = await api.post(
          "/addresses",
          flatNewAddressData,
        );
        addressId = createdAddress._id;
      }

      await dispatch(
        createFlatThunk({
          flatNumber: addForm.flatNumber.trim(),
          floor: parseInt(addForm.floor),
          ...(addressId && { address: addressId }),
        }),
      ).unwrap();
      setAddDialogOpen(false);
      setAddForm({ flatNumber: "", floor: "0" });
      setFlatAddressId(null);
      setFlatNewAddressData(null);
    } catch (err: any) {
      setAddError(err || "Failed to add flat.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteFlat = async (flatId: string) => {
    if (!window.confirm("Delete this flat permanently?")) return;
    setDeleteLoading(flatId);
    try {
      await dispatch(deleteFlatThunk(flatId)).unwrap();
    } catch (err: any) {
      alert(err || "Failed to delete flat.");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (isError) return <Alert severity="error">{message}</Alert>;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Flats Overview
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Flat
        </Button>
      </Box>

      {/* Summary Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            icon: <HomeIcon sx={{ fontSize: 36, color: "primary.main" }} />,
            count: flats.length,
            label: "Total Flats",
            color: "primary.main",
          },
          {
            icon: (
              <PeopleAltIcon sx={{ fontSize: 36, color: "success.main" }} />
            ),
            count: occupiedCount,
            label: "Occupied",
            color: "success.main",
          },
          {
            icon: (
              <MeetingRoomIcon sx={{ fontSize: 36, color: "warning.main" }} />
            ),
            count: vacantCount,
            label: "Vacant",
            color: "warning.main",
          },
        ].map(({ icon, count, label, color }) => (
          <Paper
            key={label}
            elevation={2}
            sx={{
              p: 2.5,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {icon}
            <Box>
              <Typography variant="h5" fontWeight="bold" color={color}>
                {count}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Status Filter */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        {(["all", "occupied", "vacant"] as StatusFilter[]).map((s) => (
          <Chip
            key={s}
            label={s.charAt(0).toUpperCase() + s.slice(1)}
            onClick={() => setStatusFilter(s)}
            color={
              statusFilter === s
                ? s === "vacant"
                  ? "warning"
                  : s === "occupied"
                    ? "success"
                    : "primary"
                : "default"
            }
            variant={statusFilter === s ? "filled" : "outlined"}
            sx={{ fontWeight: statusFilter === s ? "bold" : "normal" }}
          />
        ))}
        <Typography variant="body2" color="text.secondary">
          {filteredFlats.length} flat{filteredFlats.length !== 1 ? "s" : ""}
        </Typography>
      </Stack>

      {/* Floor Groups */}
      {Object.keys(groupedFlats)
        .map(Number)
        .sort()
        .map((floor) => {
          const floorFlats = groupedFlats[floor];
          if (!floorFlats?.length) return null;
          return (
            <Box key={floor} sx={{ mb: 5 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography
                  variant="h5"
                  fontWeight="medium"
                  color="text.secondary"
                >
                  {FLOOR_NAMES[floor] || `Floor ${floor}`}
                </Typography>
                <Chip label={`${floorFlats.length} flats`} size="small" />
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 2.5,
                }}
              >
                {floorFlats.map((flat: any) => (
                  <Card
                    key={flat._id}
                    elevation={2}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderLeft: 5,
                      borderColor: flat.currentTenant
                        ? "success.main"
                        : "warning.main",
                      transition: "transform 0.15s, box-shadow 0.15s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 5,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1.5,
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          Flat {flat.flatNumber}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Chip
                            label={flat.currentTenant ? "Occupied" : "Vacant"}
                            color={flat.currentTenant ? "success" : "warning"}
                            size="small"
                          />
                          {!flat.currentTenant && (
                            <Tooltip title="Delete flat">
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  disabled={deleteLoading === flat._id}
                                  onClick={() => handleDeleteFlat(flat._id)}
                                >
                                  {deleteLoading === flat._id ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <DeleteOutlineIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                      {flat.currentTenant ? (
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Tenant: <strong>{flat.currentTenant.name}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Rent: ₹
                            {flat.currentTenant.monthlyRent?.toLocaleString()}
                          </Typography>
                          {flat.currentTenant.pendingBalance > 0 && (
                            <Typography
                              variant="body2"
                              color="error.main"
                              sx={{ mt: 1, fontWeight: "bold" }}
                            >
                              Pending: ₹{flat.currentTenant.pendingBalance}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic", mt: 1 }}
                        >
                          Ready to be assigned
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        fullWidth
                        onClick={() => router.push(`/flats/${flat._id}`)}
                      >
                        {flat.currentTenant ? "View / Edit" : "Assign Tenant"}
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Box>
          );
        })}

      {filteredFlats.length === 0 && !isLoading && (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <MeetingRoomIcon sx={{ fontSize: 64, mb: 2, opacity: 0.2 }} />
          <Typography variant="h6">
            No {statusFilter !== "all" ? statusFilter : ""} flats found.
          </Typography>
        </Box>
      )}

      {/* Add Flat Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setAddError("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Flat</DialogTitle>
        <DialogContent>
          {addError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Flat Number (e.g. 305)"
            fullWidth
            variant="outlined"
            value={addForm.flatNumber}
            onChange={(e) =>
              setAddForm({ ...addForm, flatNumber: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Floor"
            fullWidth
            variant="outlined"
            value={addForm.floor}
            onChange={(e) => setAddForm({ ...addForm, floor: e.target.value })}
            sx={{ mb: 3 }}
          >
            {[0, 1, 2].map((f) => (
              <MenuItem key={f} value={String(f)}>
                {FLOOR_NAMES[f]}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
            Flat Address
          </Typography>
          <AddressForm
            value={flatAddressId || "new"}
            onChange={(addressId, addressData) => {
              setFlatAddressId(addressId);
              setFlatNewAddressData(addressData);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddDialogOpen(false);
              setAddError("");
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddFlat}
            variant="contained"
            disabled={addLoading}
          >
            {addLoading ? <CircularProgress size={20} /> : "Add Flat"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
