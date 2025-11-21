import { Card, HeaderComponent, Loader, SVG, Button, Footer } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import EqualHeightWrapper from "../../../components/CreateCampaignComponents/WrapperModuleCard";

const NewAppModule = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const projectType = searchParams.get("projectType");
  const tenantId = searchParams.get("tenantId");

  const schemaCode = `${CONSOLE_MDMS_MODULENAME}.NewApkConfig`;
  const { isLoading, data: mdmsData } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV2Criteria(
      tenantId,
      schemaCode,
      {
        project: campaignNumber,
      },
      `MDMSDATA-${schemaCode}-${campaignNumber}`,
      {
        enabled: !!campaignNumber,
        cacheTime: 0,
        staleTime: 0,
      }
    )
  );

  // Sort mdmsData by order
  const sortedMdmsData = mdmsData?.slice().sort((a, b) => {
    const orderA = a?.data?.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b?.data?.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  const handleCardClick = (moduleName) => {
    navigate(`/${window.contextPath}/employee/campaign/dummy-loader?campaignNumber=${campaignNumber}&flow=${moduleName}`);
  };


  if (isLoading) {
    return <Loader page={true} variant={"OverlayLoader"} loaderText={t("LOADING")} />;
  }

  return (
    <>
      <div>
        <HeaderComponent className="campaign-header-module-style" style={{ marginBottom: "1rem" }}>
          {t(`HCM_CHOOSE_MODULE`)}
        </HeaderComponent>
      </div>
      <EqualHeightWrapper deps={[sortedMdmsData]}>
        <div className="modules-container">
          {sortedMdmsData?.map((item, index) => {
            const isActive = item?.data?.active === true;

            return (
              <Card
                key={item?.id || index}
                className={`module-card ${isActive ? 'selected-card' : ''}`}
                onClick={() => {
                  if (isActive) {
                    handleCardClick(item?.data?.name);
                  }
                }}
                style={{
                  cursor: "pointer",
                  position: 'relative'
                }}
              >
                {/* {isActive && (
                  <SVG.CheckCircle
                    fill={"#00703C"}
                    width={"3rem"}
                    height={"3rem"}
                    style={{
                      position: "absolute",
                      left: "-10px",
                      top: "-14px",
                    }}
                  />
                )} */}
                <HeaderComponent className={`detail-header ${isActive ? 'selected-header' : ''}`}>
                  {t(item?.data?.name)}
                </HeaderComponent>
                <hr style={{ border: "1px solid #e0e0e0", width: "100%", margin: "0.5rem 0" }} />
                <p className="module-description">
                  {item?.data?.description || t(`MODULE_DESCRIPTION_${item?.data?.name}`)}
                </p>

                <Button
                  type="button"
                  size="medium"
                  variation={isActive ? "primary" : "secondary"}
                  label={isActive ? t("CONFIGURE_MODULE") : t("UPCOMING_MODULE")}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    if (isActive) {
                      // Handle button click for allowed modules
                      handleCardClick(item?.data?.name);
                    }
                  }}
                  isDisabled={!isActive}
                  style={{
                    marginTop: "1rem",
                    width: "100%"
                  }}
                />
              </Card>
            );
          })}
        </div>
      </EqualHeightWrapper>
    </>
  );
};

export default NewAppModule;