import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Link } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/router';


const InsightCard = ({ insight }) => {
  const router = useRouter();
  
  const handleLinkClick = (suggestion) => {
    if (!suggestion?.linkHref) return;

    if (suggestion.isLinkExternal) {
      window.open(suggestion.linkHref, "_blank", "noopener,noreferrer");
    } else {
      router.push(suggestion.linkHref);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#0a0a0a',
        borderRadius: 2,
        border: '1px solid #2a2a2a',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="body2" sx={{ color: '#ffffff', mb: 2, flex: 1 }}>
        {insight.text}
      </Typography>
      <Link
        component="button"
        onClick={() => handleLinkClick(insight)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: '#2196f3',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          '&:hover': {
            color: '#64b5f6',
          },
        }}
      >
        {insight.link}
        <ArrowForwardIcon sx={{ fontSize: 16 }} />
      </Link>
    </Box>
  );
};

const AIInsights = ({ insights }) => {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(76, 175, 80, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeIcon sx={{ color: '#4caf50', fontSize: 18 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Insights
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {insights.map((insight) => (
            <Grid item xs={12} md={4} key={insight.id}>
              <InsightCard insight={insight} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
