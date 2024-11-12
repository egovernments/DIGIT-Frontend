import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Card, CardHeader } from "@egovernments/digit-ui-react-components";
import { Card as CardNew } from "@egovernments/digit-ui-components";

const ActivityHomeCard = ({onClickCard=()=>{},...props}) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <React.Fragment>
  <Card className="fsm" style={{ backgroundColor: "transparent", boxShadow: "none", paddingTop: "0",marginRight:"1rem",marginLeft:"1rem" }}>
    <CardHeader> {t(props.title)} </CardHeader>
    <div className="activity-grid"
       >
      {props.module.map((i) => {
        return (
          <CardNew
          className={`activity-card ${i.disable ? "disabled-activity" : ""}`}
            key={i.name} // Always use key when rendering list items
            style={{ 
                minWidth: "100px", 
                cursor: i.disable ? "not-allowed" : "pointer", 
                opacity: i.disable ? 0.8 : 1,  
                backgroundColor:i.disable ? "transparent" : "#FFFFFF",
                // To visually indicate the disabled state
                justifyContent: "center",
                alignItems: "center",
                height: "130px",
              }} // Adding margin to each card
            onClick={() => {
                if (!i.disable) { // Check if disabled
                  onClickCard(i)
                  i.link ? history.push(i.link) : location.assign(i.locate);
                }
              }}
            children={
              <>
                {i.icon} 
                <p className={`activity-card-label ${i.disable ? "disable-label" : ""}`}>{t(i.name)}</p>
              </>
            }
          ></CardNew>
        );
      })}
    </div>
  </Card>
</React.Fragment>
  );
};

export default ActivityHomeCard;
