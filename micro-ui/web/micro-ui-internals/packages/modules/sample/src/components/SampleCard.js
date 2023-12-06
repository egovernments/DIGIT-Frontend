import {EmployeeModuleCard} from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SampleCard = () => {
  const { t } = useTranslation();
  const propsForModuleCard = {
    moduleName: t("Sample"),
    kpis: [
    ],
    links: [
      {
        label: t("Sample Components"),
        link: `/${window?.contextPath}/employee/sample/components`,
      }
    ],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SampleCard;