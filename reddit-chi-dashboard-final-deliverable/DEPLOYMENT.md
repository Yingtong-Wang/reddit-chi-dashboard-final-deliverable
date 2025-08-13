# 🚀 Deployment Guide

This guide will walk you through deploying your Reddit CHI Dashboard to GitHub Pages with automatic CI/CD.

## 📋 **Prerequisites**

- GitHub account
- Node.js 20.x or later installed locally
- Git installed and configured

## 🌐 **GitHub Pages Setup**

### 1. **Enable GitHub Pages**

1. Go to your repository on GitHub: [https://github.com/nkondav3/reddit-chi-dashboard-final-deliverable](https://github.com/nkondav3/reddit-chi-dashboard-final-deliverable)
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

### 2. **Configure Repository Settings**

1. In **Settings** → **Pages**
2. Ensure **Source** is set to **GitHub Actions**
3. **Custom domain** (optional) - leave blank for now

## 🔧 **Local Configuration**

### 1. **Update Repository URLs**

Update the following files with your actual GitHub username and repository name:

**`package.json`:**
```json
{
  "repository": {
    "url": "https://github.com/nkondav3/reddit-chi-dashboard-final-deliverable.git"
  },
  "homepage": "https://nkondav3.github.io/reddit-chi-dashboard-final-deliverable"
}
```

**`next.config.mjs`:**
```javascript
basePath: process.env.NODE_ENV === 'production' ? '/reddit-chi-dashboard-final-deliverable' : '',
```

### 2. **Test Local Build**

```bash
# Install dependencies
npm install

# Test build
npm run build

# Test export
npm run export

# Verify output
ls -la out/
```

## 🚀 **Automatic Deployment**

### 1. **Push to GitHub**

The GitHub Actions workflow will automatically:
- Build your Next.js application
- Export static files
- Deploy to GitHub Pages

```bash
git add .
git commit -m "feat: Initial deployment setup"
git push origin main
```

### 2. **Monitor Deployment**

1. Go to **Actions** tab in your repository
2. Watch the **Deploy to GitHub Pages** workflow
3. Wait for completion (usually 2-5 minutes)

### 3. **Access Your Dashboard**

Once deployed, your dashboard will be available at:
```
https://nkondav3.github.io/reddit-chi-dashboard-final-deliverable
```

## 🔄 **Manual Deployment (Alternative)**

If you prefer manual deployment:

### 1. **Build and Export**

```bash
npm run build
npm run export
```

### 2. **Deploy to GitHub Pages**

1. Create a new branch called `gh-pages`
2. Copy contents of `out/` folder to the root of `gh-pages` branch
3. Push the `gh-pages` branch
4. Set GitHub Pages source to `gh-pages` branch

## 🐛 **Troubleshooting**

### **Build Failures**

**Error: "Build failed - out directory not found"**
- Check Node.js version (must be 20.x+)
- Clear `node_modules` and reinstall
- Verify `next.config.mjs` configuration

**Error: "Permission denied"**
- Ensure GitHub Actions has proper permissions
- Check repository settings for Pages access

### **Deployment Issues**

**Dashboard not loading**
- Verify basePath in `next.config.mjs`
- Check GitHub Pages source branch
- Wait 5-10 minutes for deployment to complete

**404 Errors**
- Ensure `trailingSlash: true` in Next.js config
- Check file paths in static export

### **Common Fixes**

```bash
# Clear build cache
rm -rf .next out

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
npm run export
```

## 📱 **Custom Domain Setup**

### 1. **Add Custom Domain**

1. In repository **Settings** → **Pages**
2. Enter your domain in **Custom domain**
3. Click **Save**
4. Add CNAME record pointing to `nkondav3.github.io`

### 2. **Update Configuration**

Update `next.config.mjs`:
```javascript
basePath: process.env.NODE_ENV === 'production' ? '' : '',
```

## 🔒 **Security Considerations**

- **Environment Variables**: Never commit sensitive data
- **API Keys**: Use environment variables for external services
- **Data Privacy**: Ensure compliance with data protection regulations

## 📊 **Performance Optimization**

### 1. **Build Optimization**

```bash
# Analyze bundle size
npm run build
# Check .next/analyze/ for detailed breakdown
```

### 2. **Image Optimization**

- Use WebP format when possible
- Implement lazy loading for images
- Optimize chart rendering performance

## 🔄 **Continuous Deployment**

### 1. **Automatic Updates**

Every push to `main` branch triggers:
- Build verification
- Static export
- GitHub Pages deployment

### 2. **Preview Deployments**

Pull requests get:
- Build testing
- Deployment preview (if configured)

## 📈 **Monitoring**

### 1. **GitHub Actions**

- Monitor workflow runs in **Actions** tab
- Check build logs for errors
- Verify deployment success

### 2. **GitHub Pages**

- Check deployment status in **Pages** settings
- Monitor page load times
- Track visitor analytics (if enabled)

## 🆘 **Getting Help**

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Community support and questions
- **Documentation**: Check Next.js and GitHub Pages docs

---

**Need help?** Open an issue in the repository or check the troubleshooting section above. 