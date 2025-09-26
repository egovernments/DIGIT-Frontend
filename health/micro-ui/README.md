
# DIGIT Frontend - Health UI

A multi-variant React application built on top of DIGIT UI Core, designed for healthcare management systems.

## Overview

DIGIT (Digital Infrastructure for Governance, Impact & Transformation) is India's largest platform for governance services. This repository contains the frontend implementation for the Health module of DIGIT, featuring a multi-variant build system.

## Project Structure

```
DIGIT-Frontend/
├── health/micro-ui/web/                    # Health UI main application
│   ├── src/                                # Source code
│   ├── builds/                             # Build variants
│   │   ├── console/                        # Admin console variant
│   │   │   ├── index.js                    # Console-specific entry point
│   │   │   ├── package.json                # Console dependencies & config
│   │   │   └── public/                     # Console-specific assets
│   │   ├── core-ui/                        # Core application variant
│   │   │   ├── index.js                    # Core-specific entry point
│   │   │   ├── package.json                # Core dependencies & config
│   │   │   └── public/                     # Core-specific assets
│   │   └── workbench-ui/                   # Workbench variant (default)
│   │       ├── index.js                    # Workbench-specific entry point
│   │       ├── package.json                # Workbench dependencies & config
│   │       └── public/                     # Workbench-specific assets
│   ├── docker/                             # Docker configuration
│   │   ├── Dockerfile                      # Multi-variant Dockerfile
│   │   └── nginx.conf.template             # Dynamic nginx configuration
│   ├── packages/                           # Local packages
│   │   ├── css/                            # Health UI styles
│   │   └── modules/campaign-manager/       # Campaign management module
│   └── webpack.*.js                        # Webpack configurations
├── build/                                  # CI/CD configuration
│   └── build-config.yml                    # Build pipeline configuration
└── .github/workflows/                      # GitHub Actions workflows
    └── build.yaml                          # Multi-variant build pipeline
```

## Build Variants

This application supports three distinct build variants:

### 🏥 **Console** (`/console/`)
- **Purpose**: Administrative console interface
- **Modules**: Core, Admin, Console
- **Users**: System administrators
- **Features**: User management, system configuration

### 🩺 **Core-UI** (`/core-ui/`)
- **Purpose**: Basic healthcare application
- **Modules**: Core modules only  
- **Users**: Healthcare workers
- **Features**: Patient management, basic workflows

### 📊 **Workbench-UI** (`/workbench-ui/`)
- **Purpose**: Campaign management and analytics
- **Modules**: Core, Workbench, Campaign Manager
- **Users**: Program managers, data analysts
- **Features**: Campaign planning, data visualization, reporting


## 🚀 Local Development

### Prerequisites
- Node.js >= 14
- Yarn package manager
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/egovernments/DIGIT-Frontend.git
cd DIGIT-Frontend/health/micro-ui/web
```

2. **Choose and configure a build variant**
```bash
# For Workbench UI (default - includes campaign management)
cp builds/workbench-ui/package.json package.json
cp builds/workbench-ui/index.js src/index.js

# OR for Core UI (basic healthcare features only)
cp builds/core-ui/package.json package.json
cp builds/core-ui/index.js src/index.js

# OR for Console (admin interface)
cp builds/console/package.json package.json
cp builds/console/index.js src/index.js
```

3. **Install dependencies**
```bash
yarn install
```

4. **Create environment file**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Start development server**
```bash
yarn start
```

The application will be available at:
- **Workbench UI**: http://localhost:3000/workbench-ui/
- **Core UI**: http://localhost:3000/core-ui/
- **Console**: http://localhost:3000/console/

### Development Tips

- **Hot Reload**: Changes are automatically reloaded
- **Switching Variants**: Copy different variant files and restart the server
- **Package Building**: Run `yarn build:packages` to build local packages
- **Production Build**: Run `yarn build:prod` for optimized production bundle


## 🔧 Environment Variables

Create a `.env` file in the `health/micro-ui/web/` directory with the following variables:

```bash
# API Configuration
REACT_APP_PROXY_API=https://your-api-server.com
REACT_APP_GLOBAL=https://your-global-server.com
REACT_APP_PROXY_ASSETS=https://your-assets-server.com

# User Configuration  
REACT_APP_USER_TYPE=EMPLOYEE
# Options: EMPLOYEE, CITIZEN

# Build Configuration
SKIP_PREFLIGHT_CHECK=true

# Optional: State Configuration
REACT_APP_STATE_LEVEL_TENANT_ID=mz
```

### Environment Profiles

Different deployment environments may require different configurations:

- **Development**: Local API endpoints
- **Staging**: Staging server endpoints  
- **Production**: Production server endpoints


## 🚢 CI/CD Deployment

### GitHub Actions

The repository includes automated CI/CD pipelines that build and deploy different variants:

1. **Navigate to Actions tab** in GitHub
2. **Select "Build Pipeline"**  
3. **Choose variant**: `console`, `core-ui`, or `workbench-ui`
4. **Run workflow**

The pipeline automatically:
- Detects the build variant from the selection
- Builds the appropriate Docker image
- Supports both AMD64 and ARM64 architectures
- Creates multi-platform manifest

### Manual Deployment

For manual deployments, use the build configuration:

```bash
# Build specific variant
yarn build:prod

# Or with Docker
docker build --build-arg BUILD_VARIANT=workbench-ui -t my-app .
```

## 🛠 Tech Stack

### Core Technologies
- **[React 19.0.0](https://react.dev/)** - Modern UI framework with latest features
- **[React Hook Form](https://www.react-hook-form.com/)** - Performant forms with easy validation
- **[TanStack Query](https://tanstack.com/query/)** - Powerful data synchronization for React
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Webpack 5](https://webpack.js.org/)** - Module bundler with advanced optimizations

### Additional Libraries
- **Campaign Management**: Excel processing, mapping, form handling
- **Data Visualization**: Charts and analytics components  
- **UI Components**: DIGIT UI component library
- **State Management**: Redux Toolkit for complex state

### Build Optimizations
- **Code Splitting**: Lazy loading of heavy modules
- **Tree Shaking**: Dead code elimination
- **Bundle Analysis**: Webpack Bundle Analyzer integration
- **Compression**: Gzip compression for production

## 🗂 Modules

The application is organized into modular components:

### Core Modules
1. **Core** - Basic functionality and routing
2. **Assignment** - Task and assignment management  
3. **Utilities** - Common utilities and helpers

### Variant-Specific Modules
4. **Workbench** - Data management and configuration
5. **Campaign Manager** - Campaign planning and execution
6. **Admin/Console** - System administration (console variant)

### Optional Modules
7. **HRMS** - Human Resource Management
8. **Dashboard** - Analytics and reporting
9. **Engagement** - User engagement tools
10. **Payment** - Payment processing

## 📖 Documentation

- **[DIGIT UI Developer Guide](https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)** - Official documentation
- **[API Documentation](https://core.digit.org/)** - Backend API reference
- **[Component Library](https://github.com/egovernments/DIGIT-UI-LIBRARIES)** - Reusable UI components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

For support and issues:

- **GitHub Issues**: [DIGIT-Frontend Issues](https://github.com/egovernments/DIGIT-Frontend/issues)
- **DIGIT Core Issues**: [DIGIT-Core Issues](https://github.com/egovernments/DIGIT-core/issues)
- **Documentation**: [DIGIT Docs](https://core.digit.org/)

## 📄 License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/) - see the LICENSE file for details.

## 👥 Authors

- **[@jagankumar-egov](https://www.github.com/jagankumar-egov)** - Lead Developer
- **DIGIT Team** - Core platform development

## 🏗 Architecture

### Multi-Variant Build System

The application uses a sophisticated build system that allows:

- **Single Codebase**: Maintain one codebase for multiple applications
- **Optimized Bundles**: Each variant only includes necessary dependencies  
- **Dynamic Configuration**: Webpack configs adapt to build variant
- **CI/CD Integration**: Automated builds for different variants

### Performance Optimizations

- **Lazy Loading**: Heavy modules loaded on demand
- **Code Splitting**: Separate chunks for different features
- **Bundle Analysis**: Monitor and optimize bundle sizes
- **Caching**: Efficient browser and CDN caching strategies

---

![DIGIT](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)


**Built with ❤️ by the eGov Team**


![eGov](https://egov-dev-assets.s3.ap-south-1.amazonaws.com/egov.png)
