import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const ImpressionsChart = ({ data }) => {
  const [period, setPeriod] = useState('30D');

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Impressions vs Engagement
          </Typography>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={handlePeriodChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: '#94a3b8',
                borderColor: '#2a2a2a',
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: '#2196f3',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#1976d2',
                  },
                },
              },
            }}
          >
            <ToggleButton value="7D">7D</ToggleButton>
            <ToggleButton value="30D">30D</ToggleButton>
            <ToggleButton value="90D">90D</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis 
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121212',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  color: '#ffffff',
                }}
              />
              <Legend />
              <Bar 
                dataKey="impressions" 
                fill="#2196f3" 
                radius={[4, 4, 0, 0]}
                name="Impressions"
              />
              <Bar 
                dataKey="engagement" 
                fill="#64b5f6" 
                radius={[4, 4, 0, 0]}
                name="Engagement"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ImpressionsChart;
