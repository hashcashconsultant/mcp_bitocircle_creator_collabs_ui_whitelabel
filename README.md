# Collabs Marketplace - BitoCircle

A Next.js + React + Material UI dashboard for managing influencer marketing campaigns in the crypto space.

## Features

- **Dashboard** - Overview of wallet stats, active campaigns, and AI insights
- **My Campaigns** - Manage, edit, pause, and end campaigns
- **Discover Creators** - Search and filter crypto influencers
- **Performance Analytics** - Charts and tables for campaign metrics
- **Payments & Escrow** - Manage escrow payments and releases
- **Messages** - Real-time messaging with creators
- **Settings** - Brand verification, KYC, and payment settings

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Material UI 5
- **Charts**: Recharts
- **Language**: JavaScript (JSX)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd collabs-marketplace
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   ├── layout/         # Header, Sidebar, Layout, FAB
│   ├── common/         # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── campaigns/      # Campaign management components
│   ├── creators/       # Creator discovery components
│   ├── performance/    # Analytics charts and tables
│   ├── payments/       # Payment management components
│   ├── messages/       # Messaging components
│   └── settings/       # Settings components
├── pages/
│   ├── _app.jsx        # App wrapper with theme
│   ├── _document.jsx   # Custom document
│   ├── index.jsx       # Dashboard
│   ├── campaigns.jsx   # My Campaigns
│   ├── discover-creators.jsx
│   ├── performance.jsx
│   ├── payments.jsx
│   ├── messages.jsx
│   └── settings.jsx
├── theme/
│   └── theme.js        # MUI theme configuration
├── data/
│   └── mockData.js     # Sample data
└── styles/
    └── globals.css     # Global styles
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background Dark | #0a1628 | Main background |
| Card Background | #0f2744 | Card surfaces |
| Primary Blue | #2196f3 | Primary actions |
| Success Green | #4caf50 | Success states |
| Warning Yellow | #ff9800 | Warning states |
| Error Red | #f44336 | Error states |
| Text Primary | #ffffff | Primary text |
| Text Secondary | #94a3b8 | Secondary text |
| Border | #1e3a5f | Borders and dividers |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Theme
Edit `src/theme/theme.js` to customize colors, typography, and component styles.

### Mock Data
Edit `src/data/mockData.js` to change sample data or connect to your API.

## License

MIT License
