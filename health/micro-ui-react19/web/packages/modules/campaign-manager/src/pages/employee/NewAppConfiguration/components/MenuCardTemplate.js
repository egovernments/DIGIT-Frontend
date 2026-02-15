import React from "react";
import { MenuCard } from "@egovernments/digit-ui-components";

/**
 * MenuCardTemplate Component
 * Renders a menu card with icon, heading, description and handles click actions
 */
const MenuCardTemplate = ({ field, t, fieldTypeMasterData }) => {
  const {
    icon,
    heading,
    description,
    onAction,
    properties = {},
    fieldName,
    disabled = false,
    hidden = false
  } = field;

  // Don't render if hidden
  if (hidden) return null;



  // Extract custom styles if provided
  const { styles, className: customClassName, ...otherProps } = properties;

  return (
    <div className="menu-card-template-wrapper">
      <style>{`
        .menu-card-template-wrapper .icon-menu-header {
          padding: 0;
          margin: 0;
        }
        .menu-card-template-wrapper .digit-menucard-description {
          padding: 0;
          margin: 0;
        }
        .menu-card-template-wrapper .digit-menucard-icon {
          flex-shrink: 0;
        }
      `}</style>
      <MenuCard
        icon={field?.icon || field?.properties?.icon || "ShippingTruck"}
        menuName={t(field?.heading) || t(field.label)}
        description={t(field?.description)}
        onClick={() => {}}
        className={`menu-card-template ${fieldName || ""} ${customClassName || ""} ${disabled ? "disabled" : ""}`}
        styles={styles}
      />
    </div>
  );
};

export default MenuCardTemplate;