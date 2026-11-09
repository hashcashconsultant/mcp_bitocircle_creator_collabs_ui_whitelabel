// Mock data for Collabs Marketplace

export const walletStats = {
  name: 'PayBito Wallet',
  verified: true,
  activeCampaigns: 3,
  totalSpent: '2,850 USDT',
  avgROI: '4.2×',
  creators: 12,
  balance: '5,000 USDT',
};

export const activeCampaigns = [
  {
    id: 1,
    name: 'CryptoWallet Launch',
    status: 'ACTIVE',
    creatorsActive: 2,
    budget: '1,000 USDT',
    kpiTarget: '100K Views/Creator',
    kpiProgress: 78,
  },
  {
    id: 2,
    name: 'NFT Drop Promotion',
    status: 'ACTIVE',
    creatorsActive: 5,
    budget: '1,500 USDT',
    kpiTarget: '50K Engagement',
    kpiProgress: 45,
  },
  {
    id: 3,
    name: 'DeFi Education Series',
    status: 'ACTIVE',
    creatorsActive: 8,
    budget: '2,000 USDT',
    kpiTarget: '200 Sign-ups',
    kpiProgress: 92,
  },
];

export const topPerformingCreators = [
  {
    handle: '@DefiTrader',
    avatar: 'DT',
    roi: '8.3×',
    color: '#2196f3',
  },
  {
    handle: '@CryptoNinja',
    avatar: 'CN',
    roi: '6.2×',
    color: '#4caf50',
  },
  {
    handle: '@BitGirl',
    avatar: 'BG',
    roi: '5.1×',
    color: '#9c27b0',
  },
];

export const aiSuggestion = {
  text: 'Similar creators to @DefiTrader available with 15% lower rates.',
  linkText: 'View Creators',
  linkHref: '/suggested-creators'
};

export const escrowData = {
  amount: '1,250 USDT',
  pendingReleases: 3,
};

export const aiInsights = [
  {
    id: 1,
    text: 'Creators in DeFi segment deliver 2× engagement compared to general crypto influencers.',
    link: 'View DeFi Creators',
    linkHref: '/suggested-creators',
    isLinkExternal : false
  },
  {
    id: 2,
    text: 'You saved 12% using performance-based deals vs fixed pricing.',
    link: 'Optimize Pricing',
    linkHref: '/campaigns',
    isLinkExternal: false
  },
  {
    id: 3,
    text: 'Next time: try hybrid model (base + bonus) for 15% better ROI.',
    link: 'Learn More',
    linkHref: '/suggested-creators',
    isLinkExternal: true
  },
];

export const campaigns = [
  {
    id: 1,
    name: 'CryptoWallet Launch',
    status: 'ACTIVE',
    createdAt: 'Jan 15, 2025',
    duration: 'Apr 2 – Apr 9, 2025',
    totalBudget: '1,000 USDT',
    spent: '750 USDT',
    creators: '2 Active',
    kpiProgress: 78,
  },
  {
    id: 2,
    name: 'NFT Drop Promotion',
    status: 'ACTIVE',
    createdAt: 'Jan 10, 2025',
    duration: 'Mar 15 – Mar 30, 2025',
    totalBudget: '1,500 USDT',
    spent: '675 USDT',
    creators: '5 Active',
    kpiProgress: 45,
  },
  {
    id: 3,
    name: 'Token Airdrop',
    status: 'COMPLETED',
    createdAt: 'Dec 5, 2024',
    duration: 'Jan 1 – Jan 15, 2025',
    totalBudget: '2,000 USDT',
    spent: '2,000 USDT',
    creators: '8 Completed',
    kpiProgress: 100,
  },
];

export const campaignDetails = {
  1: {
    id: 1,
    name: 'CryptoWallet Launch',
    duration: 'Apr 2 – Apr 9, 2025',
    budget: '1,000 USDT',
    kpi: '100K Views / Creator',
    creators: [
      {
        id: 1,
        handle: '@CryptoNinja',
        avatar: 'CN',
        followers: '180K',
        status: 'Active',
        kpiProgress: '78%',
        deliverables: '1 Reel, 1 Story',
        payout: '750 USDT (Escrow)',
        views: '78,100 / 100,000',
      },
      {
        id: 2,
        handle: '@BitGirl',
        avatar: 'BG',
        followers: '245K',
        status: 'Active',
        kpiProgress: '45%',
        deliverables: '2 Posts, 1 Story',
        payout: '500 USDT (Escrow)',
        views: '45,000 / 100,000',
      },
    ],
  },
  2: {
    id: 2,
    name: 'NFT Drop Promotion',
    duration: 'Mar 15 – Mar 30, 2025',
    budget: '1,500 USDT',
    kpi: '150K Views / Creator',
    creators: [
      {
        id: 3,
        handle: '@ChainBro',
        avatar: 'CB',
        followers: '95K',
        status: 'Active',
        kpiProgress: '60%',
        deliverables: '1 Video, 2 Posts',
        payout: '600 USDT (Escrow)',
        views: '90,000 / 150,000',
      },
    ],
  },
  3: {
    id: 3,
    name: 'Token Airdrop',
    duration: 'Jan 1 – Jan 15, 2025',
    budget: '2,000 USDT',
    kpi: '200K Views / Creator',
    creators: [
      {
        id: 4,
        handle: '@TokenKing',
        avatar: 'TK',
        followers: '320K',
        status: 'Completed',
        kpiProgress: '100%',
        deliverables: '3 Posts, 2 Stories',
        payout: '800 USDT (Released)',
        views: '200,000 / 200,000',
      },
    ],
  },
};

export const creators = [
  {
    id: 1,
    name: 'CryptoNinja',
    handle: '@cryptoninja',
    avatar: 'CN',
    verified: true,
    followers: '180K',
    engagement: '5.4%',
    tags: ['India', 'UAE', 'USA', '70% Male', '25-35 age'],
    avgCPM: '$4.50',
    estReach: '100K',
    avgROI: '4.2×',
    topContent: {
      avgViews: '245K',
      avgLikes: '12K',
      avgComments: '890',
      recentPosts: ['Bitcoin analysis', 'DeFi tutorials', 'Market predictions'],
    },
  },
  {
    id: 2,
    name: 'BitGirl',
    handle: '@bitgirl_crypto',
    avatar: 'BG',
    verified: true,
    followers: '245K',
    engagement: '7.2%',
    tags: ['Global', '60% Female', '20-30 age', 'DeFi Focus'],
    avgCPM: '$5.20',
    estReach: '150K',
    avgROI: '5.1×',
    topContent: {
      avgViews: '320K',
      avgLikes: '18K',
      avgComments: '1.2K',
      recentPosts: ['NFT reviews', 'Wallet tutorials', 'Crypto news'],
    },
  },
  {
    id: 3,
    name: 'ChainBro',
    handle: '@chainbro',
    avatar: 'CB',
    verified: false,
    followers: '95K',
    engagement: '4.8%',
    tags: ['USA', 'UK', '80% Male', '30-40 age'],
    avgCPM: '$3.80',
    estReach: '75K',
    avgROI: '3.5×',
    topContent: {
      avgViews: '120K',
      avgLikes: '8K',
      avgComments: '650',
      recentPosts: ['Blockchain tech', 'Trading strategies', 'Altcoin picks'],
    },
  },
];

export const performanceData = {
  impressionsVsEngagement: [
    { name: 'Week 1', impressions: 45000, engagement: 2800 },
    { name: 'Week 2', impressions: 52000, engagement: 3200 },
    { name: 'Week 3', impressions: 61000, engagement: 3800 },
    { name: 'Week 4', impressions: 48000, engagement: 3100 },
    { name: 'Week 5', impressions: 55000, engagement: 3500 },
    { name: 'Week 6', impressions: 72000, engagement: 4200 },
  ],
  costPerAcquisition: [
    { name: 'Jan', cpa: 12.5, target: 10 },
    { name: 'Feb', cpa: 8.2, target: 10 },
    { name: 'Mar', cpa: 9.1, target: 10 },
    { name: 'Apr', cpa: 7.8, target: 10 },
    { name: 'May', cpa: 8.5, target: 10 },
    { name: 'Jun', cpa: 9.2, target: 10 },
    { name: 'Jul', cpa: 8.8, target: 10 },
  ],
  topCreators: [
    { creator: '@CryptoNinja', campaign: 'Wallet Launch', views: '245K', clicks: '12.5K', conversions: 890, roi: '4.2×' },
    { creator: '@BitGirl', campaign: 'NFT Drop', views: '320K', clicks: '18.2K', conversions: 1250, roi: '5.1×' },
    { creator: '@ChainBro', campaign: 'Token Airdrop', views: '180K', clicks: '9.8K', conversions: 620, roi: '3.5×' },
  ],
};

export const payments = [
  {
    id: 1,
    status: 'Pending Escrow',
    statusColor: 'warning',
    creator: '@CryptoNinja',
    campaign: 'Wallet Launch',
    amount: '750 USDT',
    paymentMethod: 'PayBito Wallet',
    action: 'Release',
  },
  {
    id: 2,
    status: 'Released',
    statusColor: 'success',
    creator: '@BitGirl',
    campaign: 'Wallet Launch',
    amount: '500 USDT',
    paymentMethod: 'Escrow → Creator Wallet',
    action: null,
  },
  {
    id: 3,
    status: 'Refund',
    statusColor: 'error',
    creator: '@ChainBro',
    campaign: 'NFT Drop',
    amount: '250 USDT',
    paymentMethod: '—',
    action: 'Review',
  },
];

export const paymentSummary = {
  totalBudget: '3,000 USDT',
  inEscrow: '1,250 USDT',
  released: '1,750 USDT',
};

export const conversations = [
  {
    id: 1,
    name: '@CryptoNinja',
    campaign: 'Wallet Launch',
    lastMessage: 'Just posted the reel! Check it out...',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    name: '@BitGirl',
    campaign: 'NFT Drop',
    lastMessage: 'Thanks for the payment!',
    time: '1 hour ago',
    unread: false,
  },
];

export const chatMessages = [
  {
    id: 1,
    sender: 'creator',
    name: '@CryptoNinja',
    message: "Hey! I've reviewed the campaign brief. Love the concept!",
    time: 'Yesterday, 2:30 PM',
  },
  {
    id: 2,
    sender: 'brand',
    message: 'Great! Looking forward to your content. Please ensure to include the link in bio.',
    time: 'Yesterday, 3:15 PM',
  },
  {
    id: 3,
    sender: 'creator',
    name: '@CryptoNinja',
    message: 'Just posted the reel! Check it out and let me know if you need any changes.',
    time: 'Just now',
  },
];

export const campaignSummary = {
  campaign: 'CryptoWallet Launch',
  dealStatus: 'Active',
  kpiProgress: '78% (78,100 / 100,000 views)',
  payment: '750 USDT (Escrow)',
  deliverables: '1 Reel ✓, 1 Story (Pending)',
  quickReplies: ['Please upload proof.', 'Looks great!', 'Can you make changes?'],
};

export const settingsData = {
  brandVerification: {
    verified: true,
    description: 'Verify your brand to build trust with creators',
  },
  kyc: {
    status: 'pending',
    description: 'Required for campaigns above 5,000 USDT',
  },
  paymentSettings: {
    defaultWallet: 'PayBito Wallet (0x742d...5f9b)',
  },
};

export const categories = [
  'All Categories',
  'DeFi',
  'NFT',
  'Trading',
  'Education',
  'Gaming',
  'Metaverse',
];

export const regions = [
  'All Regions',
  'Global',
  'North America',
  'Europe',
  'Asia',
  'Middle East',
  'Africa',
  'South America',
];

export const followerRanges = [
  'Min Followers',
  '10K+',
  '50K+',
  '100K+',
  '500K+',
  '1M+',
];
