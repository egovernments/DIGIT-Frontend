import React, { useState, useEffect ,Fragment} from 'react';
import DateRangePicker from './DateRangePicker';

/**
 * Higher-Order Component that wraps a component with date range filtering
 * Provides date range selection UI and passes startDate/endDate to wrapped component
 * 
 * @param {React.Component} WrappedComponent - Component to wrap with date range filtering
 * @param {Object} options - Configuration options for the HOC
 */
const withDateRangeFilter = (WrappedComponent, options = {}) => {
  const {
    // Configuration options
    showDateFilter = true,
    showPresets = true,
    persistDates = false,
    storageKey = 'dateRangeFilter',
    
    // Initial dates
    defaultStartDate = null,
    defaultEndDate = null,
    defaultPreset = 'last30days',
    
    // Labels
    label = 'Date Range Filter',
    
    // Styling
    filterPosition = 'top', // 'top', 'bottom', 'none'
    containerStyle = {},
    
    // Callbacks
    onDateRangeChange = null
  } = options;

  return function DateRangeFilteredComponent(props) {
    // Initialize dates from storage or defaults
    const [dateRange, setDateRange] = useState(() => {
      if (persistDates && typeof window !== 'undefined') {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            return {
              startDate: parsed.startDate ? new Date(parsed.startDate) : null,
              endDate: parsed.endDate ? new Date(parsed.endDate) : null
            };
          } catch (e) {
            console.error('Failed to load persisted date range:', e);
          }
        }
      }
      
      // Apply default preset if no saved dates
      if (!defaultStartDate && !defaultEndDate && defaultPreset) {
        const presets = {
          today: () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            return { startDate: today, endDate: end };
          },
          yesterday: () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            const end = new Date(yesterday);
            end.setHours(23, 59, 59, 999);
            return { startDate: yesterday, endDate: end };
          },
          last7days: () => {
            const start = new Date();
            start.setDate(start.getDate() - 7);
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            return { startDate: start, endDate: end };
          },
          last30days: () => {
            const start = new Date();
            start.setDate(start.getDate() - 30);
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            return { startDate: start, endDate: end };
          },
          thismonth: () => {
            const start = new Date();
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setMonth(end.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            return { startDate: start, endDate: end };
          },
          lastmonth: () => {
            const start = new Date();
            start.setMonth(start.getMonth() - 1, 1);
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setDate(0);
            end.setHours(23, 59, 59, 999);
            return { startDate: start, endDate: end };
          },
          last3months: () => {
            const start = new Date();
            start.setMonth(start.getMonth() - 3);
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            return { startDate: start, endDate: end };
          },
          last6months: () => {
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            return { startDate: start, endDate: end };
          },
          thisyear: () => {
            const start = new Date();
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setMonth(11, 31);
            end.setHours(23, 59, 59, 999);
            return { startDate: start, endDate: end };
          },
          alltime: () => {
            return { startDate: null, endDate: null };
          }
        };
        
        if (presets[defaultPreset]) {
          return presets[defaultPreset]();
        }
      }
      
      return {
        startDate: defaultStartDate,
        endDate: defaultEndDate
      };
    });

    // State for filter visibility
    const [filterVisible, setFilterVisible] = useState(showDateFilter);

    // Handle date range changes
    const handleDateRangeChange = (startDate, endDate) => {
      const newRange = { startDate, endDate };
      setDateRange(newRange);
      
      // Persist if enabled
      if (persistDates && typeof window !== 'undefined') {
        if (startDate || endDate) {
          localStorage.setItem(storageKey, JSON.stringify({
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
          }));
        } else {
          localStorage.removeItem(storageKey);
        }
      }
      
      // Call external handler if provided
      if (onDateRangeChange) {
        onDateRangeChange(startDate, endDate);
      }
    };

    // Effect to handle external date updates
    useEffect(() => {
      if (props.externalStartDate !== undefined || props.externalEndDate !== undefined) {
        setDateRange({
          startDate: props.externalStartDate || null,
          endDate: props.externalEndDate || null
        });
      }
    }, [props.externalStartDate, props.externalEndDate]);

    // Prepare enhanced props for wrapped component
    const enhancedProps = {
      ...props,
      // Add date range props
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      dateRange: dateRange,
      
      // Add control methods
      clearDateRange: () => handleDateRangeChange(null, null),
      setDateRange: handleDateRangeChange,
      toggleDateFilter: () => setFilterVisible(!filterVisible),
      
      // Add info
      hasDateFilter: !!(dateRange.startDate || dateRange.endDate),
      dateFilterActive: !!(dateRange.startDate || dateRange.endDate)
    };

    // Date range info component
    const DateRangeInfo = (dateRange.startDate || dateRange.endDate) ? (
      <div style={{
        padding: '10px 20px',
        backgroundColor: '#fff3cd',
        borderBottom: '1px solid #ffc107',
        fontSize: '13px',
        color: '#856404',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <strong>Date Filter Active:</strong>{' '}
          {dateRange.startDate && dateRange.endDate ? (
            <>
              {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
            </>
          ) : dateRange.startDate ? (
            <>From {dateRange.startDate.toLocaleDateString()}</>
          ) : (
            <>Until {dateRange.endDate.toLocaleDateString()}</>
          )}
        </div>
        {filterPosition !== 'none' && (
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            style={{
              padding: '4px 12px',
              backgroundColor: '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {filterVisible ? 'Hide Date Filter' : 'Show Date Filter'}
          </button>
        )}
      </div>
    ) : null;

    // Date filter component
    const DateFilterComponent = (filterPosition !== 'none' && filterVisible) ? (
      <DateRangePicker
        onDateRangeChange={handleDateRangeChange}
        initialStartDate={dateRange.startDate}
        initialEndDate={dateRange.endDate}
        showPresets={showPresets}
        containerStyle={containerStyle}
        label={label}
      />
    ) : null;

    // Render based on filter position
    if (filterPosition === 'bottom') {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          {DateRangeInfo}
          <WrappedComponent {...enhancedProps} />
          {DateFilterComponent}
        </div>
      );
    } else if (filterPosition === 'none') {
      // Just pass date range without showing filter UI
      return <WrappedComponent {...enhancedProps} />;
    } else {
      // Default: filter on top
      return (
        <div style={{ width: '100%', height: '100%' }}>
          {DateFilterComponent}
          {DateRangeInfo}
          <WrappedComponent {...enhancedProps} />
        </div>
      );
    }
  };
};

/**
 * Hook version of withDateRangeFilter for functional components
 * Provides date range logic without the UI components
 */
export const useDateRangeFilter = (defaultStartDate = null, defaultEndDate = null) => {
  const [dateRange, setDateRange] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate
  });

  const updateDateRange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  const clearDateRange = () => {
    setDateRange({ startDate: null, endDate: null });
  };

  const isActive = !!(dateRange.startDate || dateRange.endDate);

  return {
    dateRange,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    updateDateRange,
    clearDateRange,
    isActive
  };
};

export default withDateRangeFilter;