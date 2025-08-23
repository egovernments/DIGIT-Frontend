import React from 'react';
import { FormComposerV2 } from '@egovernments/digit-ui-components';

const CustomFormComposer = (props) => {
  // Legacy FormComposer wrapper - maps old props to new FormComposerV2
  const {
    config,
    onSubmit,
    defaultValues,
    isDisabled,
    cardStyle,
    inline,
    label,
    ...rest
  } = props;

  // Transform legacy config to new format if needed
  const transformedConfig = config ? (Array.isArray(config) ? config : [config]) : [];
  
  return (
    <FormComposerV2
      config={transformedConfig}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      isDisabled={isDisabled}
      cardStyle={cardStyle}
      inline={inline}
      label={label}
      {...rest}
    />
  );
};

export default CustomFormComposer;