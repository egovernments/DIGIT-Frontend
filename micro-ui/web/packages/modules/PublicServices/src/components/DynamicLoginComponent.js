import { TextBlock, LinkLabel } from "@egovernments/digit-ui-components";
import { Card } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const DynamicLoginComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    const div1 = document.querySelector("#user-login-form");
    const div2 = document.querySelector(".citizen-linking-card");

    if (!div1 || !div2) return;

    const applyWidth = () => {
      div2.style.width = div1.offsetWidth + "px";
    };

    applyWidth();
    window.addEventListener("resize", applyWidth);

    return () => window.removeEventListener("resize", applyWidth);
  }, []);

  return (
    <Card className="citizen-linking-card" style={{...styles.card, boxShadow: "none"}} ref={cardRef}>
      <div style={styles.content}>
        <TextBlock
          className="typography heading-m"
          body={t("CS_NOT_EMPLOYEE")}
        />
        <div style={styles.linksContainer}>
          <LinkLabel
            style={styles.link}
            onClick={() =>
              navigate(`/${window.contextPath}/citizen/login`)
            }
          >
            {t("CS_CLICK_HERE")}
          </LinkLabel>
        </div>
      </div>
    </Card>
  );
};

const styles = {
  card: {
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    marginTop: "-1rem",
    width: "max-content",
    textAlign: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  linksContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.25rem",
  },
  link: {
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default DynamicLoginComponent;