import React from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const VerifiedBadge = ({ size = 'small' }) => {
  return (
    <Chip
      icon={<CheckCircleIcon sx={{ fontSize: 14, color: '#4caf50 !important' }} />}
      label="Verified"
      size={size}
      sx={{
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        color: '#4caf50',
        border: '1px solid rgba(76, 175, 80, 0.3)',
        fontWeight: 500,
        fontSize: '0.7rem',
        height: 24,
        '& .MuiChip-icon': {
          marginLeft: '6px',
        },
      }}
    />
  );
};

export default VerifiedBadge;
