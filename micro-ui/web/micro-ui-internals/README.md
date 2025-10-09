# DIGIT UI Micro Frontend Internals

This directory contains the internal packages and components for the DIGIT UI micro frontend architecture.

## Structure

```
micro-ui-internals/
├── packages/
│   ├── css/                 # Shared CSS and styling configuration
│   └── modules/            # Individual micro frontend modules
│       └── property-tax/   # Property Tax management module
├── scripts/                # Build and deployment scripts
├── example/                # Development examples
└── config files           # Configuration and setup files
```

## Available Packages

### Modules
- **@egovernments/digit-ui-module-pt**: Property Tax management interface

### CSS
- **@egovernments/digit-ui-css**: Shared styling and Tailwind CSS configuration

## Development

### Prerequisites
- Node.js >= 14
- Yarn package manager

### Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start development:
   ```bash
   yarn start
   ```

3. Build all packages:
   ```bash
   yarn build
   ```

### Working with Individual Modules

Each module can be developed independently:

```bash
# Development
cd packages/modules/property-tax
yarn start

# Build
cd packages/modules/property-tax
yarn build
```

## Scripts

- `yarn start` - Start all development servers
- `yarn build` - Build all packages
- `yarn clean` - Clean all node_modules
- `yarn publish:css` - Publish CSS package
- `./scripts/deploy.sh` - Deploy to environment

## Contributing

1. Follow the existing code structure
2. Use Prettier for code formatting
3. Test changes in the example application
4. Update documentation as needed

## License

MIT