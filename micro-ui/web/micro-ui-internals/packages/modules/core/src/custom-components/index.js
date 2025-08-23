// Custom Components Index
// Migration from @egovernments/digit-ui-react-components to @egovernments/digit-ui-components

// Form Components
export { default as CustomFormComposer } from './forms/CustomFormComposer';
export { default as CustomFormStep } from './forms/CustomFormStep';
export { default as CustomCardLabel } from './forms/CustomCardLabel';
export { default as CustomCardLabelError } from './forms/CustomCardLabelError';
export { default as CustomTextInput } from './forms/CustomTextInput';
export { default as CustomDropdown } from './forms/CustomDropdown';
export { default as CustomOTPInput } from './forms/CustomOTPInput';
export { default as CustomPageBasedInput } from './forms/CustomPageBasedInput';
export { default as CustomSearchOnRadioButtons } from './forms/CustomSearchOnRadioButtons';

// Layout Components  
export { default as CustomHeader } from './layout/CustomHeader';
export { default as CustomTopBar } from './layout/CustomTopBar';
export { default as CustomCard } from './layout/CustomCard';
export { default as CustomButton } from './layout/CustomButton';
export { default as CustomLinkButton } from './layout/CustomLinkButton';

// Data Display Components
export { default as CustomCitizenInfoLabel } from './display/CustomCitizenInfoLabel';
export { default as CustomActionBar } from './display/CustomActionBar';
export { default as CustomSubmitBar } from './display/CustomSubmitBar';
export { default as CustomLoader } from './display/CustomLoader';
export { default as CustomTable } from './display/CustomTable';
export { default as CustomCardHeader } from './display/CustomCardHeader';
export { default as CustomCardSubHeader } from './display/CustomCardSubHeader';
export { default as CustomCardText } from './display/CustomCardText';

// Icon Components
export * from './icons/ModuleIcons';
export * from './icons/NavigationIcons';
export * from './icons/ActionIcons';

// Specialized Components
export { default as CustomFileUploadModal } from './specialized/CustomFileUploadModal';
export { default as CustomFormComposerV2 } from './specialized/CustomFormComposerV2';

// Legacy component aliases for backward compatibility
export { CustomButton as Button } from './layout/CustomButton';
export { CustomCard as Card } from './layout/CustomCard';
export { CustomLoader as Loader } from './display/CustomLoader';
export { CustomTable as Table } from './display/CustomTable';
export { CustomFormComposer as FormComposer } from './forms/CustomFormComposer';
export { CustomFormComposerV2 as FormComposerV2 } from './specialized/CustomFormComposerV2';
export { CustomOTPInput as OTPInput } from './forms/CustomOTPInput';
export { CustomTextInput as TextInput } from './forms/CustomTextInput';
export { CustomDropdown as Dropdown } from './forms/CustomDropdown';
export { CustomCardText as CardText } from './display/CustomCardText';
export { CustomCardHeader as CardHeader } from './display/CustomCardHeader';
export { CustomCardSubHeader as CardSubHeader } from './display/CustomCardSubHeader';
export { CustomLinkButton as LinkButton } from './layout/CustomLinkButton';
export { CustomPageBasedInput as PageBasedInput } from './forms/CustomPageBasedInput';
export { CustomSearchOnRadioButtons as SearchOnRadioButtons } from './forms/CustomSearchOnRadioButtons';