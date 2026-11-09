import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    IconButton,
    MenuItem,
    Divider,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    Snackbar,
    Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiClient from '../../utils/apiClient';
import { getBrandDetails } from '../../utils/library';

const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

const SendOfferModal = ({ open, onClose, creator }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Campaign Form state
    const [campaignData, setCampaignData] = useState({
        campaignName: '',
        description: '',
        creatorRegion: 'Global',
        creatorType: 'All Types',
        audienceInterest: 'Finance',
        compensationType: 'FIXED',
        paymentCurrency: 'USDB',
        kpiType: 'VIEWS',
        escrowEnabled: 1,
        autoPayoutEnabled: 1,
        rights: 'FULL_RIGHTS',
        exclusivityDurationDays: 7,
    });

    // Campaign deliverables
    const [campaignDeliverables, setCampaignDeliverables] = useState([
        { deliverableType: 'POST', quantity: '', pricePerUnit: '' },
    ]);

    // Campaign dates
    const [campaignStartDate, setCampaignStartDate] = useState('');
    const [campaignEndDate, setCampaignEndDate] = useState('');

    // Campaign tags
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // Offer Form state (simplified - only KPI fields)
    const [offerData, setOfferData] = useState({
        kpiType: 'ENGAGEMENT',
        kpiTarget: '',
    });

    // Options
    const creatorRegions = [
        { value: 'Global', label: 'Global' },
        { value: 'USA', label: 'USA' },
        { value: 'North America', label: 'North America' },
        { value: 'Europe', label: 'Europe' },
        { value: 'Asia', label: 'Asia' },
        { value: 'Middle East', label: 'Middle East' },
    ];

    const creatorTypes = [
        { value: 'All Types', label: 'All Types' },
        { value: 'Influencer', label: 'Influencer' },
        { value: 'Content Creator', label: 'Content Creator' },
        { value: 'NFT Artist', label: 'NFT Artist' },
        { value: 'Educator', label: 'Educator' },
        { value: 'Analyst', label: 'Analyst' },
    ];

    const audienceInterests = [
        { value: 'Finance', label: 'Finance' },
        { value: 'DeFi', label: 'DeFi' },
        { value: 'NFTs', label: 'NFTs' },
        { value: 'NFT', label: 'NFT' },
        { value: 'Trading', label: 'Trading' },
        { value: 'Gaming', label: 'Gaming' },
    ];

    const kpiTypes = [
        { value: 'ENGAGEMENT', label: 'Engagement' },
        { value: 'VIEWS', label: 'Views' },
        { value: 'CLICKS', label: 'Clicks' },
        { value: 'REACH', label: 'Reach' },
    ];

    const deliverableTypes = [
        { value: 'POST', label: 'Post' },
        { value: 'REEL', label: 'Reel' },
        { value: 'STORY', label: 'Story' },
        { value: 'LIVE_STREAM', label: 'Live Stream' },
        { value: 'VIDEO', label: 'Video' },
    ];

    const compensationTypes = [
        { value: 'FIXED', label: 'Fixed' },
        { value: 'PERFORMANCE', label: 'Performance' },
        { value: 'HYBRID', label: 'Hybrid' },
    ];

    const rightsOptions = [
        { value: 'FULL_RIGHTS', label: 'Full Rights' },
        { value: 'SHARED_RIGHTS', label: 'Shared Rights' },
        { value: 'LIMITED_RIGHTS', label: 'Limited Rights' },
        { value: 'NO_RIGHTS', label: 'No Rights' },
    ];

    // Fetch brand details and set brand name as default tag
    useEffect(() => {
        const fetchBrandDetails = async () => {
            if (open) {
                try {
                    const uuid = localStorage.getItem('collab_brand_uuid');
                    if (uuid) {
                        const response = await getBrandDetails(uuid);
                        if (response?.brand?.brandName) {
                            const formattedBrandTag = response.brand.brandName.trim().startsWith('#')
                                ? response.brand.brandName.trim()
                                : `#${response.brand.brandName.trim()}`;
                            setTags([formattedBrandTag]);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching brand details:', error);
                }
            }
        };

        fetchBrandDetails();
    }, [open]);

    // Handle campaign field changes
    const handleCampaignChange = (field, value) => {
        setCampaignData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setError(null);
    };

    // Handle offer field changes
    const handleOfferChange = (field, value) => {
        setOfferData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setError(null);
    };

    // Handle campaign deliverable changes
    const handleCampaignDeliverableChange = (index, field, value) => {
        const updated = [...campaignDeliverables];
        updated[index][field] = value;
        setCampaignDeliverables(updated);
        setError(null);
    };

    // Add campaign deliverable
    const addCampaignDeliverable = () => {
        setCampaignDeliverables([
            ...campaignDeliverables,
            { deliverableType: 'POST', quantity: '', pricePerUnit: '' },
        ]);
    };

    // Remove campaign deliverable
    const removeCampaignDeliverable = (index) => {
        if (campaignDeliverables.length > 1) {
            setCampaignDeliverables(campaignDeliverables.filter((_, i) => i !== index));
        }
    };

    // Tag handlers
    const handleRemoveTag = (tagToRemove) => {
        setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    };

    const handleAddTag = (newTag) => {
        if (newTag && newTag.trim()) {
            const formattedTag = newTag.trim().startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
            if (!tags.includes(formattedTag)) {
                setTags((prev) => [...prev, formattedTag]);
            }
            setTagInput('');
        }
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === ' ' && tagInput.trim()) {
            e.preventDefault();
            handleAddTag(tagInput);
        } else if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            handleAddTag(tagInput);
        }
    };

    // Calculate campaign total budget from deliverables
    const calculateCampaignBudget = () => {
        return campaignDeliverables.reduce((total, del) => {
            const quantity = parseFloat(del.quantity) || 0;
            const price = parseFloat(del.pricePerUnit) || 0;
            return total + quantity * price;
        }, 0);
    };

    // Validate form
    const validateForm = () => {
        // Campaign validation
        if (!campaignData.campaignName.trim()) return 'Campaign name is required';
        if (!campaignData.description.trim()) return 'Campaign description is required';
        if (!campaignStartDate) return 'Campaign start date is required';
        if (!campaignEndDate) return 'Campaign end date is required';
        if (tags.length === 0) return 'At least one tag is required';

        // Validate campaign dates
        const campStart = new Date(campaignStartDate);
        const campEnd = new Date(campaignEndDate);
        if (campEnd <= campStart) return 'Campaign end date must be after start date';

        // Validate campaign deliverables
        for (let i = 0; i < campaignDeliverables.length; i++) {
            const del = campaignDeliverables[i];
            if (!del.quantity || parseFloat(del.quantity) <= 0) {
                return `Deliverable ${i + 1}: Quantity is required and must be greater than 0`;
            }
            if (!del.pricePerUnit || parseFloat(del.pricePerUnit) <= 0) {
                return `Deliverable ${i + 1}: Price per unit is required and must be greater than 0`;
            }
        }

        // Offer validation
        if (!offerData.kpiTarget) return 'KPI target is required';

        return null;
    };

    // Handle snackbar close
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validate form
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Get brand ID from localStorage
            const brandId = localStorage.getItem('collab_brand_id');
            if (!brandId) {
                throw new Error('Brand ID not found. Please login again.');
            }

            // Get creator data from props
            const minFollowerCount = creator?.followerCount || creator?.followers || 1;
            const avgEngagementRate = creator?.engagementRate || creator?.engagement || 0;

            // Calculate budget
            const totalBudget = calculateCampaignBudget();

            // Prepare campaign payload
            const campaignPayload = {
                campaignName: campaignData.campaignName,
                description: campaignData.description,
                startDate: campaignStartDate,
                endDate: campaignEndDate,
                creatorRegion: campaignData.creatorRegion,
                creatorType: campaignData.creatorType,
                audienceInterest: campaignData.audienceInterest,
                minFollowerCount: parseInt(minFollowerCount),
                avgEngagementRate: parseFloat(avgEngagementRate),
                compensationType: campaignData.compensationType,
                paymentCurrency: campaignData.paymentCurrency,
                totalBudget: parseFloat(totalBudget.toFixed(2)),
                kpiType: campaignData.kpiType,
                kpiTarget: offerData.kpiTarget, // Using offer's KPI target for campaign
                escrowEnabled: campaignData.escrowEnabled,
                autoPayoutEnabled: campaignData.autoPayoutEnabled,
                rights: campaignData.rights,
                exclusivityDurationDays: parseInt(campaignData.exclusivityDurationDays),
                brandId: parseInt(brandId),
                deliverables: campaignDeliverables.map((del) => ({
                    deliverableType: del.deliverableType,
                    quantity: parseInt(del.quantity),
                    pricePerUnit: parseFloat(del.pricePerUnit),
                })),
                tags: tags.map((tagName) => ({ tagName })),
            };

            // Prepare offer payload (using campaign dates and deliverables)
            const offerPayload = {
                startDate: campaignStartDate, // Using campaign start date
                endDate: campaignEndDate, // Using campaign end date
                totalBudget: parseFloat(totalBudget.toFixed(2)), // Using campaign budget
                kpiType: offerData.kpiType,
                kpiTarget: offerData.kpiTarget,
                brandId: parseInt(brandId),
                creatorId: creator.creatorId,
                deliverables: campaignDeliverables.map((del) => ({ // Using campaign deliverables
                    deliverableType: del.deliverableType,
                    quantity: parseInt(del.quantity),
                    pricePerUnit: parseFloat(del.pricePerUnit),
                })),
            };

            // Combined payload
            const payload = {
                campaign: campaignPayload,
                offer: offerPayload,
            };

            console.log('Sending campaign with offer payload:', payload);

            // Call API
            const response = await apiClient.post(
                `${API_BASE_URL}/brand/saveCampaignWithOffer`,
                payload
            );

            console.log('Campaign with offer response:', response.data);

            // Check for API-level errors
            if (response.data.errorResponse?.errorData !== 0) {
                throw new Error(response.data.errorResponse?.errorMsg || 'Failed to create campaign and send offer');
            }

            // Success - Show snackbar
            setSuccess(true);
            setSnackbarMessage('Campaign created and offer sent successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Close modal after short delay
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            console.error('Send campaign with offer error:', err);
            const errorMessage = err.message || 'Failed to create campaign and send offer. Please try again.';
            setError(errorMessage);

            // Also show error in snackbar
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // Handle modal close
    const handleClose = () => {
        if (!loading) {
            // Reset all form data
            setCampaignData({
                campaignName: '',
                description: '',
                creatorRegion: 'Global',
                creatorType: 'All Types',
                audienceInterest: 'Finance',
                compensationType: 'FIXED',
                paymentCurrency: 'USDB',
                kpiType: 'VIEWS',
                escrowEnabled: 1,
                autoPayoutEnabled: 1,
                rights: 'FULL_RIGHTS',
                exclusivityDurationDays: 7,
            });
            setCampaignStartDate('');
            setCampaignEndDate('');
            setCampaignDeliverables([
                { deliverableType: 'POST', quantity: '', pricePerUnit: '' },
            ]);
            setTags([]);
            setTagInput('');
            setOfferData({
                kpiType: 'ENGAGEMENT',
                kpiTarget: '',
            });
            setError(null);
            setSuccess(false);
            onClose();
        }
    };

    // Get minimum date (today)
    const today = new Date().toISOString().split('T')[0];

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
                        maxHeight: '90vh',
                    },
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    <Typography variant="h6" component="div">
                        Create Campaign & Send Offer to {creator?.creatorName || 'Creator'}
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
                            Campaign created and offer sent successfully!
                        </Alert>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {/* ============ CAMPAIGN SECTION ============ */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ color: '#2196f3', mb: 2, fontWeight: 600 }}>
                                Campaign Details
                            </Typography>
                        </Grid>

                        {/* Campaign Name */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Campaign Name"
                                value={campaignData.campaignName}
                                onChange={(e) => handleCampaignChange('campaignName', e.target.value)}
                                required
                            />
                        </Grid>

                        {/* Campaign Description */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Campaign Description"
                                multiline
                                rows={3}
                                value={campaignData.description}
                                onChange={(e) => handleCampaignChange('description', e.target.value)}
                                required
                            />
                        </Grid>

                        {/* Campaign Duration */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                value={campaignStartDate}
                                onChange={(e) => setCampaignStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: today }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                value={campaignEndDate}
                                onChange={(e) => setCampaignEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: campaignStartDate || today }}
                                required
                            />
                        </Grid>

                        {/* Creator Targeting */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Creator Region</InputLabel>
                                <Select
                                    value={campaignData.creatorRegion}
                                    onChange={(e) => handleCampaignChange('creatorRegion', e.target.value)}
                                    label="Creator Region"
                                >
                                    {creatorRegions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Creator Type</InputLabel>
                                <Select
                                    value={campaignData.creatorType}
                                    onChange={(e) => handleCampaignChange('creatorType', e.target.value)}
                                    label="Creator Type"
                                >
                                    {creatorTypes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Audience Interest</InputLabel>
                                <Select
                                    value={campaignData.audienceInterest}
                                    onChange={(e) => handleCampaignChange('audienceInterest', e.target.value)}
                                    label="Audience Interest"
                                >
                                    {audienceInterests.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Deliverables */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>
                                    Deliverables
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={addCampaignDeliverable}
                                    sx={{ color: '#2196f3' }}
                                >
                                    Add
                                </Button>
                            </Box>
                        </Grid>

                        {campaignDeliverables.map((deliverable, index) => (
                            <Grid item xs={12} key={index}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: '#0a0a0a',
                                        borderRadius: 2,
                                        border: '1px solid #2a2a2a',
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Type</InputLabel>
                                                <Select
                                                    value={deliverable.deliverableType}
                                                    onChange={(e) =>
                                                        handleCampaignDeliverableChange(index, 'deliverableType', e.target.value)
                                                    }
                                                    label="Type"
                                                >
                                                    {deliverableTypes.map((type) => (
                                                        <MenuItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Quantity"
                                                type="number"
                                                value={deliverable.quantity}
                                                onChange={(e) =>
                                                    handleCampaignDeliverableChange(index, 'quantity', e.target.value)
                                                }
                                                inputProps={{ min: 1 }}
                                                required
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Price per Unit (B$)"
                                                type="number"
                                                value={deliverable.pricePerUnit}
                                                onChange={(e) =>
                                                    handleCampaignDeliverableChange(index, 'pricePerUnit', e.target.value)
                                                }
                                                inputProps={{ min: 0, step: 0.01 }}
                                                required
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={2}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1 }}>
                                                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                                    B${((parseFloat(deliverable.quantity) || 0) * (parseFloat(deliverable.pricePerUnit) || 0)).toFixed(2)}
                                                </Typography>
                                                {campaignDeliverables.length > 1 && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeCampaignDeliverable(index)}
                                                        sx={{ color: '#ef4444' }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        ))}

                        {/* Total Budget */}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: '#2196f3',
                                    borderRadius: 2,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Total Budget
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    {calculateCampaignBudget().toFixed(2)} B$
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Tags */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#94a3b8' }}>
                                Tags *
                            </Typography>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    border: '1px solid #2a2a2a',
                                    backgroundColor: '#0a0a0a',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    minHeight: '50px',
                                    alignItems: 'center',
                                }}
                            >
                                {tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => handleRemoveTag(tag)}
                                        sx={{
                                            backgroundColor: 'rgba(33, 150, 243, 0.15)',
                                            color: '#2196f3',
                                            '& .MuiChip-deleteIcon': {
                                                color: '#2196f3',
                                                '&:hover': {
                                                    color: '#64b5f6',
                                                },
                                            },
                                        }}
                                    />
                                ))}
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagInputKeyDown}
                                    placeholder={tags.length === 0 ? "Type tag and press space..." : ""}
                                    style={{
                                        flex: 1,
                                        minWidth: '150px',
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: 'transparent',
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        padding: '4px',
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" sx={{ mt: 0.5, color: '#94a3b8', display: 'block' }}>
                                Press Space or Enter to add tag. # will be added automatically.
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ borderColor: '#2196f3', my: 2 }} />
                        </Grid>

                        {/* ============ OFFER SECTION (Simplified) ============ */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ color: '#2196f3', mb: 2, fontWeight: 600 }}>
                                Offer Details
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                                The offer will use the same dates and deliverables as the campaign above.
                            </Typography>
                        </Grid>

                        {/* KPI Settings */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>KPI Type</InputLabel>
                                <Select
                                    value={offerData.kpiType}
                                    onChange={(e) => handleOfferChange('kpiType', e.target.value)}
                                    label="KPI Type"
                                >
                                    {kpiTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="KPI Target"
                                value={offerData.kpiTarget}
                                onChange={(e) => handleOfferChange('kpiTarget', e.target.value)}
                                placeholder="e.g., 7% engagement rate"
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 2, borderTop: '1px solid #2a2a2a' }}>
                    <Button onClick={handleClose} disabled={loading} sx={{ color: '#94a3b8' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#2196f3',
                            '&:hover': { backgroundColor: '#1976d2' },
                            minWidth: 150,
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create & Send Offer'}
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

export default SendOfferModal;