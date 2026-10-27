"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchFlats,
  fetchFloors,
  createFlatThunk,
  deleteFlatThunk,
  fetchBuildingTags,
} from "@/store/flatSlice";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import AddressForm from "@/components/AddressForm";
import { useSnackbar } from "@/components/SnackbarProvider";
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
  Autocomplete,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";


type StatusFilter = "all" | "vacant" | "occupied";

export default function FlatsOverview() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { flats, buildingTags, floors, tagsLoading, isLoading, isError, message } =
    useSelector((state: RootState) => state.flats);
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperadmin = user?.role === "superadmin";
  const { showSuccess, showError } = useSnackbar();

  // Dynamic floor name mapping from database floors
  const floorNameMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (floors && floors.length > 0) {
      floors.forEach((f) => {
        map[f.floorNumber] = f.name;
      });
    }
    return map;
  }, [floors]);

  const getFloorDisplayName = (floor: number) =>
    floorNameMap[floor] || (floor === 0 ? "Ground Floor" : `${floor}th Floor`);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    flatNumber: "",
    floor: "0",
    buildingName: "",
  });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  // Address state for Add Flat dialog
  const [flatAddressId, setFlatAddressId] = useState<string | null>(null);
  const [flatNewAddressData, setFlatNewAddressData] = useState<any>(null);

  // Active building tag from URL query params
  const activeTag = searchParams.get("tag") || "";

  useEffect(() => {
    dispatch(fetchBuildingTags());
    dispatch(fetchFloors());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFlats(activeTag ? { tag: activeTag } : undefined));
  }, [dispatch, activeTag]);

  // Set default tag when tags finish loading and no tag is in URL
  useEffect(() => {
    if (buildingTags.length > 0 && !searchParams.get("tag")) {
      router.replace(
        `/admin/flats?tag=${encodeURIComponent(buildingTags[0])}`,
        {
          scroll: false,
        },
      );
    }
  }, [buildingTags, searchParams, router]);

  // Filter flats by active building tag
  const tagFilteredFlats = useMemo(() => {
    if (!activeTag) return flats;
    return flats.filter((f: any) => f.buildingName === activeTag);
  }, [flats, activeTag]);

  // Apply status filter on top of tag filter
  const filteredFlats = useMemo(() => {
    if (statusFilter === "vacant")
      return tagFilteredFlats.filter((f: any) => !f.currentTenant);
    if (statusFilter === "occupied")
      return tagFilteredFlats.filter((f: any) => !!f.currentTenant);
    return tagFilteredFlats;
  }, [tagFilteredFlats, statusFilter]);

  // Group filtered flats by floor within the active building
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

  const occupiedCount = tagFilteredFlats.filter(
    (f: any) => !!f.currentTenant,
  ).length;
  const vacantCount = tagFilteredFlats.filter(
    (f: any) => !f.currentTenant,
  ).length;

  const handleTagClick = (tag: string) => {
    router.replace(`/admin/flats?tag=${encodeURIComponent(tag)}`, {
      scroll: false,
    });
  };

  const handleAddFlat = async () => {
    if (!addForm.flatNumber.trim()) {
      setAddError("Flat number is required.");
      showError("Flat number is required.");
      return;
    }
    if (!addForm.buildingName.trim()) {
      setAddError("Building/Apartment name is required.");
      showError("Building/Apartment name is required.");
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
          buildingName: addForm.buildingName.trim(),
          ...(addressId && { address: addressId }),
        }),
      ).unwrap();
      showSuccess(`Flat ${addForm.flatNumber.trim()} added successfully!`);
      setAddDialogOpen(false);
      setAddForm({ flatNumber: "", floor: "0", buildingName: "" });
      setFlatAddressId(null);
      setFlatNewAddressData(null);
      // Re-fetch building tags so new building names appear instantly
      dispatch(fetchBuildingTags());
    } catch (err: any) {
      setAddError(err || "Failed to add flat.");
      showError(err, "Failed to add flat.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteFlat = async (flatId: string) => {
    if (!window.confirm("Delete this flat permanently?")) return;
    setDeleteLoading(flatId);
    try {
      await dispatch(deleteFlatThunk(flatId)).unwrap();
      showSuccess("Flat deleted permanently.");
      // Re-fetch tags in case that was the only flat in a building
      dispatch(fetchBuildingTags());
    } catch (err: any) {
      showError(err, "Failed to delete flat.");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (isLoading || tagsLoading)
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
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Flats Overview
        </Typography>
        {isSuperadmin && (
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              setAddForm({
                flatNumber: "",
                floor: "0",
                buildingName: activeTag || "",
              });
              setAddDialogOpen(true);
            }}
          >
            Add Flat
          </Button>
        )}
      </Box>

      {/* Building Tag Bar */}
      {buildingTags.length > 0 && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <ApartmentIcon sx={{ color: "text.secondary", mr: 0.5 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mr: 0.5, fontWeight: 500 }}
          >
            Buildings:
          </Typography>
          {buildingTags.map((tag: string) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagClick(tag)}
              color={activeTag === tag ? "primary" : "default"}
              variant={activeTag === tag ? "filled" : "outlined"}
              sx={{ fontWeight: activeTag === tag ? "bold" : "normal" }}
            />
          ))}
        </Paper>
      )}

      {/* Summary Stats (scoped to active building) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            icon: <HomeIcon sx={{ fontSize: 36, color: "primary.main" }} />,
            count: tagFilteredFlats.length,
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

      {/* Floor Groups within Active Building */}
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
                  {getFloorDisplayName(floor)}
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
                    elevation={0}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.12)",
                        borderColor: flat.currentTenant
                          ? "success.main"
                          : "warning.main",
                      },
                    }}
                  >
                    {/* Top status color strip */}
                    <Box
                      sx={{
                        height: 4,
                        bgcolor: flat.currentTenant
                          ? "success.main"
                          : "warning.main",
                        width: "100%",
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
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
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600, borderWidth: 1.5 }}
                          />
                          {isSuperadmin && !flat.currentTenant && (
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

                      {/* Address Details Block */}
                      {flat.address && typeof flat.address === "object" && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 0.75,
                            mb: 2,
                            p: 1.25,
                            bgcolor: "action.hover",
                            borderRadius: 2,
                            border: "1px dashed",
                            borderColor: "divider",
                          }}
                        >
                          <LocationOnOutlinedIcon
                            sx={{
                              fontSize: 18,
                              color: "text.secondary",
                              mt: 0.15,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontWeight: 500,
                              lineHeight: 1.4,
                              wordBreak: "break-word",
                            }}
                          >
                            {[
                              flat.address.addressLine1,
                              flat.address.addressLine2,
                              flat.address.city,
                              flat.address.postalCode || flat.address.pincode,
                            ]
                              .filter(
                                (p) => typeof p === "string" && p.trim() !== "",
                              )
                              .join(", ")}
                          </Typography>
                        </Box>
                      )}

                      {flat.currentTenant ? (
                        <Box
                          sx={{
                            p: 1.5,
                            bgcolor: "action.selected",
                            borderRadius: 2,
                            mt: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.primary"
                            gutterBottom
                          >
                            Tenant: <strong>{flat.currentTenant.name}</strong>
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            Rent: ₹
                            {flat.currentTenant.monthlyRent?.toLocaleString()}
                          </Typography>
                          {flat.currentTenant.pendingBalance > 0 && (
                            <Typography
                              variant="body2"
                              color="error.main"
                              sx={{ mt: 0.5, fontWeight: "bold" }}
                            >
                              Pending: ₹{flat.currentTenant.pendingBalance}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic", mt: 1 }}
                        >
                          Ready to be assigned to a tenant
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions
                      sx={{
                        p: 2,
                        pt: 0,
                      }}
                    >
                      <Button
                        size="medium"
                        variant={flat.currentTenant ? "outlined" : "contained"}
                        color="primary"
                        fullWidth
                        onClick={() => router.push(`/admin/flats/${flat._id}`)}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          py: 0.8,
                        }}
                      >
                        {flat.currentTenant ? "View Details" : "Assign Tenant"}
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
            No {statusFilter !== "all" ? statusFilter : ""} flats found
            {activeTag ? ` in ${activeTag}` : ""}.
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
          <Autocomplete
            freeSolo
            options={buildingTags}
            value={addForm.buildingName}
            onInputChange={(_e, newValue) =>
              setAddForm({ ...addForm, buildingName: newValue })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                required
                margin="dense"
                label="Building / Apartment Name"
                variant="outlined"
                placeholder="Search or type a new building name"
              />
            )}
            sx={{ mb: 2 }}
          />
          <TextField
            required
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
            {floors && floors.length > 0
              ? floors.map((f) => (
                  <MenuItem key={f.floorNumber} value={String(f.floorNumber)}>
                    {f.name}
                  </MenuItem>
                ))
              : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((f) => (
                  <MenuItem key={f} value={String(f)}>
                    {f === 0 ? "Ground Floor" : `${f}th Floor`}
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
