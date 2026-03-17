'use client';

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchFlats } from '@/store/flatSlice';
import { useRouter } from 'next/navigation';
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
  Divider
} from '@mui/material';

export default function FlatsOverview() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { flats, isLoading, isError, message } = useSelector(
    (state: RootState) => state.flats
  );

  useEffect(() => {
    dispatch(fetchFlats());
  }, [dispatch]);

  // Group flats by floor
  const groupedFlats = useMemo(() => {
    const groups: { [key: number]: any[] } = { 0: [], 1: [], 2: [] };
    flats.forEach((flat: any) => {
      if (groups[flat.floor]) {
        groups[flat.floor].push(flat);
      } else {
        groups[flat.floor] = [flat];
      }
    });
    
    // Sort each group by flat number
    Object.keys(groups).forEach(key => {
      groups[parseInt(key)].sort((a, b) => parseInt(a.flatNumber) - parseInt(b.flatNumber));
    });

    return groups;
  }, [flats]);

  const floorNames: { [key: number]: string } = {
    0: 'Ground Floor',
    1: 'First Floor',
    2: 'Second Floor'
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{message}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Flats Overview
        </Typography>
      </Box>

      {Object.keys(groupedFlats).map((floorKey) => {
        const floor = parseInt(floorKey);
        const floorFlats = groupedFlats[floor];

        if (!floorFlats || floorFlats.length === 0) return null;

        return (
          <Box key={floor} sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium', color: 'text.secondary' }}>
              {floorNames[floor]}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {floorFlats.map((flat) => (
                <Box key={flat._id}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderLeft: 6,
                      borderColor: flat.currentTenant ? 'success.main' : 'warning.main'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                          Flat {flat.flatNumber}
                        </Typography>
                        <Chip 
                          label={flat.currentTenant ? 'Occupied' : 'Vacant'} 
                          color={flat.currentTenant ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>

                      {flat.currentTenant ? (
                        <>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Tenant: <strong>{flat.currentTenant.name}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Rent: ₹{flat.currentTenant.monthlyRent}
                          </Typography>
                          {flat.currentTenant.pendingBalance > 0 && (
                            <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                              Pending: ₹{flat.currentTenant.pendingBalance}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
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
                        {flat.currentTenant ? 'View Details' : 'Assign Tenant'}
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
