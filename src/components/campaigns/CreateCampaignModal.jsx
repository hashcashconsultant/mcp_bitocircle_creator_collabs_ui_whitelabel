import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Switch,
  IconButton,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import apiClient from '../../utils/apiClient';
import CustomSnackbar from '../../utils/CustomSnackbar';
import { getBrandDetails } from '../../utils/library';

const steps = ['Basic Info', 'Targeting', 'Budget & KPI'];

const deliverables = [
  { id: 'POST', label: 'Post' },
  { id: 'STORY', label: 'Story' },
  { id: 'REEL', label: 'Reel' },
  { id: 'LIVESTREAM', label: 'Livestream' },
];

// API base URL
const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

const CreateCampaignModal = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [brandName, setBrandName] = useState('');

  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  });

  // Step 1 - Basic Info
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDeliverables, setSelectedDeliverables] = useState([]);
  const [deliverableQuantities, setDeliverableQuantities] = useState({
    POST: '',
    STORY: '',
    REEL: '',
    LIVESTREAM: '',
  });
  const [deliverablePrices, setDeliverablePrices] = useState({
    POST: '',
    STORY: '',
    REEL: '',
    LIVESTREAM: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Step 2 - Targeting
  const [creatorRegion, setCreatorRegion] = useState('Global');
  const [creatorType, setCreatorType] = useState('All Types');
  const [audienceInterest, setAudienceInterest] = useState('Finance');
  const [minFollowers, setMinFollowers] = useState('');
  const [engagementRate, setEngagementRate] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Step 3 - Budget & KPI
  const [compensationType, setCompensationType] = useState('FIXED');
  const [paymentCurrency, setPaymentCurrency] = useState('USDB');
  const [totalBudget, setTotalBudget] = useState('');
  const [maxCreatorApplications, setMaxCreatorApplications] = useState('');
  const [budgetPerCreator, setBudgetPerCreator] = useState('');
  const [kpiType, setKpiType] = useState('VIEWS');
  const [kpiTarget, setKpiTarget] = useState('');
  const [escrowEnabled, setEscrowEnabled] = useState(true);
  const [autoPayout, setAutoPayout] = useState(true);
  const [rights, setRights] = useState('FULL_RIGHTS');
  const [exclusivity, setExclusivity] = useState(false);

  // Fetch brand details and set brand name as default tag
  useEffect(() => {
    const fetchBrandDetails = async () => {
      if (open) {
        try {
          const uuid = localStorage.getItem('collab_brand_uuid');
          if (uuid) {
            const response = await getBrandDetails(uuid);
            if (response?.brand?.brandName) {
              setBrandName(response.brand.brandName);
              // Set brand name as default tag if tags are empty
              const formattedBrandTag = response.brand.brandName.trim().startsWith('#')
                ? response.brand.brandName.trim()
                : `#${response.brand.brandName.trim()}`;
              setTags([formattedBrandTag]);
            }
          }
        } catch (error) {
          console.error('Error fetching brand details:', error);
          // Don't show error to user, just log it
        }
      }
    };

    fetchBrandDetails();
  }, [open]);

  // Handle exclusivity checkbox change
  useEffect(() => {
    if (exclusivity) {
      setMaxCreatorApplications('1');
    }
  }, [exclusivity]);

  // Auto-calculate totalBudget based on deliverables and maxCreatorApplications
  useEffect(() => {
    const deliverablesTotalPrice = calculateDeliverablesTotalPrice();

    if (deliverablesTotalPrice > 0) {
      if (maxCreatorApplications && parseInt(maxCreatorApplications) > 0) {
        // totalBudget = deliverables total * maxCreatorApplications
        const calculatedTotal = deliverablesTotalPrice * parseInt(maxCreatorApplications);
        setTotalBudget(calculatedTotal.toFixed(2));
      } else {
        // totalBudget = deliverables total
        setTotalBudget(deliverablesTotalPrice.toFixed(2));
      }
    } else {
      setTotalBudget('');
    }
  }, [selectedDeliverables, deliverableQuantities, deliverablePrices, maxCreatorApplications]);

  // Auto-calculate budgetPerCreator when totalBudget or maxCreatorApplications changes
  useEffect(() => {
    if (totalBudget && maxCreatorApplications) {
      const total = parseFloat(totalBudget);
      const maxCreators = parseInt(maxCreatorApplications);
      if (!isNaN(total) && !isNaN(maxCreators) && maxCreators > 0) {
        const calculatedBudget = (total / maxCreators).toFixed(2);
        setBudgetPerCreator(calculatedBudget);
      }
    } else {
      setBudgetPerCreator('');
    }
  }, [totalBudget, maxCreatorApplications]);

  // Snackbar handler
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

  // Validation functions
  const validateStep1 = () => {
    const errors = {};

    if (!campaignName.trim()) {
      errors.campaignName = 'Campaign name is required';
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
    }

    if (selectedDeliverables.length === 0) {
      errors.selectedDeliverables = 'Please select at least one deliverable';
    }

    // Validate deliverables have quantity and price
    if (selectedDeliverables.length > 0) {
      const invalidDeliverables = {};

      selectedDeliverables.forEach(deliverableType => {
        const quantity = deliverableQuantities[deliverableType];
        const price = deliverablePrices[deliverableType];

        invalidDeliverables[deliverableType] = {
          quantity: !quantity || quantity <= 0,
          price: !price || price <= 0
        };
      });

      // Check if any deliverable has invalid quantity or price
      const hasInvalidDeliverables = Object.values(invalidDeliverables).some(
        d => d.quantity || d.price
      );

      if (hasInvalidDeliverables) {
        errors.deliverableValidation = invalidDeliverables;
        errors.selectedDeliverables = 'Please provide valid quantity and price for all selected deliverables';
      }
    }

    if (!startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!endDate) {
      errors.endDate = 'End date is required';
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      errors.endDate = 'End date must be after start date';
    }

    return errors;
  };
  const validateStep2 = () => {
    const errors = {};

    if (!minFollowers || parseInt(minFollowers) <= 0) {
      errors.minFollowers = 'Minimum follower count is required and must be greater than 0';
    }

    if (!engagementRate || parseFloat(engagementRate) <= 0) {
      errors.engagementRate = 'Average engagement rate is required and must be greater than 0';
    }

    if (tags.length === 0) {
      errors.tags = 'At least one tag is required';
    }

    return errors;
  };

  const validateStep3 = () => {
    const errors = {};

    if (!totalBudget || parseFloat(totalBudget) <= 0) {
      errors.totalBudget = 'Total budget is required and must be greater than 0';
    }

    if (!maxCreatorApplications || parseInt(maxCreatorApplications) <= 0) {
      errors.maxCreatorApplications = 'Max creator applications is required and must be greater than 0';
    }

    // Validate maxCreatorApplications is between 1 and 10
    if (maxCreatorApplications && (parseInt(maxCreatorApplications) < 1 || parseInt(maxCreatorApplications) > 10)) {
      errors.maxCreatorApplications = 'Max creator applications must be between 1 and 10';
    }

    if (!budgetPerCreator || parseFloat(budgetPerCreator) <= 0) {
      errors.budgetPerCreator = 'Budget per creator is required and must be greater than 0';
    }

    // Validate that budgetPerCreator * maxCreatorApplications <= totalBudget
    if (totalBudget && maxCreatorApplications && budgetPerCreator) {
      const total = parseFloat(totalBudget);
      const maxCreators = parseInt(maxCreatorApplications);
      const perCreator = parseFloat(budgetPerCreator);
      const calculatedBudget = maxCreators * perCreator;

      if (calculatedBudget > total) {
        errors.budgetAllocation = `Budget allocation (${maxCreators} creators × B$${perCreator} = B$${calculatedBudget}) exceeds total budget (B$${total})`;
      }
    }

    if (!kpiTarget || !kpiTarget.trim()) {
      errors.kpiTarget = 'KPI target is required';
    }

    return errors;
  };

  const validateCurrentStep = () => {
    let errors = {};

    switch (activeStep) {
      case 0:
        errors = validateStep1();
        break;
      case 1:
        errors = validateStep2();
        break;
      case 2:
        errors = validateStep3();
        break;
      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prev) => prev + 1);
      setValidationErrors({});
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setValidationErrors({});
  };

  const handleDeliverableToggle = (id) => {
    setSelectedDeliverables((prev) =>
      prev.includes(id)
        ? prev.filter((d) => d !== id)
        : [...prev, id]
    );
    // Clear validation error when user makes a change
    if (validationErrors.selectedDeliverables) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.selectedDeliverables;
        return newErrors;
      });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    // Clear validation error when user makes a change
    if (validationErrors.tags) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.tags;
        return newErrors;
      });
    }
  };

  const handleAddTag = (newTag) => {
    if (newTag && newTag.trim()) {
      const formattedTag = newTag.trim().startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
      if (!tags.includes(formattedTag)) {
        setTags((prev) => [...prev, formattedTag]);
        // Clear validation error when user adds a tag
        if (validationErrors.tags) {
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.tags;
            return newErrors;
          });
        }
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

  // Handler to clear budget allocation error when fields change
  const handleBudgetFieldChange = (field, value, setter) => {
    setter(value);

    // Clear specific field error
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Clear budget allocation error
    if (validationErrors.budgetAllocation) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.budgetAllocation;
        return newErrors;
      });
    }
  };

  // Calculate total price of deliverables
  const calculateDeliverablesTotalPrice = () => {
    let total = 0;
    selectedDeliverables.forEach(deliverableType => {
      const quantity = deliverableQuantities[deliverableType] || 0;
      const price = deliverablePrices[deliverableType] || 0;
      total += quantity * price;
    });
    return total;
  };

  const handlePublish = async () => {
    // Validate all steps before publishing
    const step1Errors = validateStep1();
    const step2Errors = validateStep2();
    const step3Errors = validateStep3();
    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors };

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      setError('Please fill in all required fields correctly');
      showSnackbar('Please fill in all required fields correctly', 'error');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare deliverables array
      const deliverablesArray = selectedDeliverables.map((deliverableType) => ({
        deliverableType,
        quantity: deliverableQuantities[deliverableType],
        pricePerUnit: deliverablePrices[deliverableType],
      }));

      // Prepare tags array
      const tagsArray = tags.map((tagName) => ({ tagName }));

      // Prepare payload
      const payload = {
        campaignName,
        description,
        startDate,
        endDate,
        creatorRegion,
        creatorType,
        audienceInterest,
        minFollowerCount: parseInt(minFollowers),
        avgEngagementRate: parseFloat(engagementRate),
        compensationType: 'FIXED',
        paymentCurrency,
        totalBudget: parseFloat(totalBudget),
        maxCreatorApplications: parseInt(maxCreatorApplications),
        budgetPerCreator: parseFloat(budgetPerCreator),
        kpiType,
        kpiTarget,
        escrowEnabled: escrowEnabled ? 1 : 0,
        autoPayoutEnabled: autoPayout ? 1 : 0,
        rights,
        //exclusivityDurationDays: exclusivity ? 365 : 1,
        exclusivityEnabled: exclusivity ? 1 : 0,
        brandId: parseInt(localStorage.getItem('collab_brand_id')) || 1,
        deliverables: deliverablesArray,
        tags: tagsArray,
      };

      console.log('Payload:', JSON.stringify(payload, null, 2));

      // Make API call with full URL
      const response = await apiClient.post(API_BASE_URL + '/brand/create_campaign', payload);

      // Check for error response
      const errorResponse = response.data.errorResponse;
      if (errorResponse && errorResponse.errorData === 1) {
        const errorMessage = errorResponse.errorMsg || 'Failed to create campaign';
        showSnackbar(errorMessage, 'error');
        setError(errorMessage);
        return;
      }

      // Success
      showSnackbar('Campaign created successfully!', 'success');
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      console.error('Error creating campaign:', err);
      const errorMessage = err.message || 'Failed to create campaign. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setError(null);
    setSuccess(false);
    setValidationErrors({});
    onClose();
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#0a0a0a',
      '& fieldset': {
        borderColor: '#2a2a2a',
      },
      '&:hover fieldset': {
        borderColor: '#2196f3',
      },
      '&.Mui-error fieldset': {
        borderColor: '#f44336',
      },
    },
  };

  const selectStyles = {
    backgroundColor: '#0a0a0a',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2a2a2a',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2196f3',
    },
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {/* Campaign Name */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Campaign Name *
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter campaign name"
              value={campaignName}
              onChange={(e) => {
                setCampaignName(e.target.value);
                if (validationErrors.campaignName) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.campaignName;
                    return newErrors;
                  });
                }
              }}
              error={!!validationErrors.campaignName}
              helperText={validationErrors.campaignName}
              sx={{ ...inputStyles, mb: 3 }}
              required
            />

            {/* Description */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Description *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Describe your campaign goals and message"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (validationErrors.description) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.description;
                    return newErrors;
                  });
                }
              }}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
              sx={{ ...inputStyles, mb: 3 }}
              required
            />

            {/* Select Deliverables */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Select Deliverables *
            </Typography>
            {validationErrors.selectedDeliverables && (
              <Typography variant="caption" sx={{ color: '#f44336', mb: 1, display: 'block' }}>
                {validationErrors.selectedDeliverables}
              </Typography>
            )}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {deliverables.map((deliverable) => (
                <Grid item xs={6} key={deliverable.id}>
                  <Box
                    onClick={() => handleDeliverableToggle(deliverable.id)}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: selectedDeliverables.includes(deliverable.id)
                        ? '#2196f3'
                        : '#2a2a2a',
                      backgroundColor: selectedDeliverables.includes(deliverable.id)
                        ? 'rgba(33, 150, 243, 0.1)'
                        : '#0a0a0a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#2196f3',
                      },
                    }}
                  >
                    <Checkbox
                      checked={selectedDeliverables.includes(deliverable.id)}
                      sx={{
                        p: 0,
                        color: '#2a2a2a',
                        '&.Mui-checked': {
                          color: '#2196f3',
                        },
                      }}
                    />
                    <Typography variant="body2">{deliverable.label}</Typography>
                  </Box>

                  {/* Quantity and Price inputs for selected deliverables */}
                  {selectedDeliverables.includes(deliverable.id) && (
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <TextField
                        size="small"
                        type="number"
                        placeholder="Qty"
                        value={deliverableQuantities[deliverable.id]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDeliverableQuantities({
                            ...deliverableQuantities,
                            [deliverable.id]: value === '' ? '' : parseInt(value)
                          });
                          // Clear validation error for this field
                          if (validationErrors.deliverableValidation?.[deliverable.id]?.quantity) {
                            setValidationErrors((prev) => {
                              const newErrors = { ...prev };
                              if (newErrors.deliverableValidation) {
                                newErrors.deliverableValidation[deliverable.id].quantity = false;
                              }
                              return newErrors;
                            });
                          }
                        }}
                        onBlur={(e) => {
                          // Set to 1 if empty when user leaves the field
                          if (e.target.value === '' || parseInt(e.target.value) < 1) {
                            setDeliverableQuantities({
                              ...deliverableQuantities,
                              [deliverable.id]: 1
                            });
                          }
                        }}
                        error={validationErrors.deliverableValidation?.[deliverable.id]?.quantity}
                        sx={{ ...inputStyles, flex: 1 }}
                        inputProps={{ min: 1 }}
                      />
                      <TextField
                        size="small"
                        type="number"
                        placeholder="Price (B$)"
                        value={deliverablePrices[deliverable.id]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setDeliverablePrices({
                            ...deliverablePrices,
                            [deliverable.id]: value === '' ? '' : parseFloat(value)
                          });
                          // Clear validation error for this field
                          if (validationErrors.deliverableValidation?.[deliverable.id]?.price) {
                            setValidationErrors((prev) => {
                              const newErrors = { ...prev };
                              if (newErrors.deliverableValidation) {
                                newErrors.deliverableValidation[deliverable.id].price = false;
                              }
                              return newErrors;
                            });
                          }
                        }}
                        onBlur={(e) => {
                          // Set to 0 if empty when user leaves the field
                          if (e.target.value === '' || parseFloat(e.target.value) < 0) {
                            setDeliverablePrices({
                              ...deliverablePrices,
                              [deliverable.id]: 0
                            });
                          }
                        }}
                        error={validationErrors.deliverableValidation?.[deliverable.id]?.price}
                        sx={{ ...inputStyles, flex: 1 }}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>

            {/* Duration */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Duration *
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (validationErrors.startDate) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.startDate;
                        return newErrors;
                      });
                    }
                  }}
                  onClick={(e) => {
                    // Automatically open the date picker
                    try {
                      e.target.showPicker?.();
                    } catch (error) {
                      // Fallback for browsers that don't support showPicker
                      console.log('showPicker not supported');
                    }
                  }}
                  error={!!validationErrors.startDate}
                  helperText={validationErrors.startDate}
                  sx={inputStyles}
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: '#94a3b8' }
                  }}
                  inputProps={{
                    style: { cursor: 'pointer' }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (validationErrors.endDate) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.endDate;
                        return newErrors;
                      });
                    }
                  }}
                  onClick={(e) => {
                    // Automatically open the date picker
                    try {
                      e.target.showPicker?.();
                    } catch (error) {
                      // Fallback for browsers that don't support showPicker
                      console.log('showPicker not supported');
                    }
                  }}
                  error={!!validationErrors.endDate}
                  helperText={validationErrors.endDate}
                  sx={inputStyles}
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: '#94a3b8' }
                  }}
                  inputProps={{
                    style: { cursor: 'pointer' }
                  }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            {/* Creator Region */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Creator Region
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                value={creatorRegion}
                onChange={(e) => setCreatorRegion(e.target.value)}
                sx={selectStyles}
              >
                <MenuItem value="Global">Global</MenuItem>
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="North America">North America</MenuItem>
                <MenuItem value="Europe">Europe</MenuItem>
                <MenuItem value="Asia">Asia</MenuItem>
                <MenuItem value="Middle East">Middle East</MenuItem>
              </Select>
            </FormControl>

            {/* Creator Type */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Creator Type
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                value={creatorType}
                onChange={(e) => setCreatorType(e.target.value)}
                sx={selectStyles}
              >
                <MenuItem value="All Types">All Types</MenuItem>
                <MenuItem value="Influencer">Influencer</MenuItem>
                <MenuItem value="Content Creator">Content Creator</MenuItem>
                <MenuItem value="NFT Artist">NFT Artist</MenuItem>
                <MenuItem value="Educator">Educator</MenuItem>
                <MenuItem value="Analyst">Analyst</MenuItem>
              </Select>
            </FormControl>

            {/* Audience Interest */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Audience Interest
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                value={audienceInterest}
                onChange={(e) => setAudienceInterest(e.target.value)}
                sx={selectStyles}
              >
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="DeFi">DeFi</MenuItem>
                <MenuItem value="NFTs">NFTs</MenuItem>
                <MenuItem value="NFT">NFT</MenuItem>
                <MenuItem value="Trading">Trading</MenuItem>
                <MenuItem value="Gaming">Gaming</MenuItem>
              </Select>
            </FormControl>

            {/* Minimum Follower Count */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Minimum Follower Count *
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="e.g. 10000"
              value={minFollowers}
              onChange={(e) => {
                setMinFollowers(e.target.value);
                if (validationErrors.minFollowers) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.minFollowers;
                    return newErrors;
                  });
                }
              }}
              error={!!validationErrors.minFollowers}
              helperText={validationErrors.minFollowers}
              sx={{ ...inputStyles, mb: 3 }}
              required
            />

            {/* Average Engagement Rate */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Average Engagement Rate (%) *
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="e.g. 3.5"
              value={engagementRate}
              onChange={(e) => {
                setEngagementRate(e.target.value);
                if (validationErrors.engagementRate) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.engagementRate;
                    return newErrors;
                  });
                }
              }}
              error={!!validationErrors.engagementRate}
              helperText={validationErrors.engagementRate}
              sx={{ ...inputStyles, mb: 3 }}
              required
            />

            {/* Tags */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Tags *
            </Typography>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: validationErrors.tags ? '#f44336' : '#2a2a2a',
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
            {validationErrors.tags && (
              <Typography variant="caption" sx={{ mt: 0.5, color: '#f44336', display: 'block' }}>
                {validationErrors.tags}
              </Typography>
            )}
            <Typography variant="caption" sx={{ mt: 0.5, color: '#94a3b8', display: 'block' }}>
              Press Space or Enter to add tag. # will be added automatically. At least one tag required.
            </Typography>
          </Box>
        );

      case 2:
        return (
          <Box>
            {/* Payment Currency - Disabled */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Payment Currency
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                value={paymentCurrency}
                onChange={(e) => setPaymentCurrency(e.target.value)}
                disabled
                sx={{
                  ...selectStyles,
                  '&.Mui-disabled': {
                    backgroundColor: '#050505',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1a1a1a',
                    },
                  },
                  '& .MuiSelect-select.Mui-disabled': {
                    WebkitTextFillColor: '#64748b',
                    color: '#64748b',
                  },
                }}
              >
                <MenuItem value="USDB">BitoDollar(B$)</MenuItem>
              </Select>
            </FormControl>

            {/* Deliverables Cost Info */}
            {selectedDeliverables.length > 0 && calculateDeliverablesTotalPrice() > 0 && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Total Deliverables Cost:</strong> B${calculateDeliverablesTotalPrice().toLocaleString()}
                </Typography>
              </Alert>
            )}

            {/* Exclusivity Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={exclusivity}
                  onChange={(e) => setExclusivity(e.target.checked)}
                  sx={{
                    color: '#2a2a2a',
                    '&.Mui-checked': {
                      color: '#2196f3',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Exclusivity
                </Typography>
              }
              sx={{ mb: 3 }}
            />

            {/* Max Creator Applications */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Max Creator Applications *
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="e.g. 10"
              value={maxCreatorApplications}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!exclusivity && (!value || (value >= 1 && value <= 10))) {
                  handleBudgetFieldChange('maxCreatorApplications', e.target.value, setMaxCreatorApplications);
                }
              }}
              disabled={exclusivity}
              error={!!validationErrors.maxCreatorApplications}
              helperText={validationErrors.maxCreatorApplications || 'Maximum number of creators who can apply (1-10)'}
              sx={{
                ...inputStyles,
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#0a0a0a',
                  '& fieldset': {
                    borderColor: '#2a2a2a',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#050505',
                    '& fieldset': {
                      borderColor: '#1a1a1a',
                    },
                  },
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#64748b',
                  color: '#64748b',
                },
              }}
              inputProps={{ min: 1, max: 10 }}
              required
            />

            {/* Total Budget - Auto-calculated and Disabled */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Total Budget * (Auto-calculated)
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="Auto-calculated"
              value={totalBudget}
              disabled
              error={!!validationErrors.totalBudget}
              helperText={validationErrors.totalBudget || 'Automatically calculated from deliverables cost × max creator applications'}
              sx={{
                ...inputStyles,
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#0a0a0a',
                  '& fieldset': {
                    borderColor: '#2a2a2a',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#050505',
                    '& fieldset': {
                      borderColor: '#1a1a1a',
                    },
                  },
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#64748b',
                  color: '#64748b',
                },
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">B$</InputAdornment>,
              }}
              required
            />

            {/* Budget Per Creator - Auto-calculated and Disabled */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Budget Per Creator * (Auto-calculated)
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="Auto-calculated"
              value={budgetPerCreator}
              disabled
              sx={{
                ...inputStyles,
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#0a0a0a',
                  '& fieldset': {
                    borderColor: '#2a2a2a',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#050505',
                    '& fieldset': {
                      borderColor: '#1a1a1a',
                    },
                  },
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#64748b',
                  color: '#64748b',
                },
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">B$</InputAdornment>,
              }}
              helperText="Automatically calculated as Total Budget ÷ Max Creator Applications"
            />

            {/* Budget Allocation Alert */}
            {validationErrors.budgetAllocation && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {validationErrors.budgetAllocation}
              </Alert>
            )}

            {/* Budget Calculation Info */}
            {totalBudget && maxCreatorApplications && budgetPerCreator && !validationErrors.budgetAllocation && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Budget Allocation:</strong> {parseInt(maxCreatorApplications || 0)} creators × B${parseFloat(budgetPerCreator || 0).toLocaleString()} = <strong>B${(parseInt(maxCreatorApplications || 0) * parseFloat(budgetPerCreator || 0)).toLocaleString()}</strong>
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  Remaining: B${(parseFloat(totalBudget) - (parseInt(maxCreatorApplications || 0) * parseFloat(budgetPerCreator || 0))).toLocaleString()}
                </Typography>
              </Alert>
            )}

            {/* KPI Type */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              KPI Type
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                value={kpiType}
                onChange={(e) => setKpiType(e.target.value)}
                sx={selectStyles}
              >
                <MenuItem value="VIEWS">Views</MenuItem>
                <MenuItem value="CLICKS">Clicks</MenuItem>
                <MenuItem value="ENGAGEMENT">Engagement</MenuItem>
              </Select>
            </FormControl>

            {/* KPI Target */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              KPI Target *
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder={kpiType === 'VIEWS' || kpiType === 'CLICKS' ? 'e.g. 5000' : 'e.g. 5'}
              value={kpiTarget}
              onChange={(e) => {
                setKpiTarget(e.target.value);
                if (validationErrors.kpiTarget) {
                  setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.kpiTarget;
                    return newErrors;
                  });
                }
              }}
              error={!!validationErrors.kpiTarget}
              helperText={validationErrors.kpiTarget || (kpiType === 'ENGAGEMENT' ? 'e.g. 5 for 5% engagement rate minimum' : kpiType === 'VIEWS' ? 'e.g. 5000 for minimum views' : 'e.g. 5000 for minimum clicks')}
              sx={{ ...inputStyles, mb: 3 }}
              inputProps={{ min: 0, step: kpiType === 'ENGAGEMENT' ? 0.01 : 1 }}
              required
            />

            {/* Auto-payout on KPI verified */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Auto-payout on KPI verified
              </Typography>
              <Switch
                checked={autoPayout}
                onChange={(e) => setAutoPayout(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#2196f3',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#2196f3',
                  },
                }}
              />
            </Box>

            {/* Rights */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Rights
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                value={rights}
                onChange={(e) => setRights(e.target.value)}
                sx={selectStyles}
              >
                <MenuItem value="FULL_RIGHTS">Full Rights</MenuItem>
                <MenuItem value="SHARED_RIGHTS">Shared Rights</MenuItem>
                <MenuItem value="LIMITED_RIGHTS">Limited Rights</MenuItem>
                <MenuItem value="NO_RIGHTS">No Rights</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          // Prevent closing on backdrop click or escape key
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
          handleClose();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#121212',
            border: '1px solid #2a2a2a',
            borderRadius: 2,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #2a2a2a',
            pb: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Create Campaign
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: '#94a3b8' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 3,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#0a0a0a',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#2a2a2a',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#3a3a3a',
            },
          }}
        >
          {/* Error Alert - Only show when not success */}
          {error && !success && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Campaign created successfully!
            </Alert>
          )}

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': {
                        color: '#2196f3',
                      },
                      '&.Mui-completed': {
                        color: '#4caf50',
                      },
                    },
                  }}
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: activeStep === index ? '#ffffff' : '#94a3b8',
                      '&.Mui-active': {
                        color: '#ffffff',
                      },
                      '&.Mui-completed': {
                        color: '#94a3b8',
                      },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          {renderStepContent(activeStep)}
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: '1px solid #2a2a2a',
            p: 2,
            gap: 2,
          }}
        >
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outlined"
              disabled={loading}
              sx={{
                flex: 1,
                borderColor: '#2a2a2a',
                color: '#94a3b8',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: 'rgba(148, 163, 184, 0.08)',
                },
              }}
            >
              ← Previous
            </Button>
          )}

          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{
              flex: 1,
              borderColor: '#2a2a2a',
              color: '#94a3b8',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: 'rgba(148, 163, 184, 0.08)',
              },
            }}
          >
            Cancel
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={loading}
              sx={{
                flex: 1,
                backgroundColor: '#2196f3',
                '&:hover': { backgroundColor: '#1976d2' },
              }}
            >
              Next Step →
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
              sx={{
                flex: 1,
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#388e3c' },
                '&:disabled': {
                  backgroundColor: '#2a2a2a',
                  color: '#666',
                },
              }}
            >
              {loading ? 'Publishing...' : 'Publish Campaign'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
};

export default CreateCampaignModal;