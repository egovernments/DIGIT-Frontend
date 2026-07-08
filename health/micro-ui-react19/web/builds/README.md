
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
│   │   └── hcm-digit-ui/                   # HCM DIGIT UI variant (default)
│   │       ├── index.js                    # HCM-specific entry point
│   │       ├── package.json                # HCM dependencies & config
│   │       └── public/                     # HCM-specific assets
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

### **Console** (`/console/`)
- **Purpose**: Administrative console interface
- **Modules**: Core, Admin, Console
- **Users**: System administrators
- **Features**: User management, system configuration

### **Core-UI** (`/core-ui/`)
- **Purpose**: Basic healthcare application
- **Modules**: Core modules only
- **Users**: Healthcare workers
- **Features**: Patient management, basic workflows

### **HCM-DIGIT-UI** (`/hcm-digit-ui/`)
- **Purpose**: Campaign management and analytics
- **Modules**: Core, Workbench, Campaign Manager
- **Users**: Program managers, data analysts
- **Features**: Campaign planning, data visualization, reporting



## Docker Deployment

### Building Docker Images

The project uses a unified Dockerfile that can build different variants. The `COUNTRY_PREFIX` build arg is required for country-specific deployments:

```bash
# Build HCM DIGIT UI variant for Chad
docker build -f health/micro-ui/web/docker/Dockerfile \
  --build-arg BUILD_VARIANT=hcm-digit-ui \
  --build-arg COUNTRY_PREFIX=chad \
  --build-arg PUBLIC_PATH=/chad/hcm-digit-ui/ \
  -t health-hcm-digit-ui-chad:latest .

# Build HCM DIGIT UI variant for Congo-B
docker build -f health/micro-ui/web/docker/Dockerfile \
  --build-arg BUILD_VARIANT=hcm-digit-ui \
  --build-arg COUNTRY_PREFIX=congob \
  --build-arg PUBLIC_PATH=/congob/hcm-digit-ui/ \
  -t health-hcm-digit-ui-congob:latest .

# Build Core UI variant
docker build -f health/micro-ui/web/docker/Dockerfile \
  --build-arg BUILD_VARIANT=core-ui \
  --build-arg COUNTRY_PREFIX=chad \
  --build-arg PUBLIC_PATH=/chad/core-ui/ \
  -t health-core-chad:latest .

# Build Console variant
docker build -f health/micro-ui/web/docker/Dockerfile \
  --build-arg BUILD_VARIANT=console \
  --build-arg COUNTRY_PREFIX=chad \
  --build-arg PUBLIC_PATH=/chad/console/ \
  -t health-console-chad:latest .
```

### Running Docker Containers

```bash
# Run HCM DIGIT UI (Chad)
docker run -p 80:80 health-hcm-digit-ui-chad:latest
# Access at: http://localhost/chad/hcm-digit-ui/

# Run Core UI (Chad)
docker run -p 80:80 health-core-chad:latest
# Access at: http://localhost/chad/core-ui/

# Run Console (Chad)
docker run -p 80:80 health-console-chad:latest
# Access at: http://localhost/chad/console/
```

### Docker Build Arguments

| Argument | Required | Description | Example |
|----------|----------|-------------|---------|
| `BUILD_VARIANT` | Yes | Which build variant to use | `hcm-digit-ui`, `core-ui`, `console` |
| `COUNTRY_PREFIX` | Yes | Country code for URL path prefix | `chad`, `congob` |
| `PUBLIC_PATH` | Yes | Full public path for webpack | `/chad/hcm-digit-ui/` |

### Docker Compose (Optional)

```yaml
version: '3.8'
services:
  hcm-digit-ui-chad:
    build:
      context: .
      dockerfile: health/micro-ui/web/docker/Dockerfile
      args:
        BUILD_VARIANT: hcm-digit-ui
        COUNTRY_PREFIX: chad
        PUBLIC_PATH: /chad/hcm-digit-ui/
    ports:
      - "3001:80"

  core-ui-chad:
    build:
      context: .
      dockerfile: health/micro-ui/web/docker/Dockerfile
      args:
        BUILD_VARIANT: core-ui
        COUNTRY_PREFIX: chad
        PUBLIC_PATH: /chad/core-ui/
    ports:
      - "3002:80"
```

## Tech Stack

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


## Documentation

- **[DIGIT UI Developer Guide](https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui)** - Official documentation
- **[API Documentation](https://core.digit.org/)** - Backend API reference
- **[Component Library](https://github.com/egovernments/DIGIT-UI-LIBRARIES)** - Reusable UI components

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support and issues:

- **GitHub Issues**: [DIGIT-Frontend Issues](https://github.com/egovernments/DIGIT-Frontend/issues)
- **DIGIT Core Issues**: [DIGIT-Core Issues](https://github.com/egovernments/DIGIT-core/issues)
- **Documentation**: [DIGIT Docs](https://core.digit.org/)

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/) - see the LICENSE file for details.

## Authors

- **[@jagankumar-egov](https://www.github.com/jagankumar-egov)** - Lead Developer
- **DIGIT Team** - Core platform development

## Architecture

### Multi-Variant Build System

The application uses a sophisticated build system that allows:

- **Single Codebase**: Maintain one codebase for multiple applications
- **Optimized Bundles**: Each variant only includes necessary dependencies
- **Dynamic Configuration**: Webpack configs adapt to build variant
- **CI/CD Integration**: Automated builds for different variants
- **Country-Specific Deployments**: Each country gets its own URL prefix

### Performance Optimizations

- **Lazy Loading**: Heavy modules loaded on demand
- **Code Splitting**: Separate chunks for different features
- **Bundle Analysis**: Monitor and optimize bundle sizes
- **Caching**: Efficient browser and CDN caching strategies

---

![DIGIT](https://s3.ap-south-1.amazonaws.com/works-dev-asset/mseva-white-logo.png)


**Built by the eGov Team**


![eGov](https://egov-dev-assets.s3.ap-south-1.amazonaws.com/egov.png)
