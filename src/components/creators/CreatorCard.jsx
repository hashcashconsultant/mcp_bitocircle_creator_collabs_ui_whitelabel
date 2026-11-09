import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import { VerifiedBadge, TagChip, StatCard } from '../common';

const CreatorCard = ({ creator, onSendOffer, onAddToCampaign }) => {
  // Helper function to format numbers
  const formatNumber = (num) => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Helper function to format currency
  const formatCurrency = (num) => {
    if (!num || num === 0) return '$0.00';
    return `$${num.toFixed(2)}`;
  };

  // Helper function to format percentage
  const formatPercentage = (num) => {
    if (!num || num === 0) return '0%';
    return `${num.toFixed(1)}%`;
  };

  // Generate avatar initials
  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate handle from creator name
  const getHandle = (name) => {
    if (!name) return '@unknown';
    return `@${name.toLowerCase().replace(/\s+/g, '')}`;
  };

  // Generate tags based on creator metrics
  const getTags = () => {
    if (!creator) return [];
    const tags = [];
    if (creator.engagementRate && creator.engagementRate > 10) tags.push('High Engagement');
    if (creator.followerCount && creator.followerCount > 100000) tags.push('Influencer');
    if (creator.reelsEarnings && creator.postsEarnings && creator.reelsEarnings > creator.postsEarnings) {
      tags.push('Video Creator');
    }
    if (creator.ctr && creator.ctr > 2) tags.push('High CTR');
    if (creator.fillRate && creator.fillRate > 80) tags.push('Premium Inventory');
    if (creator.totalEarnings && creator.totalEarnings > 10000) tags.push('Top Earner');
    return tags.slice(0, 3); // Limit to 3 tags
  };

  // Calculate estimated ROI based on CTR
  const getEstimatedROI = () => {
    if (!creator.ctr || creator.ctr === 0) return '0%';
    return `${(creator.ctr * 10).toFixed(0)}%`;
  };

  // Check if creator data exists and has required fields
  if (!creator || !creator.creatorName) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>
            No creator data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Check if creator is verified (followers > 50K)
  const isVerified = creator.followerCount && creator.followerCount > 50000;
  const tags = getTags();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        {/* Header with Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: '#2196f3',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            {getInitials(creator.creatorName)}
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {creator.creatorName}
              </Typography>
             {/*  {isVerified && <VerifiedBadge />} */}
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {getHandle(creator.creatorName)}
            </Typography>
          </Box>
        </Box>

        {/* Stats Row */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <StatCard
              label="Followers"
              value={formatNumber(creator.followerCount)}
              valueVariant="h5"
            />
          </Grid>
          <Grid item xs={6}>
            <StatCard
              label="Engagement"
              value={formatPercentage(creator.engagementRate)}
              valueColor="#4caf50"
              valueVariant="h5"
            />
          </Grid>
        </Grid>

        {/* Tags - only show if we have tags */}
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {tags.map((tag, index) => (
              <TagChip key={index} label={tag} />
            ))}
          </Box>
        )}

        <Divider sx={{ borderColor: '#2a2a2a', my: 2 }} />

        {/* CPM, Reach, ROI */}
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <StatCard
              label="Avg CPM"
              value={formatCurrency(creator.currentCpm)}
              valueColor="#2196f3"
              valueVariant="body1"
            />
          </Grid>
          <Grid item xs={4}>
            <StatCard
              label="Est Reach"
              value={formatNumber(creator.totalImpression)}
              valueColor="#2196f3"
              valueVariant="body1"
              align="center"
            />
          </Grid>
          <Grid item xs={4}>
            <StatCard
              label="Avg ROI"
              value={getEstimatedROI()}
              valueColor="#2196f3"
              valueVariant="body1"
              align="right"
            />
          </Grid>
        </Grid>

        {/* Additional Info Section (Optional) */}
        {creator.activeSubscribers && creator.activeSubscribers > 0 && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #2a2a2a' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StatCard
                  label="Total Earnings"
                  value={formatCurrency(creator.totalEarnings)}
                  valueColor="#4caf50"
                  valueVariant="body2"
                />
              </Grid>
              <Grid item xs={6}>
                <StatCard
                  label="Active Subs"
                  value={formatNumber(creator.activeSubscribers)}
                  valueColor="#2196f3"
                  valueVariant="body2"
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>

      {/* Action Buttons */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              onClick={onSendOffer}
              disabled={creator.engagementRate === 0}
              sx={{
                backgroundColor: '#2196f3',
                '&:hover': { backgroundColor: '#1976d2' },
              }}
            >
              Send Offer
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onAddToCampaign}
              sx={{
                borderColor: '#2a2a2a',
                color: '#2196f3',
                '&:hover': {
                  borderColor: '#2196f3',
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                },
              }}
            >
              Send Campaign Invite
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default CreatorCard;