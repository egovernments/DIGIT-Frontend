import React, { Fragment,useEffect,useState } from "react";
import CheckBox from "../atoms/CheckBox";
import { Loader } from "../atoms";
import CardLabel from "../atoms/CardLabel";

const WorkflowStatusFilter = ({ props, t, populators, formData,inboxResponse,disabled }) => {
  //from inbox response get the statusMap and show the relevant statuses
  //here need to filter these options based on logged in user(and test based on single roles in every inbox)(new requirement from vasanth)

  // Support both old format (props.onChange) and new format (props.field.onChange)
  const field = props?.field || props;

  const [statusMap,setStatusMap] = useState(null)

  useEffect(() => {
    if(inboxResponse) {
      setStatusMap(inboxResponse.statusMap?.map(row => {
       return {
         uuid:row.statusid,
         state: row.state || row.applicationstatus,
         businessService:row?.businessservice
       }
      }))
    }
  }, [inboxResponse])


  if (!statusMap && !inboxResponse) return <Loader />;

  return (
    <>
      {statusMap && statusMap.length > 0 && populators?.componentLabel && (
        <CardLabel style={{ ...props.labelStyle}}>
          {t(populators?.componentLabel)}
          {populators?.isMandatory ? " * " : null}
        </CardLabel>
      )}
      {statusMap?.map((row) => {
        return (
          <CheckBox
            onChange={(e) => {
              const obj = {
                ...field?.value,
                [e.target.value]: e.target.checked,
              };
              field?.onChange?.(obj);
            }}
            value={row.uuid}
            checked={formData?.[populators.name]?.[row.uuid]}
            label={t(
              Digit.Utils.locale.getTransformedLocale(
                `${populators.labelPrefix}${row?.businessService}_STATE_${row?.state}`
              )
            )}
            isIntermediate={populators?.isIntermediate}
            styles={populators?.styles}
            style={populators?.labelStyles}
            disabled={disabled}
            isLabelFirst={populators?.isLabelFirst}
            removeMargin={populators?.removeMargin}
          />
        );
      })}
    </>
  );
};

export default WorkflowStatusFilter;
