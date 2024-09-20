import React from "react";
import { useTranslation } from "react-i18next";
import { CardText, Card, CardHeader, LinkLabel } from "@egovernments/digit-ui-components";
import { Link } from "react-router-dom";

const QuickSetupComponent = ({ config }) => {
  const { t } = useTranslation();

  return (
    <Card>
      {config.map((section, sectionIndex) => (
        <React.Fragment key={sectionIndex}>
          <CardHeader>{t(section.sectionHeader)}</CardHeader>
          {section.sections && section.sections.map((item, itemIndex) => (
            <CardText key={itemIndex}>{t(item.label)}</CardText>
          ))}
          {section.links && Object.values(section.links).map((linkGroup, linkIndex) => (
            <div key={linkIndex}>
              <CardText>{t(linkGroup.description)}</CardText>
              {linkGroup.links.map((link, linkItemIndex) => (
                <div key={linkItemIndex}>
                  <Link to={{ pathname: link.link, search: link.queryParams }} className="quickLink">
                    {t(link.label)}
                  </Link>
                  <CardText>{t(link.description)}</CardText>
                </div>
              ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </Card>
  );
};

export default QuickSetupComponent;
