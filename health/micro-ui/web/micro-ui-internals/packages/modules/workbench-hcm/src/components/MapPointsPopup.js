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
      case statusUpper.includes('COMPLETED') || statusUpper.includes('SUCCESS'):
        return { 
          color: "#10b981", 
          text: "COMPLETED", 
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
  
  // Build sections based on available data and options
  const sections = [];
  
  // Resource Stats Section (if quantity or memberCount is available)
  if (quantity > 0 || memberCount > 0) {
    sections.push(`
      <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 10px; padding: 18px; margin-bottom: 18px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h4 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">📊 ${options.resourceTitle || 'Resource Summary'}</h4>
        <div style="display: flex; justify-content: space-around; text-align: center;">
          ${quantity > 0 ? `
            <div>
              <div style="font-size: 32px; font-weight: 900; color: #7c3aed; margin-bottom: 8px; line-height: 1;">
                ${quantity.toLocaleString()}
              </div>
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                ${options.quantityLabel || 'Total Quantity'}
              </div>
            </div>
          ` : ''}
          ${memberCount > 0 ? `
            <div ${quantity > 0 ? 'style="border-left: 2px solid #e2e8f0; padding-left: 18px;"' : ''}>
              <div style="font-size: 32px; font-weight: 900; color: #10b981; margin-bottom: 8px; line-height: 1;">
                ${memberCount.toLocaleString()}
              </div>
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">
                ${options.memberLabel || 'People Served'}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `);
  } else {
    sections.push(`
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; margin-bottom: 18px; text-align: center;">
        <div style="color: #dc2626; font-weight: 600; font-size: 14px;">
          ⚠️ ${options.noDataMessage || 'No resource information available'}
        </div>
      </div>
    `);
  }
  
  // Task Information Section
  const taskFields = [];
  
  // if (taskId !== "N/A") {
  //   taskFields.push(`
  //     <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9fafb;">
  //       <span style="font-weight: 600; color: #6b7280; font-size: 13px;">${options.taskIdLabel || 'Task ID'}:</span>
  //       <span style="color: #374151; font-weight: 600; font-family: monospace; font-size: 12px; background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${taskId}</span>
  //     </div>
  //   `);
  // }
  
  taskFields.push(`
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9fafb;">
      <span style="font-weight: 600; color: #6b7280; font-size: 13px;">${options.statusLabel || 'Status'}:</span>
      <span style="color: ${statusInfo.color}; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 4px;">
        ${statusInfo.icon} ${statusInfo.text}
      </span>
    </div>
  `);
  
  if (taskType !== "Task") {
    taskFields.push(`
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9fafb;">
        <span style="font-weight: 600; color: #6b7280; font-size: 13px;">${options.productLabel || 'Product'}:</span>
        <span style="color: #374151; font-weight: 600; font-size: 13px;">${taskType}</span>
      </div>
    `);
  }
  
  if (quantity > 0) {
    taskFields.push(`
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9fafb;">
        <span style="font-weight: 600; color: #6b7280; font-size: 13px;">${options.quantityLabel || 'Resource Quantity'}:</span>
        <span style="color: #374151; font-weight: 600; font-size: 13px;">${quantity} total</span>
      </div>
    `);
  }
  
  if (deliveredBy !== "Unknown User") {
    taskFields.push(`
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9fafb;">
        <span style="font-weight: 600; color: #6b7280; font-size: 13px;">${options.deliveredByLabel || 'Delivered By'}:</span>
        <span style="color: #374151; font-weight: 600; font-size: 13px;">${deliveredBy}</span>
      </div>
    `);
  }
  
  if (deliveryTime !== "N/A") {
    taskFields.push(`
      <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <span style="font-weight: 600; color: #6b7280; font-size: 13px;">${options.timeLabel || 'Delivery Time'}:</span>
        <span style="color: #374151; font-weight: 500; font-size: 12px;">${deliveryTime}</span>
      </div>
    `);
  }
  
  // Remove the last border-bottom from the last task field
  if (taskFields.length > 0) {
    taskFields[taskFields.length - 1] = taskFields[taskFields.length - 1].replace('border-bottom: 1px solid #f9fafb;', '');
  }
  
  sections.push(`
    <div style="margin-bottom: 18px;">
      <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 3px solid ${statusInfo.color}; padding-bottom: 4px; display: flex; align-items: center; gap: 6px;">
        📋 ${options.taskSectionTitle || 'Task Information'}
      </h4>
      <div style="background: #fefefe; border: 1px solid #f3f4f6; border-radius: 8px; padding: 12px;">
        ${taskFields.join('')}
      </div>
    </div>
  `);
  
  // Location Information Section
  if (location !== "Unknown Location" || (lat !== 0 || lng !== 0)) {
    sections.push(`
      <div style="margin-bottom: 12px;">
        <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 3px solid #7c3aed; padding-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          📍 ${options.locationSectionTitle || 'Location Information'}
        </h4>
        <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 12px;">
          ${location !== "Unknown Location" ? `
            <div style="margin-bottom: 8px;">
              <span style="font-weight: 600; color: #6b46c1;">${options.areaLabel || 'Area'}:</span>
              <span style="color: #374151; margin-left: 8px; font-weight: 500;">${location}</span>
            </div>
          ` : ''}
          <div style="font-size: 13px; color: #6b46c1; font-weight: 600; margin-bottom: 6px;">
            📍 ${options.coordinatesLabel || 'Coordinates'}:
          </div>
          <div style="font-size: 13px; color: #4b5563; font-family: monospace; background: white; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb;">
            ${coords}
          </div>
        </div>
      </div>
    `);
  }
  
  // Build the complete popup HTML
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; max-width: 400px;">
      
      <!-- Header -->
      <div style="background: ${statusInfo.bgGradient}; color: white; padding: 18px; margin: -9px -9px 18px -9px; border-radius: 8px 8px 0 0; box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0; font-size: 20px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 24px;">${statusInfo.icon}</span>
              ${options.titlePrefix || 'Task'} #${pointNumber}
            </h3>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; font-family: monospace; letter-spacing: 0.5px;">
              ${taskId !== "N/A" ? `ID: ${taskId}` : `${taskType} • ${location}`}
            </p>
          </div>
          <div style="background: rgba(255,255,255,0.25); padding: 8px 14px; border-radius: 25px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; text-align: center;">
            ${statusInfo.text}
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div style="padding: 0 14px;">
        ${sections.join('')}
      </div>

      <!-- Footer -->
      <div style="background: #f8fafc; padding: 10px 16px; margin: 14px -9px -9px -9px; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
          <span style="display: flex; align-items: center; gap: 4px;">
            📅 ${new Date().toLocaleDateString()}
          </span>
          <span style="font-weight: 600; background: ${statusInfo.color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px;">
            Point #${pointNumber}
          </span>
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