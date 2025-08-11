import React from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import UserDetails from "./UserDetails";

const UserDetailsExample = () => {
  const { t } = useTranslation();

  // Example UUIDs (replace with real UUIDs from your system)
  const exampleUUIDs = [
    "12345678-1234-1234-1234-123456789abc",
    "87654321-4321-4321-4321-cba987654321",
    "abcdef12-3456-7890-abcd-ef1234567890"
  ];

  return (
    <div className="override-card">
      <Header className="works-header-view">{t("USER_DETAILS_EXAMPLE")}</Header>
      
      <div style={{ padding: "1rem" }}>
        <h3>Basic Usage:</h3>
        <div style={{ marginBottom: "1rem" }}>
          <UserDetails uuid={exampleUUIDs[0]} />
        </div>

        <h3>Without Icon:</h3>
        <div style={{ marginBottom: "1rem" }}>
          <UserDetails uuid={exampleUUIDs[1]} showIcon={false} />
        </div>

        <h3>Custom Styling:</h3>
        <div style={{ marginBottom: "1rem" }}>
          <UserDetails 
            uuid={exampleUUIDs[2]} 
            style={{ 
              backgroundColor: "#f0f0f0", 
              padding: "8px", 
              borderRadius: "4px" 
            }}
            iconSize="20px"
            tooltipPosition="bottom"
          />
        </div>

        <h3>Invalid UUID:</h3>
        <div style={{ marginBottom: "1rem" }}>
          <UserDetails uuid={null} />
        </div>

        <h3>Empty UUID:</h3>
        <div style={{ marginBottom: "1rem" }}>
          <UserDetails uuid="" />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsExample;
