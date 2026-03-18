'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter, useParams } from 'next/navigation';
import { fetchFlats } from '@/store/flatSlice';
import api from '@/services/api';
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
} from '@mui/material';

export default function FlatDetail() {
  const params = useParams();
  const id = params?.id as string;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { flats, isLoading } = useSelector((state: RootState) => state.flats);
  const flat = flats.find((f: any) => f._id === id);

  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    age: '',
    aadharNumber: '',
    address: '',
    occupantsCount: '',
    securityDeposit: '',
    monthlyRent: '',
    dateOfRenting: new Date().toISOString().split('T')[0],
  });

  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (flats.length === 0) {
      dispatch(fetchFlats());
    }
  }, [dispatch, flats.length]);

  useEffect(() => {
    // Pre-fill form if flat has an existing tenant (simulate edit/view)
    if (flat && flat.currentTenant) {
      setFormData({
        name: flat.currentTenant.name || '',
        contactNumber: flat.currentTenant.contactNumber || '',
        age: flat.currentTenant.age || '',
        aadharNumber: flat.currentTenant.aadharNumber || '',
        address: flat.currentTenant.address || '',
        occupantsCount: flat.currentTenant.occupantsCount || '',
        securityDeposit: flat.currentTenant.securityDeposit || '',
        monthlyRent: flat.currentTenant.monthlyRent || '',
        dateOfRenting: flat.currentTenant.dateOfRenting 
          ? new Date(flat.currentTenant.dateOfRenting).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [flat]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'contactNumber') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key as keyof typeof formData]);
      });
      data.append('flatId', id as string);
      
      if (file) {
        data.append('aadharImage', file);
      }

      const isUpdate = flat?.currentTenant;
      
      if (isUpdate) {
        // Update existing tenant
        await api.put(`/tenants/${flat.currentTenant._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMsg('Tenant details updated successfully!');
      } else {
        // Create new tenant
        await api.post('/tenants', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMsg('Tenant assigned successfully!');
      }
      
      // Refresh flats data to get new status
      dispatch(fetchFlats());
      
      // Navigate back after a short delay
      setTimeout(() => {
        router.push('/flats');
      }, 1500);

    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveTenant = async () => {
    if (window.confirm("Are you sure you want to remove this tenant? This action will archive them.")) {
      setSubmitting(true);
      try {
        await api.post(`/tenants/${flat?.currentTenant?._id}/change`);
        dispatch(fetchFlats());
        setSuccessMsg('Tenant removed. Flat is now vacant.');
        router.push('/flats');
      } catch (error: any) {
        setErrorMsg(error.response?.data?.message || 'Failed to remove tenant');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (isLoading || !flat) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isOccupied = !!flat.currentTenant;

  let firstMonthRent = 0;
  if (!isOccupied && formData.securityDeposit && formData.monthlyRent && formData.dateOfRenting) {
    const day = new Date(formData.dateOfRenting).getDate();
    // Pro-rated formula based on 30 day month: (monthlyRent/30) * (30 - (day - 1)) = 31 - day
    const rentFraction = (parseFloat(formData.monthlyRent) / 30) * (31 - day);
    firstMonthRent = parseFloat(formData.securityDeposit) + rentFraction;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          {isOccupied ? 'Update Tenant Details' : 'Assign New Tenant'} (Flat {flat.flatNumber})
        </Typography>
        <Button variant="outlined" onClick={() => router.back()}>
          Back
        </Button>
      </Box>

      {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box component="form" onSubmit={onSubmit}>
          <Typography variant="h6" gutterBottom color="primary">
            Personal Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <TextField required fullWidth label="Full Name" name="name" value={formData.name} onChange={onChange} />
            </Box>
            <Box>
              <TextField 
                required
                fullWidth 
                type="tel" 
                label="Contact Number" 
                name="contactNumber" 
                value={formData.contactNumber} 
                onChange={onChange} 
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                }}
                inputProps={{ maxLength: 10 }}
              />
            </Box>
            <Box>
              <TextField fullWidth type="number" label="Age" name="age" value={formData.age} onChange={onChange} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField fullWidth multiline rows={2} label="Permanent Address" name="address" value={formData.address} onChange={onChange} />
            </Box>
            <Box>
              <TextField fullWidth label="Aadhar Number" name="aadharNumber" value={formData.aadharNumber} onChange={onChange} />
            </Box>
            <Box>
              <Button variant="outlined" component="label" fullWidth sx={{ height: '100%', minHeight: 56 }}>
                {file ? file.name : (isOccupied ? 'Update Aadhar Image' : 'Upload Aadhar Image')}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
              {isOccupied && flat.currentTenant.aadharImage && !file && (
                <Typography variant="caption" display="block" sx={{ mt: 1, ml: 1 }}>
                  Current image: <a href={flat.currentTenant.aadharImage} target="_blank" rel="noreferrer">View</a>
                </Typography>
              )}
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
            Lease Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
             <Box>
              <TextField fullWidth type="number" label="Total Occupants" name="occupantsCount" value={formData.occupantsCount} onChange={onChange} />
            </Box>
            <Box>
              <TextField required fullWidth type="number" label="Security Deposit (₹)" name="securityDeposit" value={formData.securityDeposit} onChange={onChange} />
            </Box>
             <Box>
              <TextField required fullWidth type="number" label="Monthly Rent (₹)" name="monthlyRent" value={formData.monthlyRent} onChange={onChange} />
            </Box>
            <Box>
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
          </Box>

          {!isOccupied && firstMonthRent > 0 && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                First Month Payment: ₹{firstMonthRent.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                (Security Deposit + Pro-rated rent for the remaining {(31 - new Date(formData.dateOfRenting).getDate())} days of the month)
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
              color="primary" 
              disabled={submitting}
              sx={{ minWidth: 150 }}
            >
              {submitting ? <CircularProgress size={24} /> : (isOccupied ? 'Update Details' : 'Assign Tenant')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
