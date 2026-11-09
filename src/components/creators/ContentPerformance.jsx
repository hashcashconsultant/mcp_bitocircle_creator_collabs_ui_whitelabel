import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const ContentPerformance = ({ data }) => {
  // Don't render if no data
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Helper function to format currency
  const formatCurrency = (num) => {
    if (!num || num === 0) return '$0';
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="caption"
          sx={{
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 600,
            mb: 2,
            display: 'block',
          }}
        >
          Content Performance
        </Typography>

        <Grid container spacing={2}>
          {data.map((content, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  p: 2.5,
                  backgroundColor: '#0a0a0a',
                  borderRadius: 2,
                  border: '1px solid #2a2a2a',
                  height: '100%',
                }}
              >
                {/* Content Type Header */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#2196f3',
                    fontWeight: 600,
                    mb: 2,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {content.type || 'Content'}
                </Typography>

                {/* Earnings */}
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#4caf50',
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    {formatCurrency(content.earnings)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Earnings
                  </Typography>
                </Box>

                {/* Impressions */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#fff',
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    {formatNumber(content.impressions)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Impressions
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ContentPerformance;