import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Layout } from '../components/layout';
import { ImpressionsChart, CostAcquisitionChart, TopCreatorsTable } from '../components/performance';
import { performanceData } from '../data/mockData';

const Performance = () => {
  const handleFabClick = () => {
    console.log('Export report');
  };

  return (
    <Layout onFabClick={handleFabClick}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Performance Analytics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={6}>
          <ImpressionsChart data={performanceData.impressionsVsEngagement} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <CostAcquisitionChart data={performanceData.costPerAcquisition} />
        </Grid>
      </Grid>

      <TopCreatorsTable data={performanceData.topCreators} />
    </Layout>
  );
};

export default Performance;
