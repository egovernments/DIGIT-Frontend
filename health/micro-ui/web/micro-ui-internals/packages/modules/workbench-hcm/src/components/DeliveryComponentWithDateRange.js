import React from 'react';
import DeliveryComponent from './DeliveryComponent';
import withDateRangeFilter from './withDateRangeFilter';

// Create the date range filtered delivery component
const DateRangeFilteredDeliveryComponent = withDateRangeFilter(DeliveryComponent, {
  showDateFilter: true,
  showPresets: true,
  persistDates: true,
  storageKey: 'deliveryComponentDateRange',
  defaultPreset: 'last30days',
  label: 'Delivery Date Range Filter',
  filterPosition: 'top',
  containerStyle: {
    backgroundColor: '#fff3cd',
    borderBottom: '2px solid #ffc107'
  },
  onDateRangeChange: (startDate, endDate) => {
    console.log('Date range changed:', { startDate, endDate });
  }
});

/**
 * Demo component showcasing the DeliveryComponent with date range filtering
 * This wraps the entire DeliveryComponent and provides date range selection
 */
const DeliveryComponentWithDateRange = (props) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Header explaining the enhancement */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#f0f9ff',
        borderBottom: '1px solid #bae6fd',
        fontSize: '14px',
        color: '#1e40af'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>🕒 Date Range Enhanced Delivery Component</strong>
            <div style={{ fontSize: '12px', marginTop: '4px', color: '#3b82f6' }}>
              Filter delivery records by creation date using the date picker above
            </div>
          </div>
          <div style={{
            padding: '6px 12px',
            backgroundColor: '#dbeafe',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Query Field: Data.createdTime
          </div>
        </div>
      </div>

      {/* The enhanced delivery component with date range filter */}
      <DateRangeFilteredDeliveryComponent {...props} />
    </div>
  );
};

export default DeliveryComponentWithDateRange;