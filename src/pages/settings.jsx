import React from 'react';
import { Typography } from '@mui/material';
import { Layout } from '../components/layout';
import { BrandVerification, PaymentSettings } from '../components/settings';
import { settingsData } from '../data/mockData';

const Settings = () => {
  return (
    <Layout showFab={true}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Settings
      </Typography>

      <BrandVerification data={settingsData} />
      <PaymentSettings data={settingsData.paymentSettings} />
    </Layout>
  );
};

export default Settings;
