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
    <MenuCard
      icon={field?.icon || field?.properties?.icon || "ShippingTruck"}
      menuName={t(field?.heading) || t(field.label)} 
      description={t(field?.description)} // MenuCard uses description prop
      onClick={() => {}}
      className={`menu-card-template ${fieldName || ""} ${customClassName || ""} ${disabled ? "disabled" : ""}`}
      styles={styles}
      // Note: MenuCard component handles translation internally,
      // so we pass the keys directly without t() wrapper
    />
  );
};

export default MenuCardTemplate;