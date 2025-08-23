import React from 'react';
import { FormComposerV2 } from '@egovernments/digit-ui-components';

const CustomFormComposerV2 = (props) => {
  // This is a direct wrapper for the new FormComposerV2 from ui-components
  // No transformation needed as it's already the new component
  return <FormComposerV2 {...props} />;
};

export default CustomFormComposerV2;