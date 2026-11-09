// components/discover-creators/CreatorDetailTabs.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  Grid,
  Button,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ForumIcon from '@mui/icons-material/Forum';
import { useRouter } from 'next/router';
import apiClient from '../../utils/apiClient';

const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

const TabPanel = ({ children, value, index }) => {
  return (
    <Box hidden={value !== index} sx={{ pt: 3 }}>
      {value === index && children}
    </Box>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return '#ff9800';
    case 'ACCEPTED':
      return '#4caf50';
    case 'REJECTED':
      return '#f44336';
    case 'NEGOTIATING':
      return '#2196f3';
    default:
      return '#94a3b8';
  }
};

const getPlacedByColor = (placedBy) => {
  return placedBy === 'BRAND' ? '#2196f3' : '#9c27b0';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0 B$';
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} B$`;
};

const CounterOffersTab = ({ offerTimeline, loading, creatorId }) => {
  const router = useRouter();

  const handleCounterOffers = (offerId) => {
    router.push(`/counter-offers?offerId=${offerId}&creatorId=${creatorId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!offerTimeline || offerTimeline.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <HistoryIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#94a3b8' }}>
          No offer history found
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
          Counter offers and negotiations will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        Offer Timeline ({offerTimeline.length} {offerTimeline.length === 1 ? 'offer' : 'offers'})
      </Typography>

      <TableContainer component={Paper} sx={{ backgroundColor: '#0f0f0f' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: '#2a2a2a' }}>
                Date & Time
              </TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: '#2a2a2a' }}>
                Duration
              </TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: '#2a2a2a' }}>
                KPI
              </TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderColor: '#2a2a2a' }}>
                Deliverables
              </TableCell>
              <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 600, borderColor: '#2a2a2a' }}>
                Budget
              </TableCell>
              <TableCell align="center" sx={{ color: '#94a3b8', fontWeight: 600, borderColor: '#2a2a2a' }}>
                Placed By
              </TableCell>
              <TableCell align="center" sx={{ color: '#94a3b8', fontWeight: 600, borderColor: '#2a2a2a' }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ color: '#94a3b8', fontWeight: 600, borderColor: '#2a2a2a' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offerTimeline.map((offer, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:hover': {
                    backgroundColor: '#1a1a1a',
                  },
                }}
              >
                <TableCell sx={{ borderColor: '#2a2a2a' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDateTime(offer.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderColor: '#2a2a2a' }}>
                  <Typography variant="body2">
                    {formatDate(offer.startDate)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    to {formatDate(offer.endDate)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderColor: '#2a2a2a' }}>
                  <Chip
                    label={offer.kpiType}
                    size="small"
                    sx={{
                      backgroundColor: '#2196f3',
                      color: '#ffffff',
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    {offer.kpiTarget}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderColor: '#2a2a2a' }}>
                  {offer.deliverables && offer.deliverables.length > 0 ? (
                    <Box>
                      {offer.deliverables.map((deliverable, idx) => (
                        <Typography
                          key={idx}
                          variant="caption"
                          sx={{ display: 'block', color: '#94a3b8' }}
                        >
                          {deliverable.quantity}x {deliverable.deliverableType.replace(/_/g, ' ')}
                          ({formatCurrency(deliverable.pricePerUnit)})
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      No deliverables
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right" sx={{ borderColor: '#2a2a2a' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#4caf50' }}>
                    {formatCurrency(offer.totalBudget)}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ borderColor: '#2a2a2a' }}>
                  <Chip
                    label={offer.placedBy}
                    size="small"
                    sx={{
                      backgroundColor: getPlacedByColor(offer.placedBy),
                      color: '#ffffff',
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ borderColor: '#2a2a2a' }}>
                  <Chip
                    label={offer.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(offer.status),
                      color: '#ffffff',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ borderColor: '#2a2a2a' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ForumIcon />}
                    onClick={() => handleCounterOffers(offer.offerId)}
                    sx={{
                      borderColor: '#2196f3',
                      color: '#2196f3',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: 'rgba(33, 150, 243, 0.08)',
                      },
                    }}
                  >
                    View Counter Offers
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const CreatorDetailTabs = ({ creatorData, brandId, offerId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [offerTimeline, setOfferTimeline] = useState([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch offer timeline when All Offers tab is selected
  useEffect(() => {
    const fetchOfferTimeline = async () => {
      if (tabValue === 0 && brandId && creatorData?.creatorId && offerId) {
        setLoadingTimeline(true);
        try {
          const response = await apiClient.post(`${API_BASE_URL}/brand/offers`, {
            offerId: parseInt(offerId),
            brandId: parseInt(brandId),
            creatorId: parseInt(creatorData.creatorId),
          });

          if (response.data.errorResponse?.errorData === 0 && response.data.offerList) {
            setOfferTimeline(response.data.offerList);
          } else if (response.data.errorResponse?.errorData === 1) {
            setSnackbar({
              open: true,
              message: response.data.errorResponse?.errorMsg || 'Failed to load offer timeline',
              severity: 'error',
            });
            setOfferTimeline([]);
          } else {
            setOfferTimeline([]);
          }
        } catch (error) {
          console.error('Error fetching offer timeline:', error);
          setSnackbar({
            open: true,
            message: error.response?.data?.errorResponse?.errorMsg || 'Failed to load offer timeline',
            severity: 'error',
          });
          setOfferTimeline([]);
        } finally {
          setLoadingTimeline(false);
        }
      }
    };

    fetchOfferTimeline();
  }, [tabValue, brandId, creatorData, offerId]);

  return (
    <>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #2a2a2a',
              '& .MuiTab-root': {
                color: '#94a3b8',
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 48,
                '&.Mui-selected': {
                  color: '#2196f3',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2196f3',
              },
            }}
          >
            <Tab icon={<HistoryIcon />} iconPosition="start" label="All Offers" />
            {/* <Tab icon={<AccountBalanceWalletIcon />} iconPosition="start" label="Payments" /> */}
          </Tabs>

          {/* All Offers Tab */}
          <TabPanel value={tabValue} index={0}>
            <CounterOffersTab
              offerTimeline={offerTimeline}
              loading={loadingTimeline}
              creatorId={creatorData?.creatorId}
            />
          </TabPanel>

          {/* Payments Tab */}
         {/*  <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                Payment history and escrow status
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                Track all payments made to this creator
              </Typography>
            </Box>
          </TabPanel> */}
        </CardContent>
      </Card>

      {/* Snackbar for error messages */}
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
    </>
  );
};

export default CreatorDetailTabs;