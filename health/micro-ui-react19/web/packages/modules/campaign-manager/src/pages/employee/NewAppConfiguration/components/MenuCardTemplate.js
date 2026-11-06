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

  // The config can lay the card out through `styling`: the icon above the heading instead of
  // beside it, and the text centred. Turned into classes the stylesheet acts on, so a card
  // that declares no styling keeps the library's default row layout.
  const { alignment, iconPosition } = field?.styling || {};
  const stylingClassName = [iconPosition ? `menu-card-icon-${iconPosition}` : "", alignment ? `menu-card-align-${alignment}` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <MenuCard
      icon={field?.icon || field?.properties?.icon || "ShippingTruck"}
      menuName={t(field?.heading) || t(field.label)} 
      description={t(field?.description)} // MenuCard uses description prop
      onClick={() => {}}
      className={`menu-card-template ${fieldName || ""} ${customClassName || ""} ${stylingClassName} ${disabled ? "disabled" : ""}`}
      styles={styles}
      // Note: MenuCard component handles translation internally,
      // so we pass the keys directly without t() wrapper
    />
  );
};

export default MenuCardTemplate;