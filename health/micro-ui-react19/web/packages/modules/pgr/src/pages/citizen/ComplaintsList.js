import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Card, Header, Loader } from "@egovernments/digit-ui-react-components";
import { LOCALE } from "../../constants/Localization";

// Complaint row component — inline since it's simple enough not to need a separate file
const ComplaintRow = ({ service, path }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <div className="complaint-row">
        <span>{t(`SERVICEDEFS.${service.serviceCode?.toUpperCase()}`)}</span>
        <span className={`pgr-status pgr-status--${service.applicationStatus?.toLowerCase()}`}>
          {t(`CS_COMMON_${service.applicationStatus}`)}
        </span>
        <span>{service.serviceRequestId}</span>
      </div>
    </Card>
  );
};

export const ComplaintsList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const User = Digit.UserService.getUser();
  const mobileNumber = User.mobileNumber || User?.info?.mobileNumber || User?.info?.userInfo?.mobileNumber;
  const tenantId = Digit.Utils.getMultiRootTenant?.()
    ? Digit.ULBService.getStateId()
    : Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();

  const { isLoading, error, data, revalidate } = Digit.Hooks.pgr?.useComplaintsListByMobile?.(tenantId, mobileNumber) || {};

  useEffect(() => {
    revalidate?.();
  }, []);

  if (isLoading) {
    return (
      <>
        <Header>{t(LOCALE.MY_COMPLAINTS)}</Header>
        <Loader />
      </>
    );
  }

  const complaints = data?.ServiceWrappers;

  let complaintsList;
  if (error) {
    complaintsList = <Card><p style={{ textAlign: "center" }}>{t("CS_COMMON_SOMETHING_WENT_WRONG")}</p></Card>;
  } else if (!complaints || complaints.length === 0) {
    complaintsList = <Card><p style={{ textAlign: "center" }}>{t(LOCALE.NO_COMPLAINTS)}</p></Card>;
  } else {
    complaintsList = complaints.map(({ service }, index) => (
      <ComplaintRow key={index} service={service} path={location.pathname.replace("/complaints", "")} />
    ));
  }

  return (
    <div className="applications-list-container">
      <Header>{t(LOCALE.MY_COMPLAINTS)}</Header>
      {complaintsList}
    </div>
  );
};
