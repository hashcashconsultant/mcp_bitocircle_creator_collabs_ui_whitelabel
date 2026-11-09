import React from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import moment from 'moment';
import { StatusBadge, ProgressBar, StatCard } from '../common';

const CampaignCard = ({
  campaign,
  onManage,
  onEdit,
  onActivate,
  onPause,
  onResume,
  onCancel,
  onComplete
}) => {
  const router = useRouter();

  const handleManage = () => {
    router.push(`/campaigns/${campaign.campaignId}`);
  };

  // Format date using moment.js
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('MMM DD, YYYY');
  };

  // Calculate duration between start and end date
  const calculateDuration = () => {
    if (!campaign.startDate || !campaign.endDate) return 'N/A';

    const start = moment(campaign.startDate);
    const end = moment(campaign.endDate);
    const duration = moment.duration(end.diff(start));

    const days = Math.floor(duration.asDays());

    if (days === 0 || days === 1) {
      return '1 day';
    } else {
      return `${days} days`;
    }
  };

  // Format created at date with time
  const formatCreatedAt = () => {
    if (!campaign.createdAt) return 'N/A';
    return moment(campaign.createdAt).format('MMM DD, YYYY [at] hh:mm A');
  };

  // Format budget with currency
  const formatBudget = () => {
    if (!campaign.totalBudget) return `0 ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`;
    return `${campaign.totalBudget.toLocaleString()} ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`;
  };

  // Format spent with currency
  const formatSpent = () => {
    if (!campaign.totalSpent) return `0 ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`;
    return `${campaign.totalSpent.toLocaleString()} ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`;
  };

  // Check if campaign end date has passed
  const hasEndDatePassed = () => {
    if (!campaign.endDate) return false;
    return moment().isAfter(moment(campaign.endDate));
  };

  // Parse KPI target to extract percentage if present
  const getKpiProgressValue = () => {
    const parsed = parseFloat(campaign.kpiTarget);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Determine which buttons to show based on status and end date
  const getActionButtons = () => {
    const status = campaign.status;
    const endDatePassed = hasEndDatePassed();

    // Status: DRAFT - Show Activate button
    if (status === 'DRAFT') {
      return (
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={onActivate}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#388e3c' },
              fontSize: '0.875rem',
              py: 1,
            }}
          >
            Activate
          </Button>
        </Grid>
      );
    }

    // Status: ACTIVE - Show Pause and Cancel buttons
    if (status === 'ACTIVE') {
      // If end date has passed, show Complete button
      if (endDatePassed) {
        return (
          <>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={onComplete}
                sx={{
                  backgroundColor: '#4caf50',
                  '&:hover': { backgroundColor: '#388e3c' },
                  fontSize: '0.875rem',
                  py: 1,
                }}
              >
                Complete
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onCancel}
                sx={{
                  borderColor: 'rgba(244, 67, 54, 0.5)',
                  color: '#f44336',
                  '&:hover': {
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.08)',
                  },
                  fontSize: '0.875rem',
                  py: 1,
                }}
              >
                Cancel
              </Button>
            </Grid>
          </>
        );
      }

      return (
        <>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onPause}
              sx={{
                borderColor: '#2a2a2a',
                color: '#94a3b8',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: 'rgba(148, 163, 184, 0.08)',
                },
                fontSize: '0.875rem',
                py: 1,
              }}
            >
              Pause
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onCancel}
              sx={{
                borderColor: 'rgba(244, 67, 54, 0.5)',
                color: '#f44336',
                '&:hover': {
                  borderColor: '#f44336',
                  backgroundColor: 'rgba(244, 67, 54, 0.08)',
                },
                fontSize: '0.875rem',
                py: 1,
              }}
            >
              Cancel
            </Button>
          </Grid>
        </>
      );
    }

    // Status: PAUSED - Show Resume and Cancel buttons
    if (status === 'PAUSED') {
      return (
        <>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={onResume}
              sx={{
                backgroundColor: '#2196f3',
                '&:hover': { backgroundColor: '#1976d2' },
                fontSize: '0.875rem',
                py: 1,
              }}
            >
              Resume
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onCancel}
              sx={{
                borderColor: 'rgba(244, 67, 54, 0.5)',
                color: '#f44336',
                '&:hover': {
                  borderColor: '#f44336',
                  backgroundColor: 'rgba(244, 67, 54, 0.08)',
                },
                fontSize: '0.875rem',
                py: 1,
              }}
            >
              Cancel
            </Button>
          </Grid>
        </>
      );
    }

    // Status: COMPLETED, CANCELLED, ENDED - Show no action buttons (read-only)
    return null;
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {campaign.campaignName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Created: {formatCreatedAt()} | Duration: {calculateDuration()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
              {hasEndDatePassed() && campaign.status === 'ACTIVE' && (
                <span style={{ color: '#ff9800', fontWeight: 600, marginLeft: '8px' }}>
                  (Ended)
                </span>
              )}
            </Typography>
          </Box>
          <StatusBadge status={campaign.status} />
        </Box>

        {/* Stats Row */}
        <Grid container spacing={3} sx={{ my: 2 }}>
          <Grid item xs={6} sm={3}>
            <StatCard
              label="Total Budget"
              value={formatBudget()}
              valueVariant="h5"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              label="Spent"
              value={formatSpent()}
              valueColor="#4caf50"
              valueVariant="h5"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              label="Creators"
              value={campaign.creators?.length || 0}
              valueVariant="h5"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              label="KPI Progress"
              value={campaign.kpiTarget}
              valueColor="#ff9800"
              valueVariant="h5"
            />
          </Grid>
        </Grid>

        

        {/* Action Buttons - All in one row */}
        <Grid container spacing={2}>
          {/* Manage Button - Always visible */}
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleManage}
              sx={{
                backgroundColor: '#2196f3',
                '&:hover': { backgroundColor: '#1976d2' },
                fontSize: '0.875rem',
                py: 1,
              }}
            >
              Manage
            </Button>
          </Grid>

          {/* Edit Button - Always visible except for COMPLETED/CANCELLED */}
          {campaign.status !== 'COMPLETED' && campaign.status !== 'CANCELLED'  && (
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onEdit}
                disabled={campaign.status === 'ACTIVE'}
                sx={{
                  borderColor: '#2a2a2a',
                  color: '#2196f3',
                  '&:hover': {
                    borderColor: '#2196f3',
                    backgroundColor: 'rgba(33, 150, 243, 0.08)',
                  },
                  fontSize: '0.875rem',
                  py: 1,
                }}
              >
                Edit
              </Button>
            </Grid>
          )}

          {/* Dynamic Action Buttons based on status */}
          {getActionButtons()}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;