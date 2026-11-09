// pages/offers.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { Layout } from '../components/layout';
import OffersTable from '../components/offers/OffersTable';
import OffersSummary from '../components/offers/OffersSummary';
import apiClient from '../utils/apiClient';
import CustomSnackbar from '../utils/CustomSnackbar';
import { CampaignCard, CreateCampaignModal, EditCampaignModal } from '../components/campaigns';


const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

const Offers = () => {
    const router = useRouter();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const brandId = getBrandId();

            const response = await apiClient.post(`${API_BASE_URL}/brand/offers`, {
                brandId: brandId,
            });

            if (response.data && response.data.errorResponse?.errorData === 0) {
                setOffers(response.data.offerList || []);

                if (response.data.offerList?.length === 0) {
                    showSnackbar('No offers found.', 'info');
                }
            } else {
                throw new Error(response.data?.errorResponse?.errorMsg || 'Failed to fetch offers');
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
            showSnackbar(error.message || 'Failed to load offers. Please try again.', 'error');
            setOffers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleViewCounterOffers = (offer) => {
        router.push({
            pathname: '/counter-offers',
            query: {
                offerId: offer.offerId,
                creatorId: offer.creatorId,
            },
        });
    };

    const handleFabClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Calculate summary
    const summary = {
        totalOffers: offers.length,
        pending: offers.filter((o) => o.status === 'PENDING').length,
        accepted: offers.filter((o) => o.status === 'ACCEPTED').length,
        rejected: offers.filter((o) => o.status === 'REJECTED').length,
    };

    return (
        <Layout onFabClick={handleFabClick}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
                Offers Management
            </Typography>

            <Box sx={{ mb: 3 }}>
                <OffersSummary summary={summary} />
            </Box>

            <Box sx={{ mb: 3 }}>
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
                    <OffersTable offers={offers} onViewCounterOffers={handleViewCounterOffers} />
                )}
            </Box>
            <CreateCampaignModal open={isModalOpen} onClose={handleCloseModal} />
            <CustomSnackbar
                open={snackbar.open}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Layout>
    );
};

export default Offers;