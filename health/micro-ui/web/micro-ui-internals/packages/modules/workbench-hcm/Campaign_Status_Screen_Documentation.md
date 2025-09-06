# Campaign Status Screen Documentation

## Overview
The Campaign Status Screen provides real-time monitoring of campaign creation processes, displaying progress indicators, summary statistics, and detailed process status information.

## Features

### 1. **Real-Time Status Monitoring**
- Displays current status of campaign setup processes
- Automatic progress calculation and visualization
- Last updated timestamp tracking

### 2. **Visual Progress Indicators**
- Circular progress chart showing overall completion percentage
- Color-coded status indicators (Green: Completed, Orange: Pending, Red: Failed, Blue: In Progress)
- Process-specific status badges

### 3. **Summary Dashboard**
- **Facilities**: Mapped vs completed counts
- **Resources**: Mapped vs to-be-mapped counts  
- **Users**: Mapped vs completed counts
- **Boundaries**: Completion count

### 4. **Process Details View**
- Individual process status tracking
- Formatted process names with descriptions
- Visual status indicators with icons

### 5. **Interactive Actions**
- Revalidate button to refresh status data
- Navigation to campaign details
- Back navigation functionality

## API Integration

### Endpoint
```
POST http://localhost:8080/project-factory/v1/project-type/status
```

### Request Body
```json
{
  "CampaignDetails": {
    "campaignNumber": "CMP-2025-09-06-000069",
    "tenantId": "od"
  }
}
```

### Response Structure
```json
{
  "CampaignStatus": {
    "campaignNumber": "CMP-2025-09-06-000069",
    "summary": {
      "facility": { "mapped": 10, "completed": 7 },
      "resource": { "mapped": 55, "toBeMapped": 48 },
      "user": { "mapped": 4, "completed": 4 },
      "boundary": { "completed": 103 }
    },
    "processes": [
      {
        "processname": "CAMPAIGN_FACILITY_CREATION_PROCESS",
        "status": "completed"
      }
    ]
  }
}
```

## URL Structure
```
/employee/hcm-workbench/campaign-status?tenantId={tenantId}&campaignNumber={campaignNumber}
```

**Required Parameters:**
- `tenantId`: Tenant identifier (e.g., "od")
- `campaignNumber`: Campaign identifier (e.g., "CMP-2025-09-06-000069")

## Component Architecture

### Main Components
- **CampaignStatusScreen.js**: Main screen component
- **CampaignStatus.js**: Page wrapper component
- **CampaignStatusRoute.js**: Routing configuration

### Key Features Implementation

#### Progress Calculation
```javascript
const calculateOverallProgress = () => {
  if (!campaignStatus?.processes) return 0;
  const completed = campaignStatus.processes.filter(p => p.status === 'completed').length;
  const total = campaignStatus.processes.length;
  return Math.round((completed / total) * 100);
};
```

#### Status Color Mapping
```javascript
const getStatusInfo = (status) => {
  switch (status) {
    case 'completed': return { color: '#4CAF50', icon: 'CheckCircle', text: 'Completed' };
    case 'pending': return { color: '#FF9800', icon: 'Schedule', text: 'Pending' };
    case 'failed': return { color: '#F44336', icon: 'Error', text: 'Failed' };
    case 'in_progress': return { color: '#2196F3', icon: 'Sync', text: 'In Progress' };
  }
};
```

## Styling & Design

### CSS Classes
- `.campaign-status-container`: Main container
- `.progress-circle`: Circular progress indicator
- `.summary-card`: Summary statistics cards
- `.process-item`: Individual process status items
- `.rotating`: Animation for refresh icon

### Responsive Design
- Mobile-first approach with breakpoints at 768px and 480px
- Flexible grid layouts that adapt to screen size
- Touch-optimized button sizing for mobile devices

## User Experience Features

### 1. **Loading States**
- Full-page loader during initial data fetch
- Button-specific loading for revalidation
- Rotating refresh icon animation

### 2. **Error Handling**
- Toast notifications for API errors
- Graceful fallback for missing data
- User-friendly error messages

### 3. **Navigation**
- Back button to previous screen
- Direct link to campaign details
- External link handling for campaign viewing

### 4. **Real-Time Updates**
- Manual refresh via revalidate button
- Timestamp tracking for last update
- Success confirmation for status updates

## Translation Keys

All text content is internationalized using translation keys:

```javascript
// Key examples
"WBH_CAMPAIGN_STATUS": "Campaign Status"
"WBH_OVERALL_PROGRESS": "Overall Progress"
"WBH_REVALIDATE_STATUS": "Revalidate Status"
"WBH_COMPLETED": "Completed"
"WBH_PENDING": "Pending"
```

## Integration Steps

### 1. **Add to Module Registration**
```javascript
// In Module.js
import CampaignStatusScreen from "./components/CampaignStatusScreen";
import CampaignStatus from "./pages/employee/CampaignStatus";

const componentsToRegister = {
  // ... existing components
  CampaignStatusScreen,
  CampaignStatus,
};
```

### 2. **Route Configuration**
```javascript
// In your routing configuration
<Route 
  path="/employee/hcm-workbench/campaign-status" 
  component={CampaignStatus} 
/>
```

### 3. **Translation Setup**
Add the translation keys from `CampaignStatusTranslations.js` to your locale files.

## Usage Examples

### Basic Usage
```jsx
import CampaignStatusScreen from "./components/CampaignStatusScreen";

// URL: /campaign-status?tenantId=od&campaignNumber=CMP-2025-09-06-000069
<CampaignStatusScreen />
```

### Custom Navigation
```javascript
// Navigate to campaign status
history.push(`/campaign-status?tenantId=${tenantId}&campaignNumber=${campaignNumber}`);
```

### Programmatic Status Check
```javascript
// The component automatically fetches status on mount
// Manual revalidation available via UI button
```

## Performance Considerations

### 1. **API Optimization**
- Manual trigger for status updates to avoid unnecessary calls
- Error handling prevents infinite retry loops
- Loading states prevent duplicate requests

### 2. **Rendering Optimization**
- Conditional rendering based on data availability
- Efficient progress calculations
- Optimized CSS for smooth animations

### 3. **Memory Management**
- Proper cleanup of timers and subscriptions
- State management optimized for re-renders
- CSS-in-JS avoided for better performance

## Browser Support
- Modern browsers supporting ES6+
- Progressive Web App capabilities
- Responsive design for mobile/tablet
- Offline functionality considerations

## Security Features
- Input validation for URL parameters
- Secure API communication
- Error message sanitization
- XSS protection through React's built-in security

## Future Enhancements
- WebSocket integration for real-time updates
- Export functionality for status reports
- Historical status tracking
- Bulk campaign status monitoring
- Integration with notification systems