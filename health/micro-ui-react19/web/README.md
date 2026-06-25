# DIGIT Health Campaign Management Platform

A modern React-based web application for managing health campaigns with support for both local development and production deployment.

## Features

- 🚀 **Dual Environment Support**: Separate configs for development and production
- 🔥 **Hot Module Replacement**: Fast development with live reload
- 📦 **Optimized Production Build**: Code splitting, minification, and compression
- 🏗️ **Modular Architecture**: Support for DIGIT UI modules
- 🌍 **Multi-language Support**: Built-in internationalization (i18n)
- 🔐 **Authentication**: Support for Employee and Citizen user types

## Project Structure

```
web/
├── src/                    # Source code
│   ├── index.js           # Application entry point
│   ├── App.js             # Main App component
│   ├── globalConfig.js    # Global configuration
│   └── Customisations/    # UI customizations
├── packages/              # Local packages (workspace)
│   ├── css/              # Health UI CSS package
│   └── modules/
│       └── campaign-manager/  # Campaign management module
├── public/                # Static assets
├── webpack.common.js      # Shared webpack config
├── webpack.dev.js         # Development config
├── webpack.prod.js        # Production config
└── package.json          # Dependencies and workspaces
```

## Installation

```bash
# Install dependencies (need to fix permissions first)
yarn install

# Or if you have permission issues:
sudo chown -R $(whoami) .
yarn install
```

## Development

### Start Development Server

```bash
# Start with hot reload (default port 3000)
yarn start

# Or explicitly
yarn start:dev

# Use custom port
PORT=3001 yarn start
```

The application will be available at: `http://localhost:3000/hcm-digit-ui`

### Environment Variables

Create a `.env` file for local development:

```bash
# Copy example env file
cp .env.example .env

# Configure your backend URL
REACT_APP_PROXY_URL=https://your-backend-url.com
```

## Production Build

### Build for Production

```bash
# Create optimized production build
yarn build

# Or
yarn build:prod

# Build with bundle analysis
yarn build:analyze
```

Build output will be in the `build/` directory.

### Production Features

- Code splitting for better caching
- Minified and compressed assets
- Source maps disabled for security
- Optimized chunk sizes
- Tree shaking for smaller bundles

## Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start development server with hot reload |
| `yarn build` | Create production build |
| `yarn build:analyze` | Build and analyze bundle size |
| `yarn clean` | Clean build artifacts and dependencies |

## Environment Configuration

### Development (.env.development)
- Hot module replacement enabled
- Source maps for debugging
- Proxy to QA backend
- Debug logging enabled

### Production (.env.production)
- Optimized bundle sizes
- No source maps
- Production backend URLs
- Error logging only

## Key Technologies

- **React 19**: Latest React with concurrent features
- **Webpack 5**: Module bundling and optimization
- **React Router v6**: Client-side routing
- **TanStack Query**: Server state management
- **React Hook Form**: Form handling
- **i18next**: Internationalization

## Backend Services

The application connects to various backend microservices:

- MDMS (Master Data Management)
- HRMS (Human Resource Management)
- Workflow Engine
- File Storage
- Billing & Payment
- Localization
- User Management


## Troubleshooting

### Permission Issues

If you encounter permission issues with node_modules:

```bash
# Fix ownership
sudo chown -R $(whoami) .

# Clean and reinstall
rm -rf node_modules yarn.lock
yarn install
```

### Port Already in Use

```bash
# Use a different port
PORT=3001 yarn start
```

### Build Issues

```bash
# Clean everything and rebuild
yarn clean
yarn install
yarn build
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test in development
4. Build for production
5. Submit a pull request

## License

MIT