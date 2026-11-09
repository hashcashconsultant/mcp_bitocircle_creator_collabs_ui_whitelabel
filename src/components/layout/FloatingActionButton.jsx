import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const FloatingActionButton = ({ onClick, tooltip = 'Create New' }) => {
  return (
    <Tooltip title={tooltip} placement="left">
      <Fab
        color="primary"
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 64,
          height: 64,
          boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 6px 24px rgba(33, 150, 243, 0.5)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>
    </Tooltip>
  );
};

export default FloatingActionButton;
