import React from 'react';
import { Box, Typography } from '@mui/material';

const StatCard = ({ 
  label, 
  value, 
  valueColor = '#ffffff',
  labelVariant = 'caption',
  valueVariant = 'h4',
  align = 'left'
}) => {
  return (
    <Box sx={{ textAlign: align }}>
      <Typography
        variant={labelVariant}
        sx={{
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontSize: '0.7rem',
          fontWeight: 500,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant={valueVariant}
        sx={{
          color: valueColor,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default StatCard;
