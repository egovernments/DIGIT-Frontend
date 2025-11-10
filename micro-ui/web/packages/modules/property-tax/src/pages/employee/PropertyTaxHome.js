import React, { useEffect, useState } from "react";
import { Header } from "@egovernments/digit-ui-react-components";
import { Card, CardText, Loader} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";

const PropertyTaxHome = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [numProperties, setNumProperties] = useState(0);
  const [numDrafts, setNumDrafts] = useState(0);
  const [numFailedPayments, setNumFailedPayments] = useState(0);

  const user = Digit.UserService.getUser();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Fetch property data on mount
  useEffect(() => {
    const fetchPropertiesData = async () => {
      setLoading(true);
      try {
        if (user?.info?.uuid) {
          // Fetch user properties
          const propertiesResponse = await Digit.PropertyService.search(
            tenantId,
            { accountId: user.info.uuid },
            {}
          );
          setNumProperties(propertiesResponse?.Properties?.length || 0);

          // Fetch drafts
          const draftsResponse = await Digit.PropertyService.getDrafts(
            tenantId,
            { userId: user.info.uuid, isActive: true, limit: 100 }
          );
          setNumDrafts(draftsResponse?.drafts?.length || 0);

          // Fetch failed payments
          const failedPaymentsResponse = await Digit.PaymentService.search(
            tenantId,
            { userUuid: user.info.uuid, txnStatus: "FAILURE" }
          );
          setNumFailedPayments(failedPaymentsResponse?.Payments?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching properties data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertiesData();
  }, [user?.info?.uuid, tenantId]);

  // Add breadcrumbs
  useEffect(() => {
    const pathname = location.pathname;
    const url = pathname && pathname.split("/").pop();
    if (url === "property-tax") {
      Digit.SessionStorage.set("BPA_BREADCRUMB", [{ title: "", path: "" }]);
    }
  }, [location.pathname]);

  const cardItems = [
    {
      label: t("PT_COLLECT_PAYMENT"),
      Icon: () => (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="#fe7a51">
          <path d="M12 3L2 12H5V20H9V14H15V20H19V12H22L12 3Z" />
        </svg>
      ),
      subText: t("PT_COLLECT_PAYMENT_SUBLABEL"),
      route: `/${window.contextPath}/employee/property-tax/search-property`,
    },
    {
      label: t("PT_NEW_PROPERTY_ASSESSMENT"),
      Icon: () => (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="#fe7a51">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      ),
      subText: t("PT_NEW_PROPERTY_ASSESSMENT_SUBLABEL"),
      route: `/${window.contextPath}/employee/property-tax/new-application`,
    },
    {
      label: t("PT_ASSESS_PROPERTY"),
      Icon: () => (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="#fe7a51">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      subText: t("PT_ASSESS_PROPERTY_SUBLABEL"),
      route: `/${window.contextPath}/employee/pt/search-property?mode=assess`,
    },
    {
      label: t("PT_REASSESS_PROPERTY"),
      Icon: () => (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="#fe7a51">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
      ),
      subText: t("PT_REASSESS_PROPERTY_SUBLABEL"),
      route: `/${window.contextPath}/employee/pt/search-property?mode=reassess`,
    },
  ];

  const navigationItems = [
    {
      text: t("PT_HOW_IT_WORKS"),
      link: `/${window.contextPath}/employee/pt/how-it-works`,
    },
    {
      text: t("PT_EXAMPLE"),
      link: `/${window.contextPath}/employee/pt/examples`,
    },
    {
      text: t("PT_HELP"),
      link: `/${window.contextPath}/employee/pt/help`,
    },
  ];

  const handleCardClick = (route) => {
    history.push(route);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="ground-container">
      <div className="page-header">
        <Header>{t("PT_PROPERTY_TAX")}</Header>
      </div>

      <div className="property-tax-home-container">
        {/* Main Action Cards */}
        <div className="action-cards-container">
          {cardItems.map((item, index) => (
            <Card
              key={index}
              className="property-tax-action-card cursor-pointer"
              onClick={() => handleCardClick(item.route)}
            >
              <div className="action-card-content">
                <div className="card-icon">
                  <item.Icon />
                </div>
                <div className="card-text">
                  <h3 className="card-label">{item.label}</h3>
                  <p className="card-sublabel">{item.subText}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Statistics Section */}
        {(numProperties > 0 || numDrafts > 0 || numFailedPayments > 0) && (
          <Card className="property-tax-stats-card">
            <CardText className="card-header-text">{t("PT_QUICK_STATS")}</CardText>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">{numProperties}</span>
                <span className="stat-label">{t("PT_TOTAL_PROPERTIES")}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{numDrafts}</span>
                <span className="stat-label">{t("PT_DRAFT_APPLICATIONS")}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{numFailedPayments}</span>
                <span className="stat-label">{t("PT_FAILED_PAYMENTS")}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Information Section */}
        <Card className="property-tax-info-card">
          <CardText className="card-header-text">{t("PT_INFORMATION")}</CardText>
          <div className="navigation-items">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className="navigation-item cursor-pointer"
                onClick={() => handleCardClick(item.link)}
              >
                <span className="nav-text">{item.text}</span>
                <span className="nav-arrow">→</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Drafts and Failed Payments Section */}
        {(numDrafts > 0 || numFailedPayments > 0) && (
          <Card className="property-tax-actions-card">
            <CardText className="card-header-text">{t("PT_PENDING_ACTIONS")}</CardText>
            <div className="pending-actions">
              {numDrafts > 0 && (
                <div
                  className="action-item cursor-pointer"
                  onClick={() => handleCardClick(`/${window.contextPath}/employee/property-tax/drafts`)}
                >
                  <span className="action-text">{t("PT_VIEW_DRAFT_APPLICATIONS")} ({numDrafts})</span>
                  <span className="action-arrow">→</span>
                </div>
              )}
              {numFailedPayments > 0 && (
                <div
                  className="action-item cursor-pointer"
                  onClick={() => handleCardClick(`/${window.contextPath}/employee/property-tax/failed-payments`)}
                >
                  <span className="action-text">{t("PT_RETRY_FAILED_PAYMENTS")} ({numFailedPayments})</span>
                  <span className="action-arrow">→</span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PropertyTaxHome;