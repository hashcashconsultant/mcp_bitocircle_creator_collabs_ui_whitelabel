import React from 'react';
import { Box, Card, CardContent, Typography, Button, Link, Divider } from '@mui/material';

const PaymentSettings = ({ data }) => {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Payment Settings
        </Typography>

        {/* Default Wallet */}
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
              Default Wallet
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {data.defaultWallet}
            </Typography>
          </Box>
          <Link
            component="button"
            sx={{
              color: '#ff9800',
              textDecoration: 'none',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Change
          </Link>
        </Box>

        <Divider sx={{ borderColor: '#2a2a2a' }} />

        {/* Add Payment Method */}
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
              Add Payment Method
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Connect additional wallets or payment methods
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#2a2a2a',
              color: '#2196f3',
              '&:hover': {
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
              },
            }}
          >
            Add Method
          </Button>
        </Box>

        <Divider sx={{ borderColor: '#2a2a2a' }} />

        {/* Transaction History */}
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
              Transaction History
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              View all past transactions and invoices
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#2a2a2a',
              color: '#94a3b8',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: 'rgba(148, 163, 184, 0.08)',
              },
            }}
          >
            View History
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;
