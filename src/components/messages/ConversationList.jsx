import React from 'react';
import { Box, Card, Typography, List, ListItemButton, Avatar } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const ConversationList = ({ conversations, selectedId, onSelect }) => {
  const getInitials = (name) => {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const generateAvatarColor = (id) => {
    const colors = [
      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    ];
    const numericId = typeof id === 'string' ? id.split('-')[0] : id;
    const index = (numericId || 0) % colors.length;
    return colors[index];
  };

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
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#0a0a0a',
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Conversations
        </Typography>
        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
          {conversations.length} active conversation{conversations.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <List
        sx={{
          p: 0,
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
        {conversations.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: '#6b7280', fontSize: '14px' }}>
              No conversations yet
            </Typography>
          </Box>
        ) : (
          conversations.map((conversation) => (
            <ListItemButton
              key={conversation.id}
              selected={selectedId === conversation.id}
              onClick={() => onSelect(conversation.id)}
              sx={{
                p: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(37, 99, 235, 0.15)',
                  borderLeft: '3px solid #2563eb',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                <Avatar
                  sx={{
                    width: 45,
                    height: 45,
                    background: generateAvatarColor(conversation.id),
                    fontSize: '16px',
                    fontWeight: 700,
                  }}
                >
                  {getInitials(conversation.name)}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: conversation.unread ? 600 : 500,
                        color: conversation.unread ? '#ffffff' : '#d1d5db',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {conversation.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#6b7280',
                        fontSize: '11px',
                        flexShrink: 0,
                        ml: 1,
                      }}
                    >
                      {conversation.time}
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: '#9ca3af',
                      display: 'block',
                      mb: 0.5,
                      fontSize: '11px',
                    }}
                  >
                    📁 {conversation.campaign}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#9ca3af',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '13px',
                        flex: 1,
                      }}
                    >
                      {conversation.lastMessage}
                    </Typography>
                    {conversation.unread && (
                      <FiberManualRecordIcon
                        sx={{
                          color: '#2563eb',
                          fontSize: 12,
                          ml: 1,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </ListItemButton>
          ))
        )}
      </List>
    </Card>
  );
};

export default ConversationList;