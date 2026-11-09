import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, ButtonGroup } from '@mui/material';
import { Layout } from '../components/layout';
import { CampaignCard, CreateCampaignModal, EditCampaignModal } from '../components/campaigns';
import apiClient from '../utils/apiClient';
import CustomSnackbar from '../utils/CustomSnackbar';
import { updateCampaignStatus, getBrandId } from '../utils/library';

// API base URL
const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

const MyCampaigns = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('IN_APPLICATION'); // Default filter

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

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

  // Fetch campaigns on component mount and when filter changes
  useEffect(() => {
    fetchCampaigns();
  }, [selectedFilter]);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);

    try {
      const brandId = localStorage.getItem('collab_brand_id') || '1';

      // Make API call with filter parameter
      const response = await apiClient.get(
        `${API_BASE_URL}/brand/campaigns?brandId=${brandId}&campaignType=${selectedFilter}`
      );

      console.log('Campaigns API Response:', response.data);

      // Check for error response
      const errorResponse = response.data.errorResponse;
      if (errorResponse && errorResponse.errorData !== 0) {
        const errorMessage = errorResponse.errorMsg || 'Failed to fetch campaigns';
        setError(errorMessage);
        showSnackbar(errorMessage, 'error');
        setCampaigns([]);
        return;
      }

      // Extract campaign list from response
      const campaignList = response.data.campaignList || [];

      // Transform API data to match your component's expected format
      const transformedCampaigns = campaignList.map((campaign) => ({
        id: campaign.campaignId,
        campaignId: campaign.campaignId,
        campaignName: campaign.campaignName,
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

      setCampaigns(transformedCampaigns);

      if (transformedCampaigns.length === 0) {
        showSnackbar(`No campaigns found for ${selectedFilter.toLowerCase()} filter.`, 'info');
      }

    } catch (err) {
      console.error('Error fetching campaigns:', err);
      const errorMessage = err.message || 'Failed to load campaigns. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleManage = (id) => {
    console.log('Manage campaign:', id);
    showSnackbar('Opening campaign management...', 'info');
  };

  const handleEdit = (campaign) => {
    console.log('Edit campaign:', campaign.campaignId);
    setSelectedCampaign(campaign);
    setIsEditModalOpen(true);
  };

  // ========== Activate Campaign (from DRAFT) ==========
  const handleActivate = async (id) => {
    try {
      const brandId = getBrandId();
      await updateCampaignStatus(id, brandId, 'ACTIVE');
      showSnackbar('Campaign activated successfully!', 'success');
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to activate campaign:', err);
      showSnackbar(err.message || 'Failed to activate campaign', 'error');
    }
  };

  // ========== Pause Campaign ==========
  const handlePause = async (id) => {
    try {
      const brandId = getBrandId();
      await updateCampaignStatus(id, brandId, 'PAUSED');
      showSnackbar('Campaign paused successfully!', 'success');
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to pause campaign:', err);
      showSnackbar(err.message || 'Failed to pause campaign', 'error');
    }
  };

  // ========== Resume Campaign (from PAUSED) ==========
  const handleResume = async (id) => {
    try {
      const brandId = getBrandId();
      await updateCampaignStatus(id, brandId, 'ACTIVE');
      showSnackbar('Campaign resumed successfully!', 'success');
      fetchCampaigns();
    } catch (err) {
      showSnackbar(err.message || 'Failed to resume campaign', 'error');
    }
  };

  // ========== Cancel Campaign ==========
  const handleCancel = async (id) => {
    try {
      const brandId = getBrandId();
      await updateCampaignStatus(id, brandId, 'CANCELLED');
      showSnackbar('Campaign cancelled successfully!', 'success');
      fetchCampaigns();
    } catch (err) {
      showSnackbar(err.message || 'Failed to cancel campaign', 'error');
    }
  };

  // ========== Complete Campaign ==========
  const handleComplete = async (id) => {
    try {
      const brandId = getBrandId();
      await updateCampaignStatus(id, brandId, 'COMPLETED');
      showSnackbar('Campaign completed successfully!', 'success');
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to complete campaign:', err);
      showSnackbar(err.message || 'Failed to complete campaign', 'error');
    }
  };

  const handleFabClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchCampaigns();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCampaign(null);
    fetchCampaigns();
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress size={60} sx={{ color: '#2196f3' }} />
        </Box>
      </Layout>
    );
  }

  // Error state
  if (error && campaigns.length === 0) {
    return (
      <Layout onFabClick={handleFabClick}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            My Campaigns
          </Typography>

          {/* Filter Buttons */}
          <ButtonGroup
            variant="outlined"
            sx={{
              '& .MuiButton-root': {
                borderColor: '#2a2a2a',
                color: '#94a3b8',
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                '&:hover': {
                  borderColor: '#2196f3',
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                },
              },
              '& .MuiButton-root.active': {
                borderColor: '#2196f3',
                backgroundColor: '#2196f3',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  borderColor: '#1976d2',
                },
              },
            }}
          >
            <Button
              onClick={() => handleFilterChange('IN_APPLICATION')}
              className={selectedFilter === 'IN_APPLICATION' ? 'active' : ''}
            >
              By Application
            </Button>
            <Button
              onClick={() => handleFilterChange('IN_INVITATION')}
              className={selectedFilter === 'IN_INVITATION' ? 'active' : ''}
            >
              By Invitation
            </Button>
            <Button
              onClick={() => handleFilterChange('IN_OFFER')}
              className={selectedFilter === 'IN_OFFER' ? 'active' : ''}
            >
              By Offer
            </Button>
          </ButtonGroup>
        </Box>
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Typography
              sx={{
                color: '#2196f3',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={fetchCampaigns}
            >
              Retry
            </Typography>
          }
        >
          {error}
        </Alert>

        <CreateCampaignModal open={isModalOpen} onClose={handleCloseModal} />
        <EditCampaignModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          campaignData={selectedCampaign}
        />
        <CustomSnackbar
          open={snackbar.open}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </Layout>
    );
  }

  // Empty state
  if (campaigns.length === 0) {
    return (
      <Layout onFabClick={handleFabClick}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            My Campaigns
          </Typography>

          {/* Filter Buttons */}
          <ButtonGroup
            variant="outlined"
            sx={{
              '& .MuiButton-root': {
                borderColor: '#2a2a2a',
                color: '#94a3b8',
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                '&:hover': {
                  borderColor: '#2196f3',
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                },
              },
              '& .MuiButton-root.active': {
                borderColor: '#2196f3',
                backgroundColor: '#2196f3',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  borderColor: '#1976d2',
                },
              },
            }}
          >
            <Button
              onClick={() => handleFilterChange('IN_APPLICATION')}
              className={selectedFilter === 'IN_APPLICATION' ? 'active' : ''}
            >
              By Application
            </Button>
            <Button
              onClick={() => handleFilterChange('IN_INVITATION')}
              className={selectedFilter === 'IN_INVITATION' ? 'active' : ''}
            >
              By Invitation
            </Button>
            <Button
              onClick={() => handleFilterChange('IN_OFFER')}
              className={selectedFilter === 'IN_OFFER' ? 'active' : ''}
            >
              By Offer
            </Button>
          </ButtonGroup>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: '#94a3b8', mb: 2 }}>
            No campaigns yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Click the + button to create your first campaign
          </Typography>
        </Box>

        <CreateCampaignModal open={isModalOpen} onClose={handleCloseModal} />
        <EditCampaignModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          campaignData={selectedCampaign}
        />
        <CustomSnackbar
          open={snackbar.open}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </Layout>
    );
  }

  // Success state with campaigns
  return (
    <Layout onFabClick={handleFabClick}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          My Campaigns
        </Typography>

        {/* Filter Buttons */}
        <ButtonGroup
          variant="outlined"
          sx={{
            '& .MuiButton-root': {
              borderColor: '#2a2a2a',
              color: '#94a3b8',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
              },
            },
            '& .MuiButton-root.active': {
              borderColor: '#2196f3',
              backgroundColor: '#2196f3',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#1976d2',
                borderColor: '#1976d2',
              },
            },
          }}
        >
          <Button
            onClick={() => handleFilterChange('IN_APPLICATION')}
            className={selectedFilter === 'IN_APPLICATION' ? 'active' : ''}
          >
            By Application
          </Button>
          <Button
            onClick={() => handleFilterChange('IN_INVITATION')}
            className={selectedFilter === 'IN_INVITATION' ? 'active' : ''}
          >
            By Invitation
          </Button>
          <Button
            onClick={() => handleFilterChange('IN_OFFER')}
            className={selectedFilter === 'IN_OFFER' ? 'active' : ''}
          >
            By Offer
          </Button>
        </ButtonGroup>
      </Box>

      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onManage={() => handleManage(campaign.id)}
          onEdit={() => handleEdit(campaign)}
          onActivate={() => handleActivate(campaign.id)}
          onPause={() => handlePause(campaign.id)}
          onResume={() => handleResume(campaign.id)}
          onCancel={() => handleCancel(campaign.id)}
          onComplete={() => handleComplete(campaign.id)}
        />
      ))}

      <CreateCampaignModal open={isModalOpen} onClose={handleCloseModal} />
      <EditCampaignModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        campaignData={selectedCampaign}
      />
      <CustomSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Layout>
  );
};

export default MyCampaigns;