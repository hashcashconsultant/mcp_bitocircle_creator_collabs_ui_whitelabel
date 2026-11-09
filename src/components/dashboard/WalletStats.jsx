import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const WalletStats = ({ data }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {data.name}
          </Typography>
          {data.verified && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#4caf50',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Verified
              </Typography>
            </Box>
          )}
        </Box>

        {/* Stats Row */}
        <Grid container spacing={3}>
          {/* Active Campaigns */}
          <Grid item xs={6} sm={3}>
            <Typography
              variant="caption"
              sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}
            >
              Active Campaigns
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mt: 0.5 }}>
              {data.activeCampaigns}
            </Typography>
          </Grid>

          {/* Total Spent */}
          <Grid item xs={6} sm={3}>
            <Typography
              variant="caption"
              sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}
            >
              Total Spent
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mt: 0.5, color: '#f44336' }}>
              {data.totalSpent}
            </Typography>
          </Grid>

          {/* Creators */}
          <Grid item xs={6} sm={3}>
            <Typography
              variant="caption"
              sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}
            >
              Creators
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mt: 0.5 }}>
              {data.creators}
            </Typography>
          </Grid>

          {/* Wallet Balance */}
          <Grid item xs={6} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
              <Typography
                variant="caption"
                sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}
              >
                Balance
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mt: 0.5, color: '#4caf50' }}>
              {data.balance}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WalletStats;