# DIGIT UI Core New Module

A fresh, stable core module for DIGIT UI authentication handling, built specifically for React 19 compatibility.

## Overview

This module provides essential authentication components with a focus on:
- Language selection for both Employee and Citizen user types
- Modern React 19 support
- Clean, maintainable code structure
- Optimized build configuration

## Features

### Language Selection
- **Employee Language Selection**: Full-page language selection with state logo and branding
- **Citizen Language Selection**: Compact language selection using radio buttons
- Follows established DIGIT UI naming conventions and patterns

### Component Structure
```
src/
├── components/           # Reusable components
│   └── CoreNewApp.js    # Main app routing component
├── pages/               # Page components
│   ├── employee/        # Employee-specific pages
│   │   └── LanguageSelection/
│   └── citizen/         # Citizen-specific pages
│       └── LanguageSelection/
├── utils/               # Utility functions (for future use)
└── Module.js           # Main module export
```

## Dependencies

### Core Dependencies
- `@egovernments/digit-ui-components` - UI component library
- `@egovernments/digit-ui-svg-components` - SVG icons
- `react-i18next` - Internationalization

### Peer Dependencies
- `react` (19.0.0)
- `react-dom` (19.0.0)
- `react-router-dom` (6.25.1)
- `@tanstack/react-query` (^5.62.16)

## Development

### Local Development
```bash
yarn install
yarn start  # Starts dev server on port 3010
```

### Build Commands
```bash
yarn build          # Production build
yarn build:dev      # Development build
yarn build:analyze  # Bundle analysis
```

## Usage

### Module Registration
```javascript
import { CoreNewModule } from '@egovernments/digit-ui-module-core-new';

// Register the module
Digit.ComponentRegistryService.setupRegistry({
  ...CoreNewModule
});
```

### Direct Component Usage
```javascript
import { EmployeePages, CitizenPages } from '@egovernments/digit-ui-module-core-new';

// Use employee language selection
<EmployeePages.LanguageSelection />

// Use citizen language selection  
<CitizenPages.LanguageSelection />
```

### Route Configuration
The module provides these routes:
- `/employee/language-selection` - Employee language selection
- `/citizen/language-selection` - Citizen language selection

## Component APIs

### Employee Language Selection
- Displays state logo and name
- Button-based language selection
- Navigates to employee login after selection
- Responsive design for mobile/desktop

### Citizen Language Selection
- Uses radio buttons for selection
- Follows PageBasedInput pattern
- Navigates to location selection after language choice
- Compact, form-based design

## Styling

The module includes responsive SCSS styling with:
- Mobile-first responsive design
- DIGIT UI design system alignment
- Accessible color contrast
- Hover and focus states

## Build Configuration

- **Webpack 5** with environment-based optimization
- **Babel 7** with React 19 JSX transform
- **Tree-shaking** enabled for minimal bundle size
- **External dependencies** properly configured
- **Performance budgets** set at 300KB

## Browser Support

- Modern browsers (> 1% usage)
- Last 2 versions of Chrome, Firefox, Safari
- No Internet Explorer support

This module provides a clean, stable foundation for DIGIT UI authentication flows with modern React 19 support.