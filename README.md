# 📊 Reddit Community Health Index (CHI) Dashboard

A comprehensive, interactive dashboard for analyzing Reddit Community Health Index (CHI) data across multiple communities and time periods. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🌐 **Deployed Dashboard**

**Live Dashboard**: https://reddit-chi-dashboard-final-delivera-seven.vercel.app/

## ✨ **Features**

- **📈 Interactive Data Visualization**: Dynamic charts and graphs using Recharts
- **🔄 Multi-Week Analysis**: Compare community health across different time periods
- **🎯 Community Insights**: Actionable recommendations for community improvement
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🌙 Dark/Light Theme**: Toggle between themes for better user experience
- **⚡ Real-time Updates**: Live data updates and filtering capabilities

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Charts**: Recharts
- **State Management**: React Context API
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📊 **Dashboard Sections**

1. **Compare All Communities**: Visual comparison of community health scores
2. **Health Overview**: Comprehensive metrics and statistics
3. **Community Statistics**: Detailed breakdown of community data
4. **Weekly Changes**: Track improvements and declines over time
5. **Actionable Insights**: Data-driven recommendations for community managers

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 20.x or higher
- npm 9.x or higher

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/[YOUR-USERNAME]/reddit-chi-dashboard.git
   cd reddit-chi-dashboard
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

## 📦 **Available Scripts**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ **Project Structure**

```
reddit-chi-dashboard/
├── app/                    # Next.js 15 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── week-selector.tsx # Week selection component
│   └── weekly-changes.tsx # Weekly changes component
├── contexts/             # React Context providers
│   └── data-context.tsx  # Data management context
├── data/                 # JSON data files
│   ├── combined.json     # Week 1 data
│   ├── combined-week2.json # Week 2 data
│   ├── week-3.json       # Week 3 data
│   └── insights.json     # Insights data
├── lib/                  # Utility functions
│   └── utils.ts          # Helper utilities
└── dashboard.tsx         # Main dashboard component
```

## 📈 **Data Sources**

The dashboard analyzes Reddit Community Health Index (CHI) data including:
- **Community Health Scores**: Composite scores for overall community health
- **Engagement Metrics**: Posts, comments, and user activity
- **Growth Indicators**: Subscriber growth and retention rates
- **Content Quality**: Moderation actions and content scores
- **Weekly Trends**: Time-series analysis of community changes

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env.local` file in the root directory:
```env
# Add any environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Next.js Configuration**
The project is configured for optimal performance:
- Static export support for GitHub Pages
- Image optimization disabled for static builds
- TypeScript and ESLint integration

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push to main

### **Manual Deployment**
```bash
npm run build
npm run start
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Navya Kondaveeti**
- GitHub: [@nkondav3](https://github.com/nkondav3)

## 🙏 **Acknowledgments**

- Reddit API for community data
- Recharts for beautiful data visualizations
- Radix UI for accessible components
- Tailwind CSS for styling
- Next.js team for the amazing framework

## 📞 **Support**

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/[YOUR-USERNAME]/reddit-chi-dashboard/issues) page
2. Create a new issue if your question isn't answered
3. Reach out via GitHub discussions

---

**⭐ Star this repository if you find it helpful!**
