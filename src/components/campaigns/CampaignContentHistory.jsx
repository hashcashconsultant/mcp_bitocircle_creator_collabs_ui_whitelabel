import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Grid,
    CircularProgress,
    Chip,
    Divider,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    ThumbUp as ThumbUpIcon,
    Comment as CommentIcon,
    TouchApp as TouchAppIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import apiClient from '../../utils/apiClient';

const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

const CampaignContentHistory = ({ campaignId, onError }) => {
    const [contentData, setContentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContentHistory = async () => {
            if (!campaignId) return;

            setLoading(true);
            try {
                const response = await apiClient.get(
                    `${API_BASE_URL}/brand/contentDetailsByCampaign/${campaignId}`
                );

                if (response.data.success && response.data.data) {
                    setContentData(response.data.data);
                } else {
                    setContentData([]);
                    if (onError) {
                        onError('Failed to load content history');
                    }
                }
            } catch (err) {
                console.error('Error fetching content history:', err);
                setContentData([]);
                if (onError) {
                    onError(err.response?.data?.message || 'Failed to load content history');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchContentHistory();
    }, [campaignId, onError]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const MetricItem = ({ icon: Icon, label, value, color = '#64748b' }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon sx={{ fontSize: 18, color }} />
            <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', lineHeight: 1 }}>
                    {label}
                </Typography>
                <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600, lineHeight: 1.2 }}>
                    {value.toLocaleString()}
                </Typography>
            </Box>
        </Box>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!contentData || contentData.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 6, backgroundColor: '#1a1a1a', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                    No content history available
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Content will appear here once creators publish their work
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Content History
            </Typography>

            <Grid container spacing={3}>
                {contentData.map((content, index) => (
                    <Grid item xs={12} sm={6} md={4} key={content.contentId || index}>
                        <Card
                            sx={{
                                backgroundColor: '#1a1a1a',
                                borderRadius: 2,
                                border: '1px solid #2d2d2d',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: '#3d3d3d',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                {/* Creator Info */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar
                                        src={content.profilePicture}
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            border: '2px solid #2d2d2d',
                                        }}
                                    >
                                        {content.creatorName ? content.creatorName.substring(0, 2).toUpperCase() : 'CR'}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
                                            {content.creatorName || 'Unknown Creator'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            {content.username || `ID: ${content.creatorId}`}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                                            {formatDate(content.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={content.contentType}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#2563eb20',
                                            color: '#3b82f6',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                        }}
                                    />
                                </Box>

                                <Divider sx={{ my: 2, borderColor: '#2d2d2d' }} />

                                {/* Engagement Metrics */}
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <MetricItem
                                            icon={VisibilityIcon}
                                            label="Views"
                                            value={content.totalViews || 0}
                                            color="#3b82f6"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <MetricItem
                                            icon={ThumbUpIcon}
                                            label="Likes"
                                            value={content.totalLikes || 0}
                                            color="#10b981"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <MetricItem
                                            icon={CommentIcon}
                                            label="Comments"
                                            value={content.totalComment || 0}
                                            color="#f59e0b"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <MetricItem
                                            icon={TouchAppIcon}
                                            label="Clicks"
                                            value={content.totalClick || 0}
                                            color="#8b5cf6"
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2, borderColor: '#2d2d2d' }} />

                                {/* Engagement Score */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                    <TrendingUpIcon sx={{ fontSize: 20, color: '#06b6d4' }} />
                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                        Engagement Score:
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: content.engagementScore > 0 ? '#06b6d4' : '#64748b',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {content.engagementScore || 0}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CampaignContentHistory;