// components/layout/Sidebar.jsx
import React from 'react';
import { useRouter } from 'next/router';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CampaignIcon from '@mui/icons-material/Campaign';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'My Campaigns', icon: <CampaignIcon />, path: '/campaigns' },
  { text: 'Discover Creators', icon: <SearchIcon />, path: '/discover-creators' },
  { text: 'My Offers', icon: <LocalOfferIcon />, path: '/offers' },
  { text: 'Payments & Escrow', icon: <AccountBalanceWalletIcon />, path: '/payments' },
  { text: 'Messages', icon: <ChatIcon />, path: '/messages' },
];

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path) => {
    if (path === '/') {
      return router.pathname === '/dashboard';
    }
    return router.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    router.push(path);
    if (isMobile && onDrawerToggle) {
      onDrawerToggle();
    }
  };

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(33, 150, 243, 0.12)',
                  '& .MuiListItemIcon-root': {
                    color: '#2196f3',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#2196f3',
                    fontWeight: 600,
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.18)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? '#2196f3' : '#94a3b8',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: isActive(item.path) ? '#2196f3' : '#94a3b8',
                    fontSize: '0.95rem',
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#000000',
              borderRight: '1px solid #2a2a2a',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop drawer */
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#000000',
              borderRight: '1px solid #2a2a2a',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;