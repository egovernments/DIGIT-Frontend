# withMapView HOC - Enhanced with MapViewComponent

## Overview

The `withMapView` Higher-Order Component uses the dedicated `MapViewComponent` to provide comprehensive map visualization capabilities without nested tables. This creates a clean separation between table and map views, ensuring smooth toggling between visualization modes.

## Key Features

### 🗺️ Advanced Map Capabilities
- **Multi-boundary Support**: Automatic detection and visualization of LGA, Ward, and Settlement boundaries
- **Smart Clustering**: Dynamic marker clustering based on zoom level and data density
- **Multiple Base Layers**: Google Maps, OpenStreetMap, CartoDB themes, Satellite imagery
- **Interactive Controls**: Layer switching, zoom controls, and boundary selection

### 🔍 Built-in Filtering & Search
- **Global Search**: Search across all data fields
- **Column Filters**: Dropdown filters for categorical data
- **Boundary Filtering**: Filter by geographic boundaries
- **Real-time Updates**: Instant filter application with visual feedback

### 📊 Data Integration
- **Automatic Coordinate Detection**: Flexible coordinate field mapping
- **Rich Popup Content**: Comprehensive data display on marker click
- **Data Statistics**: Real-time counts and filtering summaries
- **Export Capabilities**: Excel download for filtered data

## Usage Examples

### Simple Usage
```javascript
import withMapView from './withMapView';

const SimpleMapTable = withMapView(ReusableTableWrapper, {
  showMapToggle: true,
  defaultView: 'table',
  
  // Basic coordinate extraction
  getLatitude: (row) => row.latitude || row.lat,
  getLongitude: (row) => row.longitude || row.lng
});
```

### Advanced Usage with HOC Composition
```javascript
const AdvancedComponent = withDateRangeFilter(
  withBoundaryFilter(
    withGenericFilter(
      withMapView(ReusableTableWrapper, {
        showMapToggle: true,
        persistViewMode: true,
        storageKey: 'myComponentMapView',
        
        getLatitude: (row) => row.coordinates?.lat,
        getLongitude: (row) => row.coordinates?.lng
      })
    )
  )
);
```

## Configuration Options

### Core Options
- `showMapToggle` (boolean): Show map/table toggle buttons
- `defaultView` ('table' | 'map'): Initial view mode
- `persistViewMode` (boolean): Remember user's view preference
- `storageKey` (string): localStorage key for persistence

### Data Mapping
- `getLatitude(row)`: Function to extract latitude from data row
- `getLongitude(row)`: Function to extract longitude from data row
- `getMapPopupContent(visit, index, data)`: Custom popup content function

### Map Features
- `showConnectingLines` (boolean): Connect markers with lines
- `showBaseLayer` (boolean): Show map base layers
- `mapContainerId` (string): HTML container ID for map
- `showBoundaryControls` (boolean): Show LGA/Ward/Settlement toggle
- `defaultBoundaryType` (string): Initial boundary type ('LGA', 'WARD', 'SETTLEMENT')
- `showFilters` (boolean): Show filter dropdowns in map view
- `showSearch` (boolean): Show search bar in map view

## Benefits of MapViewComponent Integration

### 🚀 Performance
- **Viewport-aware Rendering**: Only renders visible markers
- **Smart Clustering**: Reduces DOM elements for better performance
- **Efficient Updates**: Minimal re-rendering on data changes

### 🎨 User Experience
- **Consistent Interface**: Follows DIGIT design patterns
- **Intuitive Controls**: Familiar map interactions
- **Responsive Design**: Works on all screen sizes

### 🔧 Developer Experience
- **Minimal Configuration**: Sensible defaults for most use cases
- **Flexible Customization**: Override any aspect when needed
- **Type Safety**: Clear prop interfaces and documentation

### 🌍 Geographic Features
- **Boundary Awareness**: Automatic boundary detection and visualization
- **Multi-level Navigation**: LGA → Ward → Settlement drilling
- **Spatial Filtering**: Filter data by geographic regions

## Integration with Other HOCs

The `withMapView` HOC works seamlessly with other filter HOCs:

```javascript
// HOC Composition Order (inner to outer):
// 1. ReusableTableWrapper (base table)
// 2. withMapView (adds map/table toggle)  
// 3. withGenericFilter (adds field filters)
// 4. withBoundaryFilter (adds boundary filters)
// 5. withDateRangeFilter (adds date filtering)
```

## Architecture Benefits

The separation of `MapViewComponent` from `BoundariesMapWrapper` provides:

### Clean Separation of Concerns
- **No Nested Tables**: MapViewComponent is purely for map visualization
- **Clear Toggle**: Clean switching between table and map views
- **Independent Controls**: Each view has its own appropriate controls

## Migration from Previous Versions

If you were previously using components with nested table issues, the new `MapViewComponent` provides:

- **Enhanced Boundaries**: Automatic shapefile loading and boundary visualization
- **Better Performance**: Optimized rendering and clustering
- **More Features**: Built-in filtering, search, and data export
- **Consistent UX**: Standardized interface across all map components

## Best Practices

1. **Coordinate Mapping**: Provide robust coordinate extraction functions that handle multiple data formats
2. **Performance**: Use pagination for large datasets (>1000 records)
3. **User Experience**: Always provide fallback content when no coordinates are available
4. **Accessibility**: Ensure map controls are keyboard accessible
5. **Mobile**: Test on mobile devices for touch interactions

## Example Implementation

See `DeliveryComponent.js` for a complete implementation example that demonstrates:
- Multi-level HOC composition
- Custom coordinate extraction
- Integration with Elasticsearch data
- Real-time filtering and search
- Export functionality

The enhanced `withMapView` HOC provides a powerful, flexible, and user-friendly way to add comprehensive mapping capabilities to any table component while maintaining the simplicity of the original table interface.