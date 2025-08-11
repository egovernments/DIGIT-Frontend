# UserDetails Component

A reusable React component that displays a masked UUID by default and reveals user details on click with caching functionality.

## Features

- **Masked Display**: Shows a shortened UUID format (e.g., "1234...abcd")
- **Click to Reveal**: Click to fetch and display user details
- **Caching**: Caches user data in localStorage to avoid repeated API calls
- **Tooltip Display**: Shows user details in a positioned tooltip
- **Auto-hide**: Tooltip automatically hides after 3 seconds
- **Error Handling**: Graceful error handling for failed API calls
- **Customizable**: Multiple props for styling and behavior customization

## Usage

```jsx
import UserDetails from './UserDetails';

// Basic usage
<UserDetails uuid="12345678-1234-1234-1234-123456789abc" />

// With custom styling
<UserDetails 
  uuid="12345678-1234-1234-1234-123456789abc"
  style={{ backgroundColor: "#f0f0f0", padding: "8px" }}
  iconSize="20px"
  tooltipPosition="bottom"
/>

// Without icon
<UserDetails uuid="12345678-1234-1234-1234-123456789abc" showIcon={false} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `uuid` | string | - | The user UUID to display (required) |
| `tenantId` | string | `Digit?.ULBService?.getCurrentTenantId()` | Tenant ID for API calls |
| `className` | string | `""` | Additional CSS classes |
| `style` | object | `{}` | Inline styles for the container |
| `showIcon` | boolean | `true` | Whether to show the eye icon |
| `iconSize` | string | `"16px"` | Size of the eye icon |
| `tooltipPosition` | string | `"top"` | Tooltip position: "top", "bottom", "left", "right" |
| `cacheKey` | string | `"user-details-cache"` | localStorage key for caching |

## Behavior

1. **Default State**: Shows masked UUID with eye icon
2. **First Click**: Fetches user details from API and caches them
3. **Subsequent Clicks**: Uses cached data (no API call)
4. **Tooltip**: Shows user name, mobile, and email
5. **Auto-hide**: Tooltip disappears after 3 seconds or when clicking outside

## Caching

User data is cached in localStorage with the following structure:
```json
{
  "user-details-cache": {
    "uuid-1": {
      "name": "John Doe",
      "mobileNumber": "1234567890",
      "emailId": "john@example.com",
      "cachedAt": 1640995200000
    }
  }
}
```

## API Endpoint

The component uses the `/digit-ui/egov-user/user/v1/_search` endpoint to fetch user details.

## Error Handling

- Invalid UUID: Shows "N/A"
- API errors: Shows error message in tooltip
- Network issues: Graceful fallback with error message

## Styling

The component uses inline styles for consistency and can be customized via the `style` prop. The tooltip uses a dark theme with white text.

## Example

See `UserDetailsExample.js` for complete usage examples.
