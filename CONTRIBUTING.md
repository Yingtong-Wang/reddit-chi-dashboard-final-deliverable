# Contributing to Reddit CHI Dashboard

Thank you for your interest in contributing to the Reddit Community Health Index Dashboard! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 9.x or higher
- Git

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/reddit-chi-dashboard.git
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

## 📋 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear title and description**
- **Use case** for the enhancement
- **Mockups or examples** (if applicable)
- **Implementation ideas** (optional)

### Pull Requests

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow the coding standards
   - Add tests if applicable
   - Update documentation

3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes

## 🎨 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper TypeScript interfaces
- Implement proper error boundaries

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design
- Test on multiple screen sizes

### Git Commit Messages
Follow the conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(dashboard): add new chart component
fix(api): resolve data loading issue
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Writing Tests
- Write unit tests for utility functions
- Add integration tests for components
- Test edge cases and error scenarios
- Maintain good test coverage

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Include usage examples

### README Updates
- Update README for new features
- Keep installation instructions current
- Add screenshots for UI changes

## 🔍 Code Review Process

1. **Automated Checks**
   - All CI checks must pass
   - Code must build successfully
   - Tests must pass

2. **Manual Review**
   - Code quality and standards
   - Functionality and user experience
   - Documentation completeness

3. **Approval and Merge**
   - At least one maintainer approval required
   - Squash and merge preferred
   - Delete feature branch after merge

## 🏷️ Release Process

1. **Version Bumping**
   - Follow semantic versioning
   - Update CHANGELOG.md
   - Tag releases appropriately

2. **Deployment**
   - Automatic deployment to Vercel
   - Monitor for deployment issues
   - Rollback if necessary

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: For security issues or private matters

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special mentions for outstanding contributions

## 📋 Checklist for Contributors

Before submitting a pull request:

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented, particularly complex areas
- [ ] Documentation updated if needed
- [ ] Tests added/updated and passing
- [ ] No breaking changes (or clearly documented)
- [ ] Issue linked to pull request

Thank you for contributing to the Reddit CHI Dashboard! 🎉