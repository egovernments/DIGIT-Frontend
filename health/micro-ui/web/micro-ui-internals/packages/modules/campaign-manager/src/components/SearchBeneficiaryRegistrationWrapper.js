import React, { Fragment } from "react";
import {
  Card,
  CardText,
  TextInput,
  SelectionTag,
  Dropdown,
  CardHeader,
  Button,
  TooltipWrapper,
  AlertCard,
  FieldV1,
  Loader,
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { ProximitySearch, RegistrationComponentRegistry } from "../utils/svgs/registrationFlowSVGs";


const SearchBeneficiaryRegistrationWrapper = ({ components = dummydata, metaMasterConfig, t }) => {
    // Build config map for quick lookup
    const configMap = {};
    metaMasterConfig.forEach((cfg) => {
      configMap[cfg.metadata.format] = cfg.metadata;
    });
  
    return (
      <div className="search-wrapper">
        {components.map((field, index) => {
          const meta = configMap[field.jsonPath];
          if (!meta) return null;
  
          const ComponentToRender = RegistrationComponentRegistry[meta.component];
          if (!ComponentToRender) return null;
  
          return (
            <div key={index} style={{ marginBottom: "16px" }}>
              {/* Render the matched component */}
              {!field.hidden && <ComponentToRender field={field} t={t} />}
            </div>
          );
        })}
      </div>
    );
  };

export default SearchBeneficiaryRegistrationWrapper;
