import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Dropdown } from "@egovernments/digit-ui-components";

// HACK: This wrapper renders the Dropdown trigger as usual, but renders the dropdown menu in a portal (document.body),
// so the menu is not clipped or scrolled inside modals/popups. Use as a drop-in replacement for Dropdown.

const PortalDropdown = (props) => {
  const [menu, setMenu] = useState(null);
  const triggerRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  // This assumes Dropdown renders its menu as a sibling or child of the trigger.
  // We will use a MutationObserver to move the menu to a portal when it appears.
  useEffect(() => {
    if (!menuOpen) return;
    // Find the menu DOM node after Dropdown opens it
    const dropdownNode = triggerRef.current?.parentNode;
    if (!dropdownNode) return;
    // Look for a menu element (by class or role)
    const menuEl = dropdownNode.querySelector(".digit-dropdown-menu, [role='listbox']");
    if (menuEl) {
      setMenu(menuEl);
    }
  }, [menuOpen]);

  // Move menu to portal when found
  useEffect(() => {
    if (!menu) return;
    const portal = document.createElement("div");
    portal.style.position = "absolute";
    portal.style.zIndex = 9999;
    document.body.appendChild(portal);
    portal.appendChild(menu);
    return () => {
      if (portal.contains(menu)) portal.removeChild(menu);
      document.body.removeChild(portal);
    };
  }, [menu]);

  // Listen for open/close
  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);

  // Pass ref and open/close handlers to Dropdown
  return (
    <div ref={triggerRef}>
      <Dropdown
        {...props}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
      />
    </div>
  );
};

export default PortalDropdown; 