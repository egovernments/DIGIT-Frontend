import React, { useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, Tab, CheckBox, Card, Toast, TextInput, LabelFieldPair } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./tableCustomStyle";
import { CustomSVG } from "@egovernments/digit-ui-components";
import TimelinePopUpWrapper from "./timelinePopUpWrapper";

const CustomizeAssumptionsPopup = ({selectedBusinessId,setShowTimelinePopup,setSelectedBusinessId,showTimelinePopup,onTimelinePopupClose,onClose,data,columns ,selectedBoundaryCode,setSelectedBoundaryCode}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { microplanId, campaignId } = Digit.Hooks.useQueryParams();
  const [showToast, setShowToast] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [disabledAction, setDisabledAction] = useState(false);
  const [disableApplyAction, setDisableApplyAction] = useState(true);
  const { isLoading: isLoadingPlanObject, data: planObject, error: errorPlan, refetch: refetchPlan } = Digit.Hooks.microplanv1.useSearchPlanConfig(
    {
      PlanConfigurationSearchCriteria: {
        tenantId,
        id: microplanId,
      },
    },
    {
      enabled: microplanId ? true : false,
      cacheTime: 0,
      //   queryKey: currentKey,
    }
  );
  const initialConfirmedValues = planObject?.assumptions?.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {}) || {};  
  const [confirmedValues, setConfirmedValues] = useState(initialConfirmedValues);
  
  console.log(planObject, "planObject");

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const groupedDataForAssumptions = planObject?.assumptions?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const onConfirm = () => {
    console.log("Confirmed");
  };

  const handleInputChange = (fieldKey, value) => {
        // Validation function for range and decimal places
        const isValidValue = (value) => {
          const numericValue = parseFloat(value);
          return (
            numericValue > 0 &&
            numericValue <= 1000 &&
            /^[0-9]+(\.[0-9]{1,2})?$/.test(value) // Check for at most 2 decimals
          );
        };

          // Determine the updated state
  const updatedValues = isValidValue(value)
  ? { ...confirmedValues, [fieldKey]: Number(value) }
  : {...confirmedValues};

setConfirmedValues(updatedValues);
setDisableApplyAction(false);
  };

  console.log(confirmedValues, "confirmedValues");


  const onApply = () => {
    if(JSON.stringify(confirmedValues) === JSON.stringify(initialConfirmedValues)){
      setShowToast({ key: "error", label: t("VALUES_CANNOT_BE_SAME_AS_BEFORE"), transitionTime: 5000 });
    }
    else{
      // CALL THE API HERE
      console.log(confirmedValues,"Confirmed Values")
    }
  };

  return (
    <>
      {(
        <PopUp
          onClose={onClose}
          heading={`${t(`CUSTOMIZE_ASSUMPTIONS_FOR_SELECTED_VILLAGES`)}`}
          children={[
            <div className="facilitypopup-serach-results-wrapper">
              {
                <Card className="fac-middle-child" style={{ margin: "0rem", padding: "1.5rem" }}>
                  {/*need to add kapis*/}
                </Card>
              }
              <div className="customizeAssumptions-popup-wrapper">
                <div className="customizeAssumptions-filter-wrapper">
                  <Card className="customize-assumptions-popup" type={"secondary"}>
                    {Object.entries(groupedDataForAssumptions).map(([category, items]) => (
                      <Card key={category} className="assumptions-category-section">
                        <div className="assumptions-category-name">{category}</div>
                        {items.map((item) => (
                          <LabelFieldPair key={item.key} className="assumptions-item-section">
                            <div className="assumptions-item-name">{item.key}</div>
                            <TextInput
                              type="number"
                              value={confirmedValues[item.key] || ""}
                              onChange={(e) => handleInputChange(item.key, e.target.value)}
                              //error={errors[field.key]}
                            />
                          </LabelFieldPair>
                        ))}
                      </Card>
                    ))}
                  </Card>
                  <div className="button-wrap-div">
                    <Button
                      className={"campaign-type-alert-button"}
                      type={"button"}
                      variation={"primary"}
                      label={t(`APPLY_BUTTON`)}
                      title={t(`APPLY_BUTTON`)}
                      onClick={onApply}
                      isDisabled={disableApplyAction}
                    />
                  </div>
                </div>
                <Card className="customize-popup-table-card" type={"primary"}>
                  {
                    planObject && (
                      <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        paginationServer
                        paginationDefaultPage={currentPage}
                        paginationPerPage={rowsPerPage}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsPerPageChange}
                        paginationRowsPerPageOptions={[10, 20, 50, 100]}
                        paginationTotalRows={totalCount}
                        noContextMenu
                        customStyles={tableCustomStyle}
                        fixedHeader={true}
                        className={"customize-assumptions-popup-table-no-frozen-columns"}
                        fixedHeaderScrollHeight={"100vh"}
                        sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                      />
                    )
                  }
                </Card>
              </div>
              {showToast && (
                <Toast
                  type={
                    showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"
                  }
                  label={t(showToast.label)}
                  transitionTime={showToast.transitionTime}
                  onClose={() => setShowToast(null)}
                />
              )}
            </div>,
          ]}
          onOverlayClick={onClose}
          footerChildren={[
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t(`MICROPLAN_CANCEL_BUTTON`)}
              title={t(`MICROPLAN_CANCEL_BUTTON`)}
              onClick={onClose}
            />,
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t(`CONFIRM_CUSTOMIZATION_BUTTON`)}
              title={t(`CONFIRM_CUSTOMIZATION_BUTTON`)}
              onClick={onConfirm}
            />,
          ]}
          className={"assumptions-popup"}
        />
      )}
            {showTimelinePopup && (
        <TimelinePopUpWrapper
          key={`${selectedBusinessId}-${Date.now()}`}
          onClose={onTimelinePopupClose}
          businessId={selectedBusinessId} // Pass selectedBusinessId as businessId
          heading={`${t("HCM_MICROPLAN_STATUS_LOG_FOR_LABEL")} ${t(selectedBoundaryCode)}`}
          labelPrefix={"PLAN_ACTIONS_"}
        />
      )}
    </>
  );
};

export default CustomizeAssumptionsPopup;
