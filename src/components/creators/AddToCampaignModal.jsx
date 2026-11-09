import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
    Box,
    CircularProgress,
    Alert,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Card,
    CardContent,
    Grid,
    Chip,
    Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import apiClient from '../../utils/apiClient';

const AddToCampaignModal = ({ open, onClose, creator }) => {
    const [loading, setLoading] = useState(false);
    const [fetchingCampaigns, setFetchingCampaigns] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [activeCampaigns, setActiveCampaigns] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Fetch active campaigns when modal opens
    useEffect(() => {
        if (open) {
            fetchActiveCampaigns();
        }
    }, [open]);

    const fetchActiveCampaigns = async () => {
        setFetchingCampaigns(true);
        setError(null);

        try {
            const brandId = localStorage.getItem('collab_brand_id');
            if (!brandId) {
                throw new Error('Brand ID not found. Please login again.');
            }

            const response = await apiClient.get(
                `https://institutional-bo.paybito.com:8443/MonetizeService/brand/campaigns?brandId=${brandId}&campaignType=IN_APPLICATION`
            );

            console.log('Campaigns API Response:', response.data);

            // Check for error response
            if (response.data.errorResponse?.errorData !== 0) {
                throw new Error(response.data.errorResponse?.errorMsg || 'Failed to fetch campaigns');
            }

            // Get campaign list and filter ACTIVE campaigns
            const campaignList = response.data.campaignList || [];
            const activeCampaignsList = campaignList.filter(
                (campaign) => campaign.status === 'ACTIVE'
            );

            setActiveCampaigns(activeCampaignsList);

            if (activeCampaignsList.length === 0) {
                setError('No active campaigns found. Please create a campaign first.');
            }
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            setError(err.message || 'Failed to load campaigns. Please try again.');
            setActiveCampaigns([]);
        } finally {
            setFetchingCampaigns(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleAdd = async () => {
        if (!selectedCampaignId) {
            setError('Please select a campaign');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                campaignId: selectedCampaignId,
                creatorId: creator.creatorId,
            };

            console.log('Adding creator to campaign:', payload);

            const response = await apiClient.post(
                'https://institutional-bo.paybito.com:8443/MonetizeService/brand/add_to_campaign',
                payload
            );

            console.log('Add to campaign response:', response.data);

            // Check for API-level errors
            if (response.data.errorResponse?.errorData !== 0) {
                throw new Error(
                    response.data.errorResponse?.errorMsg || 'Failed to add creator to campaign'
                );
            }

            // Success - Show snackbar
            setSuccess(true);
            setSnackbarMessage('Creator added to campaign successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Close modal after short delay
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            console.error('Add to campaign error:', err);
            const errorMessage = err.message || 'Failed to add creator to campaign. Please try again.';
            setError(errorMessage);

            // Also show error in snackbar
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setSelectedCampaignId(null);
            setError(null);
            setSuccess(false);
            onClose();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatBudget = (budget) => {
        if (!budget) return 'B$0';
        return `B$${parseFloat(budget).toLocaleString()}`;
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#1a1a1a',
                        backgroundImage: 'none',
                    },
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    <Typography variant="h6" component="div">
                        Add {creator?.creatorName || 'Creator'} to Campaign
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        disabled={loading}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: '#94a3b8',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ borderColor: '#2a2a2a' }}>
                    {/* Success Message */}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Creator added to campaign successfully!
                        </Alert>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Loading State */}
                    {fetchingCampaigns ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: 200,
                            }}
                        >
                            <CircularProgress size={60} />
                        </Box>
                    ) : activeCampaigns.length === 0 ? (
                        // No Campaigns State
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: 200,
                                textAlign: 'center',
                                p: 4,
                            }}
                        >
                            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                                No Active Campaigns
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Create a campaign first to add creators
                            </Typography>
                        </Box>
                    ) : (
                        // Campaign Selection
                        <FormControl component="fieldset" fullWidth>
                            <Typography variant="subtitle2" sx={{ mb: 2, color: '#94a3b8' }}>
                                Select a campaign to add this creator
                            </Typography>
                            <RadioGroup
                                value={selectedCampaignId}
                                onChange={(e) => {
                                    setSelectedCampaignId(parseInt(e.target.value));
                                    setError(null);
                                }}
                            >
                                {activeCampaigns.map((campaign) => (
                                    <Card
                                        key={campaign.campaignId}
                                        sx={{
                                            mb: 2,
                                            backgroundColor: '#0a0a0a',
                                            border:
                                                selectedCampaignId === campaign.campaignId
                                                    ? '2px solid #2196f3'
                                                    : '1px solid #2a2a2a',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                borderColor: '#2196f3',
                                            },
                                        }}
                                        onClick={() => {
                                            setSelectedCampaignId(campaign.campaignId);
                                            setError(null);
                                        }}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                <FormControlLabel
                                                    value={campaign.campaignId}
                                                    control={<Radio sx={{ color: '#2196f3' }} />}
                                                    label=""
                                                    sx={{ mr: 1 }}
                                                />
                                                <Box sx={{ flex: 1 }}>
                                                    {/* Campaign Name */}
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                        {campaign.campaignName}
                                                    </Typography>

                                                    {/* Campaign Description */}
                                                    {campaign.description && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: '#94a3b8', mb: 1.5 }}
                                                        >
                                                            {campaign.description}
                                                        </Typography>
                                                    )}

                                                    {/* Campaign Details Grid */}
                                                    <Grid container spacing={2}>
                                                        {/* Date Range */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <CalendarTodayIcon
                                                                    sx={{ fontSize: 16, color: '#94a3b8' }}
                                                                />
                                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>

                                                        {/* Budget */}
                                                        <Grid item xs={12} sm={6}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <AttachMoneyIcon
                                                                    sx={{ fontSize: 16, color: '#94a3b8' }}
                                                                />
                                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                                    Budget: {formatBudget(campaign.totalBudget)}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>

                                                    {/* Campaign Tags/Chips */}
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                                                        {campaign.status && (
                                                            <Chip
                                                                label={campaign.status}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: '#4caf50',
                                                                    color: '#fff',
                                                                    fontSize: '0.7rem',
                                                                    height: 20,
                                                                }}
                                                            />
                                                        )}
                                                        {campaign.kpiType && (
                                                            <Chip
                                                                label={campaign.kpiType}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: '#2196f3',
                                                                    color: '#fff',
                                                                    fontSize: '0.7rem',
                                                                    height: 20,
                                                                }}
                                                            />
                                                        )}
                                                        {campaign.creators && campaign.creators.length > 0 && (
                                                            <Chip
                                                                label={`${campaign.creators.length} Creator${campaign.creators.length !== 1 ? 's' : ''
                                                                    }`}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: '#0a0a0a',
                                                                    border: '1px solid #2a2a2a',
                                                                    fontSize: '0.7rem',
                                                                    height: 20,
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2, borderTop: '1px solid #2a2a2a' }}>
                    <Button onClick={handleClose} disabled={loading} sx={{ color: '#94a3b8' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAdd}
                        variant="contained"
                        disabled={loading || !selectedCampaignId || fetchingCampaigns}
                        sx={{
                            backgroundColor: '#2196f3',
                            '&:hover': { backgroundColor: '#1976d2' },
                            minWidth: 120,
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Add to Campaign'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
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
        </>
    );
};

export default AddToCampaignModal;