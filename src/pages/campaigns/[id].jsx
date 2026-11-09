import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Layout } from '../../components/layout';
import { CampaignHeader, CreatorDealCard, CreatorDetailTabs } from '../../components/campaigns';
import CampaignContentHistory from '../../components/campaigns/CampaignContentHistory';
import apiClient from '../../utils/apiClient';
import { MAX_OFFER_PLACE_LIMIT } from '../../utils/library';
const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';


const CampaignDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [campaign, setCampaign] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Get brandId from localStorage
  const brandId = typeof window !== 'undefined' ? localStorage.getItem('collab_brand_id') : null;

  // Fetch campaign details and offers
  // Fetch campaign details and offers
  useEffect(() => {
    const fetchData = async () => {
      if (!router.isReady || !id || !brandId) return;

      setLoading(true);
      try {
        // Fetch campaign details
        const campaignResponse = await apiClient.get(`${API_BASE_URL}/brand/campaign?brandId=${brandId}&campaignId=${id}`);

        if (campaignResponse.data.errorResponse?.errorData === 0 &&
          campaignResponse.data.campaignList &&
          campaignResponse.data.campaignList.length > 0) {
          const campaignData = campaignResponse.data.campaignList[0];
          console.log('Campaign data loaded:', campaignData);
          setCampaign(campaignData);

          // Fetch offers
          try {
            const offersResponse = await apiClient.post(`${API_BASE_URL}/brand/offers`, {
              brandId: parseInt(brandId),
            });

            if (offersResponse.data.errorResponse?.errorData === 0 && offersResponse.data.offerList) {
              setOffers(offersResponse.data.offerList);
              console.log('Offers loaded:', offersResponse.data.offerList);
            } else if (offersResponse.data.errorResponse?.errorData === 1) {
              setSnackbar({
                open: true,
                message: offersResponse.data.errorResponse?.errorMsg || 'Failed to load offers',
                severity: 'error',
              });
              setOffers([]);
            } else {
              setOffers([]);
            }
          } catch (offerErr) {
            console.error('Error fetching offers:', offerErr);
            setSnackbar({
              open: true,
              message: offerErr.response?.data?.errorResponse?.errorMsg || 'Failed to load offers',
              severity: 'error',
            });
            setOffers([]);
          }

          setError(null);
        } else if (campaignResponse.data.errorResponse?.errorData === 1) {
          setError('Campaign not found');
          setSnackbar({
            open: true,
            message: campaignResponse.data.errorResponse?.errorMsg || 'Failed to load campaign',
            severity: 'error',
          });
        } else {
          setError('Campaign not found');
          setSnackbar({
            open: true,
            message: 'Failed to load campaign',
            severity: 'error',
          });
        }
      } catch (err) {
        console.error('Error fetching campaign details:', err);
        setError('Failed to load campaign details');
        setSnackbar({
          open: true,
          message: err.response?.data?.errorResponse?.errorMsg || 'Failed to load campaign details. Please try again.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, id, brandId]);

  const handleReleasePayment = (creatorId) => {
    console.log('Release payment for creator:', creatorId);
    setSnackbar({
      open: true,
      message: 'Payment release initiated',
      severity: 'success',
    });
  };

  const handleCounterOfferSuccess = (message) => {
    setSnackbar({
      open: true,
      message: message,
      severity: 'success',
    });

    // Refresh offers after successful counter offer
    if (brandId) {
      apiClient.post(`${API_BASE_URL}/brand/offers`, { brandId: parseInt(brandId) })
        .then(response => {
          if (response.data.errorResponse?.errorData === 0 && response.data.offerList) {
            setOffers(response.data.offerList);
          }
        })
        .catch(err => console.error('Error refreshing offers:', err));
    }
  };

  const handleContentHistoryError = (message) => {
    setSnackbar({
      open: true,
      message: message,
      severity: 'warning',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Loading state
  if (!router.isReady || loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  // Error state
  if (error || !campaign) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h5" sx={{ color: '#f44336', mb: 2 }}>
            {error || 'Campaign not found'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Unable to load campaign details. Please try again or check the campaign ID.
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Campaign Header */}
      <CampaignHeader
        campaign={campaign}
        maxCreatorApplications={campaign.maxCreatorApplications}
        budgetPerCreator={campaign.budgetPerCreator}
      />

      {/* Creator Deals Section */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, mt: 4 }}>
        Creator Deals
      </Typography>

      {campaign.creators && campaign.creators.length > 0 ? (
        campaign.creators.map((creator) => {
          // Find offer for this creator
          const creatorOffer = offers.find(offer => offer.creatorId === creator.creatorId);

          // Check if counter offer limit reached
          const hasReachedOfferLimit = offers.length >= MAX_OFFER_PLACE_LIMIT;

          // Transform creator data to match CreatorDealCard expected format
          const dealData = {
            id: creator.creatorId,
            avatar: creator.creatorName ? creator.creatorName.substring(0, 2).toUpperCase() : 'CR',
            handle: creator.creatorName || 'Unknown Creator',
            followers: creator.followerCount ? `${creator.followerCount.toLocaleString()}` : '0',
            status: 'Active',
            kpiProgress: creator.engagementRate ? `${creator.engagementRate}%` : '0%',
            deliverables: campaign.deliverables
              ? `${campaign.deliverables.reduce((sum, d) => sum + d.quantity, 0)} items`
              : '0 items',
            payout: campaign.totalBudget
              ? `${campaign.totalBudget.toLocaleString()} ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`
              : `0 ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`,
            views: creator.totalImpression
              ? creator.totalImpression.toLocaleString()
              : '0',
          };

          return (
            <Box key={creator.creatorId} sx={{ mb: 4 }}>
              <CreatorDealCard
                deal={dealData}
                offer={creatorOffer}
                brandId={brandId}
                campaignId={id}
                hasReachedOfferLimit={hasReachedOfferLimit}
                currentOfferCount={offers.length}
                maxOfferLimit={MAX_OFFER_PLACE_LIMIT}
                onCounterOfferSuccess={handleCounterOfferSuccess}
                onReleasePayment={() => handleReleasePayment(creator.creatorId)}
              />
              {/* Creator Detail Tabs */}
              <CreatorDetailTabs
                creatorData={creator}
                brandId={brandId}
                offerId={creatorOffer?.offerId}
              />
            </Box>
          );
        })
      ) : (
        <Box sx={{ textAlign: 'center', py: 6, backgroundColor: '#1a1a1a', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
            No creators assigned yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Creators will appear here once they accept your offers
          </Typography>
        </Box>
      )}

      {/* Content History Section */}
      <Box sx={{ mt: 6 }}>
        <CampaignContentHistory
          campaignId={id}
          onError={handleContentHistoryError}
        />
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default CampaignDetailsPage;