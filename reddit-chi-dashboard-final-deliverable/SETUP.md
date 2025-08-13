# 🛠️ Setup Guide

This guide will help you set up the Reddit CHI Dashboard project from scratch.

## 📋 **Prerequisites**

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or later ([Download](https://nodejs.org/))
- **npm** 9.0.0 or later (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

### **Verify Installation**

```bash
# Check Node.js version
node --version  # Should be 20.x or later

# Check npm version
npm --version   # Should be 9.0.0 or later

# Check Git version
git --version   # Should be 2.x or later
```

## 🚀 **Quick Start (Automated)**

### **Option 1: Clone and Setup**

```bash
# Clone the repository
git clone https://github.com/nkondav3/reddit-chi-dashboard-final-deliverable.git

# Navigate to project directory
cd reddit-chi-dashboard-final-deliverable

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Option 2: Use Setup Scripts**

We provide automated setup scripts for different operating systems:

**macOS/Linux:**
```bash
chmod +x scripts/quick-start.sh
./scripts/quick-start.sh
```

**Windows:**
```cmd
scripts\quick-start.bat
```

## 🔧 **Manual Setup (Step by Step)**

### **Step 1: Clone Repository**

```bash
git clone https://github.com/nkondav3/reddit-chi-dashboard-final-deliverable.git
cd reddit-chi-dashboard-final-deliverable
```

### **Step 2: Install Dependencies**

```bash
# Install all required packages
npm install

# Verify installation
npm list --depth=0
```

### **Step 3: Environment Setup**

Create a `.env.local` file in the root directory:

```bash
# Create environment file
touch .env.local
```

Add any environment variables you need:

```env
# Example environment variables
NEXT_PUBLIC_API_URL=your_api_url_here
NEXT_PUBLIC_APP_NAME=Reddit CHI Dashboard
```

### **Step 4: Data Setup**

Ensure your data files are in the `data/` directory:

```bash
# Check data directory
ls -la data/

# Expected files:
# - combined.json
# - insights.json
# - week-1.json
# - week-2.json
# - week-3.json
```

### **Step 5: Start Development Server**

```bash
# Start the development server
npm run dev

# The dashboard will be available at:
# http://localhost:3000
```

## 📁 **Project Structure**

```
reddit-chi-dashboard-final-deliverable/
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
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static assets
├── scripts/                # Data processing scripts
└── .github/                # GitHub configuration
    └── workflows/          # CI/CD workflows
```

## ⚙️ **Configuration Files**

### **Next.js Configuration (`next.config.mjs`)**

```javascript
const nextConfig = {
  output: 'export',           // Static export for GitHub Pages
  images: { unoptimized: true }, // Required for static export
  basePath: process.env.NODE_ENV === 'production' 
    ? '/reddit-chi-dashboard-final-deliverable' 
    : '',
  trailingSlash: true,       // GitHub Pages compatibility
}
```

### **TypeScript Configuration (`tsconfig.json`)**

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  }
}
```

### **Tailwind CSS Configuration (`tailwind.config.ts`)**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: { /* ... */ },
  plugins: [require("tailwindcss-animate")],
};
```

## 🧪 **Testing Your Setup**

### **Build Test**

```bash
# Test production build
npm run build

# Verify build output
ls -la .next/
```

### **Export Test**

```bash
# Test static export
npm run export

# Verify export output
ls -la out/
```

### **Development Test**

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
# Verify dashboard loads correctly
```

## 🔍 **Common Issues & Solutions**

### **Node.js Version Issues**

**Error: "Node.js version not supported"**

```bash
# Check current version
node --version

# Install Node.js 20.x using nvm (recommended)
nvm install 20
nvm use 20

# Or download from https://nodejs.org/
```

### **Dependency Issues**

**Error: "Cannot find module"**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Build Failures**

**Error: "Build failed"**

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Clear build cache
rm -rf .next out

# Rebuild
npm run build
```

### **Port Conflicts**

**Error: "Port 3000 is already in use"**

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
npm run dev -- -p 3001
```

## 🚀 **Production Setup**

### **Build for Production**

```bash
# Create production build
npm run build

# Export static files
npm run export

# Verify output
ls -la out/
```

### **Deploy to GitHub Pages**

Follow the [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

## 📚 **Additional Resources**

- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **React Documentation**: [https://react.dev/](https://react.dev/)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Radix UI**: [https://www.radix-ui.com/](https://www.radix-ui.com/)

## 🆘 **Getting Help**

If you encounter issues:

1. **Check the troubleshooting section** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Check the logs** for error messages

## 🎯 **Next Steps**

After successful setup:

1. **Explore the dashboard** at http://localhost:3000
2. **Review the code structure** in the components directory
3. **Check the data flow** in contexts/data-context.tsx
4. **Customize the styling** in app/globals.css
5. **Deploy to GitHub Pages** using the deployment guide

---

**Happy coding! 🎉** 