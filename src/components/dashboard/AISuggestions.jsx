import React from 'react';
import { Box, Card, CardContent, Typography, Link } from '@mui/material';
import { useRouter } from 'next/router';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const AISuggestions = ({ suggestion }) => {
  const router = useRouter();

  const handleLinkClick = () => {
    if (suggestion.linkHref) {
      router.push(suggestion.linkHref);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AutoAwesomeIcon sx={{ color: '#f44336', fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            AI Suggestions
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
          {suggestion.text}
        </Typography>

        <Link
          component="button"
          onClick={handleLinkClick}
          sx={{
            color: '#2196f3',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {suggestion.linkText} →
        </Link>
      </CardContent>
    </Card>
  );
};

export default AISuggestions;