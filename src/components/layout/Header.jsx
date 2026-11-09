import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useBrand } from '../../context/BrandContext';
import { getBrandDetails, handleCentralizedLogout,LOGIN_URL } from '../../utils/library';
import Cookies from 'js-cookie';
import WHITELABEL, { communityUrl, cookieOptions } from '../../config/whitelabel';


const Header = ({ onMenuClick }) => {
  const { brandData, saveBrandData, getBrandId, loading, setLoadingState } = useBrand();
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (brandData) {
      console.log('Brand data already loaded:', brandData);
      return;
    }
    fetchBrandData();
  }, [brandData]);

  const fetchBrandData = async () => {
    setLoadingState(true);
    setError(null);

    try {
      let uuid = localStorage.getItem('collab_brand_uuid');

      if (!uuid || uuid === '' || uuid === 'null') {
        const existingBrandId = localStorage.getItem('collab_brand_id');

        if (existingBrandId && existingBrandId !== '' && existingBrandId !== 'null') {
          uuid = existingBrandId;
        } else {
          uuid = '1';
          console.log('No UUID found, using default:', uuid);
        }
      }

      console.log('Fetching brand details for UUID:', uuid);

      const data = await getBrandDetails(uuid);

      console.log('Brand details received:', data);

      if (!data || !data.brand) {
        throw new Error('Invalid brand data received from API');
      }

      saveBrandData(data);

      localStorage.setItem('collab_brand_uuid', uuid);

      const brand = data.brand;
      if (brand?.brandId) {
        localStorage.setItem('collab_brand_id', brand.brandId.toString());
        console.log('Brand ID saved to localStorage:', brand.brandId);
      }

      console.log('Brand information stored successfully');
    } catch (err) {
      console.error('Error fetching brand data:', err);
      setError(err.message || 'Failed to load brand information');
      setSnackbarOpen(true);

      const fallbackId = '1';
      localStorage.setItem('collab_brand_id', fallbackId);
      console.log('Set fallback brand ID:', fallbackId);
    } finally {
      setLoadingState(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    // Clear all localStorage items
    localStorage.removeItem('collab_brand_uuid');
    localStorage.removeItem('collab_brand_id');

    // Close menu
    handleMenuClose();

    // Redirect to login or home page
    // Adjust the URL based on your app's routing
    const response = await handleCentralizedLogout();
    const error = response?.error;
    if (error && error.error_data === 1) {
      console.error('Logout error:', error);
      setError(error?.error_msg || 'Failed to logout. Please try again.');
      setSnackbarOpen(true);
    } else {
      Cookies.remove('paybito_launch_platform_token', cookieOptions());
      Cookies.remove('paybito_launch_platform_uuid', cookieOptions());
      window.location.href = LOGIN_URL;
    }
  };

  const getWalletBalance = () => {
    if (brandData?.balance !== undefined) {
      return `${brandData.balance.toLocaleString()} B$`;
    }
    return '0 B$';
  };

  const getBrandInitials = () => {
    if (brandData?.brandName) {
      return brandData.brandName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'PB';
  };

  const getBrandName = () => {
    return brandData?.brandName || 'Brand';
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#000000',
          borderBottom: '1px solid #2a2a2a',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Left Section: Menu Button + Logo + Breadcrumb */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flex: 1, minWidth: 0 }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={onMenuClick}
                sx={{ mr: 0.5 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Typography
              variant={isSmallMobile ? 'h6' : 'h5'}
              sx={{
                fontWeight: 700,
                background: `linear-gradient(90deg, ${WHITELABEL.colors.primary.main}, ${WHITELABEL.colors.primary.light})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                flexShrink: 0,
              }}
            >
              {WHITELABEL.brandName}
            </Typography>

            {/* Breadcrumb - Hidden on small mobile */}
            {!isSmallMobile && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: '#94a3b8',
                overflow: 'hidden',
                minWidth: 0,
              }}>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>Ad Center</Typography>
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>→</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#ffffff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Collabs Marketplace
                </Typography>
              </Box>
            )}
          </Box>

          {/* Right Section: Wallet + Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 2 }, flexShrink: 0 }}>
            {/* Loading indicator */}
            {loading && (
              <CircularProgress size={24} sx={{ color: '#2196f3' }} />
            )}

            {/* Wallet Button */}
            <Button
              variant="outlined"
              startIcon={!isSmallMobile && <AccountBalanceWalletIcon sx={{ color: '#ffc107' }} />}
              disabled={loading}
              onClick={() => window.open(communityUrl(WHITELABEL.communityLinks.wallet), '_blank', 'noopener,noreferrer')}
              sx={{
                borderColor: '#2a2a2a',
                color: '#4caf50',
                cursor: 'pointer',
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1, sm: 2 },
                '&:hover': {
                  borderColor: '#2196f3',
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                },
              }}
            >
              {isSmallMobile ? (
                // Mobile: Show only icon and balance
                <>
                  <AccountBalanceWalletIcon sx={{ color: '#ffc107', fontSize: 20, mr: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.75rem' }}>
                    {getWalletBalance()}
                  </Typography>
                </>
              ) : (
                // Desktop: Show full text
                <>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mr: 1, display: { xs: 'none', md: 'block' } }}>
                    Wallet:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    {getWalletBalance()}
                  </Typography>
                </>
              )}
            </Button>

            {/* Avatar */}
            <Avatar
              onClick={handleAvatarClick}
              sx={{
                bgcolor: '#2196f3',
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                cursor: 'pointer',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&:hover': {
                  bgcolor: '#1976d2',
                },
              }}
            >
              {getBrandInitials()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Avatar Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            minWidth: 200,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: '#1a1a1a',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderLeft: '1px solid #2a2a2a',
              borderTop: '1px solid #2a2a2a',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          disabled
          sx={{
            opacity: '1 !important',
            cursor: 'default !important',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: '#2196f3' }} fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={getBrandName()}
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: 600,
              color: '#ffffff',
            }}
          />
        </MenuItem>
        <Divider sx={{ borderColor: '#2a2a2a', my: 0.5 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: '#f44336',
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#f44336' }} fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: 500,
            }}
          />
        </MenuItem>
      </Menu>

      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;