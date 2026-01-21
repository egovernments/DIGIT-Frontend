import React from "react";
import { useTranslation } from "react-i18next";
import { CustomSVG } from "@egovernments/digit-ui-components";

const NotificationCard = ({ title, desc, index, onClick, data, icon }) => {
  const { t } = useTranslation();

  // Get the Icon component dynamically
  const IconComponent = CustomSVG[icon];

  return (
    <div
      className={`service-card`}
      style={{ height: "15rem", cursor: "pointer" }}
      key={index}
      onClick={(e) => onClick(index, data)}
    >
      <div className="notif-card-body">
        {IconComponent && (
          <IconComponent
            height="40"
            width="40"
            fill="#C84C0E"
            style={{
              backgroundColor: "beige",
              border: "1px solid beige",
              borderRadius: "5px",
              padding: "3px",
              margin: "6px 0px"
            }}
          />
        )}
        <h3 className="service-title">{t(title)}</h3>
        <p className="service-description">{t(desc)}</p>
      </div>
    </div>
  );
};


export default NotificationCard;