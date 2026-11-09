import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const CurrentEscrow = ({ amount, pendingReleases }) => {
  return (
    <Card>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccountBalanceWalletIcon sx={{ color: '#ff9800', fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Current Escrow
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 0.5 }}>
          {amount}
        </Typography>

        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          {pendingReleases} pending releases
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CurrentEscrow;
