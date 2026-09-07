import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Tag } from "@egovernments/digit-ui-components";

const TagComponent = ({campaignName , type = "monochrome" , icon="" , showIcon = false}) => {
  const { t } = useTranslation();
  // Without a name the tag renders as an empty pill; skip it entirely
  if (!campaignName || !String(campaignName).trim()) {
    return null;
  }
  return (
    <Tag label={campaignName} showIcon={showIcon} className={"campaign-tag"} type={type} stroke={true} icon={icon} />
  );
};


export default TagComponent;