"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter, useParams } from "next/navigation";
import { fetchFlats } from "@/store/flatSlice";
import api from "@/services/api";
import AddressForm from "@/components/AddressForm";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  MenuItem,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function FlatDetail() {
  const params = useParams();
  const id = params?.id as string;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { flats, isLoading } = useSelector((state: RootState) => state.flats);
  const flat = flats.find((f: any) => f._id === id);

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    age: "",
    aadharNumber: "",
    gender: "",
    occupantsCount: "",
    securityDeposit: "",
    monthlyRent: "",
    dateOfRenting: new Date().toISOString().split("T")[0],
  });
  // Address state
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [newAddressData, setNewAddressData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // History tab state
  const [tenantHistory, setTenantHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Revenue tab state
  const [revenue, setRevenue] = useState<{
    grandTotal: number;
    monthlyBreakdown: any[];
  } | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(false);

  // Vacant history tab state
  const [vacantHistory, setVacantHistory] = useState<any[]>([]);
  const [vacantLoading, setVacantLoading] = useState(false);

  useEffect(() => {
    if (flats.length === 0) dispatch(fetchFlats());
  }, [dispatch, flats.length]);

  useEffect(() => {
    if (flat?.currentTenant) {
      setFormData({
        name: flat.currentTenant.name || "",
        contactNumber: flat.currentTenant.contactNumber || "",
        age: flat.currentTenant.age || "",
        aadharNumber: flat.currentTenant.aadharNumber || "",
        gender: flat.currentTenant.gender || "",
        occupantsCount: flat.currentTenant.occupantsCount || "",
        securityDeposit: flat.currentTenant.securityDeposit || "",
        monthlyRent: flat.currentTenant.monthlyRent || "",
        dateOfRenting: flat.currentTenant.dateOfRenting
          ? new Date(flat.currentTenant.dateOfRenting)
              .toISOString()
              .split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
      if (flat.currentTenant.address?._id) {
        setSelectedAddressId(flat.currentTenant.address._id);
      }
    }
  }, [flat]);

  const handleTabChange = async (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 1 && tenantHistory.length === 0) {
      setHistoryLoading(true);
      try {
        const { data } = await api.get(`/flats/${id}/tenants`);
        setTenantHistory(data);
      } catch {
        /* silent */
      } finally {
        setHistoryLoading(false);
      }
    }
    if (newValue === 2 && !revenue) {
      setRevenueLoading(true);
      try {
        const { data } = await api.get(`/flats/${id}/revenue`);
        setRevenue(data);
      } catch {
        /* silent */
      } finally {
        setRevenueLoading(false);
      }
    }
    if (newValue === 3 && vacantHistory.length === 0) {
      setVacantLoading(true);
      try {
        const { data } = await api.get(`/flats/${id}/vacant-history`);
        setVacantHistory(data);
      } catch {
        /* silent */
      } finally {
        setVacantLoading(false);
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === "contactNumber") value = value.replace(/\D/g, "").slice(0, 10);
    if (name === "aadharNumber") value = value.replace(/\D/g, "").slice(0, 12);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (
    addressId: string | null,
    addressData: any | null,
  ) => {
    setSelectedAddressId(addressId);
    setNewAddressData(addressData);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Client-side Aadhar validation
    if (formData.aadharNumber && formData.aadharNumber.length !== 12) {
      setErrorMsg("Aadhar number must be exactly 12 digits");
      setSubmitting(false);
      return;
    }

    try {
      // Handle address: create new one if needed
      let addressId = selectedAddressId;
      if (!addressId && newAddressData && newAddressData.addressLine1) {
        const { data: createdAddress } = await api.post(
          "/addresses",
          newAddressData,
        );
        addressId = createdAddress._id;
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) =>
        data.append(key, formData[key as keyof typeof formData]),
      );
      data.append("flatId", id);
      if (addressId) data.append("address", addressId);
      if (file) data.append("aadharImage", file);
      const opts = { headers: { "Content-Type": "multipart/form-data" } };
      if (flat?.currentTenant) {
        await api.put(`/tenants/${flat.currentTenant._id}`, data, opts);
        setSuccessMsg("Tenant details updated successfully!");
      } else {
        await api.post("/tenants", data, opts);
        setSuccessMsg("Tenant assigned successfully!");
      }
      dispatch(fetchFlats());
      setTimeout(() => router.push("/flats"), 1500);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveTenant = async () => {
    if (!window.confirm("Vacate this flat? The tenant will be archived."))
      return;
    setSubmitting(true);
    try {
      await api.post(`/tenants/${flat?.currentTenant?._id}/change`);
      dispatch(fetchFlats());
      setSuccessMsg("Tenant removed. Flat is now vacant.");
      router.push("/flats");
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Failed to remove tenant");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !flat)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  const isOccupied = !!flat.currentTenant;
  let firstMonthRent = 0;
  if (
    !isOccupied &&
    formData.securityDeposit &&
    formData.monthlyRent &&
    formData.dateOfRenting
  ) {
    const day = new Date(formData.dateOfRenting).getDate();
    firstMonthRent =
      parseFloat(formData.securityDeposit) +
      (parseFloat(formData.monthlyRent) / 30) * (31 - day);
  }

  const BAR_COLORS = ["#1976d2", "#388e3c", "#f57c00", "#7b1fa2", "#d32f2f"];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Flat {flat.flatNumber}
          </Typography>
          <Chip
            label={isOccupied ? "Occupied" : "Vacant"}
            color={isOccupied ? "success" : "warning"}
            size="small"
            sx={{ mt: 0.5 }}
          />
        </Box>
        <Button variant="outlined" onClick={() => router.back()}>
          Back
        </Button>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      {/* Tabs */}
      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
        >
          <Tab label={isOccupied ? "Update Tenant" : "Assign Tenant"} />
          <Tab label="Tenant History" />
          <Tab label="Revenue" />
          <Tab label="Vacant Periods" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* ── Tab 0: Tenant Form ── */}
          <TabPanel value={activeTab} index={0}>
            <Box component="form" onSubmit={onSubmit}>
              <Typography variant="h6" gutterBottom color="primary">
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                />
                <TextField
                  required
                  fullWidth
                  type="tel"
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+91</InputAdornment>
                    ),
                  }}
                  inputProps={{ maxLength: 10 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Age"
                  name="age"
                  value={formData.age}
                  onChange={onChange}
                />
                <TextField
                  select
                  fullWidth
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={onChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Aadhar Number (12 digits)"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={onChange}
                  inputProps={{ maxLength: 12, inputMode: "numeric" }}
                  helperText={
                    formData.aadharNumber &&
                    formData.aadharNumber.length !== 12
                      ? `${formData.aadharNumber.length}/12 digits`
                      : ""
                  }
                  error={
                    !!formData.aadharNumber &&
                    formData.aadharNumber.length > 0 &&
                    formData.aadharNumber.length !== 12
                  }
                />
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: "100%", minHeight: 56 }}
                  >
                    {file
                      ? file.name
                      : isOccupied
                        ? "Update Aadhar Image"
                        : "Upload Aadhar Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setFile(e.target.files[0]);
                      }}
                    />
                  </Button>
                  {isOccupied && flat.currentTenant.aadharImage && !file && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1, ml: 1 }}
                    >
                      Current:{" "}
                      <a
                        href={flat.currentTenant.aadharImage}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </Typography>
                  )}
                </Box>
              </Box>

              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ mt: 4 }}
              >
                Address Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <AddressForm
                value={selectedAddressId || "new"}
                onChange={handleAddressChange}
                initialAddress={flat?.currentTenant?.address || null}
              />

              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ mt: 4 }}
              >
                Lease Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                  gap: 3,
                }}
              >
                <TextField
                  fullWidth
                  type="number"
                  label="Total Occupants"
                  name="occupantsCount"
                  value={formData.occupantsCount}
                  onChange={onChange}
                />
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Security Deposit (₹)"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={onChange}
                />
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Monthly Rent (₹)"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={onChange}
                />
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Date of Renting"
                  name="dateOfRenting"
                  value={formData.dateOfRenting}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {!isOccupied && firstMonthRent > 0 && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    First Month Payment: ₹{firstMonthRent.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    (Security Deposit + Pro-rated rent for{" "}
                    {31 - new Date(formData.dateOfRenting).getDate()} days)
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                {isOccupied && (
                  <Button
                    variant="outlined"
                    color="error"
                    disabled={submitting}
                    onClick={handleRemoveTenant}
                  >
                    Vacate Flat
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{ minWidth: 150 }}
                >
                  {submitting ? (
                    <CircularProgress size={24} />
                  ) : isOccupied ? (
                    "Update Details"
                  ) : (
                    "Assign Tenant"
                  )}
                </Button>
              </Box>
            </Box>
          </TabPanel>

          {/* ── Tab 1: Tenant History ── */}
          <TabPanel value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom>
              All Tenants — Flat {flat.flatNumber}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {historyLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : tenantHistory.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No tenant history found for this flat.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Contact</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Moved In</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Moved Out</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Rent (₹)</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tenantHistory.map((t: any) => (
                      <TableRow key={t._id}>
                        <TableCell>{t.name}</TableCell>
                        <TableCell>+91 {t.contactNumber}</TableCell>
                        <TableCell>
                          {new Date(t.dateOfRenting).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {t.vacatedDate
                            ? new Date(t.vacatedDate).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          ₹{t.monthlyRent?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={t.isActive ? "Active" : "Past"}
                            color={t.isActive ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* ── Tab 2: Revenue ── */}
          <TabPanel value={activeTab} index={2}>
            {revenueLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : !revenue ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No revenue data.
              </Typography>
            ) : (
              <>
                <Box
                  sx={{
                    mb: 3,
                    p: 2.5,
                    bgcolor: "success.main",
                    color: "white",
                    borderRadius: 3,
                    display: "inline-block",
                  }}
                >
                  <Typography variant="body2">
                    Total Revenue — Flat {flat.flatNumber}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ₹{revenue.grandTotal?.toLocaleString()}
                  </Typography>
                </Box>
                {revenue.monthlyBreakdown.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Monthly Breakdown
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ height: 280, mb: 3 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenue.monthlyBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="monthStr" tick={{ fontSize: 11 }} />
                          <YAxis />
                          <Tooltip
                            formatter={(v: any) => `₹${v.toLocaleString()}`}
                          />
                          <Bar
                            dataKey="totalPaid"
                            name="Amount Paid (₹)"
                            radius={[4, 4, 0, 0]}
                          >
                            {revenue.monthlyBreakdown.map((_, i) => (
                              <Cell
                                key={i}
                                fill={BAR_COLORS[i % BAR_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Month / Year</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Amount Collected (₹)</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {revenue.monthlyBreakdown.map((m: any) => (
                            <TableRow key={m.monthStr}>
                              <TableCell>{m.monthStr}</TableCell>
                              <TableCell align="right">
                                ₹{m.totalPaid?.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </>
            )}
          </TabPanel>

          {/* ── Tab 3: Vacant Periods ── */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom>
              Vacancy History — Flat {flat.flatNumber}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {vacantLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : vacantHistory.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No vacancy gaps found. The flat may have been continuously
                occupied.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Vacant From</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Vacant Until</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Days Vacant</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Previous Tenant</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Next Tenant</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vacantHistory.map((v: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>
                          {v.from ? new Date(v.from).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>
                          {v.to ? (
                            new Date(v.to).toLocaleDateString()
                          ) : (
                            <Chip
                              label="Currently Vacant"
                              color="warning"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>{v.daysVacant} days</TableCell>
                        <TableCell>{v.prevTenant || "—"}</TableCell>
                        <TableCell>{v.nextTenant || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
}
