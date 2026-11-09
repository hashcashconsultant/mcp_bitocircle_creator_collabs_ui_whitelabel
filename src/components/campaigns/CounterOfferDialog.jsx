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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const DELIVERABLE_TYPES = [
    { value: 'POST', label: 'Post' },
    { value: 'REEL', label: 'Reel' },
    { value: 'STORY', label: 'Story' },
    { value: 'LIVE_STREAM', label: 'Live Stream' },
    { value: 'VIDEO', label: 'Video' },
];

const KPI_TYPES = [
    { value: 'ENGAGEMENT', label: 'Engagement' },
    { value: 'VIEWS', label: 'Views' },
    { value: 'CLICKS', label: 'Clicks' },
    /* { value: 'CONVERSIONS', label: 'Conversions' }, */
];

const CounterOfferDialog = ({ open, onClose, creatorId, offerId, brandId, campaignId, initialOfferData, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        offerId: offerId || '',
        startDate: '',
        endDate: '',
        totalBudget: '',
        kpiType: 'ENGAGEMENT',
        kpiTarget: '',
        brandId: brandId || '',
        campaignId: campaignId || '',
        creatorId: creatorId || '',
        deliverables: [
            { deliverableType: 'POST', quantity: '', pricePerUnit: '' }
        ],
    });

    // Pre-fill form with existing offer data when dialog opens
    useEffect(() => {
        if (open && initialOfferData) {
            setFormData({
                offerId: initialOfferData.offerId || offerId || '',
                startDate: initialOfferData.startDate || '',
                endDate: initialOfferData.endDate || '',
                totalBudget: initialOfferData.totalBudget || '',
                kpiType: initialOfferData.kpiType || 'ENGAGEMENT',
                kpiTarget: initialOfferData.kpiTarget || '',
                brandId: brandId || '',
                campaignId: campaignId || '',
                creatorId: creatorId || '',
                deliverables: initialOfferData.deliverables && initialOfferData.deliverables.length > 0
                    ? initialOfferData.deliverables.map(d => ({
                        deliverableType: d.deliverableType,
                        quantity: d.quantity || '',
                        pricePerUnit: d.pricePerUnit || '',
                    }))
                    : [{ deliverableType: 'POST', quantity: '', pricePerUnit: '' }],
            });
        }
    }, [open, initialOfferData, offerId, brandId, creatorId]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleDeliverableChange = (index, field, value) => {
        const updatedDeliverables = [...formData.deliverables];
        updatedDeliverables[index][field] = value;
        setFormData(prev => ({ ...prev, deliverables: updatedDeliverables }));
        setError(null);
    };

    const addDeliverable = () => {
        setFormData(prev => ({
            ...prev,
            deliverables: [
                ...prev.deliverables,
                { deliverableType: 'POST', quantity: '', pricePerUnit: '' }
            ]
        }));
    };

    const removeDeliverable = (index) => {
        if (formData.deliverables.length > 1) {
            setFormData(prev => ({
                ...prev,
                deliverables: prev.deliverables.filter((_, i) => i !== index)
            }));
        }
    };

    const calculateTotalBudget = () => {
        return formData.deliverables.reduce((total, deliverable) => {
            const quantity = parseFloat(deliverable.quantity) || 0;
            const price = parseFloat(deliverable.pricePerUnit) || 0;
            return total + (quantity * price);
        }, 0);
    };

    const validateForm = () => {
        if (!formData.startDate) return 'Start date is required';
        if (!formData.endDate) return 'End date is required';
        if (!formData.kpiTarget) return 'KPI target is required';
        if (formData.deliverables.length === 0) return 'At least one deliverable is required';

        for (let i = 0; i < formData.deliverables.length; i++) {
            const d = formData.deliverables[i];
            if (!d.quantity || parseFloat(d.quantity) <= 0) {
                return `Deliverable ${i + 1}: Quantity is required and must be greater than 0`;
            }
            if (!d.pricePerUnit || parseFloat(d.pricePerUnit) <= 0) {
                return `Deliverable ${i + 1}: Price per unit is required and must be greater than 0`;
            }
        }

        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        if (endDate <= startDate) {
            return 'End date must be after start date';
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
            const calculatedBudget = calculateTotalBudget();

            const payload = {
                offerId: parseInt(formData.offerId),
                startDate: formData.startDate,
                endDate: formData.endDate,
                totalBudget: calculatedBudget,
                kpiType: formData.kpiType,
                kpiTarget: formData.kpiTarget,
                brandId: parseInt(formData.brandId),
                campaignId: parseInt(formData.campaignId),
                creatorId: parseInt(formData.creatorId),
                deliverables: formData.deliverables.map(d => ({
                    deliverableType: d.deliverableType,
                    quantity: parseInt(d.quantity),
                    pricePerUnit: parseFloat(d.pricePerUnit),
                })),
            };

            const apiClient = (await import('../../utils/apiClient')).default;
            const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';


            const response = await apiClient.post(`${API_BASE_URL}/brand/send_offer`, payload); 

            if (response.data.errorResponse?.errorData === 0) {
                onSuccess?.('Counter offer sent successfully!');
                handleClose();
            } else if (response.data.errorResponse?.errorData === 1) {
                setError(response.data.errorResponse?.errorMsg || 'Failed to send counter offer');
            } else {
                setError('Failed to send counter offer');
            }
        } catch (err) {
            console.error('Error sending counter offer:', err);
            setError(
                err.response?.data?.errorResponse?.errorMsg ||
                'Failed to send counter offer. Please try again.'
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

    const calculatedBudget = calculateTotalBudget();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#1a1a1a',
                    backgroundImage: 'none',
                }
            }}
        >
            <DialogTitle sx={{ pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Send Counter Offer
                    </Typography>
                    <IconButton onClick={handleClose} disabled={loading} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Divider sx={{ borderColor: '#2a2a2a' }} />

            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Start Date */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                            disabled={loading}
                        />
                    </Grid>

                    {/* End Date */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                            disabled={loading}
                        />
                    </Grid>

                    {/* KPI Type */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="KPI Type"
                            value={formData.kpiType}
                            onChange={(e) => handleInputChange('kpiType', e.target.value)}
                            required
                            disabled={loading}
                        >
                            {KPI_TYPES.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* KPI Target */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="KPI Target"
                            placeholder="e.g., 7% engagement rate, 10k views"
                            value={formData.kpiTarget}
                            onChange={(e) => handleInputChange('kpiTarget', e.target.value)}
                            required
                            disabled={loading}
                        />
                    </Grid>

                    {/* Deliverables Section */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Deliverables
                            </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addDeliverable}
                                disabled={loading}
                                size="small"
                                sx={{ textTransform: 'none' }}
                            >
                                Add Deliverable
                            </Button>
                        </Box>

                        {formData.deliverables.map((deliverable, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: '#0f0f0f',
                                    borderRadius: 1,
                                    border: '1px solid #2a2a2a',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Type"
                                            value={deliverable.deliverableType}
                                            onChange={(e) => handleDeliverableChange(index, 'deliverableType', e.target.value)}
                                            size="small"
                                            disabled={loading}
                                        >
                                            {DELIVERABLE_TYPES.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Quantity"
                                            type="number"
                                            value={deliverable.quantity}
                                            onChange={(e) => handleDeliverableChange(index, 'quantity', e.target.value)}
                                            size="small"
                                            inputProps={{ min: 1 }}
                                            disabled={loading}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Price Per Unit"
                                            type="number"
                                            value={deliverable.pricePerUnit}
                                            onChange={(e) => handleDeliverableChange(index, 'pricePerUnit', e.target.value)}
                                            size="small"
                                            inputProps={{ min: 0, step: 0.01 }}
                                            disabled={loading}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                            <IconButton
                                                onClick={() => removeDeliverable(index)}
                                                disabled={formData.deliverables.length === 1 || loading}
                                                color="error"
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                                {deliverable.quantity && deliverable.pricePerUnit && (
                                    <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block' }}>
                                        Subtotal: ${(parseFloat(deliverable.quantity) * parseFloat(deliverable.pricePerUnit)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Grid>

                    {/* Calculated Total Budget */}
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: '#0f0f0f',
                                borderRadius: 1,
                                border: '1px solid #2a2a2a',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Total Budget
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                                    ${calculatedBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider sx={{ borderColor: '#2a2a2a' }} />

            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        backgroundColor: '#2196f3',
                        '&:hover': { backgroundColor: '#1976d2' },
                        textTransform: 'none',
                        minWidth: 120,
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Send Offer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CounterOfferDialog;