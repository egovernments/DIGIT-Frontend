import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Card, CardHeader } from "@egovernments/digit-ui-react-components";

const ActivityHomeCard = ({onClickCard=()=>{},...props}) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <React.Fragment>
  <Card className="fsm" style={{ backgroundColor: "transparent", boxShadow: "none", paddingTop: "0" }}>
    <CardHeader> {t(props.title)} </CardHeader>
    <div style={{ display: "grid", gridTemplateColumns: "33.3% 33.3% 33.3%", textAlign: "-webkit-center", gap: "10px" }}>
      {props.module.map((i) => {
        return (
          <Card
            key={i.name} // Always use key when rendering list items
            style={{ 
                minWidth: "100px", 
                cursor: i.disable ? "not-allowed" : "pointer", 
                opacity: i.disable ? 0.6 : 1,  // To visually indicate the disabled state
                margin: "10px" 
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
                <p>{t(i.name)}</p>
              </>
            }
          ></Card>
        );
      })}
    </div>
  </Card>
</React.Fragment>
  );
};

export default ActivityHomeCard;
