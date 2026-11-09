import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const PaymentSummary = ({ summary }) => {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Payment Summary
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
              Total Budget:
            </Typography>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
              {summary.totalBudget}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
              In Escrow:
            </Typography>
            <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600 }}>
              {summary.inEscrow}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
              Released:
            </Typography>
            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
              {summary.released}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
