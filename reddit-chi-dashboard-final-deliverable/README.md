# Reddit CHI Dashboard

A comprehensive dashboard for analyzing and visualizing Reddit Community Health Index (CHI) data across multiple subreddits and time periods.

## 🎯 **Features**

- **Compare All Communities**: Side-by-side analysis of subreddit health metrics
- **Health Overview**: Interactive charts showing community health status
- **Community Drilldown**: Detailed qualitative and quantitative analysis
- **Metrics & Stats**: Performance indicators and community statistics
- **Actionable Insights**: Data-driven recommendations for improvement
- **Communities Needing Attention**: Priority identification for at-risk communities

## 🏗️ **Technology Stack**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Charts**: Recharts (Bar, Line, Radar charts)
- **State Management**: React Context API
- **Build Tool**: Next.js with optimized production builds

## 📊 **Dashboard Sections**

### 1. Compare All Communities
- Composite Community Health Score visualization
- Communities Needing Attention (top 3 at-risk)
- Interactive bar charts with click-to-drill functionality

### 2. Health Overview
- Community Health Status with color-coded indicators
- Status badges and health grades
- Real-time data updates

### 3. Community Drilldown
- Qualitative Health Radar charts
- Weekly progression trends
- Multi-dimensional assessment metrics

### 4. Metrics & Stats
- Quantitative performance metrics
- Community statistics (subscribers, posts, health grade)
- Progress indicators and visualizations

### 5. Actionable Insights
- Current insights with bullet-point formatting
- Recommended actions for improvement
- Week-specific recommendations

## 🚀 **Getting Started**

### Prerequisites
- Node.js 20.x or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nkondav3/reddit-chi-dashboard-final-deliverable.git
   cd reddit-chi-dashboard-final-deliverable
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (when configured)

## 📁 **Project Structure**

```
reddit-chi-dashboard/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/             # Reusable UI components
│   ├── ui/                # Radix UI components
│   ├── week-selector.tsx  # Week selection component
│   └── weekly-changes.tsx # Weekly changes component
├── contexts/               # React context providers
│   └── data-context.tsx   # Data management context
├── data/                   # Data files and JSON
│   ├── combined.json      # Combined dataset
│   ├── insights.json      # Actionable insights
│   └── week-*.json        # Weekly data files
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static assets
├── scripts/                # Data processing scripts
└── .github/                # GitHub configuration
    └── workflows/          # CI/CD workflows
```

## 🌐 **Deployed Dashboard**

**Live Dashboard**: [https://nkondav3.github.io/reddit-chi-dashboard-final-deliverable](https://nkondav3.github.io/reddit-chi-dashboard-final-deliverable)

## 🔧 **Data Sources**

The dashboard integrates data from multiple sources:
- **Quantitative Metrics**: Community health scores, engagement metrics
- **Qualitative Assessments**: Multi-dimensional health evaluations
- **Weekly Insights**: Time-based recommendations and analysis
- **Comparative Data**: Cross-community health benchmarking

## 🚀 **Deployment**

### GitHub Pages Deployment

1. **Enable GitHub Pages** in your repository settings
2. **Set source branch** to `gh-pages` or `main` (with `/docs` folder)
3. **Configure custom domain** (optional)

### Vercel Deployment (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Automatic deployments** on every push to main
3. **Preview deployments** for pull requests

### Manual Deployment

```bash
# Build the project
npm run build

# Export static files (if using static export)
npm run export

# Deploy to your hosting provider
```

## 🔄 **CI/CD Pipeline**

The repository includes GitHub Actions workflows for:
- **Automatic building** on every push
- **Dependency installation** and testing
- **Build verification** and output testing
- **Deployment preparation**

## 📈 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **Development Workflow**

### Adding New Data
1. Place new data files in the `data/` directory
2. Update the data context if needed
3. Test locally with `npm run dev`
4. Commit and push changes

### Adding New Components
1. Create component in `components/` directory
2. Follow existing naming conventions
3. Add TypeScript types if needed
4. Test integration with existing components

## 🐛 **Troubleshooting**

### Common Issues

**Build Failures**
- Ensure Node.js version is 20.x or later
- Clear `node_modules` and reinstall dependencies
- Check for TypeScript errors

**Data Loading Issues**
- Verify data file paths in `contexts/data-context.tsx`
- Check JSON file format and structure
- Ensure data files are committed to repository

**Styling Issues**
- Verify Tailwind CSS is properly configured
- Check component class names
- Ensure CSS imports are correct

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 **Support**

- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions
- **Documentation**: Check the code comments and component documentation

## 🔮 **Roadmap**

- [ ] Real-time data updates
- [ ] Additional chart types
- [ ] Export functionality
- [ ] User authentication
- [ ] Custom dashboard configurations
- [ ] API endpoints for data access

---

**Built with ❤️ using Next.js, React, and Tailwind CSS** 