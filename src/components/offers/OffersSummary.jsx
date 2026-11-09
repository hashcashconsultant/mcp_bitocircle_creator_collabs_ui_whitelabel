// components/offers/OffersSummary.jsx
import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const SummaryCard = ({ title, value, icon: Icon, color }) => (
    <Paper
        sx={{
            p: 3,
            backgroundColor: '#1a1a1a',
            borderRadius: 2,
            border: '1px solid #2a2a2a',
            height: '100%',
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                    {value}
                </Typography>
            </Box>
            <Box
                sx={{
                    backgroundColor: `${color}20`,
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Icon sx={{ color, fontSize: 28 }} />
            </Box>
        </Box>
    </Paper>
);

const OffersSummary = ({ summary }) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <SummaryCard
                    title="Total Offers"
                    value={summary.totalOffers}
                    icon={LocalOfferIcon}
                    color="#3b82f6"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <SummaryCard
                    title="Pending"
                    value={summary.pending}
                    icon={PendingActionsIcon}
                    color="#f59e0b"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <SummaryCard
                    title="Accepted"
                    value={summary.accepted}
                    icon={CheckCircleIcon}
                    color="#22c55e"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <SummaryCard
                    title="Rejected"
                    value={summary.rejected}
                    icon={CancelIcon}
                    color="#ef4444"
                />
            </Grid>
        </Grid>
    );
};

export default OffersSummary;