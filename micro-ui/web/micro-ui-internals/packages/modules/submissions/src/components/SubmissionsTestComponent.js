import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SubmissionsComponent = (props) => {
  const [data, updateData] = useState({});
  const { t } = useTranslation();
  useEffect(() => {
    updateData(props?.formData || {});
  }, [props, props?.formData]);
  return (
    <div>
      <h3>View Entered Data(SubmissionsComponent)</h3>
      <div className="submissions-component-style">
        {Object.keys(data).map((key) => {
          return (
            data?.[key] && (
              <div>
                {key} : {JSON.stringify(data?.[key])}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionsComponent;