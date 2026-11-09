import React from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const CreatorFilters = ({
  searchValue,
  onSearchChange,
  followers,
  onFollowersChange,
  followerRanges,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {/* Search Bar */}
      <TextField
        placeholder="Search creators..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          flex: 1,
          minWidth: 250,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1e293b',
            '& fieldset': {
              borderColor: '#334155',
            },
            '&:hover fieldset': {
              borderColor: '#475569',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
            },
          },
        }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: '#64748b', mr: 1 }} />,
        }}
      />

      {/* Followers Filter */}
      <FormControl
        sx={{
          minWidth: 150,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1e293b',
            '& fieldset': {
              borderColor: '#334155',
            },
            '&:hover fieldset': {
              borderColor: '#475569',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
            },
          },
        }}
      >
        <InputLabel>Followers</InputLabel>
        <Select
          value={followers}
          onChange={(e) => onFollowersChange(e.target.value)}
          label="Followers"
        >
          {followerRanges.map((range) => (
            <MenuItem key={range} value={range}>
              {range}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CreatorFilters;