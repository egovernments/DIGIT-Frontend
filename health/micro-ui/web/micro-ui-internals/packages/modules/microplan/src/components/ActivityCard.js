import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { CardHeader } from "@egovernments/digit-ui-react-components";
import { Card, Tag } from "@egovernments/digit-ui-components";

const ActivityHomeCard = ({onClickCard=()=>{},...props}) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <React.Fragment>
  <div >
  <div className="village-header" >
  {t(props.title)}
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
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
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
                {i.doneLabel && <Tag
                                icon=""
                                label={t(i.doneLabel)}
                                labelStyle={{}}
                                style={{}}
                                type="success"
                              />}
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
