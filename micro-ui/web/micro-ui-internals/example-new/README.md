# DIGIT Modules Example App

A comprehensive example application to test the new Core and Workbench modules with language selection and master data management.

## Features

### Core Module
- ✅ Employee Language Selection (full-page layout)
- ✅ Citizen Language Selection (radio button layout)  
- ✅ Multi-language support (English, Hindi, Punjabi)
- ✅ Language persistence across sessions

### Workbench Module
- ✅ Master Selection Screen with comprehensive data listing
- ✅ Search and filter functionality
- ✅ Module-wise categorization
- ✅ Statistics dashboard
- ✅ Detailed master information display

## Quick Start

```bash
cd example-new
yarn install
yarn start
```

Opens at **http://localhost:3011**

## App Structure

### Home Page → Navigation to:
- **Employee Language Selection** (Core module)
- **Citizen Language Selection** (Core module)  
- **Workbench Masters** (Master data management)

### Master Data Management
**25+ Masters across 9 modules:**
- Core, Trade License, Property Tax, Water & Sewerage
- Fire NOC, PGR, FSM, Birth & Death
- Search, filter, statistics, and actions

## Technology
- React 19, Router 6, TanStack Query 5
- DIGIT UI Components, Webpack 5
- Multi-language with i18next