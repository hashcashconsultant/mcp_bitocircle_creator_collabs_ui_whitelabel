# Collabs Marketplace - Project Structure

## Pages Identified from Screenshots

1. **Dashboard** - Main overview with wallet stats, active campaigns, AI insights
2. **My Campaigns** - Campaign management with CRUD operations
3. **Discover Creators** - Creator discovery with search/filters
4. **Performance** - Analytics with charts and tables
5. **Payments & Escrow** - Payment management and escrow system
6. **Messages** - Messaging system with chat interface
7. **Settings** - Brand verification, KYC, and payment settings

## Project Structure

```
collabs-marketplace/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── FloatingActionButton.jsx
│   │   ├── common/
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── VerifiedBadge.jsx
│   │   │   └── TagChip.jsx
│   │   ├── dashboard/
│   │   │   ├── WalletStats.jsx
│   │   │   ├── ActiveCampaignCard.jsx
│   │   │   └── AIInsights.jsx
│   │   ├── campaigns/
│   │   │   └── CampaignCard.jsx
│   │   ├── creators/
│   │   │   ├── CreatorFilters.jsx
│   │   │   ├── CreatorCard.jsx
│   │   │   └── ContentPerformance.jsx
│   │   ├── performance/
│   │   │   ├── ImpressionsChart.jsx
│   │   │   ├── CostAcquisitionChart.jsx
│   │   │   └── TopCreatorsTable.jsx
│   │   ├── payments/
│   │   │   ├── PaymentsTable.jsx
│   │   │   └── PaymentSummary.jsx
│   │   ├── messages/
│   │   │   ├── ConversationList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── CampaignSummary.jsx
│   │   └── settings/
│   │       ├── BrandVerification.jsx
│   │       └── PaymentSettings.jsx
│   ├── pages/
│   │   ├── _app.jsx
│   │   ├── _document.jsx
│   │   ├── index.jsx (Dashboard)
│   │   ├── campaigns.jsx
│   │   ├── discover-creators.jsx
│   │   ├── performance.jsx
│   │   ├── payments.jsx
│   │   ├── messages.jsx
│   │   └── settings.jsx
│   ├── theme/
│   │   └── theme.js
│   ├── data/
│   │   └── mockData.js
│   └── styles/
│       └── globals.css
├── package.json
├── next.config.js
└── jsconfig.json
```

## Color Palette (from screenshots)

- **Background Dark**: #0a1628
- **Card Background**: #0f2744 / #1a3a5c
- **Primary Blue**: #2196f3
- **Success Green**: #4caf50
- **Warning Yellow**: #ff9800
- **Error Red**: #f44336
- **Text Primary**: #ffffff
- **Text Secondary**: #94a3b8
- **Border Color**: #1e3a5f

## Tech Stack

- Next.js 14
- React 18
- Material UI 5
- Recharts (for charts)
- JavaScript (no TypeScript)
