import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Layout } from '../components/layout';
import PaymentsTable from '../components/payments/PaymentsTable';
import CustomSnackbar from '../utils/CustomSnackbar';
import apiClient from '../utils/apiClient';
import ReleasePaymentDialog from '../components/campaigns/ReleasePaymentDialog';
import { CampaignCard, CreateCampaignModal, EditCampaignModal } from '../components/campaigns';


const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

const Payments = () => {
  const [escrows, setEscrows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [releasePaymentOpen, setReleasePaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchEscrows();
  }, []);

  const fetchEscrows = async () => {
    try {
      setLoading(true);
      const brandId = localStorage.getItem('collab_brand_id');

      if (!brandId) {
        showSnackbar('Brand ID not found. Please login again.', 'error');
        setLoading(false);
        return;
      }

      const response = await apiClient.get(
        `${API_BASE_URL}/brand/escrows?brandId=${brandId}`
      );

      if (response.data.errorResponse.errorData === 0) {
        const escrowList = response.data.escrowList || [];
        setEscrows(escrowList);
      } else {
        showSnackbar(
          response.data.errorResponse.errorMsg || 'Failed to fetch escrows',
          'error'
        );
      }
    } catch (error) {
      console.error('Error fetching escrows:', error);
      showSnackbar('Failed to fetch escrows. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReleasePaymentClick = (paymentId) => {
    const payment = escrows.find(escrow => escrow.escrowId === paymentId);
    if (payment) {
      setSelectedPayment(payment);
      setReleasePaymentOpen(true);
    }
  };

  const handleReleasePaymentClose = () => {
    setReleasePaymentOpen(false);
    setSelectedPayment(null);
  };

  const handleReleasePaymentSuccess = (message) => {
    setReleasePaymentOpen(false);
    setSelectedPayment(null);
    showSnackbar(message, 'success');
    fetchEscrows();
  };

  const handleFabClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Transform escrow data to payment table format
  const transformedPayments = escrows.map((escrow) => ({
    id: escrow.escrowId,
    status: escrow.status,
    creator: escrow.creatorName || 'N/A',
    creatorId: escrow.creatorId,
    campaign: escrow.campaignName,
    campaignId: escrow.campaignId,
    amount: `B$ ${escrow.amount.toFixed(2)}`,
    paymentMethod: 'Escrow',
    action: escrow.status === 'funded' ? 'Release' : null,
  }));

  if (loading) {
    return (
      <Layout onFabClick={handleFabClick}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout onFabClick={handleFabClick}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Payments & Escrow
      </Typography>

      {transformedPayments.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: '#94a3b8',
          }}
        >
          <Typography variant="h6">No escrow payments found</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Escrow payments will appear here once campaigns are funded
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <PaymentsTable
            payments={transformedPayments}
            onRelease={handleReleasePaymentClick}
          />
        </Box>
      )}

      {/* Release Payment Dialog */}
      {selectedPayment && (
        <ReleasePaymentDialog
          open={releasePaymentOpen}
          onClose={handleReleasePaymentClose}
          creatorId={selectedPayment.creatorId}
          campaignId={selectedPayment.campaignId}
          onSuccess={handleReleasePaymentSuccess}
        />
      )}
      <CreateCampaignModal open={isModalOpen} onClose={handleCloseModal} />
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Layout>
  );
};

export default Payments;