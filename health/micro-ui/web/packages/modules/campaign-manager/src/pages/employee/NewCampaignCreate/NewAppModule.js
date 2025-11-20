import { Card, HeaderComponent, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { LOCALIZATION } from "../../../constants/localizationConstants";
import { useNavigate } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import EqualHeightWrapper from "../../../components/CreateCampaignComponents/WrapperModuleCard";

const NewAppModule = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
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

  const handleCardClick = (moduleName) => {
    navigate(
      `/${window.contextPath}/employee/campaign/dummy-loader?campaignNumber=${campaignNumber}&flow=${moduleName}`
    );
  };

  if (isLoading) {
    return <Loader page={true} variant={"OverlayLoader"} loaderText={t(LOCALIZATION.LOADING)} />;
  }

  return (
    <>
      <div>
        <HeaderComponent className="campaign-header-module-style" style={{ marginBottom: "1rem" }}>
          {t(LOCALIZATION.HCM_CHOOSE_MODULE)}
        </HeaderComponent>
      </div>
      <EqualHeightWrapper deps={[mdmsData]}>
        <div className="modules-container">
          {mdmsData?.map((item, index) => (
            <Card
              key={item?.id || index}
              className="module-card"
              onClick={() => handleCardClick(item?.data?.name)}
              style={{ cursor: "pointer" }}
            >
              <HeaderComponent className="detail-header">
                {t(item?.data?.name)}
              </HeaderComponent>
              <hr style={{ border: "1px solid #e0e0e0", width: "100%", margin: "0.5rem 0" }} />
              <p className="module-description">
                {item?.data?.description || t(`MODULE_DESCRIPTION_${item?.data?.name}`)}
              </p>
            </Card>
          ))}
        </div>
      </EqualHeightWrapper>
    </>
  );
};

export default NewAppModule;
