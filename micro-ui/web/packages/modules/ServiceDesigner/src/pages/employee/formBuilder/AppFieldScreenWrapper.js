import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppConfigContext } from "./AppConfigurationWrapper";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Stepper,
  Tab,
  ActionBar,
  LabelFieldPair,
  TextInput,
  Tooltip,
  TooltipWrapper,
  Switch,
  TextArea,
  AlertCard,
} from "@egovernments/digit-ui-components";
import AppFieldComposer from "./AppFieldComposer";
import _ from "lodash";
import { useCustomT } from "./useCustomT";
import DraggableField from "./DraggableField";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";
import { CardSectionHeader, DustbinIcon } from "@egovernments/digit-ui-react-components";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
//import { useBoundaryData } from "../../../hooks/useBoundaryData";

function AppFieldScreenWrapper() {
  const {
    state,
    dispatch,
    openAddFieldPopup,
    currentFormName,
    setCurrentFormName,
    currentFormDescription,
    setCurrentFormDescription,
    selectedPreviewSection,
    setSelectedPreviewSection,
    validationErrors,
    setValidationErrors,
    setHasUnsavedChanges
  } = useAppConfigContext();
  const { locState, updateLocalization } = useAppLocalisationContext();
  const searchParams = new URLSearchParams(location.search);
  const projectType = searchParams.get("prefix");
  const formId = searchParams.get("formId");
  const { t } = useTranslation();

  // Fetch boundary data for city dropdown
  //const { data: boundaryData, isLoading: isLoadingBoundary } = useBoundaryData();

  const currentCard = useMemo(() => {
    return state?.screenData?.[0];
  }, [
    state?.screenData,
    // , numberTabs, stepper, currentStep
  ]);

  // Ensure selectedPreviewSection is always valid
  useEffect(() => {
    if (currentCard?.cards && selectedPreviewSection >= currentCard.cards.length) {
      setSelectedPreviewSection(Math.max(0, currentCard.cards.length - 1));
    }
  }, [currentCard?.cards, selectedPreviewSection]);

  const moveField = useCallback(
    (field, targetedField, fromIndex, toIndex, currentCard, cardIndex) => {
      dispatch({
        type: "REORDER_FIELDS",
        payload: { field, targetedField, fromIndex, toIndex, currentCard, cardIndex },
      });
    },
    [dispatch, currentCard]
  );

  // Helper function to convert to sentence case
  const toSentenceCase = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <React.Fragment>
      {!currentCard?.cards || currentCard.cards.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#6c757d" }}>
          No sections available. Add a section to get started.
        </div>
      ) : (
        <React.Fragment>
          {/* Sticky Section Header */}
          <div style={{
            position: "sticky",
            top: "-16px",
            backgroundColor: "#fff",
            zIndex: 10,
            //borderBottom: "1px solid #e9ecef",
            //marginBottom: "1.5rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem"
            }}>
              {/* <h3 style={{ 
                fontSize: "1.25rem", 
                fontWeight: "600", 
                //color: "#0B4B66", 
                margin: 0,
                fontFamily: "Roboto"
              }}>
                
              </h3> */}
              <div className="typography heading-m" style={{ marginLeft: "0px", color: "#0B4B66" }}>{currentCard?.cards?.[selectedPreviewSection]?.headerFields?.find(h => h.label === 'SCREEN_HEADING')?.value || `Section ${selectedPreviewSection + 1}`}</div>
              {/* Count custom sections (excluding auto-generated ones) */}
              {(() => {
                const customSections = currentCard?.cards?.filter(card => {
                  const isApplicant = card.fields?.some(field => field.jsonPath === "ApplicantName");
                  const isAddress = card.fields?.some(field => field.jsonPath === "AddressPincode");
                  return !isApplicant && !isAddress;
                });
                const customSectionsCount = customSections?.length || 0;

                // Only show delete button if more than 1 custom section
                if (currentCard?.cards?.length > 1) {
                  return (
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={t('DELETE_SECTION')}
                      onClick={() => {
                        dispatch({
                          type: 'DELETE_SECTION',
                          payload: {
                            currentScreen: currentCard,
                            sectionIndex: selectedPreviewSection,
                          },
                        });
                      }}
                    >
                      <DustbinIcon width={20} height={20} fill="#d32f2f" />
                    </button>
                  );
                }
                return null;
              })()}
            </div>
          </div>
          {/* <Divider style={{ marginBottom: "1.5rem" }} /> */}

          {/* Section Navigation */}
          {/* <div style={{ 
              display: "flex", 
              gap: "0.5rem", 
              flexWrap: "wrap"
            }}>
              {currentCard?.cards?.map((cardObj, index) => {
                // Include all sections in navigation, including template sections
                // const isApplicantSection = cardObj.fields?.some(field => field.jsonPath === "ApplicantName");
                // const isAddressSection = cardObj.fields?.some(field => field.jsonPath === "AddressPincode");
                
                // if (isApplicantSection || isAddressSection) {
                //   return null;
                // }
                
                const headingField = cardObj.headerFields?.find((f) => f.label === "SCREEN_HEADING");
                const sectionName = headingField?.value || `Section ${index + 1}`;
                
                return (
                  <button
                    key={index}
                    style={{
                      padding: "0.5rem 1rem",
                      border: selectedPreviewSection === index ? "2px solid #0B4B66" : "1px solid #e9ecef",
                      borderRadius: "6px",
                      backgroundColor: selectedPreviewSection === index ? "#EFF8FF" : "#fff",
                      color: selectedPreviewSection === index ? "#0B4B66" : "#666",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: selectedPreviewSection === index ? "600" : "400",
                      transition: "all 0.2s ease"
                    }}
                    onClick={() => setSelectedPreviewSection(index)}
                  >
                    {sectionName}
                  </button>
                );
              })}
            </div>
           */}
          {/* Section Content */}
          {currentCard?.cards?.map((cardObj, index) => {
            const { fields: rawFields, headerFields } = cardObj;
            // Filter out hierarchyDropdown if no hierarchyType is configured
            const fields = rawFields?.filter(field => {
              if (field.type === "hierarchyDropdown" || field.appType === "hierarchyDropdown") {
                return field.populators?.hierarchyType && field.populators.hierarchyType !== "";
              }
              return true;
            });
            // Find heading and description fields
            const headingField = headerFields?.find((f) => f.label === "SCREEN_HEADING");
            const descriptionField = headerFields?.find((f) => f.label === "SCREEN_DESCRIPTION");

            // Only show the selected section
            if (selectedPreviewSection !== index) {
              return null;
            }

            // Ensure we have a valid section to show
            if (!cardObj) {
              return null;
            }

            // Check if this is a template section
            const isApplicantSection = cardObj.fields?.some(field => field.jsonPath === "ApplicantName");
            const isAddressSection = cardObj.fields?.some(field => field.jsonPath === "AddressPincode");

            // Address section is now editable - removed AlertCard early return


            return (
              <div key={index}>
                {/* Section Heading and Description */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <span className="typography heading-s">{t("SECTION_HEADING")}</span>
                    <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_SECTION_HEADING")} />
                  </div>
                  <TextInput
                    name="sectionHeading"
                    value={typeof headingField?.value === 'string' ? headingField.value : `Section ${index + 1}`}
                    placeholder={t("ENTER_SECTION_HEADING")}
                    onChange={(event) => {
                      // Fix: Pass the specific cardObj instead of currentCard
                      dispatch({
                        type: "UPDATE_HEADER_FIELD",
                        payload: {
                          currentField: cardObj, // Use cardObj instead of currentCard
                          currentScreen: currentCard,
                          field: headingField,
                          value: event.target.value,
                        },
                      });
                    }}
                    style={{ marginBottom: "1rem" }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <span className="typography heading-s">{t("SECTION_DESCRIPTION")}</span>
                    <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_SECTION_DESCRIPTION")} />
                  </div>
                  <TextArea
                    name="sectionDescription"
                    value={typeof descriptionField?.value === 'string' ? descriptionField.value : `Description for Section ${index + 1}`}
                    placeholder={t("ENTER_SECTION_DESCRIPTION")}
                    onChange={(event) => {
                      // Fix: Pass the specific cardObj instead of currentCard
                      dispatch({
                        type: "UPDATE_HEADER_FIELD",
                        payload: {
                          currentField: cardObj, // Use cardObj instead of currentCard
                          currentScreen: currentCard,
                          field: descriptionField,
                          value: event.target.value,
                        },
                      });
                    }}
                    style={{ marginBottom: "1.5rem" }}
                    rows={3}
                  />
                </div>

                <Divider style={{ marginBottom: "1rem" }} />

                {/* Fields Section */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{
                    display: "flex",
                    gap: 8,
                  }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#0B4B66" }} className="typography heading-s">{t("APPCONFIG_SUBHEAD_FIELDS")}</span>
                    <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_FIELDS")} />
                  </div>

                  {fields?.map((field, i, c) => (
                    <DraggableField
                      key={field.jsonPath || i}
                      type={field.type || field.appType}
                      label={toSentenceCase(field.label)}
                      active={field.active}
                      required={field.required}
                      isDelete={field.deleteFlag === false ? false : true}
                      dropDownOptions={field.dropDownOptions}
                      onDelete={() => {
                        // Prevent deletion of mandatory fields
                        if (field.isMandatory) {
                          return;
                        }
                        dispatch({
                          type: "DELETE_FIELD",
                          payload: {
                            currentScreen: currentCard,
                            currentCard: cardObj, // Use cardObj instead of currentCard
                            currentCardIndex: index, // Pass the card index
                            currentField: c[i],
                          },
                        });
                      }}
                      onHide={() => {
                        // Prevent hiding of mandatory fields
                        if (field.isMandatory) {
                          return;
                        }
                        dispatch({
                          type: "HIDE_FIELD",
                          payload: {
                            currentScreen: currentCard,
                            currentCard: cardObj, // Use cardObj instead of currentCard
                            currentCardIndex: index, // Pass the card index
                            currentField: c[i],
                          },
                        });
                      }}
                      onSelectField={() => {
                        // Clear validation errors when user interacts with fields
                        if (Object.keys(validationErrors).length > 0) {
                          setValidationErrors({});
                        }
                        setHasUnsavedChanges(true);
                        dispatch({
                          type: "SELECT_DRAWER_FIELD",
                          payload: {
                            currentScreen: currentCard,
                            currentCard: cardObj, // Use cardObj instead of currentCard
                            currentCardIndex: index, // Pass the card index
                            drawerField: c[i],
                          },
                        });
                      }}
                      config={c[i]}
                      Mandatory={field.Mandatory}
                      helpText={useCustomT(field.helpText)}
                      infoText={useCustomT(field.infoText)}
                      innerLabel={useCustomT(field.innerLabel)}
                      rest={field}
                      index={i}
                      fieldIndex={i}
                      cardIndex={cardObj}
                      indexOfCard={index}
                      moveField={moveField}
                      fields={c}
                      isMandatory={field.isMandatory}
                      isApplicantSection={isApplicantSection}
                    />
                  ))}

                  {/* Add Field Button */}
                  <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                      className={"app-config-drawer-button"}
                      type={"button"}
                      size={"medium"}
                      icon={"AddIcon"}
                      variation={"secondary"}
                      label={t("ADD_FIELD")}
                      style={{ marginTop: 12 }}
                      onClick={() => {
                        // Clear validation errors when adding new fields
                        if (Object.keys(validationErrors).length > 0) {
                          setValidationErrors({});
                        }
                        setHasUnsavedChanges(true);
                        openAddFieldPopup({
                          currentScreen: currentCard,
                          currentCard: cardObj, // Use cardObj instead of currentCard
                        });
                        return;
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </React.Fragment>
      )}

      {/* <Divider style={{ margin: "24px 0" }} /> */}

      {/* Toggle Cards */}
      {/* <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, color: "#495057", fontSize: "1.1rem" }}>Section Options</h3>
        
        <Card style={{ marginBottom: 16, padding: 16, border: "1px solid #e9ecef" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h4 style={{ margin: 0, color: "#0B4B66" }}>Applicant Details</h4>
              <ConsoleTooltip className="app-config-tooltip" toolTipContent="Add personal information fields (Name, Mobile, Gender)"/>
            </div>
            <Switch
              isCheckedInitially={state?.applicantDetailsEnabled || currentCard?.cards?.some(card => 
                card?.fields?.some(field => field.jsonPath === "ApplicantName")
              ) || false}
              onToggle={(enabled) => {
                dispatch({
                  type: "TOGGLE_APPLICANT_DETAILS",
                  payload: {
                    enabled: enabled,
                    currentScreen: currentCard,
                  },
                });
                // Switch to the new section in preview if enabled
                if (enabled) {
                  const newSectionIndex = currentCard?.cards?.length || 0;
                  setSelectedPreviewSection(newSectionIndex);
                } else {
                  // When disabling, switch back to the first custom section
                  const customSections = currentCard?.cards?.filter((card, idx) => {
                    const isApplicantSection = card.fields?.some(field => field.jsonPath === "ApplicantName");
                    const isAddressSection = card.fields?.some(field => field.jsonPath === "AddressPincode");
                    return !isApplicantSection && !isAddressSection;
                  });
                  if (customSections && customSections.length > 0) {
                    const firstCustomSectionIndex = currentCard.cards.findIndex(card => 
                      card === customSections[0]
                    );
                    setSelectedPreviewSection(firstCustomSectionIndex);
                  }
                }
              }}
            />
          </div>
        </Card>
        
        <Card style={{ marginBottom: 16, padding: 16, border: "1px solid #e9ecef" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h4 style={{ margin: 0, color: "#0B4B66" }}>Address Details</h4>
              <ConsoleTooltip className="app-config-tooltip" toolTipContent="Add address fields (Pincode, Street, City)"/>
            </div>
            <Switch
              isCheckedInitially={state?.addressDetailsEnabled || currentCard?.cards?.some(card => 
                card?.fields?.some(field => field.jsonPath === "AddressPincode")
              ) || false}
              onToggle={(enabled) => {
                dispatch({
                  type: "TOGGLE_ADDRESS_DETAILS",
                  payload: {
                    enabled: enabled,
                    currentScreen: currentCard,
                    boundaryData: boundaryData || [],
                  },
                });
                // Switch to the new section in preview if enabled
                if (enabled) {
                  const newSectionIndex = currentCard?.cards?.length || 0;
                  setSelectedPreviewSection(newSectionIndex);
                } else {
                  // When disabling, switch back to the first custom section
                  const customSections = currentCard?.cards?.filter((card, idx) => {
                    const isApplicantSection = card.fields?.some(field => field.jsonPath === "ApplicantName");
                    const isAddressSection = card.fields?.some(field => field.jsonPath === "AddressPincode");
                    return !isApplicantSection && !isAddressSection;
                  });
                  if (customSections && customSections.length > 0) {
                    const firstCustomSectionIndex = currentCard.cards.findIndex(card => 
                      card === customSections[0]
                    );
                    setSelectedPreviewSection(firstCustomSectionIndex);
                  }
                }
              }}
            />
          </div>
        </Card>
        
        <Card style={{ marginBottom: 16, padding: 16, border: "1px solid #e9ecef" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h4 style={{ margin: 0, color: "#0B4B66" }}>Documents</h4>
              <ConsoleTooltip className="app-config-tooltip" toolTipContent="Document upload functionality (Coming Soon)"/>
            </div>
            <Switch
              isCheckedInitially={false}
              disable={true}
            />
          </div>
        </Card>
      </div> */}
      {/* <Divider className="app-config-drawer-action-divider" /> */}
      {/* {currentCard?.type !== "template" && (
        <>
          <div className="app-config-drawer-subheader">
            <div>{t("APPCONFIG_SUBHEAD_BUTTONS")}</div>
            <ConsoleTooltip className="app-config-tooltip" toolTipContent={t("TIP_APPCONFIG_SUBHEAD_BUTTONS")} />
          </div>
          <LabelFieldPair className="app-preview-app-config-drawer-action-button">
            <div className="">
              <span>{`${t("APP_CONFIG_ACTION_BUTTON_LABEL")}`}</span>
            </div>
            <TextInput
              name="name"
              value={useCustomT(currentCard?.actionLabel)}
              onChange={(event) => {
                updateLocalization(
                  currentCard?.actionLabel && currentCard?.actionLabel !== true
                    ? currentCard?.actionLabel
                    : `${currentCard?.parent}_${currentCard?.name}_ACTION_BUTTON_LABEL`,
                  Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage,
                  event.target.value
                );
                dispatch({
                  type: "ADD_ACTION_LABEL",
                  payload: {
                    currentScreen: currentCard,
                    actionLabel:
                      currentCard?.actionLabel && currentCard?.actionLabel !== true
                        ? currentCard?.actionLabel
                        : `${currentCard?.parent}_${currentCard?.name}_ACTION_BUTTON_LABEL`,
                  },
                });
                return;
              }}
            />
          </LabelFieldPair>
        </>
      )} */}
    </React.Fragment>
  );
}

export default React.memo(AppFieldScreenWrapper);
