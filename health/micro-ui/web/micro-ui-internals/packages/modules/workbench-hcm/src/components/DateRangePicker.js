import React, { useState, useEffect ,Fragment} from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@egovernments/digit-ui-components';

/**
 * DateRangePicker component for selecting date ranges
 * Provides various preset options and custom date selection
 */
const DateRangePicker = ({
  onDateRangeChange,
  initialStartDate = null,
  initialEndDate = null,
  showPresets = true,
  containerStyle = {},
  inputStyle = {},
  buttonStyle = {},
  label = 'Date Range Filter'
}) => {
  const { t } = useTranslation();
  
  // Format date to YYYY-MM-DD for input fields
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Format date for display
  const formatDateForDisplay = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const [startDate, setStartDate] = useState(formatDateForInput(initialStartDate));
  const [endDate, setEndDate] = useState(formatDateForInput(initialEndDate));
  const [selectedPreset, setSelectedPreset] = useState('custom');

  // Date presets
  const datePresets = [
    {
      label: 'Today',
      value: 'today',
      getRange: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return { start: today, end: end };
      }
    },
    {
      label: 'Yesterday',
      value: 'yesterday',
      getRange: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const end = new Date(yesterday);
        end.setHours(23, 59, 59, 999);
        return { start: yesterday, end: end };
      }
    },
    {
      label: 'Last 7 Days',
      value: 'last7days',
      getRange: () => {
        const start = new Date();
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return { start: start, end: end };
      }
    },
    {
      label: 'Last 30 Days',
      value: 'last30days',
      getRange: () => {
        const start = new Date();
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return { start: start, end: end };
      }
    },
    {
      label: 'This Month',
      value: 'thismonth',
      getRange: () => {
        const start = new Date();
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        return { start: start, end: end };
      }
    },
    {
      label: 'Last Month',
      value: 'lastmonth',
      getRange: () => {
        const start = new Date();
        start.setMonth(start.getMonth() - 1, 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        return { start: start, end: end };
      }
    },
    {
      label: 'Last 3 Months',
      value: 'last3months',
      getRange: () => {
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return { start: start, end: end };
      }
    },
    {
      label: 'Last 6 Months',
      value: 'last6months',
      getRange: () => {
        const start = new Date();
        start.setMonth(start.getMonth() - 6);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return { start: start, end: end };
      }
    },
    {
      label: 'This Year',
      value: 'thisyear',
      getRange: () => {
        const start = new Date();
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        return { start: start, end: end };
      }
    },
    {
      label: 'All Time',
      value: 'alltime',
      getRange: () => {
        return { start: null, end: null };
      }
    },
    {
      label: 'Custom Range',
      value: 'custom',
      getRange: () => null
    }
  ];

  // Handle preset selection
  const handlePresetClick = (preset) => {
    setSelectedPreset(preset.value);
    
    if (preset.value === 'custom') {
      return;
    }
    
    const range = preset.getRange();
    if (range) {
      if (range.start && range.end) {
        const formattedStart = formatDateForInput(range.start);
        const formattedEnd = formatDateForInput(range.end);
        setStartDate(formattedStart);
        setEndDate(formattedEnd);
        
        // Notify parent component
        if (onDateRangeChange) {
          onDateRangeChange(range.start, range.end);
        }
      } else {
        // All time - clear dates
        setStartDate('');
        setEndDate('');
        if (onDateRangeChange) {
          onDateRangeChange(null, null);
        }
      }
    }
  };

  // Handle custom date changes
  const handleDateChange = (type, value) => {
    setSelectedPreset('custom');
    
    if (type === 'start') {
      setStartDate(value);
      if (value && endDate) {
        const start = new Date(value);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (onDateRangeChange) {
          onDateRangeChange(start, end);
        }
      }
    } else {
      setEndDate(value);
      if (startDate && value) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(value);
        end.setHours(23, 59, 59, 999);
        if (onDateRangeChange) {
          onDateRangeChange(start, end);
        }
      }
    }
  };

  // Clear date range
  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
    setSelectedPreset('alltime');
    if (onDateRangeChange) {
      onDateRangeChange(null, null);
    }
  };

  // Default styles
  const defaultContainerStyle = {
    padding: '16px 20px',
    backgroundColor: '#fff3cd',
    borderBottom: '2px solid #ffc107',
    ...containerStyle
  };

  const defaultInputStyle = {
    padding: '8px 12px',
    border: '1px solid #ffc107',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '14px',
    color: '#495057',
    outline: 'none',
    minWidth: '140px',
    ...inputStyle
  };

  const defaultButtonStyle = {
    padding: '6px 12px',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '13px',
    color: '#495057',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ...buttonStyle
  };

  return (
    <div style={defaultContainerStyle}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px' 
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#856404' 
          }}>
            📅 {t(label)}
          </h4>
          
          {(startDate || endDate) && (
            <Button
              type="button"
              variation="secondary"
              label="Clear Dates"
              onClick={handleClearDates}
              style={{
                fontSize: '13px'
              }}
            />
          )}
        </div>

        {/* Date inputs */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '12px',
              fontWeight: '500',
              color: '#856404',
              marginBottom: '4px'
            }}>
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange('start', e.target.value)}
              style={defaultInputStyle}
              max={endDate || undefined}
            />
          </div>
          
          <div style={{ 
            alignSelf: 'flex-end', 
            paddingBottom: '8px',
            color: '#856404'
          }}>
            to
          </div>
          
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '12px',
              fontWeight: '500',
              color: '#856404',
              marginBottom: '4px'
            }}>
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange('end', e.target.value)}
              style={defaultInputStyle}
              min={startDate || undefined}
            />
          </div>

          {/* Current selection display */}
          {(startDate || endDate) && (
            <div style={{
              marginLeft: 'auto',
              padding: '8px 12px',
              backgroundColor: '#ffeaa7',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#856404',
              fontWeight: '500'
            }}>
              {startDate && endDate ? (
                <>
                  {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
                </>
              ) : startDate ? (
                <>From {formatDateForDisplay(startDate)}</>
              ) : (
                <>Until {formatDateForDisplay(endDate)}</>
              )}
            </div>
          )}
        </div>

        {/* Preset buttons */}
        {showPresets && (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            flexWrap: 'wrap' 
          }}>
            {datePresets.map(preset => (
              <Button
                key={preset.value}
                type="button"
                variation={selectedPreset === preset.value ? 'primary' : 'secondary'}
                label={preset.label}
                onClick={() => handlePresetClick(preset)}
                style={{
                  fontSize: '13px',
                  margin: '2px'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;