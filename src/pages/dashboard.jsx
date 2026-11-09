import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { Layout } from '../components/layout';
import {
  WalletStats,
  ActiveCampaignCard,
  AIInsights,
  TopPerformingCreators,
  AISuggestions,
  CurrentEscrow
} from '../components/dashboard';
import { CreateCampaignModal, EditCampaignModal } from '../components/campaigns';
import apiClient from '../utils/apiClient';
import CustomSnackbar from '../utils/CustomSnackbar';
import { updateCampaignStatus, getBrandId } from '../utils/library';
import { useBrand } from '../context/BrandContext';
import {
  aiInsights,
  aiSuggestion,
} from '../data/mockData';

// API base URL
const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

const Dashboard = () => {
  // Get brand data from context
  const { brandData } = useBrand();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletStats, setWalletStats] = useState({
    name: brandData?.brandName || 'Brand Dashboard',
    verified: brandData?.isVerified || true,
    activeCampaigns: 0,
    totalSpent: '0 B$',
    creators: 0,
    balance: '0 B$',
  });
  const [escrowData, setEscrowData] = useState({
    amount: '0 B$',
    pendingReleases: 0,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Update wallet stats when brand data changes
  useEffect(() => {
    if (brandData) {
      setWalletStats((prev) => ({
        ...prev,
        name: brandData.brandName || 'Brand Dashboard',
        verified: brandData.isVerified !== undefined ? brandData.isVerified : true,
        balance: brandData.balance
          ? `${brandData.balance.toLocaleString()} B$`
          : '0 B$',
      }));
      setEscrowData((prev) => ({
        ...prev,
        amount: `${brandData.escrowBalance} B$`,
        pendingReleases : 0

      }))
    }
  }, [brandData]);

  // Show snackbar helper
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    await Promise.all([
      fetchActiveCampaigns(),
      fetchTopCreators(),
    ]);
  };

  // Fetch top performing creators
  const fetchTopCreators = async () => {
    try {
      const brandId = localStorage.getItem('collab_brand_id') || '1';

      const response = await apiClient.get(
        `${API_BASE_URL}/brand/creators?brandId=${brandId}`
      );

      console.log('Creators API Response:', response.data);

      // Check for error response
      if (response.data.errorResponse?.errorData !== 0) {
        throw new Error(response.data.errorResponse?.errorMsg || 'Failed to fetch creators');
      }

      // Get creator list
      const creatorList = response.data.creatorList || [];

      // Sort by followerCount (descending) and take top 10
      const sortedCreators = creatorList
        .sort((a, b) => (b.followerCount || 0) - (a.followerCount || 0))
        .slice(0, 10);

      // Transform to match component format
      const transformedCreators = sortedCreators.map((creator, index) => {
        // Generate avatar initials
        const nameParts = creator.creatorName?.split(' ') || [];
        const initials = nameParts
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .substring(0, 2) || 'CR';

        // Generate color based on index
        const colors = ['#2196f3', '#4caf50', '#9c27b0', '#ff9800', '#f44336', '#00bcd4', '#8bc34a', '#e91e63', '#3f51b5', '#cddc39'];
        const color = colors[index % colors.length];

        return {
          avatar: initials,
          handle: `@${creator.creatorName?.toLowerCase().replace(/\s+/g, '')}`,
          followers: formatFollowers(creator.followerCount || 0),
          followerCount: creator.followerCount || 0,
          color: color,
          creatorId: creator.creatorId,
          creatorName: creator.creatorName,
        };
      });

      setTopCreators(transformedCreators);
      console.log(`Loaded ${transformedCreators.length} top creators`);
    } catch (err) {
      console.error('Error fetching top creators:', err);
      // Don't show error snackbar for this - just fail silently
      setTopCreators([]);
    }
  };

  // Format follower count (e.g., 1000 -> 1K, 1500000 -> 1.5M)
  const formatFollowers = (count) => {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  const fetchActiveCampaigns = async () => {
    setLoading(true);
    setError(null);

    try {
      const brandId = localStorage.getItem('collab_brand_id') || '1';

      // Make API call
      const response = await apiClient.get(
        `${API_BASE_URL}/brand/campaigns?brandId=${brandId}&campaignType=IN_APPLICATION`
      );

      console.log('Campaigns API Response:', response.data);

      // Check for error response
      const errorResponse = response.data.errorResponse;
      if (errorResponse && errorResponse.errorData !== 0) {
        const errorMessage = errorResponse.errorMsg || 'Failed to fetch campaigns';
        setError(errorMessage);
        showSnackbar(errorMessage, 'error');
        setActiveCampaigns([]);
        return;
      }

      // Extract campaign list from response
      const campaignList = response.data.campaignList || [];

      // Filter only ACTIVE campaigns
      const activeCampaignsList = campaignList.filter(
        campaign => campaign.status === 'ACTIVE'
      );

      // Transform API data to match component's expected format
      const transformedCampaigns = activeCampaignsList.map((campaign) => ({
        id: campaign.campaignId,
        campaignId: campaign.campaignId,
        campaignName: campaign.campaignName,
        name: campaign.campaignName, // Alias for backward compatibility
        description: campaign.description,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        creatorRegion: campaign.creatorRegion,
        creatorType: campaign.creatorType,
        audienceInterest: campaign.audienceInterest,
        minFollowerCount: campaign.minFollowerCount,
        avgEngagementRate: campaign.avgEngagementRate,
        compensationType: campaign.compensationType,
        paymentCurrency: campaign.paymentCurrency,
        totalBudget: campaign.totalBudget,
        totalSpent: campaign.totalSpent,
        kpiType: campaign.kpiType,
        kpiTarget: campaign.kpiTarget,
        escrowEnabled: campaign.escrowEnabled,
        autoPayoutEnabled: campaign.autoPayoutEnabled,
        rights: campaign.rights,
        exclusivityDurationDays: campaign.exclusivityDurationDays,
        status: campaign.status,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        publishedAt: campaign.publishedAt,
        brandId: campaign.brandId,
        deliverables: campaign.deliverables || [],
        tags: campaign.tags || [],
        creators: campaign.creators || [],
      }));

      setActiveCampaigns(transformedCampaigns);

      if (transformedCampaigns.length === 0) {
        showSnackbar('No active campaigns found', 'info');
      } else {
        console.log(`Found ${transformedCampaigns.length} active campaign(s)`);
      }

      // Calculate totals
      const totalSpent = transformedCampaigns.reduce((sum, campaign) => {
        const spent = parseFloat(campaign.totalSpent) || 0;
        return sum + spent;
      }, 0);

      const totalCreators = transformedCampaigns.reduce((sum, campaign) => {
        const creatorsCount = campaign.creators?.length || 0;
        return sum + creatorsCount;
      }, 0);

      // Update wallet stats with campaign data
      setWalletStats((prev) => ({
        ...prev,
        activeCampaigns: transformedCampaigns.length,
        totalSpent: `${totalSpent.toLocaleString()} B$`,
        creators: totalCreators,
      }));
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      const errorMessage = err.message || 'Failed to load campaigns. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
      setActiveCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFabClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Refresh active campaigns after modal closes (in case a new campaign was created)
    fetchActiveCampaigns();
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCampaign(null);
    // Refresh active campaigns after edit modal closes
    fetchActiveCampaigns();
  };

  const handlePause = async (id) => {
    try {
      const brandId = getBrandId();
      await updateCampaignStatus(id, brandId, 'PAUSED');
      showSnackbar('Campaign paused successfully!', 'success');
      fetchActiveCampaigns();
    } catch (err) {
      console.error('Failed to pause campaign:', err);
      showSnackbar(err.message || 'Failed to pause campaign', 'error');
    }
  };

  return (
    <Layout onFabClick={handleFabClick}>
      <Grid container spacing={3}>
        {/* Main Content Area */}
        <Grid item xs={12} lg={9}>
          {/* Wallet Stats Section */}
          <WalletStats data={walletStats} />

          {/* Active Campaigns Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Active Campaigns
            </Typography>
            {loading && (
              <CircularProgress size={24} sx={{ color: '#2196f3' }} />
            )}
          </Box>

          {/* Error State */}
          {error && !loading && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              action={
                <Typography
                  sx={{
                    color: '#2196f3',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '0.875rem',
                  }}
                  onClick={fetchActiveCampaigns}
                >
                  Retry
                </Typography>
              }
            >
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && activeCampaigns.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
              }}
            >
              <CircularProgress size={60} sx={{ color: '#2196f3' }} />
            </Box>
          ) : activeCampaigns.length === 0 && !loading ? (
            // Empty State
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                textAlign: 'center',
                mb: 3,
                p: 4,
                backgroundColor: '#0a0a0a',
                borderRadius: 2,
                border: '1px solid #2a2a2a',
              }}
            >
              <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                No Active Campaigns
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Create a new campaign or activate an existing one to see it here
              </Typography>
            </Box>
          ) : (
            // Success State with Active Campaigns
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {activeCampaigns.map((campaign) => (
                <Grid item xs={12} sm={6} md={4} key={campaign.id}>
                  <ActiveCampaignCard
                    campaign={campaign}
                    onEdit={() => handleEditCampaign(campaign)}
                    onPause={() => handlePause(campaign.id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* AI Insights Section */}
          <AIInsights insights={aiInsights} />
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={3}>
          <TopPerformingCreators creators={topCreators} />
          <AISuggestions suggestion={aiSuggestion} />
          <CurrentEscrow amount={escrowData.amount} pendingReleases={escrowData.pendingReleases} />
        </Grid>
      </Grid>

      {/* Create Campaign Modal */}
      <CreateCampaignModal open={isModalOpen} onClose={handleCloseModal} />

      {/* Edit Campaign Modal */}
      <EditCampaignModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        campaignData={selectedCampaign}
      />

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Layout>
  );
};

export default Dashboard;