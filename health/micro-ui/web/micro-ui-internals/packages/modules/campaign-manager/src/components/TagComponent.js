import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Tag } from "@egovernments/digit-ui-components";

const TagComponent = ({campaignName}) => {
  const { t } = useTranslation();
  return (
    <Tag label={campaignName} showIcon={false} className={"campaign-tag"} type={"monochrome"} stroke={true} />
  );
};


export default TagComponent;