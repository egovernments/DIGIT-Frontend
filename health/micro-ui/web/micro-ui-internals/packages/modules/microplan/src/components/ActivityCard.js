import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { CardHeader, Header, InfoIconOutline } from "@egovernments/digit-ui-react-components";
import { Card, Tag, TooltipWrapper } from "@egovernments/digit-ui-components";

const ActivityHomeCard = ({onClickCard=()=>{},...props}) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <React.Fragment>
  <div >
  <Header styles={{marginBottom:"1rem"}} className="pop-inbox-header">{t(props.title)}</Header>
                <div className="summary-sub-heading" style={{marginBottom:"1.5rem"}}>
                 {`${t("HCM_MICROPLAN_MICROPLAN_NAME_LABEL")}: ${props.microplanName || t("NO_NAME_AVAILABLE")}`}
                </div>
    <div className="activity-grid"
       >
      {props.module.map((i) => {
        return (
          <Card
          className={`activity-card ${i.disable ? "disabled-activity" : ""}`}
            key={i.name} // Always use key when rendering list items
            style={{ 
                minWidth: "100px", 
                cursor: i.disable ? "not-allowed" : "pointer", 
                opacity: i.disable ? 0.8 : 1,  // To visually indicate the disabled state
                // justifyContent: "center",
                 alignItems: "center",
                height: "200px",
                padding: "0px"
              }} // Adding margin to each card
            onClick={() => {
                if (!i.disable) { // Check if disabled
                  onClickCard(i);
                }
              }}
            children={
              <>
              <div className="select-activity-info">
              <TooltipWrapper content={t(`SELECT_ACTIVITY_TOOLTIP_CONTENT_${i.name}`)} placement={"right-start"}>
            <InfoIconOutline width="1.75rem" height="1.75rem" fill="#363636" />
          </TooltipWrapper>
              {i.doneLabel && <Tag
                                icon=""
                                label={t(i.doneLabel)}
                                labelStyle={{}}
                                style={{}}
                                type="success"
                              />}
  </div>
                {i.icon} 
                <p className={`activity-card-label ${i.disable ? "disable-label" : ""}`}>{t(i.name)}</p>
              </>
            }
          ></Card>
        );
      })}
    </div>
  </div>
</React.Fragment>
  );
};

export default ActivityHomeCard;
