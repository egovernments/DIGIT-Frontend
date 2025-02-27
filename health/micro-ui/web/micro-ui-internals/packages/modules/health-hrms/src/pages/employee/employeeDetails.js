import React from "react";
import {
  ActionBar,
  Card,
  CardSubHeader,
  DocumentSVG,
  Header,
  Loader,
  Menu,
  Row,
  StatusTable,
  SubmitBar,
  Toast
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const EmployeeDetailScreen = () => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <div
        style={
          false
            ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" }
            : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
        }
      >
        <Header>{t("HR_NEW_EMPLOYEE_FORM_HEADER")}</Header>
      </div>
      {true ? (
        <div>
          <Card>
            <StatusTable>
              <Row
                label={<CardSubHeader className="card-section-header">{t("HR_EMP_STATUS_LABEL")} </CardSubHeader>}
                text={
                  true ? (
                    <div className="sla-cell-success"> {t("ACTIVE")} </div>
                  ) : (
                    <div className="sla-cell-error">{t("INACTIVE")}</div>
                  )
                }
                textStyle={{ fontWeight: "bold", maxWidth: "6.5rem" }}
              />
            </StatusTable>
            <CardSubHeader className="card-section-header">{t("HR_LOGIN_FORM_HEADER")} </CardSubHeader>
            <StatusTable>
              <Row label={t("HR_USERNAME_LABEL")} text={ "NA"} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("HR_PASSWORD_LABEL")} text="******" textStyle={{ whiteSpace: "pre" }} />
              {/*Digit.UserService.hasAccess("SUPERUSER") ? (
                <button className="card-text-button" onClick={() => handlePasswordReset()}>
                  {t("HR_RESET_PASSWORD")}
                </button>
              ) : null*/}
            </StatusTable>

            
           
           

            
           

            
            
           

           
          </Card>
        </div>
      ) : null}
     
    </React.Fragment>
  );
};

export default EmployeeDetailScreen;
