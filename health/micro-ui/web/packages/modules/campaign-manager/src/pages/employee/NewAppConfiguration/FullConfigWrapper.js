import { useState, useEffect } from "react";
import fullParentConfig from "./configs/fullParentConfig.json";
import AppConfigurationStore from "./AppConfigurationStore";

const FullConfigWrapper = () => {
  const [selectedFlow, setSelectedFlow] = useState("REGISTRATION-DELIVERY");
  const [selectedPageName, setSelectedPageName] = useState("beneficiaryLocation");
  const [addedRoles, setAddedRoles] = useState([]);
  const allRoles = ["ADMIN", "SUPERUSER", "CAMPAIGN_MANAGER", "EMPLOYEE", "AGENT"];

  // Initialize addedRoles on first load
  useEffect(() => {
    const initialFlow = fullParentConfig.flows?.find((f) => f.id === selectedFlow);
    const initialPage = initialFlow?.pages?.find((p) => p.name === selectedPageName);
    if (initialPage?.roles) {
      setAddedRoles(initialPage.roles);
    }
  }, []); // Run only once on mount

  const handleFlowClick = (flow) => {
    setSelectedFlow(flow.id);
    // Set first page as default when flow is clicked
    if (flow.pages && flow.pages.length > 0) {
      setSelectedPageName(flow.pages[0].name);
      setAddedRoles(flow.pages[0].roles || []);
    }
  };

  const handlePageClick = (page) => {
    setSelectedPageName(page.name);
    setSelectedFlow(page.flow);
    // Set addedRoles to current page's roles when page changes
    setAddedRoles(page.roles || []);
  };

  const handleRoleToggle = (role) => {
    if (addedRoles.includes(role)) {
      // Remove role
      setAddedRoles(addedRoles.filter((r) => r !== role));
    } else {
      // Add role
      setAddedRoles([...addedRoles, role]);
    }
  };

  const activeFlow = fullParentConfig.flows?.find((flow) => flow.id === selectedFlow);

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      overflow: "hidden",
    },
    sidebar: {
      position: "absolute",
      left: "3rem",
      top: "9rem",
      width: "250px",
      height: "100vh",
      backgroundColor: "#ffffff",
      borderRight: "1px solid #e0e0e0",
      overflowY: "auto",
      boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
      zIndex: 100,
    },
    sidebarSection: {
      padding: "16px",
      borderBottom: "1px solid #f0f0f0",
    },
    sectionTitle: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#666",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "12px",
    },
    flowItem: {
      padding: "10px 12px",
      marginBottom: "6px",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "14px",
      fontWeight: "500",
    },
    roleItem: {
      padding: "8px 12px",
      marginBottom: "4px",
      borderRadius: "4px",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    checkbox: {
      width: "16px",
      height: "16px",
      cursor: "pointer",
    },
    pageItem: {
      padding: "8px 12px",
      marginBottom: "4px",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "13px",
      paddingLeft: "16px",
    },
    mainContent: {
      marginLeft: "250px",
      flex: 1,
      overflow: "auto",
      backgroundColor: "#f8f9fa",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarSection}>
          <div style={styles.sectionTitle}>Flows</div>
          {fullParentConfig.flows?.map((flow, index) => (
            <div
              key={index}
              style={{
                ...styles.flowItem,
                backgroundColor: selectedFlow === flow.id ? "#e3f2fd" : "transparent",
                color: selectedFlow === flow.id ? "#1976d2" : "#333",
                fontWeight: selectedFlow === flow.id ? "600" : "500",
              }}
              onClick={() => handleFlowClick(flow)}
            >
              {flow.name}
            </div>
          ))}
        </div>

        <div style={styles.sidebarSection}>
          <div style={styles.sectionTitle}>Roles</div>
          {allRoles.map((role, index) => (
            <div
              key={index}
              style={{
                ...styles.roleItem,
                backgroundColor: addedRoles.includes(role) ? "#e8f5e9" : "#f5f5f5",
                color: addedRoles.includes(role) ? "#2e7d32" : "#555",
              }}
              onClick={() => handleRoleToggle(role)}
            >
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={addedRoles.includes(role)}
                onChange={() => handleRoleToggle(role)}
              />
              <span>{role}</span>
            </div>
          ))}
        </div>

        <div style={styles.sidebarSection}>
          <div style={styles.sectionTitle}>Pages</div>
          {activeFlow?.pages?.map((page, index) => (
            <div
              key={index}
              style={{
                ...styles.pageItem,
                backgroundColor: selectedPageName === page.name ? "#e8f5e9" : "transparent",
                color: selectedPageName === page.name ? "#2e7d32" : "#555",
                fontWeight: selectedPageName === page.name ? "600" : "400",
              }}
              onClick={() => handlePageClick(page)}
            >
              {page.name}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.mainContent}>
        <AppConfigurationStore
          flow={selectedFlow}
          pageName={selectedPageName}
          onPageChange={setSelectedPageName}
          addedRoles={addedRoles}
        />
      </div>
    </div>
  );
};

export default FullConfigWrapper;
