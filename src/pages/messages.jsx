import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { Layout } from '../components/layout';
import { ConversationList, ChatWindow, CampaignSummary } from '../components/messages';
import apiClient from '../utils/apiClient';
import CustomSnackbar from '../utils/CustomSnackbar';
import { CampaignCard, CreateCampaignModal, EditCampaignModal } from '../components/campaigns';

const API_BASE_URL = 'https://institutional-bo.paybito.com:8443/MonetizeService';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [campaignSummary, setCampaignSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
      const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Show snackbar helper
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const handleFabClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Get brand ID from localStorage
  const getBrandId = () => {
    if (typeof window === 'undefined') return null;
    const brandId = localStorage.getItem('collab_brand_id');
    if (!brandId) {
      showSnackbar('Brand ID not found in localStorage.', 'warning');
      return null;
    }
    return brandId;
  };

  // Format time helper
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Fetch campaigns and extract creators as conversations
  const fetchConversations = async () => {
    const brandId = getBrandId();
    if (!brandId) return;

    setLoading(true);
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/brand/campaigns?brandId=${brandId}&campaignType=IN_APPLICATION`
      );

      console.log('Campaigns Response:', response.data);

      if (response.data && response.data.errorResponse?.errorMsg === 'Successful') {
        const campaignList = response.data.campaignList || [];

        // Extract all creators from all campaigns and create conversations
        const conversationsMap = new Map();

        campaignList.forEach((campaign) => {
          const creators = campaign.creators || [];

          creators.forEach((creator) => {
            // Use creator + campaign as unique key
            const key = `${creator.creatorId}-${campaign.campaignId}`;

            if (!conversationsMap.has(key)) {
              conversationsMap.set(key, {
                id: key,
                creatorId: creator.creatorId,
                campaignId: campaign.campaignId,
                name: creator.creatorName || `Creator ${creator.creatorId}`,
                campaign: campaign.campaignName || `Campaign ${campaign.campaignId}`,
                lastMessage: 'Click to start conversation',
                time: formatTime(campaign.createdAt),
                timestamp: campaign.createdAt || new Date().toISOString(),
                unread: false,
                status: campaign.status || 'Active',
                campaignData: campaign,
                creatorData: creator,
              });
            }
          });
        });

        const conversationsArray = Array.from(conversationsMap.values());

        // Sort by most recent campaign
        conversationsArray.sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        );

        setConversations(conversationsArray);

        if (conversationsArray.length > 0 && !selectedConversation) {
          // Don't auto-select, let user click
          // setSelectedConversation(conversationsArray[0]);
        }

        if (conversationsArray.length === 0) {
          showSnackbar('No creators found in your campaigns.', 'info');
        }
      } else {
        throw new Error(response.data?.errorResponse?.errorMsg || 'Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showSnackbar(
        error.response?.data?.errorResponse?.errorMsg || error.message || 'Failed to load campaigns.',
        'error'
      );
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversation) => {
    const brandId = getBrandId();
    if (!brandId || !conversation) return;

    setMessagesLoading(true);
    try {
      const payload = {
        brandId: parseInt(brandId),
        creatorId: conversation.creatorId,
        campaignId: conversation.campaignId,
        pageNo: currentPage,
        pageSize: pageSize,
      };

      const response = await apiClient.post(
        `${API_BASE_URL}/brand/messages`,
        payload
      );

      console.log('Messages Response:', response.data);

      if (response.data && response.data.errorResponse?.errorMsg === 'Successful') {
        const messagesList = response.data.messagesList || [];
        const escrowList = response.data.escrowList || [];

        // Transform messages - use senderRole to determine if message is from brand or creator
        const transformedMessages = messagesList.map((msg) => ({
          id: msg.messageId,
          sender: msg.senderRole === 'brand' ? 'brand' : 'creator',
          senderName: msg.senderRole === 'brand' ? 'You' : (msg.senderName || conversation.name),
          message: msg.messageText || msg.message || '',
          time: formatTime(msg.createdAt),
          timestamp: msg.createdAt,
          isRead: msg.isRead === 1,
          senderRole: msg.senderRole,
        }));

        // Sort messages by timestamp (oldest first for chat display)
        transformedMessages.sort((a, b) =>
          new Date(a.timestamp) - new Date(b.timestamp)
        );

        setMessages(transformedMessages);

        // Update conversation's last message if messages exist
        if (transformedMessages.length > 0) {
          const lastMsg = transformedMessages[transformedMessages.length - 1];
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversation.id
                ? {
                  ...conv,
                  lastMessage: lastMsg.message,
                  time: lastMsg.time,
                  unread: !lastMsg.isRead && lastMsg.sender === 'creator'
                }
                : conv
            )
          );
        }

        // Set campaign summary from campaign data
        const campaign = conversation.campaignData;
        const totalFunded = escrowList
          .filter(e => e.status === 'funded')
          .reduce((sum, e) => sum + (e.amount || 0), 0);

        const totalReleased = escrowList
          .filter(e => e.status === 'released')
          .reduce((sum, e) => sum + (e.amount || 0), 0);

        const deliverablesSummary = campaign.deliverables
          ? campaign.deliverables.map(d => `${d.quantity} ${d.deliverableType}`).join(', ')
          : 'No deliverables';

        setCampaignSummary({
          campaign: conversation.campaign,
          dealStatus: campaign.status || 'Active',
          kpiProgress: `${messagesList.length} messages exchanged`,
          payment: `${(totalFunded + totalReleased).toFixed(2)} ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`,
          deliverables: deliverablesSummary,
          escrowFunded: `${totalFunded.toFixed(2)} ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`,
          escrowReleased: `${totalReleased.toFixed(2)} ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`,
          totalBudget: `${campaign.totalBudget || 0} ${campaign.paymentCurrency === 'USDB' ? 'B$' : campaign.paymentCurrency}`,
          kpiType: campaign.kpiType || 'N/A',
          kpiTarget: campaign.kpiTarget || 'N/A',
        });
      } else {
        throw new Error(response.data?.errorResponse?.errorMsg || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      showSnackbar(
        error.response?.data?.errorResponse?.errorMsg || error.message || 'Failed to load messages.',
        'error'
      );
      setMessages([]);

      // Still set campaign summary even if no messages
      const campaign = conversation.campaignData;
      const deliverablesSummary = campaign.deliverables
        ? campaign.deliverables.map(d => `${d.quantity} ${d.deliverableType}`).join(', ')
        : 'No deliverables';

      setCampaignSummary({
        campaign: conversation.campaign,
        dealStatus: campaign.status || 'Active',
        kpiProgress: 'No messages yet',
        payment: `${campaign.totalBudget || 0} ${campaign.paymentCurrency || 'USDB'}`,
        deliverables: deliverablesSummary,
        totalBudget: `${campaign.totalBudget || 0} ${campaign.paymentCurrency || 'USDB'}`,
        kpiType: campaign.kpiType || 'N/A',
        kpiTarget: campaign.kpiTarget || 'N/A',
      });
    } finally {
      setMessagesLoading(false);
    }
  };

  // Send a message
  const handleSendMessage = async (messageText) => {
    const brandId = getBrandId();
    if (!brandId || !selectedConversation || !messageText.trim()) return;

    try {
      const payload = {
        brandId: parseInt(brandId),
        creatorId: selectedConversation.creatorId,
        campaignId: selectedConversation.campaignId,
        message: messageText.trim(),
      };

      const response = await apiClient.post(
        `${API_BASE_URL}/brand/send_message`,
        payload
      );

      console.log('Send Message Response:', response.data);

      if (response.data && response.data.errorResponse?.errorMsg === 'Successful') {
        showSnackbar('Message sent successfully!', 'success');

        // Fetch updated messages after sending
        await fetchMessages(selectedConversation);
      } else {
        throw new Error(response.data?.errorResponse?.errorMsg || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showSnackbar(
        error.response?.data?.errorResponse?.errorMsg || error.message || 'Failed to send message.',
        'error'
      );
    }
  };

  const handleSelectConversation = (conversationId) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation, currentPage]);

  return (
    <Layout showFab={true} onFabClick={handleFabClick}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Messages
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={50} sx={{ color: '#2563eb' }} />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ height: 'calc(100vh - 200px)' }}>
          {/* Conversation List */}
          <Grid item xs={12} md={3} sx={{ height: '100%' }}>
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversation?.id}
              onSelect={handleSelectConversation}
            />
          </Grid>

          {/* Chat Window */}
          <Grid item xs={12} md={5} sx={{ height: '100%' }}>
            {selectedConversation ? (
              <ChatWindow
                selectedConversation={selectedConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                loading={messagesLoading}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '8px',
                }}
              >
                <Typography sx={{ color: '#9ca3af' }}>
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Campaign Summary */}
          <Grid item xs={12} md={4} sx={{ height: '100%' }}>
            {campaignSummary ? (
              <CampaignSummary
                summary={campaignSummary}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '8px',
                }}
              >
                <Typography sx={{ color: '#9ca3af' }}>
                  Select a conversation to view details
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      )}
      <CreateCampaignModal open={isModalOpen} onClose={handleCloseModal} />
      <CustomSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Layout>
  );
};

export default Messages;