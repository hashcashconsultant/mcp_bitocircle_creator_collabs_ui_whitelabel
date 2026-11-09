import React from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';

const TopPerformingCreators = ({ creators }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BoltIcon sx={{ color: '#ff9800', fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Top Performing Creators
          </Typography>
        </Box>

        {creators.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              No creators found
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: '350px', // Shows ~5 creators (each ~70px)
              overflowY: 'auto',
              pr: 0.5,
              // Custom scrollbar styling
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#0a0a0a',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#2196f3',
                borderRadius: '3px',
                '&:hover': {
                  backgroundColor: '#1976d2',
                },
              },
              // Firefox scrollbar
              scrollbarWidth: 'thin',
              scrollbarColor: '#2196f3 #0a0a0a',
            }}
          >
            {creators.map((creator, index) => (
              <Box
                key={creator.creatorId || index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.5,
                  borderBottom: index < creators.length - 1 ? '1px solid #2a2a2a' : 'none',
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: creator.color || '#2196f3',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {creator.avatar}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {creator.handle}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#2196f3' }}>
                    Followers: {creator.followers}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPerformingCreators;