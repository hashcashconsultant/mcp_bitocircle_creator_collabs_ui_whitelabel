// pages/counter-offers.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Chip,
    Card,
    CardContent,
    Grid,
    Divider,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import { Layout } from '../components/layout';
import apiClient from '../utils/apiClient';
import CustomSnackbar from '../utils/CustomSnackbar';

const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

const getStatusColor = (status) => {
    const statusColors = {
        PENDING: '#f59e0b',
        APPROVED: '#22c55e',
        REJECTED: '#ef4444',
        WITHDRAWN: '#6b7280',
        COUNTER: '#3b82f6',
        EXPIRED: '#6b7280',
    };
    return statusColors[status] || '#6b7280';
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatBudget = (amount) => {
    if (!amount) return '0';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const CounterOffers = () => {
    const router = useRouter();
    const { offerId, creatorId } = router.query;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

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

    // Get brand ID from localStorage or use default
    const getBrandId = () => {
        const brandId = parseInt(localStorage.getItem('collab_brand_id'));

        if (!brandId || isNaN(brandId)) {
            showSnackbar('Brand ID not found in localStorage. Using default ID.', 'warning');
            return 1; // Default brand ID
        }

        return brandId;
    };

    const fetchCounterOffers = async () => {
        if (!offerId || !creatorId) {
            console.log('Missing offerId or creatorId:', { offerId, creatorId });
            return;
        }

        setLoading(true);
        try {
            const brandId = getBrandId();

            console.log('Fetching counter offers with params:', {
                offerId: parseInt(offerId),
                brandId: brandId,
                creatorId: parseInt(creatorId),
            });

            const response = await apiClient.post(`${API_BASE_URL}/brand/offers_timeline`, {
                offerId: parseInt(offerId),
                brandId: brandId,
                creatorId: parseInt(creatorId),
            });

            console.log('API Response:', response);

            // Check for successful response
            if (response?.data) {
                // Check if there's an error in the response
                if (response.data.errorResponse) {
                    const errorCode = response.data.errorResponse.errorData;
                    const errorMsg = response.data.errorResponse.errorMsg;

                    if (errorCode === 0) {
                        // Success case
                        setOffers(response.data.offerList || []);

                        if (!response.data.offerList || response.data.offerList.length === 0) {
                            showSnackbar('No counter offers found.', 'info');
                        }
                    } else {
                        // Error case
                        throw new Error(errorMsg || `API Error: Code ${errorCode}`);
                    }
                } else {
                    // Handle response without errorResponse structure
                    setOffers(response.data.offerList || []);
                }
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error fetching counter offers:', error);

            // More detailed error handling
            let errorMessage = 'Failed to load counter offers. Please try again.';

            if (error.response) {
                // Server responded with error
                console.error('Server Error Response:', error.response);
                errorMessage = error.response.data?.errorResponse?.errorMsg
                    || error.response.data?.message
                    || `Server error: ${error.response.status}`;
            } else if (error.request) {
                // Request made but no response
                console.error('No Response:', error.request);
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                // Error in request setup
                errorMessage = error.message || errorMessage;
            }

            showSnackbar(errorMessage, 'error');
            setOffers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch when both params are available
        if (offerId && creatorId) {
            fetchCounterOffers();
        }
    }, [offerId, creatorId]);

    const handleAcceptOffer = async (offer) => {
        try {
            const brandId = getBrandId();

            

            const response = await apiClient.post(`${API_BASE_URL}/brand/accept_offer`, {
                offerTimeLineId: offer.offerTimeLineId,
                brandId: brandId,
                creatorId: parseInt(creatorId)
            });

            console.log('Accept Offer API Response:', response);

            if (response?.data?.errorResponse) {
                const errorCode = response.data.errorResponse.errorData;
                const errorMsg = response.data.errorResponse.errorMsg;

                if (errorCode === 0) {
                    showSnackbar('Offer accepted successfully!', 'success');
                    await fetchCounterOffers();
                } else {
                    // Show error in snackbar instead of throwing
                    showSnackbar(errorMsg || 'Failed to accept offer', 'error');
                }
            } else {
                showSnackbar('Invalid response format from server', 'error');
            }
        } catch (error) {
            console.error('Error accepting offer:', error);

            let errorMessage = 'Failed to accept offer. Please try again.';

            if (error.response) {
                errorMessage = error.response.data?.errorResponse?.errorMsg
                    || error.response.data?.message
                    || 'Server error occurred';
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                errorMessage = error.message || errorMessage;
            }

            showSnackbar(errorMessage, 'error');
        }
    };

    const handleRejectOffer = async (offer) => {
        try {
            const brandId = getBrandId();

            console.log('Rejecting offer with params:', {
                status: 'REJECTED',
                offerTimeLineId: offer.offerTimeLineId,
                brandId: brandId,
                offerId: parseInt(offerId),
            });

            const response = await apiClient.post(`${API_BASE_URL}/brand/update_offer_status`, {
                status: 'REJECTED',
                offerTimeLineId: offer.offerTimeLineId,
                brandId: brandId,
                offerId: parseInt(offerId),
            });

            console.log('Reject Offer API Response:', response);

            if (response?.data?.errorResponse) {
                const errorCode = response.data.errorResponse.errorData;
                const errorMsg = response.data.errorResponse.errorMsg;

                if (errorCode === 0) {
                    showSnackbar('Offer rejected successfully!', 'success');
                    await fetchCounterOffers();
                } else {
                    // Show error in snackbar instead of throwing
                    showSnackbar(errorMsg || 'Failed to reject offer', 'error');
                }
            } else {
                showSnackbar('Invalid response format from server', 'error');
            }
        } catch (error) {
            console.error('Error rejecting offer:', error);

            let errorMessage = 'Failed to reject offer. Please try again.';

            if (error.response) {
                errorMessage = error.response.data?.errorResponse?.errorMsg
                    || error.response.data?.message
                    || 'Server error occurred';
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                errorMessage = error.message || errorMessage;
            }

            showSnackbar(errorMessage, 'error');
        }
    };

    const handleWithdrawOffer = async (offer) => {
        try {
            const brandId = getBrandId();

            console.log('Withdrawing offer with params:', {
                status: 'WITHDRAWN',
                offerTimeLineId: offer.offerTimeLineId,
                brandId: brandId,
                offerId: parseInt(offerId),
            });

            const response = await apiClient.post(`${API_BASE_URL}/brand/update_offer_status`, {
                status: 'WITHDRAWN',
                offerTimeLineId: offer.offerTimeLineId,
                brandId: brandId,
                offerId: parseInt(offerId),
            });

            console.log('Withdraw Offer API Response:', response);

            if (response?.data?.errorResponse) {
                const errorCode = response.data.errorResponse.errorData;
                const errorMsg = response.data.errorResponse.errorMsg;

                if (errorCode === 0) {
                    showSnackbar('Offer withdrawn successfully!', 'success');
                    await fetchCounterOffers();
                } else {
                    // Show error in snackbar instead of throwing
                    showSnackbar(errorMsg || 'Failed to withdraw offer', 'error');
                }
            } else {
                showSnackbar('Invalid response format from server', 'error');
            }
        } catch (error) {
            console.error('Error withdrawing offer:', error);

            let errorMessage = 'Failed to withdraw offer. Please try again.';

            if (error.response) {
                errorMessage = error.response.data?.errorResponse?.errorMsg
                    || error.response.data?.message
                    || 'Server error occurred';
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                errorMessage = error.message || errorMessage;
            }

            showSnackbar(errorMessage, 'error');
        }
    };

    const handleBack = () => {
        router.back();
    };

    // Helper function to check if Accept/Reject buttons should be shown
    const shouldShowActionButtons = (offer) => {
        // Only show buttons if:
        // 1. Offer was NOT placed by BRAND
        // 2. Status is PENDING
        return (
            offer.placedBy !== 'BRAND' &&
            offer.status === 'PENDING'
        );
    };

    // Helper function to check if Withdraw button should be shown
    const shouldShowWithdrawButton = (offer) => {
        // Only show Withdraw button if:
        // 1. Offer was placed by BRAND
        // 2. Status is PENDING
        return (
            offer.placedBy === 'BRAND' &&
            offer.status === 'PENDING'
        );
    };

    return (
        <Layout>
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <IconButton
                        onClick={handleBack}
                        sx={{
                            color: '#94a3b8',
                            '&:hover': { backgroundColor: 'rgba(148, 163, 184, 0.1)' },
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        Counter Offers Timeline
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#94a3b8', ml: 7 }}>
                    Offer ID: #{offerId} • Creator: {offers.length > 0 ? (offers[0].creatorName || offers[0].creatorId) : creatorId}
                </Typography>
            </Box>

            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 400,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {offers.map((offer, index) => (
                        <Card
                            key={`${offer.offerId}-${index}`}
                            sx={{
                                backgroundColor: '#1a1a1a',
                                borderRadius: 2,
                                border: '1px solid #2a2a2a',
                                position: 'relative',
                            }}
                        >
                            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                {/* Header */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        mb: 3,
                                        flexWrap: 'wrap',
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                backgroundColor: `${getStatusColor(offer.status)}20`,
                                                border: `2px solid ${getStatusColor(offer.status)}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                                color: getStatusColor(offer.status),
                                            }}
                                        >
                                            {index + 1}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                                                Offer #{index + 1}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                {formatDateTime(offer.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Chip
                                            label={offer.placedBy}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                                color: '#8b5cf6',
                                                fontWeight: 600,
                                            }}
                                        />
                                        <Chip
                                            label={offer.status}
                                            size="small"
                                            sx={{
                                                backgroundColor: `${getStatusColor(offer.status)}20`,
                                                color: getStatusColor(offer.status),
                                                fontWeight: 600,
                                                border: `1px solid ${getStatusColor(offer.status)}40`,
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ borderColor: '#2a2a2a', mb: 3 }} />

                                {/* Details Grid */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box
                                                sx={{
                                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                    borderRadius: 1,
                                                    p: 1,
                                                    display: 'flex',
                                                }}
                                            >
                                                <PersonIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                                    Creator
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                                    {offer.creatorName || offer.creatorId || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box
                                                sx={{
                                                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                                    borderRadius: 1,
                                                    p: 1,
                                                    display: 'flex',
                                                }}
                                            >
                                                <AttachMoneyIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                                    Total Budget
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 700 }}>
                                                    B$ {formatBudget(offer.totalBudget)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box
                                                sx={{
                                                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                    borderRadius: 1,
                                                    p: 1,
                                                    display: 'flex',
                                                }}
                                            >
                                                <CalendarTodayIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                                    Timeline
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                                    {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={3}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box
                                                sx={{
                                                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                                                    borderRadius: 1,
                                                    p: 1,
                                                    display: 'flex',
                                                }}
                                            >
                                                <TrendingUpIcon sx={{ color: '#a855f7', fontSize: 20 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                                    KPI Type
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                                                    {offer.kpiType}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: '#94a3b8', display: 'block', mb: 1 }}
                                            >
                                                KPI Target
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#fff' }}>
                                                {offer.kpiTarget}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: '#94a3b8', display: 'block', mb: 1 }}
                                            >
                                                Deliverables
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {offer.deliverables?.map((deliverable, idx) => (
                                                    <Paper
                                                        key={idx}
                                                        sx={{
                                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                            border: '1px solid rgba(59, 130, 246, 0.3)',
                                                            borderRadius: 1,
                                                            px: 2,
                                                            py: 1,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: '#3b82f6', fontWeight: 600 }}
                                                        >
                                                            {deliverable.quantity}x {deliverable.deliverableType}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                            B$ {formatBudget(deliverable.pricePerUnit)} each
                                                        </Typography>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Actions - Show Accept/Reject for offers NOT placed by BRAND with PENDING status */}
                                {shouldShowActionButtons(offer) && ( 
                                    <>
                                        <Divider sx={{ borderColor: '#2a2a2a', my: 3 }} />
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleRejectOffer(offer)}
                                                sx={{
                                                    borderColor: '#ef4444',
                                                    color: '#ef4444',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        borderColor: '#dc2626',
                                                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                                    },
                                                }}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAcceptOffer(offer)}
                                                sx={{
                                                    backgroundColor: '#22c55e',
                                                    color: '#fff',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        backgroundColor: '#16a34a',
                                                    },
                                                }}
                                            >
                                                Accept Offer
                                            </Button>
                                        </Box>
                                    </>
                                )}

                                {/* Withdraw Button - Show for offers placed by BRAND with PENDING status */}
                                {shouldShowWithdrawButton(offer) && (
                                    <>
                                        <Divider sx={{ borderColor: '#2a2a2a', my: 3 }} />
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleWithdrawOffer(offer)}
                                                sx={{
                                                    borderColor: '#f59e0b',
                                                    color: '#f59e0b',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        borderColor: '#d97706',
                                                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                                                    },
                                                }}
                                            >
                                                Withdraw Offer
                                            </Button>
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {offers.length === 0 && !loading && (
                        <Paper
                            sx={{
                                p: 6,
                                textAlign: 'center',
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #2a2a2a',
                            }}
                        >
                            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                                No counter offers found
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                There are no counter offers available for this negotiation.
                            </Typography>
                        </Paper>
                    )}
                </Box>
            )}

            <CustomSnackbar
                open={snackbar.open}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Layout>
    );
};

export default CounterOffers;