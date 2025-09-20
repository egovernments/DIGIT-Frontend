import React, { useState, useEffect ,Fragment} from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@egovernments/digit-ui-components';
import { SVG } from '@egovernments/digit-ui-react-components';
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
    const { t } = useTranslation();
    
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

    // State for filter visibility (popup mode)
    const [filterVisible, setFilterVisible] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    // Handle date range changes
    const handleDateRangeChange = (startDate, endDate) => {
      const newRange = { startDate, endDate };
      setDateRange(newRange);
      
      // Close popup after selection
      setShowPopup(false);
      
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

    // Get date range summary text
    const getDateRangeSummary = () => {
      if (dateRange.startDate && dateRange.endDate) {
        return `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`;
      } else if (dateRange.startDate) {
        return `From ${dateRange.startDate.toLocaleDateString()}`;
      } else if (dateRange.endDate) {
        return `Until ${dateRange.endDate.toLocaleDateString()}`;
      } else {
        return t('WBH_DATE_FILTER_ALL_TIME');
      }
    };

    // Compact date range summary component
    const DateRangeSummary = filterPosition !== 'none' ? (
      <div style={{
        padding: '8px 16px',
        backgroundColor: containerStyle.backgroundColor || '#e3f2fd',
        borderBottom: containerStyle.borderBottom || '1px solid #90caf9',
        fontSize: '13px',
        color: '#1565c0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📅</span>
          <strong>{label}:</strong>
          <span style={{ 
            fontWeight: '500',
            color: (dateRange.startDate || dateRange.endDate) ? '#1565c0' : '#757575'
          }}>
            {getDateRangeSummary()}
          </span>
        </div>
        <Button
          type="button"
          variation="secondary"
          label={
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <SVG.Edit width="12" height="12" />
              {t('WBH_DATE_FILTER_CHANGE')}
            </div>
          }
          onClick={() => setShowPopup(true)}
          style={{
            fontSize: '12px',
            padding: '4px 12px'
          }}
        />
      </div>
    ) : null;

    // Date filter popup component
    const DateFilterPopup = showPopup && filterPosition !== 'none' ? (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '12px'
          }}>
            <h3 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
              {label}
            </h3>
            <Button
              type="button"
              variation="secondary"
              label={<SVG.Close width="16" height="16" />}
              onClick={() => setShowPopup(false)}
              style={{
                minWidth: '32px',
                height: '32px',
                padding: '0'
              }}
            />
          </div>

          {/* Date Range Picker */}
          <DateRangePicker
            onDateRangeChange={handleDateRangeChange}
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
            showPresets={showPresets}
            containerStyle={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0'
            }}
            label=""
          />

          {/* Footer */}
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <Button
              type="button"
              variation="secondary"
              label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SVG.Close width="12" height="12" />
                  {t('WBH_DATE_FILTER_CLEAR_DATES')}
                </div>
              }
              onClick={() => handleDateRangeChange(null, null)}
              style={{ fontSize: '13px' }}
            />
            <Button
              type="button"
              variation="primary"
              label={
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SVG.Check width="12" height="12" />
                  {t('WBH_DATE_FILTER_CLOSE')}
                </div>
              }
              onClick={() => setShowPopup(false)}
              style={{ fontSize: '13px' }}
            />
          </div>
        </div>
      </div>
    ) : null;

    // Render based on filter position
    if (filterPosition === 'bottom') {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <WrappedComponent {...enhancedProps} />
          {DateRangeSummary}
          {DateFilterPopup}
        </div>
      );
    } else if (filterPosition === 'none') {
      // Just pass date range without showing filter UI
      return <WrappedComponent {...enhancedProps} />;
    } else {
      // Default: filter on top
      return (
        <div style={{ width: '100%', height: '100%' }}>
          {DateRangeSummary}
          <WrappedComponent {...enhancedProps} />
          {DateFilterPopup}
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