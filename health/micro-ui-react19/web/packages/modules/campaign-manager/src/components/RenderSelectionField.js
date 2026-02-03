import React from "react";
import { Loader, SelectionTag } from "@egovernments/digit-ui-components";

const RenderSelectionField = ({ field, t }) => {
  const isMdmsEnabled = field?.isMdms && !!field?.schemaCode;

  const { isLoading, data } = Digit?.Hooks.useCustomMDMS(
    Digit?.ULBService?.getStateId(),
    field?.schemaCode?.split(".")[0],
    [{ name: field?.schemaCode?.split(".")[1] }],
    {
      select: (data) => {
        const optionsData = _.get(data, `${field?.schemaCode?.split(".")[0]}.${field?.schemaCode?.split(".")[1]}`, []);
        return optionsData
          .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))
          .map((opt) => ({
            ...opt,
            name: `${Digit.Utils.locale.getTransformedLocale(opt.code)}`,
          }));
      },
      enabled: isMdmsEnabled,
    },
    {
      schemaCode: `SELCTIONTABMDMSLIST_${field?.name}`,
    }
  );

  if (isLoading) return <Loader />;

  const options = field?.isMdms && field?.schemaCode && data ? data : field?.dropDownOptions || [];

  return (
    <SelectionTag
      errorMessage=""
      onSelectionChanged={() => {}}
      schemaCode={field?.isMdms ? field?.schemaCode : null}
      options={options}
      optionsKey={"name"}
      selected={[]}
      withContainer={true}
      populators={{
        t: field?.isMdms ? null : t,
      }}
    />
  );
};

export default RenderSelectionField;
