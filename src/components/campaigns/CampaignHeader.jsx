import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Grid, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useRouter } from 'next/router';
import { StatusBadge } from '../common';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatCurrency = (amount, currency = 'USDB') => {
  if (amount === null || amount === undefined || amount === '') return '0.00 B$';
  return `${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} B$`;
};

const CampaignHeader = ({ campaign, maxCreatorApplications, budgetPerCreator }) => {
  const router = useRouter();

  if (!campaign) return null;

  // Safe value getters with 0 fallback
  const getMaxCreatorApplications = () => {
    return maxCreatorApplications !== null && maxCreatorApplications !== undefined && maxCreatorApplications !== ''
      ? maxCreatorApplications
      : 0;
  };

  const getBudgetPerCreator = () => {
    return budgetPerCreator !== null && budgetPerCreator !== undefined && budgetPerCreator !== ''
      ? parseFloat(budgetPerCreator)
      : 0;
  };

  const maxCreators = getMaxCreatorApplications();
  const perCreatorBudget = getBudgetPerCreator();
  const totalAllocation = maxCreators * perCreatorBudget;
  const remainingBudget = (campaign.totalBudget || 0) - totalAllocation;

  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/campaigns')}
        sx={{
          color: '#2196f3',
          textTransform: 'none',
          fontWeight: 500,
          mb: 3,
          '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.08)',
          },
        }}
      >
        Back to Campaigns
      </Button>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Campaign Title and Status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {campaign.campaignName || 'Untitled Campaign'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8', mb: 2 }}>
                {campaign.description || 'No description provided'}
              </Typography>

              {/* Tags */}
              {campaign.tags && campaign.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {campaign.tags.map((tag) => (
                    <Chip
                      key={tag.tagId}
                      label={tag.tagName}
                      size="small"
                      sx={{
                        backgroundColor: '#1e293b',
                        color: '#2196f3',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
            <StatusBadge status={campaign.status || 'DRAFT'} />
          </Box>

          {/* Campaign Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CalendarTodayIcon sx={{ color: '#2196f3', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    DURATION
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AttachMoneyIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    TOTAL BUDGET
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(campaign.totalBudget, campaign.paymentCurrency)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AttachMoneyIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    TOTAL SPENT
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(campaign.totalSpent, campaign.paymentCurrency)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TrendingUpIcon sx={{ color: '#2196f3', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    KPI TARGET
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {campaign.kpiTarget || 'Not specified'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Budget Allocation Section */}
          <Box sx={{ mb: 3, p: 2.5, backgroundColor: '#0a0a0a', borderRadius: 1, border: '1px solid #2a2a2a' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2.5, color: '#2196f3', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
              Budget Allocation
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PeopleIcon sx={{ color: '#9c27b0', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      MAX CREATOR APPLICATIONS
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {maxCreators}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AccountBalanceWalletIcon sx={{ color: '#00bcd4', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      BUDGET PER CREATOR
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatCurrency(perCreatorBudget, campaign.paymentCurrency)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AttachMoneyIcon sx={{ color: '#673ab7', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      TOTAL ALLOCATION
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatCurrency(totalAllocation, campaign.paymentCurrency)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AttachMoneyIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      REMAINING BUDGET
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: remainingBudget < 0 ? '#f44336' : '#ffffff' }}>
                      {formatCurrency(remainingBudget, campaign.paymentCurrency)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Deliverables */}
          {campaign.deliverables && campaign.deliverables.length > 0 && (
            <Box sx={{ pt: 3, borderTop: '1px solid #2a2a2a' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                Deliverables
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {campaign.deliverables.map((deliverable) => (
                  <Chip
                    key={deliverable.deliverableId}
                    label={`${deliverable.quantity}x ${deliverable.deliverableType.replace(/_/g, ' ')} @ ${formatCurrency(deliverable.pricePerUnit)}`}
                    sx={{
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Campaign Details */}
          <Box sx={{ pt: 3, mt: 3, borderTop: '1px solid #2a2a2a' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  CREATOR REGION
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {campaign.creatorRegion || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  CREATOR TYPE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {campaign.creatorType || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  AUDIENCE INTEREST
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {campaign.audienceInterest || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  MIN FOLLOWERS
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {campaign.minFollowerCount ? campaign.minFollowerCount.toLocaleString() : '0'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  AVG ENGAGEMENT RATE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {campaign.avgEngagementRate ? `${campaign.avgEngagementRate}%` : '0%'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  COMPENSATION TYPE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {campaign.compensationType || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CampaignHeader;