// components/offers/OffersTable.jsx
import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Box,
    Typography,
    IconButton,
    Tooltip,
    useMediaQuery,
    useTheme,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const getStatusColor = (status) => {
    const statusColors = {
        PENDING: '#f59e0b',
        ACCEPTED: '#22c55e',
        REJECTED: '#ef4444',
        COUNTER: '#3b82f6',
        EXPIRED: '#6b7280',
    };
    return statusColors[status] || '#6b7280';
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatBudget = (amount) => {
    if (!amount) return '0';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const OffersTable = ({ offers, onViewCounterOffers }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {offers.map((offer) => (
                    <Card
                        key={offer.offerId}
                        sx={{
                            backgroundColor: '#1a1a1a',
                            borderRadius: 2,
                            border: '1px solid #2a2a2a',
                        }}
                    >
                        <CardContent>
                            {/* Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                                        Offer ID
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                                        #{offer.offerId}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={offer.status}
                                    size="small"
                                    sx={{
                                        backgroundColor: `${getStatusColor(offer.status)}20`,
                                        color: getStatusColor(offer.status),
                                        fontWeight: 600,
                                        border: `1px solid ${getStatusColor(offer.status)}40`,
                                    }}
                                />
                            </Box>

                            <Divider sx={{ borderColor: '#2a2a2a', mb: 2 }} />

                            {/* Details */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                            Creator
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                            {offer.creatorName || offer.creatorId || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarTodayIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                            Timeline
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                            {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachMoneyIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                            Total Budget
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                                            B$ {formatBudget(offer.totalBudget)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrendingUpIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                                            KPI Target
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                                            {offer.kpiTarget}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                                        Deliverables
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {offer.deliverables?.map((deliverable, index) => (
                                            <Chip
                                                key={index}
                                                label={`${deliverable.quantity}x ${deliverable.deliverableType}`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                    color: '#3b82f6',
                                                    fontSize: '0.75rem',
                                                    height: 24,
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
                                        Placed By
                                    </Typography>
                                    <Chip
                                        label={offer.placedBy}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                            color: '#8b5cf6',
                                            fontSize: '0.75rem',
                                            height: 24,
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Divider sx={{ borderColor: '#2a2a2a', my: 2 }} />

                            {/* Actions */}
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => onViewCounterOffers(offer)}
                                sx={{
                                    backgroundColor: '#2196f3',
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: '#1976d2',
                                    },
                                }}
                            >
                                View Counter Offers
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                backgroundColor: '#1a1a1a',
                borderRadius: 2,
                border: '1px solid #2a2a2a',
                overflow: 'hidden',
            }}
        >
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#0a0a0a' }}>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #2a2a2a' }}>
                            Offer ID
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #2a2a2a' }}>
                            Creator
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #2a2a2a' }}>
                            Timeline
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #2a2a2a' }}>
                            Budget
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #2a2a2a' }}>
                            KPI Target
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #2a2a2a' }}>
                            Deliverables
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #2a2a2a' }}>
                            Status
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #2a2a2a' }}>
                            Placed By
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 600, borderBottom: '1px solid #2a2a2a' }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {offers.map((offer) => (
                        <TableRow
                            key={offer.offerId}
                            sx={{
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
                                borderBottom: '1px solid #2a2a2a',
                            }}
                        >
                            <TableCell sx={{ color: '#fff', borderBottom: '1px solid #2a2a2a' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    #{offer.offerId}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ color: '#fff', borderBottom: '1px solid #2a2a2a' }}>
                                {offer.creatorName || offer.creatorId || 'N/A'}
                            </TableCell>
                            <TableCell sx={{ color: '#fff', borderBottom: '1px solid #2a2a2a' }}>
                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                    {formatDate(offer.startDate)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                    to {formatDate(offer.endDate)}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #2a2a2a' }}>
                                <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                                    B$ {formatBudget(offer.totalBudget)}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ color: '#fff', borderBottom: '1px solid #2a2a2a' }}>
                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                    {offer.kpiTarget}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #2a2a2a' }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {offer.deliverables?.map((deliverable, index) => (
                                        <Chip
                                            key={index}
                                            label={`${deliverable.quantity}x ${deliverable.deliverableType}`}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                color: '#3b82f6',
                                                fontSize: '0.7rem',
                                                height: 20,
                                            }}
                                        />
                                    ))}
                                </Box>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #2a2a2a' }}>
                                <Chip
                                    label={offer.status}
                                    size="small"
                                    sx={{
                                        backgroundColor: `${getStatusColor(offer.status)}20`,
                                        color: getStatusColor(offer.status),
                                        fontWeight: 600,
                                        border: `1px solid ${getStatusColor(offer.status)}40`,
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #2a2a2a' }}>
                                <Chip
                                    label={offer.placedBy}
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                        color: '#8b5cf6',
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #2a2a2a' }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => onViewCounterOffers(offer)}
                                    sx={{
                                        borderColor: '#2196f3',
                                        color: '#2196f3',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: '#1976d2',
                                            backgroundColor: 'rgba(33, 150, 243, 0.08)',
                                        },
                                    }}
                                >
                                    View Counter Offers
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OffersTable;