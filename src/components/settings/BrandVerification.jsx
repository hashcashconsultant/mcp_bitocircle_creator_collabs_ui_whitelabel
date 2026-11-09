import React from 'react';
import { Box, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BrandVerification = ({ data }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Brand Verification & KYC
        </Typography>

        {/* Brand Verification */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
              Brand Verification
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {data.brandVerification.description}
            </Typography>
          </Box>
          {data.brandVerification.verified ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                Verified
              </Typography>
            </Box>
          ) : (
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#2196f3',
                '&:hover': { backgroundColor: '#1976d2' },
              }}
            >
              Verify Now
            </Button>
          )}
        </Box>

        <Divider sx={{ borderColor: '#2a2a2a' }} />

        {/* KYC Status */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
              KYC Status
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {data.kyc.description}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#2196f3',
              maxWidth: 400,
              '&:hover': { backgroundColor: '#1976d2' },
            }}
          >
            Complete KYC
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BrandVerification;
