import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Layout } from '../components/layout';
import { CreatorFilters, CreatorCard, ContentPerformance } from '../components/creators';
import { CreateCampaignModal } from '../components/campaigns';
import SendOfferModal from '../components/creators/SendOfferModal';
import AddToCampaignModal from '../components/creators/AddToCampaignModal';
import apiClient from '../utils/apiClient';

// Filter options
const followerRanges = [
  'Min Followers',
  '10K+',
  '50K+',
  '100K+',
  '500K+',
  '1M+',
];

const DiscoverCreators = () => {
  const [searchValue, setSearchValue] = useState('');
  const [followers, setFollowers] = useState('Min Followers');
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendOfferModalOpen, setIsSendOfferModalOpen] = useState(false);
  const [isAddToCampaignModalOpen, setIsAddToCampaignModalOpen] = useState(false);

  // API states
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Parse follower count from filter
  const getFollowerCount = () => {
    if (followers === 'Min Followers') return 0;
    const match = followers.match(/(\d+)([KM]?)/);
    if (match) {
      const num = parseInt(match[1]);
      if (match[2] === 'K') return num * 1000;
      if (match[2] === 'M') return num * 1000000;
      return num;
    }
    return 0;
  };

  // Fetch creators from API
  const fetchCreators = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        description: searchValue || '',
        category: '',
        region: '',
        followerCount: getFollowerCount(),
      };

      console.log('Fetching creators with payload:', payload);

      const response = await apiClient.post(
        'https://institutional-bo.paybito.com:8443/MonetizeService/brand/search_creator',
        payload
      );

      console.log('API Response:', response.data);

      // Check for API-level errors
      if (response.data.errorResponse?.errorData !== 0) {
        throw new Error(response.data.errorResponse?.errorMsg || 'API request failed');
      }

      // Use creator data directly from API (CreatorCard handles formatting)
      const creatorsList = response.data.creatorList || [];
      console.log('Creators list:', creatorsList);

      setCreators(creatorsList);

      if (creatorsList.length === 0) {
        setSnackbarMessage('No creators found matching your criteria');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Fetch creators error:', err);
      setError(err.message || 'Failed to fetch creators');
      setSnackbarMessage(err.message || 'Error fetching creators. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCreators();
  }, []);

  // Search when filters change (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (followers !== 'Min Followers' || searchValue) {
        fetchCreators();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [followers, searchValue]);

  const handleSendOffer = (creator) => {
    console.log('Send offer to creator:', creator);
    setSelectedCreator(creator);
    setIsSendOfferModalOpen(true);
  };

  const handleCloseSendOfferModal = () => {
    setIsSendOfferModalOpen(false);
    setSelectedCreator(null);
  };

  const handleAddToCampaign = (creator) => {
    console.log('Add creator to campaign:', creator);
    setSelectedCreator(creator);
    setIsAddToCampaignModalOpen(true);
  };

  const handleCloseAddToCampaignModal = () => {
    setIsAddToCampaignModalOpen(false);
    setSelectedCreator(null);
  };

  const handleFabClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Generate content performance data for first creator
  const getContentPerformance = (creator) => {
    if (!creator) return [];
    return [
      {
        type: 'Reels',
        earnings: creator.reelsEarnings || 0,
        impressions: Math.floor((creator.totalImpression || 0) * 0.4),
      },
      {
        type: 'Posts',
        earnings: creator.postsEarnings || 0,
        impressions: Math.floor((creator.totalImpression || 0) * 0.35),
      },
      {
        type: 'Stories',
        earnings: creator.storyEarnings || 0,
        impressions: Math.floor((creator.totalImpression || 0) * 0.25),
      },
    ];
  };

  return (
    <Layout onFabClick={handleFabClick}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Discover Creators
      </Typography>

      <CreatorFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        followers={followers}
        onFollowersChange={setFollowers}
        followerRanges={followerRanges}
      />

      {/* Loading State */}
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Creators Grid */}
      {!loading && !error && (
        <>
          <Grid container spacing={3}>
            {creators.map((creator) => (
              <Grid item xs={12} md={6} key={creator.creatorId}>
                <CreatorCard
                  creator={creator}
                  onSendOffer={() => handleSendOffer(creator)}
                  onAddToCampaign={() => handleAddToCampaign(creator)}
                />
              </Grid>
            ))}
          </Grid>

          {/* No Results Message */}
          {creators.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                No creators found
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Try adjusting your filters or search criteria
              </Typography>
            </Box>
          )}

          {/* Content Performance Section (for first creator) */}
          {creators.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <ContentPerformance
                data={getContentPerformance(creators[0])}
              />
            </Box>
          )}
        </>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal open={isModalOpen} onClose={handleCloseModal} />

      {/* Send Offer Modal */}
      <SendOfferModal
        open={isSendOfferModalOpen}
        onClose={handleCloseSendOfferModal}
        creator={selectedCreator}
      />

      {/* Add to Campaign Modal */}
      <AddToCampaignModal
        open={isAddToCampaignModalOpen}
        onClose={handleCloseAddToCampaignModal}
        creator={selectedCreator}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default DiscoverCreators;