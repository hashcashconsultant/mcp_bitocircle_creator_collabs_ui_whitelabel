import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const TopCreatorsTable = ({ data }) => {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Top Creators by ROI
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Creator</TableCell>
                <TableCell>Campaign</TableCell>
                <TableCell align="center">Views</TableCell>
                <TableCell align="center">Clicks</TableCell>
                {/* <TableCell align="center">Conversions</TableCell> */}
                <TableCell align="right">ROI</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#2196f3', fontWeight: 500 }}>
                      {row.creator}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      {row.campaign}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {row.views}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {row.clicks}
                    </Typography>
                  </TableCell>
                  {/* <TableCell align="center">
                    <Typography variant="body2" sx={{ color: '#4caf50' }}>
                      {row.conversions}
                    </Typography>
                  </TableCell> */}
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ color: '#64b5f6', fontWeight: 600 }}>
                      {row.roi}
                    </Typography>
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

export default TopCreatorsTable;
