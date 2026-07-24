"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { INDIAN_STATES } from "@/constants/indianStates";
import api from "@/services/api";

interface Address {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  state: string;
}

interface AddressFormProps {
  value: string; // selected address ID or "new"
  onChange: (addressId: string | null, newAddressData: any | null) => void;
  initialAddress?: Address | null;
}

export default function AddressForm({
  value,
  onChange,
  initialAddress,
}: AddressFormProps) {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>(
    value || "new",
  );
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    state: "",
  });
  const [fetchingCity, setFetchingCity] = useState(false);

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await api.get("/addresses");
        setSavedAddresses(data);
      } catch {
        /* silent */
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  // Pre-select existing address if tenant already has one
  useEffect(() => {
    if (initialAddress && initialAddress._id) {
      setSelectedOption(initialAddress._id);
    }
  }, [initialAddress]);

  // Auto-fetch city/state from postal code
  useEffect(() => {
    const fetchFromPincode = async (pincode: string) => {
      setFetchingCity(true);
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`,
        );
        const json = await res.json();
        if (
          json &&
          json[0] &&
          json[0].Status === "Success" &&
          json[0].PostOffice &&
          json[0].PostOffice.length > 0
        ) {
          const postOffice = json[0].PostOffice[0];
          setNewAddress((prev) => ({
            ...prev,
            city: postOffice.District || postOffice.Name || "",
            state: postOffice.State || "",
          }));
        }
      } catch {
        /* silent — user can fill manually */
      } finally {
        setFetchingCity(false);
      }
    };

    if (newAddress.postalCode.length === 6) {
      fetchFromPincode(newAddress.postalCode);
    }
  }, [newAddress.postalCode]);

  // Notify parent on changes
  useEffect(() => {
    if (selectedOption === "new") {
      onChange(null, newAddress);
    } else {
      onChange(selectedOption, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, newAddress]);

  const handleFieldChange = (field: string, value: string) => {
    if (field === "postalCode") {
      value = value.replace(/\D/g, "").slice(0, 6);
    }
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  if (loadingAddresses) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Address Selection Dropdown */}
      <TextField
        select
        fullWidth
        label="Use saved address"
        value={selectedOption}
        onChange={handleOptionChange}
        sx={{ mb: 2 }}
      >
        <MenuItem value="new">+ Add new address</MenuItem>
        {savedAddresses.map((addr) => (
          <MenuItem key={addr._id} value={addr._id}>
            {addr.addressLine1}, {addr.city}
          </MenuItem>
        ))}
      </TextField>

      {/* New Address Form — only shown when "new" is selected */}
      {selectedOption === "new" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
            <TextField
              required
              fullWidth
              label="Address Line 1"
              value={newAddress.addressLine1}
              onChange={(e) =>
                handleFieldChange("addressLine1", e.target.value)
              }
            />
          </Box>
          <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
            <TextField
              fullWidth
              label="Address Line 2"
              value={newAddress.addressLine2}
              onChange={(e) =>
                handleFieldChange("addressLine2", e.target.value)
              }
            />
          </Box>
          <TextField
            required
            fullWidth
            label="Postal Code"
            value={newAddress.postalCode}
            onChange={(e) => handleFieldChange("postalCode", e.target.value)}
            inputProps={{ maxLength: 6, inputMode: "numeric" }}
            helperText={
              fetchingCity ? "Fetching city..." : "Enter 6-digit PIN code"
            }
          />
          <TextField
            required
            fullWidth
            label="City"
            value={newAddress.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            InputProps={{
              endAdornment: fetchingCity ? (
                <CircularProgress size={18} />
              ) : null,
            }}
          />
          <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
            <TextField
              select
              required
              fullWidth
              label="State"
              value={newAddress.state}
              onChange={(e) => handleFieldChange("state", e.target.value)}
            >
              {INDIAN_STATES.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      )}

      {/* Display selected saved address details */}
      {selectedOption !== "new" && (
        <Box
          sx={{
            p: 2,
            bgcolor: "action.hover",
            borderRadius: 2,
          }}
        >
          {(() => {
            const addr = savedAddresses.find((a) => a._id === selectedOption);
            if (!addr) return null;
            return (
              <Typography variant="body2" color="text.secondary">
                {addr.addressLine1}
                {addr.addressLine2 ? `, ${addr.addressLine2}` : ""},{" "}
                {addr.city} — {addr.postalCode}, {addr.state}
              </Typography>
            );
          })()}
        </Box>
      )}
    </Box>
  );
}
