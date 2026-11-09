import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const ProgressBar = ({ 
  value, 
  showLabel = true, 
  label, 
  height = 8,
  color = 'primary' 
}) => {
  const getColor = () => {
    if (value >= 75) return '#4caf50';
    if (value >= 50) return '#2196f3';
    if (value >= 25) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box sx={{ width: '100%' }}>
      {showLabel && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            {label || `${value}% KPI Achieved`}
          </Typography>
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: height,
          borderRadius: height / 2,
          backgroundColor: '#2a2a2a',
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2,
            backgroundColor: color === 'auto' ? getColor() : undefined,
          },
        }}
        color={color !== 'auto' ? color : undefined}
      />
    </Box>
  );
};

export default ProgressBar;
