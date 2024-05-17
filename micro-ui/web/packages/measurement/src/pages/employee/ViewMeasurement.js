import { Header, Card, Loader, WorkflowActions, CardSubHeader } from "@digit-ui/digit-ui-react-components";
import { transformEstimateData } from "../../utils/transformEstimateData";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetails from "../../../../templates/ApplicationDetails";
import MeasurementHistory from "../../components/MBHistoryTable";
import MeasureTable from "../../components/MeasureTable";

const ViewMeasurement = () => {
  const { t } = useTranslation();
  const businessService = Digit?.Customizations?.["commonUiConfig"]?.getBusinessService("measurement");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { workOrderNumber, mbNumber } = Digit.Hooks.useQueryParams();
  const [loading, setLoading] = useState(true);
  const [viewData, setViewData] = useState({ SOR: [], NONSOR: [] });
  const body = {
    contractNumber: workOrderNumber,
    tenantId: tenantId,
    measurementNumber: mbNumber,
  };
  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.measurement.useViewMeasurement(tenantId, body);

  const projectDetails = { applicationDetails: [applicationDetails?.applicationDetails?.applicationDetails[0]] };
  const imageDetails = { applicationDetails: [applicationDetails?.applicationDetails?.applicationDetails[2]] };

  const measures = applicationDetails?.applicationData?.measurements[0];
  const data = applicationDetails?.applicationData;

  const estimateDetails = data?.estimate[0]?.estimateDetails || [];

  useEffect(() => {
    const processArrays = () => {
      if (data) {
        setViewData({
          SOR: transformEstimateData(estimateDetails, data?.contracts[0], "SOR", measures),
          NONSOR: transformEstimateData(estimateDetails, data?.contracts[0], "NON-SOR", measures),
        });
        setLoading(false);
      }
    };
    processArrays();
  }, [data]);

  if (loading || isLoading) {
    return <Loader />;
  }
  return (
    <React.Fragment>
      <Header className="works-header-view">{t("MB_VIEW_MEASUREMENT_BOOK")}</Header>
      <ApplicationDetails
        applicationDetails={projectDetails}
        isLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        moduleCode="measurements"
        workflowDetails={applicationDetails?.workflowDetails}
        mutate={() => {}}
        tenantId={tenantId}
        showTimeLine={false}
      />

      <MeasurementHistory contractNumber={workOrderNumber} measurementNumber={mbNumber} />
      <Card className="override-card">
        <CardSubHeader>{t("MB_SORS")}</CardSubHeader>
        <MeasureTable
          config={{
            key: "SOR",
            mode: "VIEW",
          }}
          register={() => {}}
          setValue={(key, value) => setViewData((old) => ({ ...old, SOR: value }))}
          arrayProps={{ fields: viewData?.SOR }}
          mode="VIEW"
        />
      </Card>
      <Card className="override-card">
        <CardSubHeader>{t("MB_NONSOR")}</CardSubHeader>
        <MeasureTable
          config={{
            key: "NONSOR",
            mode: "VIEW",
          }}
          register={() => {}}
          setValue={(key, value) => setViewData((old) => ({ ...old, NONSOR: value }))}
          arrayProps={{ fields: viewData?.NONSOR }}
        />
      </Card>
      <ApplicationDetails
        applicationDetails={imageDetails}
        isLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        moduleCode="measurements"
        workflowDetails={applicationDetails?.workflowDetails}
        mutate={() => {}}
        tenantId={tenantId}
        showTimeLine={false}
      />
      <ApplicationDetails
        isLoading={isLoading}
        applicationData={applicationDetails?.applicationData?.measurements}
        moduleCode="measurements"
        timelineStatusPrefix={`WF_${businessService}_`}
        businessService={businessService}
        tenantId={tenantId}
        showTimeLine={true}
        applicationNo={mbNumber}
      />
      <WorkflowActions
        forcedActionPrefix={`WF_${businessService}_ACTION`}
        businessService={businessService}
        applicationNo={mbNumber}
        tenantId={tenantId}
        applicationDetails={applicationDetails?.applicationData?.measurements}
        url={Digit.Utils.Urls.measurement.update}
        // setStateChanged={setStateChanged}
        moduleCode="measurements"
        // editApplicationNumber={editApplicationNumber}
      />
    </React.Fragment>
  );
};

export default ViewMeasurement;