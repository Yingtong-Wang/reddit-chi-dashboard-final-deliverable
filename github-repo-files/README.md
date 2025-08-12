# Reddit Community Health Index (CHI) Dashboard

A comprehensive dashboard for analyzing and monitoring community health scores across various Reddit subreddits. This tool provides insights into community engagement, sentiment, and overall health metrics.

## 🚀 Features

- **Compare All Communities**: Visual comparison of CHS Composite scores across all subreddits
- **Health Overview**: Individual subreddit health status with detailed metrics
- **Community Drilldown**: In-depth analysis with radar charts and performance indicators
- **Metrics & Statistics**: Comprehensive performance metrics and community statistics
- **Actionable Insights**: Week-specific insights and recommended actions for improvement
- **Week Selection**: Toggle between different data periods (Week 1, Week 2, Week 3)

## 📊 Dashboard Sections

### 1. Compare All Communities
- Horizontal bar chart showing CHS Composite scores
- Communities Needing Attention card highlighting lowest performers
- Interactive chart with click-to-select functionality

### 2. Health Overview
- Community health status visualization
- Status indicators (At-Risk, Developing, Healthy, Exemplary)
- Health grade display

### 3. Community Drilldown
- Detailed metrics breakdown
- Radar charts for qualitative factors
- Performance trend analysis

### 4. Metrics & Statistics
- Quantitative performance metrics
- Community statistics (subscribers, posts, health grade)
- Performance indicators

### 5. Actionable Insights
- Current insights for selected subreddit
- Recommended actions for improvement
- Week-specific recommendations

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.2.4, React 19
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: Radix UI
- **Language**: TypeScript
- **Package Manager**: npm

## 📁 Project Structure

```
AIP/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   ├── week-selector.tsx # Week selection component
│   └── weekly-changes.tsx
├── contexts/             # React contexts
│   └── data-context.tsx  # Data management context
├── data/                 # Data files
│   ├── insights.json     # Processed insights data
│   ├── week-1.json      # Week 1 data
│   ├── week-2.json      # Week 2 data
│   └── week-3.json      # Week 3 data
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── scripts/              # Data processing scripts
└── styles/               # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd AIP
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Data Sources

The dashboard uses processed data from CSV files:
- **Week 1**: `Expanded_Insights_July17.csv`
- **Week 2**: `Expanded_Insights_July25.csv`
- **Week 3**: Available for future data

Data is processed using scripts in the `scripts/` directory and converted to JSON format for the dashboard.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📈 Data Processing

To update insights data:

1. Place new CSV files in the `data/` directory
2. Update `scripts/convert-insights-to-json.ts` with new file paths
3. Run: `npx ts-node scripts/convert-insights-to-json.ts`

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and deploy
3. Set environment variables if needed

### Other Platforms
- Build the project: `npm run build`
- Deploy the `out/` directory to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

## 🔄 Updates

- **v1.0.0**: Initial dashboard with basic functionality
- **v1.1.0**: Added actionable insights and week selection
- **v1.2.0**: Enhanced UI with bullet points and improved layout
- **v1.3.0**: Standardized section widths and improved responsiveness 