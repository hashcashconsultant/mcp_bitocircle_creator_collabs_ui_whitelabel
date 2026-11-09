import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Button, Grid, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import { StatusBadge, StatCard } from '../common';
import CounterOfferDialog from './CounterOfferDialog';
import ReleasePaymentDialog from './ReleasePaymentDialog';

const CreatorDealCard = ({
  deal,
  offer,
  brandId,
  campaignId,
  hasReachedOfferLimit,
  currentOfferCount,
  maxOfferLimit,
  onCounterOfferSuccess,
  onReleasePaymentSuccess
}) => {
  const [counterOfferOpen, setCounterOfferOpen] = useState(false);
  const [releasePaymentOpen, setReleasePaymentOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleCounterOfferClick = () => {
    setCounterOfferOpen(true);
  };

  const handleCounterOfferClose = () => {
    setCounterOfferOpen(false);
  };

  const handleCounterOfferSuccess = (message) => {
    setCounterOfferOpen(false);
    onCounterOfferSuccess?.(message);
  };
  const handleReleasePaymentClick = () => {
    setReleasePaymentOpen(true);
  };

  const handleReleasePaymentClose = () => {
    setReleasePaymentOpen(false);
  };

  const handleReleasePaymentSuccess = (message) => {
    setReleasePaymentOpen(false);
    onReleasePaymentSuccess?.(message);
  };

  // Only show counter offer button if there's an offer for this creator
  const showCounterOffer = offer != null;

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Creator Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Avatar
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  backgroundColor: '#2196f3',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 600,
                }}
              >
                {deal.avatar}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {deal.handle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#94a3b8',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {deal.followers} followers
                </Typography>
              </Box>
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <StatusBadge status={deal.status} />
              </Box>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <StatusBadge status={deal.status} />
            </Box>
          </Box>

          {/* Stats Row */}
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <StatCard
                label="KPI Progress"
                value={deal.kpiProgress}
                valueVariant={isMobile ? "h5" : "h4"}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                label="Deliverables"
                value={deal.deliverables}
                valueVariant="h6"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                label="Payout"
                value={deal.payout}
                valueVariant="h6"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard
                label="Views"
                value={deal.views}
                valueVariant="h6"
              />
            </Grid>
          </Grid>

          {/* Action Buttons - Responsive Layout */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}>
            <Button
              variant="contained"
              onClick={handleReleasePaymentClick}
              fullWidth={isMobile}
              sx={{
                backgroundColor: '#f44336',
                '&:hover': { backgroundColor: '#d32f2f' },
                minWidth: { xs: 'auto', sm: 180 },
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Release Payment
            </Button>

            {
              showCounterOffer && (
                <Tooltip
                  title={
                    hasReachedOfferLimit
                      ? `You cannot place any counter offer. There are already ${currentOfferCount} of ${maxOfferLimit} offers placed.`
                      : ''
                  }
                  arrow
                  placement="top"
                >
                  <span>
                    <Button
                      variant="outlined"
                      onClick={handleCounterOfferClick}
                      disabled={hasReachedOfferLimit}
                      fullWidth={isMobile}
                      sx={{
                        borderColor: hasReachedOfferLimit ? '#666' : '#2196f3',
                        color: hasReachedOfferLimit ? '#666' : '#2196f3',
                        '&:hover': {
                          borderColor: hasReachedOfferLimit ? '#666' : '#1976d2',
                          backgroundColor: hasReachedOfferLimit ? 'transparent' : 'rgba(33, 150, 243, 0.08)',
                        },
                        '&.Mui-disabled': {
                          borderColor: '#666',
                          color: '#666',
                        },
                        minWidth: { xs: 'auto', sm: 180 },
                        py: { xs: 1.2, sm: 1.5 },
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      Counter Offer
                    </Button>
                  </span>
                </Tooltip>
              )
            }

            
          </Box>
        </CardContent>
      </Card>

      {/* Counter Offer Dialog - only render if offer exists */}
      {showCounterOffer && (
        <CounterOfferDialog
          open={counterOfferOpen}
          onClose={handleCounterOfferClose}
          creatorId={deal.id}
          offerId={offer.offerId}
          brandId={brandId}
          campaignId={campaignId}
          initialOfferData={offer}
          onSuccess={handleCounterOfferSuccess}
        />
      )}
      {/* Realease Payment - only render if offer exists */}
        <ReleasePaymentDialog
          open={releasePaymentOpen}
          onClose={handleReleasePaymentClose}
          creatorId={deal.id}
          campaignId={campaignId}
          onSuccess={handleReleasePaymentSuccess}
        />
      
    </>
  );
};

export default CreatorDealCard;