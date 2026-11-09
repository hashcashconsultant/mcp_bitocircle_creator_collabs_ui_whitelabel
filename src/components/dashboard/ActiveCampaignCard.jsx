import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, Typography, Button, LinearProgress } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


const ActiveCampaignCard = ({ campaign, onPause }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleViewDetails = () => {
    router.push(`/campaigns/${campaign.id}`);
  };


  // Format budget with currency
  const formatBudget = () => {
    if (!campaign.totalBudget) return 'N/A';
    return `${campaign.totalBudget.toLocaleString()} ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`;
  };



  return (
    <Fragment>

      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {campaign.name}
            </Typography>
          </Box>

          {/* Creators Active */}
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
            {campaign.creators.length} Creators Active
          </Typography>

          {/* Budget and KPI */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {/* <MonetizationOnIcon sx={{ fontSize: 16, color: '#ff9800' }} /> */}
              <Typography variant="body2" sx={{ color: '#ff9800' }}>
                {formatBudget()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 16, color: '#4caf50' }} />
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                {campaign.kpiTarget}
              </Typography>
            </Box>
          </Box>

          {/* Spacer to push buttons to bottom */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              sx={{
                flex: 1,
                backgroundColor: '#2196f3',
                fontSize: '0.75rem',
                py: 1,
                '&:hover': { backgroundColor: '#1976d2' },
              }}
            >
              View Details
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onPause}
              sx={{
                flex: 1,
                borderColor: '#2a2a2a',
                color: '#94a3b8',
                fontSize: '0.75rem',
                py: 1,
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: 'rgba(148, 163, 184, 0.08)',
                },
              }}
            >
              Pause
            </Button>
            {/* <Button
            variant="outlined"
            size="small"
            sx={{
              flex: 1,
              borderColor: '#2a2a2a',
              color: '#2196f3',
              fontSize: '0.75rem',
              py: 1,
              '&:hover': {
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
              },
            }}
          >
            Duplicate
          </Button> */}
          </Box>
        </CardContent>
      </Card>

    </Fragment>
  );
};

export default ActiveCampaignCard;