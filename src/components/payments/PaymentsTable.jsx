import React from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
} from '@mui/material';
import { StatusBadge } from '../common';

const PaymentsTable = ({ payments, onRelease, onReview }) => {
  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell>Campaign</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <StatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      {payment.creator}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {payment.campaign}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                      {payment.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {payment.paymentMethod}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {payment.action === 'Release' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => onRelease(payment.id)}
                        sx={{
                          backgroundColor: '#2196f3',
                          '&:hover': { backgroundColor: '#1976d2' },
                        }}
                      >
                        Release
                      </Button>
                    )}
                    {payment.action === 'Review' && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onReview(payment.id)}
                        sx={{
                          borderColor: '#2196f3',
                          color: '#2196f3',
                          '&:hover': {
                            borderColor: '#64b5f6',
                            backgroundColor: 'rgba(33, 150, 243, 0.08)',
                          },
                        }}
                      >
                        Review
                      </Button>
                    )}
                    {!payment.action && (
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PaymentsTable;