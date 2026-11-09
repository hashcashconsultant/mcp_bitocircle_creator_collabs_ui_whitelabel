import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import FloatingActionButton from './FloatingActionButton';

const Layout = ({ children, showFab = true, onFabClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000000' }}>
      <Header onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: '#000000',
          minHeight: '100vh',
          width: { xs: '100%', md: `calc(100% - 260px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
      {showFab && (
        <FloatingActionButton
          onClick={onFabClick || (() => console.log('FAB clicked'))}
        />
      )}
    </Box>
  );
};

export default Layout;