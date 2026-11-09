import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/Assignment';

const CampaignSummary = ({ summary }) => {
  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#0a0a0a',
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Campaign Details
        </Typography>
      </Box>

      {/* Scrollable Content */}
      <CardContent
        sx={{
          p: 3,
          pt: 2,
          overflowY: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
          },
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px' }}>
            Campaign
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#ffffff' }}>
            {summary.campaign}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px' }}>
            Deal Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 18 }} />
            <Typography variant="body1" sx={{ color: '#22c55e', fontWeight: 600 }}>
              {summary.dealStatus}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px' }}>
            Activity
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <TrendingUpIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#ffffff' }}>
              {summary.kpiProgress}
            </Typography>
          </Box>
        </Box>

        {summary.totalBudget && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px' }}>
              Campaign Budget
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              {/* <AttachMoneyIcon sx={{ color: '#f59e0b', fontSize: 18 }} /> */}
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                {summary.totalBudget}
              </Typography>
            </Box>
          </Box>
        )}

        {summary.kpiType && summary.kpiTarget && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px' }}>
              KPI Target
            </Typography>
            <Box
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: '13px' }}>
                  {summary.kpiType}
                </Typography>
                <Chip
                  label={summary.kpiTarget}
                  size="small"
                  sx={{
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        {(summary.escrowFunded || summary.escrowReleased) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px' }}>
              Escrow Summary
            </Typography>
            <Box
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(37, 99, 235, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '13px' }}>
                  Funded:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#22c55e' }}>
                  {summary.escrowFunded}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '13px' }}>
                  Released:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                  {summary.escrowReleased}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px' }}>
            Total Payment
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e', mt: 0.5 }}>
            {summary.payment}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '11px' }}>
            Deliverables
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.5 }}>
            <AssignmentIcon sx={{ color: '#3b82f6', fontSize: 18, mt: 0.2 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#ffffff', lineHeight: 1.6 }}>
              {summary.deliverables}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CampaignSummary;