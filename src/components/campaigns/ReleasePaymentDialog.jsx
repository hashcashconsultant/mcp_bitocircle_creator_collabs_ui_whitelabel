import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Grid,
    Typography,
    IconButton,
    Divider,
    MenuItem,
    CircularProgress,
    Alert,
    InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';


const ReleasePaymentDialog = ({ open, onClose, creatorId, campaignId, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        campaignId: campaignId || '',
        creatorId: creatorId || '',
        amount: '',
    });

    // Pre-fill form with existing offer data when dialog opens
    useEffect(() => {
        if (open) {
            setFormData({
                campaignId: campaignId || '',
                creatorId: creatorId || '',
                amount: '',
            });
        }
    }, [open, campaignId, creatorId]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const validateForm = () => {
        if (formData.amount <= 0 || isNaN(formData.amount)) {
            return 'Amount must be greater than zero';
        }
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = {
                campaignId: formData.campaignId,
                creatorId: formData.creatorId,
                amount: formData.amount
            };

            const apiClient = (await import('../../utils/apiClient')).default;
            const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

            const response = await apiClient.post(`${API_BASE_URL}/brand/release_payment`, payload);

            if (response.data.errorResponse?.errorData === 0) {
                onSuccess?.('Payment released successfully!');
                handleClose();
            } else if (response.data.errorResponse?.errorData === 1) {
                setError(response.data.errorResponse?.errorMsg || 'Failed to release payment');
            } else {
                setError('Failed to release payment. Please try again.');
            }
        } catch (err) {
            console.error('Error release payment:', err);
            setError(
                err.response?.data?.errorResponse?.errorMsg ||
                'Failed to release payment. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#1a1a1a',
                    backgroundImage: 'none',
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }
            }}
        >
            <DialogTitle sx={{ pb: 2, pt: 3, px: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '10px',
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <PaymentIcon sx={{ color: '#2196f3', fontSize: 22 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff', mb: 0.5 }}>
                                Release Payment
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888888', fontSize: '0.875rem' }}>
                                Release payment to the creator
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        onClick={handleClose}
                        disabled={loading}
                        size="small"
                        sx={{
                            color: '#888888',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#ffffff',
                            }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Divider sx={{ borderColor: '#2a2a2a' }} />

            <DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                            border: '1px solid rgba(211, 47, 47, 0.3)',
                            color: '#f44336',
                            '& .MuiAlert-icon': {
                                color: '#f44336',
                            }
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Box>
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 2,
                            color: '#aaaaaa',
                            fontWeight: 500,
                        }}
                    >
                        Payment Details
                    </Typography>

                    <TextField
                        fullWidth
                        label="Payment Amount"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        required
                        disabled={loading}
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography sx={{ color: '#2196f3', fontWeight: 600 }}>
                                        B$
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#0f0f0f',
                                '& fieldset': {
                                    borderColor: '#333333',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#444444',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#2196f3',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#888888',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#2196f3',
                            },
                            '& .MuiOutlinedInput-input': {
                                color: '#ffffff',
                            },
                        }}
                    />

                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor: 'rgba(33, 150, 243, 0.05)',
                            borderRadius: 1,
                            border: '1px solid rgba(33, 150, 243, 0.2)',
                        }}
                    >
                        <Typography variant="caption" sx={{ color: '#888888', display: 'block' }}>
                            This amount will be released from escrow to the creator's account immediately upon confirmation.
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <Divider sx={{ borderColor: '#2a2a2a' }} />

            <DialogActions sx={{ p: 3, gap: 1.5 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{
                        textTransform: 'none',
                        color: '#888888',
                        fontWeight: 500,
                        px: 3,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: '#ffffff',
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        backgroundColor: '#2196f3',
                        '&:hover': {
                            backgroundColor: '#1976d2',
                            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
                        },
                        '&:disabled': {
                            backgroundColor: '#333333',
                            color: '#666666',
                        },
                        textTransform: 'none',
                        minWidth: 140,
                        fontWeight: 600,
                        px: 3,
                        boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Release Payment'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReleasePaymentDialog;