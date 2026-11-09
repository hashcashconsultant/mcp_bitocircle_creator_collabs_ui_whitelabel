import React from 'react';
import { Chip } from '@mui/material';

const TagChip = ({ label, size = 'small', variant = 'outlined' }) => {
  return (
    <Chip
      label={label}
      size={size}
      variant={variant}
      sx={{
        backgroundColor: variant === 'outlined' ? 'transparent' : 'rgba(33, 150, 243, 0.1)',
        color: '#64b5f6',
        borderColor: '#2a2a2a',
        fontSize: '0.75rem',
        height: 26,
        '&:hover': {
          backgroundColor: 'rgba(33, 150, 243, 0.15)',
          borderColor: '#2196f3',
        },
      }}
    />
  );
};

export default TagChip;
