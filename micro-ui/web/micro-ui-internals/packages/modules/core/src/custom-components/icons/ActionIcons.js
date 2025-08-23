import React from 'react';

// Import icons from the new SVG components package
import { 
  HamburgerIcon,
  CameraIcon,
  GalleryIcon,
  RemoveIcon,
  LanguageIcon,
  LogoutIcon,
  AddressBookIcon,
  LocationIcon
} from '@egovernments/digit-ui-svg-components';

// Re-export with consistent naming
export const Hamburger = HamburgerIcon;
export { CameraIcon, GalleryIcon, RemoveIcon, LanguageIcon, LogoutIcon, AddressBookIcon, LocationIcon };

// Legacy component wrapper for TopBar compatibility
export const TopBar = ({ children, ...props }) => {
  return (
    <div className="legacy-topbar-wrapper" {...props}>
      {children}
    </div>
  );
};