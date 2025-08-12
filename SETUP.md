# 🛠️ Project Setup Guide

This guide will help you set up the Reddit CHI Dashboard project from scratch, whether you're developing locally or deploying to production.

## 📋 **Prerequisites**

### **Required Software**
- **Node.js**: Version 20.x or later
- **npm**: Version 9.x or later (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### **System Requirements**
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux

## 🚀 **Quick Start (Recommended)**

### **Option 1: Automated Setup (macOS/Linux)**
```bash
# Make script executable and run
chmod +x scripts/quick-start.sh
./scripts/quick-start.sh
```

### **Option 2: Automated Setup (Windows)**
```cmd
# Run the batch file
scripts\quick-start.bat
```

### **Option 3: Manual Setup**
Follow the detailed steps below.

## 🔧 **Manual Setup Steps**

### **1. Clone Repository**
```bash
# Clone the repository
git clone https://github.com/yourusername/reddit-chi-dashboard.git
cd reddit-chi-dashboard

# Or if you're starting fresh
mkdir reddit-chi-dashboard
cd reddit-chi-dashboard
```

### **2. Initialize Project**
```bash
# Initialize git repository
git init

# Add remote origin
git remote add origin https://github.com/yourusername/reddit-chi-dashboard.git
```

### **3. Install Dependencies**
```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### **4. Configure Project**
```bash
# Update package.json with your details
# Edit the following fields:
# - "author": "Your Name"
# - "repository.url": "https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
# - "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
```

### **5. Test Local Build**
```bash
# Test development server
npm run dev

# In another terminal, test production build
npm run build

# Test static export
npm run export
```

## 📁 **Project Structure Overview**

```
reddit-chi-dashboard/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/             # React components
│   ├── ui/                # UI components
│   ├── week-selector.tsx  # Week selection
│   └── weekly-changes.tsx # Weekly changes
├── contexts/               # React contexts
│   └── data-context.tsx   # Data management
├── data/                   # Data files
│   ├── insights.json      # Processed insights
│   └── week-*.json        # Weekly data
├── hooks/                  # Custom hooks
├── lib/                    # Utilities
├── public/                 # Static assets
├── scripts/                # Build/deployment scripts
├── .github/                # GitHub configuration
├── README.md               # Project documentation
├── DEPLOYMENT.md           # Deployment guide
├── SETUP.md                # This file
├── package.json            # Dependencies and scripts
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS config
└── tsconfig.json           # TypeScript config
```

## 🔧 **Configuration Files**

### **Next.js Configuration (`next.config.mjs`)**
```javascript
// Key settings for GitHub Pages deployment
output: 'export',                    // Static export
basePath: '/your-repo-name',         // Update with your repo name
trailingSlash: true,                 // GitHub Pages compatibility
images: { unoptimized: true },       // Static export requirement
```

### **Tailwind CSS (`tailwind.config.ts`)**
```typescript
// Custom color schemes and component styles
// Extends default Tailwind with custom design system
```

### **TypeScript (`tsconfig.json`)**
```json
// Strict type checking and Next.js optimizations
// Path mapping for clean imports
```

## 📊 **Data Setup**

### **1. Data Sources**
The dashboard expects data in the following format:

**`data/insights.json`:**
```json
{
  "week-1": {
    "subreddit-name": {
      "insight": "Analysis text...",
      "nextStep": "Recommendation text..."
    }
  }
}
```

**`data/week-*.json`:**
```json
{
  "subreddit": "subreddit-name",
  "CHS_composite": 750,
  "Health_Grade": "B",
  "subscribers": 50000,
  "total_posts": 1200
}
```

### **2. Data Processing Scripts**
```bash
# Convert CSV insights to JSON
npx ts-node scripts/convert-insights-to-json.ts

# Process weekly data
npx ts-node scripts/process-this-week-data.ts
```

## 🌐 **Development Workflow**

### **1. Start Development Server**
```bash
npm run dev
# Dashboard available at: http://localhost:3000
```

### **2. Make Changes**
- Edit components in `components/` directory
- Modify styles in `app/globals.css`
- Update data context in `contexts/data-context.tsx`

### **3. Test Changes**
- Browser automatically reloads on file changes
- Check console for errors
- Test different screen sizes

### **4. Build and Test**
```bash
# Test production build
npm run build

# Test static export
npm run export

# Verify output
ls -la out/
```

## 🚀 **Deployment Preparation**

### **1. Update Configuration**
```bash
# Update repository URLs in package.json
# Update basePath in next.config.mjs
# Verify GitHub Actions workflows
```

### **2. Test Deployment Build**
```bash
# Full deployment test
npm run build
npm run export

# Verify static files
ls -la out/
# Should contain: _next/, index.html, etc.
```

### **3. Commit and Push**
```bash
git add .
git commit -m "feat: Production deployment setup"
git push origin main
```

## 🐛 **Common Issues & Solutions**

### **Build Errors**

**"Module not found" errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next out
npm install
npm run build
```

**TypeScript errors:**
```bash
# Check tsconfig.json
# Verify import paths
# Run type checking: npx tsc --noEmit
```

### **Runtime Errors**

**Data loading issues:**
- Verify data file paths
- Check JSON file format
- Ensure data context is properly configured

**Styling issues:**
- Verify Tailwind CSS configuration
- Check component class names
- Ensure CSS imports are correct

### **Deployment Issues**

**GitHub Pages 404 errors:**
- Verify basePath in next.config.mjs
- Check trailingSlash setting
- Ensure static export is working

**Build failures:**
- Check Node.js version (must be 20.x+)
- Verify all dependencies are installed
- Check GitHub Actions logs

## 🔍 **Debugging Tools**

### **1. Browser Developer Tools**
- **Console**: Check for JavaScript errors
- **Network**: Monitor data loading
- **Elements**: Inspect component structure

### **2. Next.js Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm run dev
```

### **3. Build Analysis**
```bash
# Analyze bundle size
npm run build
# Check .next/analyze/ for detailed breakdown
```

## 📚 **Additional Resources**

### **Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GitHub Pages Documentation](https://pages.github.com)

### **Community Support**
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [React Community](https://reactjs.org/community/support.html)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

## 🆘 **Getting Help**

### **1. Check Documentation**
- Review this setup guide
- Check README.md for project overview
- Review DEPLOYMENT.md for deployment help

### **2. Community Support**
- Open GitHub Issues for bugs
- Use GitHub Discussions for questions
- Check existing issues for solutions

### **3. Local Development**
- Test with `npm run dev`
- Verify all dependencies are installed
- Check Node.js version compatibility

---

**Need immediate help?** Open an issue in the repository with:
- Error messages
- Steps to reproduce
- Environment details (OS, Node.js version)
- Screenshots if applicable 