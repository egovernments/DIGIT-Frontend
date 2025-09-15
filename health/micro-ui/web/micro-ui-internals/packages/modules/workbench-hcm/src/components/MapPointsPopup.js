/**
 * MapPointsPopup - Common enhanced popup component for map markers
 * 
 * This component provides a unified, professional popup interface for all map components
 * including MapComponent, MapView, TaskComponent, and others.
 */

/**
 * Creates enhanced popup content for map markers
 * @param {Object} dataPoint - The data point containing task/marker information
 * @param {number} index - The index of the marker (0-based)
 * @param {Object} options - Optional configuration for popup appearance and behavior
 * @returns {string} HTML string for the popup content
 */
export const createMapPointPopup = (dataPoint, index, options = {}) => {
  // Debug logging to understand the data structure
  if (options.debug) {
    // console.log("🔍 MapPointsPopup data received:", dataPoint, "Index:", index, "Options:", options);
  }
  
  const pointNumber = index + 1;
  
  // Extract basic information with robust fallbacks
  const taskId = dataPoint.id || "N/A";
  const taskType = dataPoint.productName || dataPoint.product || options.defaultTaskType || "Task";
  const location = dataPoint.administrativeArea || dataPoint.location || "Unknown Location";
  const quantity = dataPoint.quantity || dataPoint.resourcesQuantity || 0;
  const memberCount = dataPoint.memberCount || 0;
  const deliveredBy = dataPoint.createdBy || dataPoint.userId || dataPoint.user || "Unknown User";
  const status = dataPoint.status || "UNKNOWN";
  
  // Format time properly
  let deliveryTime = "N/A";
  if (dataPoint.time && dataPoint.time !== "NA") {
    try {
      const date = new Date(dataPoint.time);
      deliveryTime = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      deliveryTime = dataPoint.time;
    }
  }
  
  // Get coordinates with fallbacks
  const lat = dataPoint.lat || dataPoint.latitude || 0;
  const lng = dataPoint.lng || dataPoint.longitude || 0;
  const coords = `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`;
  
  // Determine status styling and info
  const getStatusInfo = (status) => {
    const statusUpper = status.toString().toUpperCase();
    
    switch (true) {
      case statusUpper.includes('ADMINISTRATION_SUCCESS') || statusUpper.includes('COMPLETED')|| statusUpper.includes('SUCCESS'):
        return { 
          color: "#10b981", 
          text: "Administration Success", 
          icon: "✅", 
          bgGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
        };
      case statusUpper.includes('PROGRESS'):
        return { 
          color: "#f59e0b", 
          text: "IN PROGRESS", 
          icon: "🔄", 
          bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" 
        };
      case statusUpper.includes('PENDING'):
        return { 
          color: "#ef4444", 
          text: "PENDING", 
          icon: "⏳", 
          bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
        };
      case statusUpper.includes('FAILED'):
        return { 
          color: "#dc2626", 
          text: "FAILED", 
          icon: "❌", 
          bgGradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" 
        };
      default:
        return { 
          color: "#6b7280", 
          text: statusUpper || "UNKNOWN", 
          icon: "❓", 
          bgGradient: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)" 
        };
    }
  };
  
  const statusInfo = getStatusInfo(status);
  const isCompleted = quantity > 0 || statusInfo.text === "COMPLETED";
  
  // Generate unique IDs for accordion sections
  const uniqueId = `popup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const deliveryAccordionId = `${uniqueId}-delivery`;
  const locationAccordionId = `${uniqueId}-location`;
  
  // Build sections based on available data and options
  const sections = [];
  
  // Basic Summary Section (always visible)
  sections.push(`
    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 10px; padding: 14px; margin-bottom: 12px; border: 1px solid #e2e8f0;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 4px;">
            ${taskType}
          </div>
          <div style="font-size: 12px; color: #6b7280;">
            ${location}
          </div>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; background: ${statusInfo.color}15; color: ${statusInfo.color};">
            ${statusInfo.icon} ${statusInfo.text}
          </span>
        </div>
      </div>
    </div>
  `);
  
  // Inline accordion functions that will work in popup context
  const createToggleFunction = (contentId, arrowId) => {
    return `
      (function() {
        const content = document.getElementById('${contentId}');
        const arrow = document.getElementById('${arrowId}');
        if (content && arrow) {
          if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            content.style.maxHeight = '300px';
            arrow.innerHTML = '▼';
            arrow.style.transform = 'none';
          } else {
            content.style.display = 'none';
            content.style.maxHeight = '0';
            arrow.innerHTML = '▶';
            arrow.style.transform = 'none';
          }
        }
      })();
    `;
  };

  // Delivery Information Accordion (if there's delivery data)
  if (quantity > 0 || memberCount > 0 || deliveredBy !== "Unknown User" || deliveryTime !== "N/A") {
    const deliveryFields = [];
    
    if (quantity > 0) {
      deliveryFields.push(`
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="font-weight: 600; color: #6b7280; font-size: 12px;">📦 ${options.quantityLabel || 'Quantity'}:</span>
          <span style="color: #374151; font-weight: 700; font-size: 13px;">${quantity.toLocaleString()}</span>
        </div>
      `);
    }
    
    if (memberCount > 0) {
      deliveryFields.push(`
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="font-weight: 600; color: #6b7280; font-size: 12px;">👥 ${options.memberLabel || 'People Served'}:</span>
          <span style="color: #374151; font-weight: 700; font-size: 13px;">${memberCount.toLocaleString()}</span>
        </div>
      `);
    }
    
    if (deliveredBy !== "Unknown User") {
      deliveryFields.push(`
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="font-weight: 600; color: #6b7280; font-size: 12px;">🚚 ${options.deliveredByLabel || 'Delivered By'}:</span>
          <span style="color: #374151; font-weight: 600; font-size: 12px;">${deliveredBy}</span>
        </div>
      `);
    }
    
    if (deliveryTime !== "N/A") {
      deliveryFields.push(`
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <span style="font-weight: 600; color: #6b7280; font-size: 12px;">⏰ ${options.timeLabel || 'Time'}:</span>
          <span style="color: #374151; font-size: 11px;">${deliveryTime}</span>
        </div>
      `);
    }
    
    if (deliveryFields.length > 0) {
      deliveryFields[deliveryFields.length - 1] = deliveryFields[deliveryFields.length - 1].replace('border-bottom: 1px solid #f3f4f6;', '');
    }
    
    sections.push(`
      <div style="margin-bottom: 8px;">
        <div 
          onclick="${createToggleFunction(deliveryAccordionId, `${deliveryAccordionId}-arrow`)}"
          style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background-color 0.2s;"
          onmouseover="this.style.background='#f1f5f9'"
          onmouseout="this.style.background='#f9fafb'"
        >
          <span style="font-weight: 600; color: #374151; font-size: 13px; display: flex; align-items: center; gap: 6px;">
            📋 Delivery Details
          </span>
          <span id="${deliveryAccordionId}-arrow" style="color: #6b7280; font-size: 12px; transition: transform 0.2s;">
            ▶
          </span>
        </div>
        <div id="${deliveryAccordionId}" style="display: none; overflow: hidden;">
          <div style="background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 12px 14px;">
            ${deliveryFields.join('')}
          </div>
        </div>
      </div>
    `);
  }
  
  // Location Information Accordion
  if (location !== "Unknown Location" || (lat !== 0 || lng !== 0)) {
    sections.push(`
      <div style="margin-bottom: 8px;">
        <div 
          onclick="${createToggleFunction(locationAccordionId, `${locationAccordionId}-arrow`)}"
          style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background-color 0.2s;"
          onmouseover="this.style.background='#f1f5f9'"
          onmouseout="this.style.background='#f9fafb'"
        >
          <span style="font-weight: 600; color: #374151; font-size: 13px; display: flex; align-items: center; gap: 6px;">
            📍 Location Details
          </span>
          <span id="${locationAccordionId}-arrow" style="color: #6b7280; font-size: 12px; transition: transform 0.2s;">
            ▶
          </span>
        </div>
        <div id="${locationAccordionId}" style="display: none; overflow: hidden;">
          <div style="background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 12px 14px;">
            ${location !== "Unknown Location" ? `
              <div style="margin-bottom: 10px;">
                <span style="font-weight: 600; color: #6b7280; font-size: 12px;">📌 Area:</span>
                <span style="color: #374151; margin-left: 8px; font-weight: 500; font-size: 12px;">${location}</span>
              </div>
            ` : ''}
            <div style="font-size: 12px; color: #6b7280; font-weight: 600; margin-bottom: 6px;">
              🗺️ GPS Coordinates:
            </div>
            <div style="font-size: 12px; color: #4b5563; font-family: monospace; background: #f9fafb; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb;">
              ${coords}
            </div>
          </div>
        </div>
      </div>
    `);
  }
  
  // Build the complete popup HTML
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 280px; max-width: 350px;">
      
      <!-- Compact Header -->
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 10px 14px; margin: -9px -9px 12px -9px; border-radius: 8px 8px 0 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
            ${options.titlePrefix || 'Point'} #${pointNumber}
          </h3>

        </div>
      </div>

      <!-- Main Content -->
      <div style="padding: 0 10px;">
        ${sections.join('')}
      </div>

      <!-- Minimal Footer -->
      <div style="margin-top: 8px; padding: 8px 10px; border-top: 1px solid #e5e7eb;">
        <div style="text-align: center; font-size: 10px; color: #9ca3af;">
          Click sections to expand details
        </div>
      </div>

    </div>
  `;
};

/**
 * Configuration presets for different component types
 */
export const PopupPresets = {
  // For TaskComponent
  TASK: {
    titlePrefix: "Task",
    taskSectionTitle: "Task Details",
    resourceTitle: "Resource Summary",
    quantityLabel: "Resource Quantity",
    noDataMessage: "No resource information available",
    debug: true
  },
  
  // For MapComponent (delivery/distribution data)
  DELIVERY: {
    titlePrefix: "Task",
    taskSectionTitle: "Delivery Information",
    resourceTitle: "Delivery Stats",
    quantityLabel: "Units Delivered",
    memberLabel: "People Served",
    deliveredByLabel: "Delivered By",
    timeLabel: "Delivery Time",
    debug: true
  },
  
  // For MapView (general visits/points)
  VISIT: {
    titlePrefix: "Visit",
    taskSectionTitle: "Visit Information",
    resourceTitle: "Visit Summary",
    quantityLabel: "Items",
    timeLabel: "Visit Time",
    locationSectionTitle: "Visit Location",
    debug: true
  },
  
  // Minimal preset for simple data
  MINIMAL: {
    titlePrefix: "Point",
    taskSectionTitle: "Information",
    noDataMessage: "No additional information available",
    debug: false
  }
};

/**
 * Convenience function for TaskComponent
 */
export const createTaskPopup = (dataPoint, index, customOptions = {}) => {
  return createMapPointPopup(dataPoint, index, { ...PopupPresets.TASK, ...customOptions });
};

/**
 * Convenience function for MapComponent
 */
export const createDeliveryPopup = (dataPoint, index, customOptions = {}) => {
  return createMapPointPopup(dataPoint, index, { ...PopupPresets.DELIVERY, ...customOptions });
};

/**
 * Convenience function for MapView
 */
export const createVisitPopup = (dataPoint, index, customOptions = {}) => {
  return createMapPointPopup(dataPoint, index, { ...PopupPresets.VISIT, ...customOptions });
};

export default {
  createMapPointPopup,
  createTaskPopup,
  createDeliveryPopup,
  createVisitPopup,
  PopupPresets
};