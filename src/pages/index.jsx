import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useBrand } from '../context/BrandContext';
import { getBrandDetails } from '../utils/library';

const Home = () => {
  const router = useRouter();
  const { uuid } = router.query;
  const { saveBrandData, isBrandSetup } = useBrand();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Initializing...');
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    // If UUID is present, setup collaboration
    if (uuid) {
      setIsSetup(true);
      setupBrandCollab(uuid);
    } else {
      // Check if already setup
      if (isBrandSetup()) {
        // Already setup, redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [uuid, router]);

  const setupBrandCollab = async (uuid) => {
    try {
      setStatus('Fetching brand details...');

      // Fetch brand details
      const data = await getBrandDetails(uuid);

      setStatus('Storing brand information...');

      // Save to context and localStorage
      saveBrandData(data);

      // Store UUID for future reference
      localStorage.setItem('collab_brand_uuid', uuid);
      // Store brand id for future reference
      const brand = data.brand;
      localStorage.setItem('collab_brand_id', brand?.brandId);

      setStatus('Setup complete! Redirecting...');

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err) {
      console.error('Error setting up collaboration:', err);
      setError(err.message || 'Failed to load brand details');
      setStatus('Setup failed');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  };

  // If no UUID and no setup, show landing page
  if (!isSetup && !uuid) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#000',
          gap: 4,
          px: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: '#fff',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          Welcome to Brand Collaboration
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          Please use the setup link provided to access your dashboard
        </Typography>
      </Box>
    );
  }

  // Show setup/loading screen
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#000',
        gap: 3,
        px: 2,
      }}
    >
      {error ? (
        <Box sx={{ textAlign: 'center', maxWidth: 500 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <Typography variant="h3" sx={{ color: '#fff' }}>
              ✕
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ color: '#ef4444', fontWeight: 600, mb: 2 }}>
            Setup Failed
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', mb: 1 }}>
            {error}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Please try again...
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ position: 'relative' }}>
            <CircularProgress
              size={80}
              thickness={4}
              sx={{
                color: '#2196f3',
                animationDuration: '1s',
              }}
            />
          </Box>
          <Box sx={{ textAlign: 'center', maxWidth: 500 }}>
            <Typography
              variant="h4"
              sx={{
                color: '#fff',
                fontWeight: 600,
                mb: 2,
                letterSpacing: '-0.5px',
              }}
            >
              Setting Up Your Collaboration
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#94a3b8',
                mb: 1,
                fontSize: '1.1rem',
              }}
            >
              {status}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.875rem',
              }}
            >
              This will only take a moment
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Home;