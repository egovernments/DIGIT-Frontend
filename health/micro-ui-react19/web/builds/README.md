
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



## 🐳 Docker Deployment

### Building Docker Images

The project uses a unified Dockerfile that can build different variants:

```bash
# Build Workbench UI variant
docker build -f health/micro-ui/web/docker/Dockerfile \
  --build-arg BUILD_VARIANT=workbench-ui \
  -t health-workbench:latest .

# Build Core UI variant
docker build -f health/micro-ui/web/docker/Dockerfile \
  --build-arg BUILD_VARIANT=core-ui \
  -t health-core:latest .

# Build Console variant
docker build -f health/micro-ui/web/docker/Dockerfile \
  --build-arg BUILD_VARIANT=console \
  -t health-console:latest .
```

### Running Docker Containers

```bash
# Run Workbench UI
docker run -p 80:80 health-workbench:latest
# Access at: http://localhost/workbench-ui/

# Run Core UI  
docker run -p 80:80 health-core:latest
# Access at: http://localhost/core-ui/

# Run Console
docker run -p 80:80 health-console:latest  
# Access at: http://localhost/console/
```

### Docker Compose (Optional)

```yaml
version: '3.8'
services:
  workbench-ui:
    build:
      context: .
      dockerfile: health/micro-ui/web/docker/Dockerfile
      args:
        BUILD_VARIANT: workbench-ui
    ports:
      - "3001:80"
      
  core-ui:
    build:
      context: .
      dockerfile: health/micro-ui/web/docker/Dockerfile  
      args:
        BUILD_VARIANT: core-ui
    ports:
      - "3002:80"
```

## 🛠 Tech Stack

### Core Technologies
- **[React 19.0.0](https://react.dev/)** - Modern UI framework with latest features
- **[React Hook Form](https://www.react-hook-form.com/)** - Performant forms with easy validation
- **[TanStack Query](https://tanstack.com/query/)** - Powerful data synchronization for React
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Webpack 5](https://webpack.js.org/)** - Module bundler with advanced optimizations


### Build Optimizations
- **Code Splitting**: Lazy loading of heavy modules
- **Tree Shaking**: Dead code elimination
- **Bundle Analysis**: Webpack Bundle Analyzer integration
- **Compression**: Gzip compression for production


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
