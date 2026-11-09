import React from 'react';
import { Chip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const statusColors = {
  ACTIVE: {
    bg: 'rgba(76, 175, 80, 0.15)',
    color: '#4caf50',
    border: '#4caf50',
  },
  COMPLETED: {
    bg: 'rgba(33, 150, 243, 0.15)',
    color: '#2196f3',
    border: '#2196f3',
  },
  PAUSED: {
    bg: 'rgba(255, 152, 0, 0.15)',
    color: '#ff9800',
    border: '#ff9800',
  },
  PENDING: {
    bg: 'rgba(255, 152, 0, 0.15)',
    color: '#ff9800',
    border: '#ff9800',
  },
  DRAFT: {
    bg: 'rgba(255, 152, 0, 0.15)',
    color: '#ff9800',
    border: '#ff9800',
  },
  'Pending Escrow': {
    bg: 'rgba(255, 152, 0, 0.15)',
    color: '#ff9800',
    border: '#ff9800',
  },
  'funded': {
    bg: 'rgba(255, 152, 0, 0.15)',
    color: '#ff9800',
    border: '#ff9800',
  },
  Released: {
    bg: 'rgba(76, 175, 80, 0.15)',
    color: '#4caf50',
    border: '#4caf50',
  },
  Refund: {
    bg: 'rgba(244, 67, 54, 0.15)',
    color: '#f44336',
    border: '#f44336',
  },
  LIVE: {
    bg: 'rgba(244, 67, 54, 0.15)',
    color: '#f44336',
    border: '#f44336',
  },
};

const StatusBadge = ({ status, size = 'small' }) => {
  console.log(status)
  const colors = statusColors[status] || statusColors.ACTIVE;

  return (
    <Chip
      icon={
        <FiberManualRecordIcon
          sx={{ fontSize: 10, color: `${colors.color} !important` }}
        />
      }
      label={status}
      size={size}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontWeight: 500,
        fontSize: '0.75rem',
        '& .MuiChip-icon': {
          marginLeft: '8px',
        },
      }}
    />
  );
};

export default StatusBadge;
