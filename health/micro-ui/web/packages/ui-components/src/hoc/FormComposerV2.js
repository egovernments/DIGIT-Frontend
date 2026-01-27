import React, { useEffect, useState, Fragment, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";

// atoms need for initial setup
import BreakLine from "../atoms/BreakLine";
import Card from "../atoms/Card";
import HeaderComponent from "../atoms/HeaderComponent";
import ActionLinks from "../atoms/ActionLinks";
import Footer from "../atoms/Footer";
import LabelFieldPair from "../atoms/LabelFieldPair";
import HorizontalNav from "../atoms/HorizontalNav";
import { SubmitBar, Toast, Button } from "../atoms";
import MultiChildFormWrapper from "./MultiChildFormWrapper";

// import Fields from "./Fields";    //This is a field selector pickup from formcomposer
import FieldController from "./FieldController";
import { ButtonIdentificationProvider, SectionIdentificationProvider } from "./ButtonIdentificationContext";

const wrapperStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  border: "solid",
  borderRadius: "5px",
  padding: "10px",
  paddingTop: "20px",
  marginTop: "10px",
  borderColor: "#f3f3f3",
  background: "#FAFAFA",
  marginBottom: "20px",
};

/**
 *  formcomposer used to render forms
 *
 * @author jagankumar-egov
 *
 * @example
 *
 * refer this implementation of sample file
 * frontend/micro-ui/web/micro-ui-internals/packages/modules/AttendenceMgmt/src/pages/citizen/Sample.js
 *
 */

export const FormComposer = (props) => {
  // ✅ Fixed: v7 syntax - errors comes from formState
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    trigger,
    control,
    setError,
    clearErrors,
    unregister,
    formState,  // Keep formState for passing to children
  } = useForm({
    defaultValues: props.defaultValues,
  });

  // ✅ Extract errors and submitCount from formState
  const { errors, submitCount } = formState;

  const { t } = useTranslation();
  const formData = watch();
  const selectedFormCategory = props?.currentFormCategory;
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [customToast, setCustomToast] = useState(false);

  useEffect(() => {
    if (props?.defaultValues && Object.keys(props?.defaultValues).length > 0) {
      reset(props?.defaultValues);
    }
  }, [props?.defaultValues]);

  useEffect(() => {
    clearErrors();
  }, [selectedFormCategory]);

  // ✅ Fixed: Use extracted errors and submitCount
  useEffect(() => {
    if (Object.keys(errors).length > 0 && submitCount > 0) {
      setShowErrorToast(true);
    } else {
      setShowErrorToast(false);
    }
  }, [errors, submitCount]);

  useEffect(() => {
    if (showErrorToast === true) {
      setShowErrorToast(false);
    }
  }, [props?.config]);

  useEffect(() => {
    if (
      props?.appData &&
      Object.keys(props?.appData)?.length > 0 &&
      (!_.isEqual(props?.appData, formData) || !_.isEqual(props?.appData?.ConnectionHolderDetails?.[0], formData?.ConnectionHolderDetails?.[0]))
    ) {
      reset({ ...props?.appData });
    }
  }, [props?.appData, formData, props?.appData?.ConnectionHolderDetails]);

  useEffect(() => {
    props.getFormAccessors && props.getFormAccessors({ setValue, getValues });
  }, []);

  useEffect(() => {
    setCustomToast(props?.customToast);
  }, [props?.customToast]);

  function onSubmit(data) {
    props.onSubmit(data);
  }

  function onSecondayActionClick(data) {
    props.onSecondayActionClick();
  }

  useEffect(() => {
    props.onFormValueChange && props.onFormValueChange(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues);
  }, [formData]);

  // Effect to handle valueExpression - automatically calculate field values
  useEffect(() => {
    if (!props.config) return;

    // Helper to evaluate value expression
    const evaluateValueExpression = (expression, formData) => {
      if (!expression) return null;
      try {
        const func = new Function("values", `return ${expression};`);
        return func(formData);
      } catch (e) {
        console.error("Error evaluating valueExpression", e, "expression:", expression);
        return null;
      }
    };

    // Iterate through all fields and update values based on valueExpression
    props.config.forEach((section) => {
      if (section?.body) {
        section.body.forEach((field) => {
          if (field?.valueExpression) {
            const calculatedValue = evaluateValueExpression(field.valueExpression, formData);
            const currentValue = getValues(field.populators?.name);

            // Only update if the calculated value is different from current value
            if (calculatedValue !== null && calculatedValue !== currentValue) {
              setValue(field.populators?.name, calculatedValue);
            }
          }
        });
      }
    });
  }, [formData, props.config, setValue, getValues]);

  const fieldSelector = (type, populators, isMandatory, disable = false, component, config, sectionFormCategory) =>
    // Calling field controller to render all label and fields
    FieldController({
      type: type,
      populators: populators,
      isMandatory: isMandatory,
      disable: disable,
      component: component,
      config: config,
      sectionFormCategory: sectionFormCategory,
      formData: formData,
      selectedFormCategory: selectedFormCategory,
      control: control,
      props: props,
      errors: errors,
      defaultValues: props?.defaultValues,
      controllerProps: {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch,
        trigger,
        control,
        formState,  // ✅ Pass full formState for compatibility
        errors,     // ✅ Also pass extracted errors
        setError,
        clearErrors,
        unregister,
      },
    });

  const getCombinedStyle = (placementinBox) => {
    switch (placementinBox) {
      case 0:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "10px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          marginBottom: "20px",
        };
      case 1:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "-30px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          borderTop: "0px",
          borderBottom: "0px",
        };
      case 2:
        return {
          border: "solid",
          borderRadius: "5px",
          padding: "10px",
          paddingTop: "20px",
          marginTop: "-30px",
          borderColor: "#f3f3f3",
          background: "#FAFAFA",
          marginBottom: "20px",
          borderTop: "0px",
        };
      default:
        return {};
    }
  };

  const titleStyle = { color: "#505A5F", fontWeight: "700", fontSize: "16px" };

  const getCombinedComponent = (section) => {
    if (section.head && section.subHead) {
      return (
        <>
          <HeaderComponent
            className={`digit-card-section-header`}
            style={props?.sectionHeadStyle ? props?.sectionHeadStyle : { margin: "5px 0px" }}
            id={section.headId}
          >
            {t(section.head)}
          </HeaderComponent>
          <HeaderComponent
            id={`${section.headId}_DES`}
            className={`sectionSubHeaderStyle ${section?.sectionSubHeadClassName || ""}`}
          >
            {t(section.subHead)}
          </HeaderComponent>
        </>
      );
    } else if (section.head) {
      return (
        <>
          <HeaderComponent className={`digit-card-section-header titleStyle ${section?.sectionHeadClassName || ""}`}
            id={section.headId}
          >
            {t(section.head)}
          </HeaderComponent>
        </>
      );
    } else {
      return <div></div>;
    }
  };

  const closeToast = () => {
    setShowErrorToast(false);
    setCustomToast(false);
    props?.updateCustomToast && props?.updateCustomToast(false);
  };

  const formFields = useCallback(
    (section, index, array, sectionFormCategory) => {
      // Helper function to evaluate visibility expression dynamically
      const evaluateVisibility = (visibilityExpression, formData) => {
        if (!visibilityExpression) return true;
        try {
          if (typeof visibilityExpression === "function") {
            return visibilityExpression(formData);
          } else if (typeof visibilityExpression === "string") {
            const func = new Function("values", `return ${visibilityExpression};`);
            const result = func(formData);
            return result;
          }
        } catch (e) {
          console.error("Error evaluating visibilityExpression", e, "expression:", visibilityExpression);
          return false;
        }
        return true;
      };

      return (
        <React.Fragment key={index}>
          {section && getCombinedComponent(section)}
          {section?.type === "multiChildForm" && (
            <MultiChildFormWrapper
              key={`multi-child-${index}`}
              config={section}
              control={control}
              formData={formData}
              setValue={setValue}
              getValues={getValues}
              errors={errors}
              props={props}
              defaultValues={props?.defaultValues}
            />
          )}
          {section?.type !== "multiChildForm" && section?.body?.map((field, fieldIndex) => {
            // Check static hideInForm flag
            if (field?.populators?.hideInForm) return null;

            // Dynamically evaluate visibilityExpression with current form data
            const isVisible = evaluateVisibility(field?.visibilityExpression, formData);
            if (!isVisible) return null;

            // Check if field should be disabled due to readOnlyWhenAutoFilled
            let isFieldDisabled = field?.disable;
            if (field?.readOnlyWhenAutoFilled && field?.valueExpression) {
              const currentValue = formData?.[field.populators?.name];
              // Disable if the field has a value (has been auto-filled)
              if (currentValue !== undefined && currentValue !== null && currentValue !== '') {
                isFieldDisabled = true;
              }
            }

            if (props.inline)
              return (
                <React.Fragment key={fieldIndex}>
                  <div style={field.isInsideBox ? getCombinedStyle(field?.placementinbox) : field.inline ? { display: "flex" } : {}}>
                    <div style={field.withoutLabel ? { width: "100%" } : {}} className="digit-field">
                      {fieldSelector(field.type, field.populators, field.isMandatory, isFieldDisabled, field?.component, field, sectionFormCategory)}
                      {field?.description && (
                        <HeaderComponent
                          style={{
                            marginTop: "-24px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#505A5F",
                            ...field?.descriptionStyles,
                          }}
                          className="bolder"
                        >
                          {t(field.description)}
                        </HeaderComponent>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );

            return (
              <Fragment>
                <LabelFieldPair
                  key={index}
                  style={
                    props?.showWrapperContainers && !field.hideContainer
                      ? { ...wrapperStyles, ...field?.populators?.customStyle }
                      : { border: "none", background: "white", ...field?.populators?.customStyle }
                  }
                  vertical={props?.labelfielddirectionvertical}
                >
                  {fieldSelector(field.type, field.populators, field.isMandatory, isFieldDisabled, field?.component, field, sectionFormCategory)}
                </LabelFieldPair>
              </Fragment>
            );
          })}
          {!props.noBreakLine && (array.length - 1 === index ? null : <BreakLine style={props?.breaklineStyle ? props?.breaklineStyle : {}} />)}
        </React.Fragment>
      );
    },
    [props.config, formData, errors]
  );

  const getCardStyles = (shouldDisplay = true) => {
    let styles = props.cardStyle || {};
    if (props.noBoxShadow) styles = { ...styles, boxShadow: "none" };
    if (!shouldDisplay) styles = { ...styles, display: "none" };
    return styles;
  };

  const isDisabled = props.isDisabled || false;

  const checkKeyDown = (e) => {
    const keyCode = e.keyCode ? e.keyCode : e.key ? e.key : e.which;
    if (keyCode === 13) {
      // e.preventDefault();
    }
  };

  const setActiveNavByDefault = (configNav) => {
    let setActiveByDefaultRow = null;
    configNav?.forEach((row) => {
      if (row?.activeByDefault) {
        setActiveByDefaultRow = row;
      }
    });

    if (setActiveByDefaultRow) {
      return setActiveByDefaultRow?.name;
    }

    return configNav?.[0]?.name;
  };

  const [activeLink, setActiveLink] = useState(props.horizontalNavConfig ? setActiveNavByDefault(props.horizontalNavConfig) : null);

  useEffect(() => {
    setActiveLink(setActiveNavByDefault(props.horizontalNavConfig));
  }, [props.horizontalNavConfig]);

  const renderFormFields = (props, section, index, array, sectionFormCategory) => (
    <React.Fragment key={index}>
      {!props.childrenAtTheBottom && props.children}
      {props.heading && (
        <HeaderComponent
          className={props?.cardSubHeaderClassName ? `digit-form-card-subheader ${props?.cardSubHeaderClassName}` : "digit-form-card-subheader"}
          styles={{ ...props.headingStyle }}
        >
          {props.heading}
        </HeaderComponent>
      )}
      {props.description && (
        <HeaderComponent
          className={props?.cardDescriptionClassName ? `digit-form-card-description ${props?.cardDescriptionClassName}` : "digit-form-card-description"}
          styles={{ ...props.descriptionStyles }}
        >
          {props.description}
        </HeaderComponent>
      )}
      {props.text && (
        <HeaderComponent className={props?.cardTextClassName ? `digit-form-card-text ${props?.cardTextClassName}` : "digit-form-card-text"}>
          {props.text}
        </HeaderComponent>
      )}
      {formFields(section, index, array, sectionFormCategory)}
      {props.childrenAtTheBottom && props.children}
      {props.submitInForm && (
        <SubmitBar label={t(props.label)} style={{ width: "100%", ...props?.buttonStyle }} submit="submit" disabled={isDisabled} className="w-full" />
      )}
      {props.secondaryActionLabel && (
        <div
          className="primary-label-btn"
          role="button"
          tabIndex={0}
          style={{ margin: "20px auto 0 auto" }}
          onClick={onSecondayActionClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSecondayActionClick();
            }
          }}
        >
          {props.secondaryActionLabel}
        </div>
      )}
    </React.Fragment>
  );

  function onDraftLabelClick() {
    props.onDraftLabelClick && props.onDraftLabelClick(getValues());
  }

  const fieldId = Digit?.Utils?.getFieldIdName?.(props?.formId || props?.className || "form") || "NA";

  return (
    <ButtonIdentificationProvider
      composerType="formcomposer"
      composerId={props.formId || props.className || "form"}
    >
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)} id={fieldId} className={props.className}>
        {props?.showMultipleCardsWithoutNavs ? (
          props?.config?.map((section, index, array) => {
            return (
              !section.navLink && (
                <SectionIdentificationProvider key={index} sectionId={section?.headId || `section-${index}`}>
                  <Card key={index} style={getCardStyles()} noCardStyle={props.noCardStyle} className={props.cardClassName}>
                    {renderFormFields(props, section, index, array)}
                  </Card>
                </SectionIdentificationProvider>
              )
            );
          })
        ) : (
          <Card style={getCardStyles()} noCardStyle={props.noCardStyle} className={props.cardClassName}>
            {props?.config?.map((section, index, array) => {
              return !section.navLink && (
                <SectionIdentificationProvider key={index} sectionId={section?.headId || `section-${index}`}>
                  {renderFormFields(props, section, index, array)}
                </SectionIdentificationProvider>
              );
            })}
          </Card>
        )}
        {props?.showFormInNav && props.horizontalNavConfig && (
          <HorizontalNav
            configNavItems={props.horizontalNavConfig ? props.horizontalNavConfig : null}
            showNav={props?.showNavs}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
          >
            {props?.showMultipleCardsInNavs ? (
              props?.config?.map((section, index, array) => {
                return section.navLink ? (
                  <SectionIdentificationProvider key={index} sectionId={section?.headId || section.navLink || `nav-section-${index}`}>
                    <Card key={index} style={section.navLink !== activeLink ? getCardStyles(false) : getCardStyles()} noCardStyle={props.noCardStyle}>
                      {renderFormFields(props, section, index, array, section?.sectionFormCategory)}
                    </Card>
                  </SectionIdentificationProvider>
                ) : null;
              })
            ) : (
              <Card style={getCardStyles()} noCardStyle={props.noCardStyle}>
                {props?.config?.map((section, index, array) => {
                  return section.navLink ? (
                    <SectionIdentificationProvider key={index} sectionId={section?.headId || section.navLink || `nav-section-${index}`}>
                      <div style={section.navLink !== activeLink ? { display: "none" } : {}}>
                        {renderFormFields(props, section, index, array, section?.sectionFormCategory)}
                      </div>
                    </SectionIdentificationProvider>
                  ) : null;
                })}
              </Card>
            )}
          </HorizontalNav>
        )}
        {!props.submitInForm && props.label && (
          <Footer className={props.actionClassName}>
            {props?.draftLabel && (
              <SubmitBar
                style={props?.submitButtonStyle}
                className="digit-formcomposer-submitbar"
                submit={false}
                label={t(props?.draftLabel)}
                onClick={onDraftLabelClick}
              />
            )}
            <SubmitBar
              label={t(props.label)}
              id={`${fieldId}-primary`}
              className="digit-formcomposer-submitbar"
              submit="submit"
              disabled={isDisabled}
              icon={props?.primaryActionIcon}
              isSuffix={props?.primaryActionIconAsSuffix}
            />
            {props?.secondaryLabel && props?.showSecondaryLabel && (
              <Button
                id={`${fieldId}-secondary`}
                className="previous-button"
                variation="secondary"
                label={t(props?.secondaryLabel)}
                onClick={props?.onSecondayActionClick}
                icon={props?.secondaryActionIcon}
                isSuffix={props?.secondaryActionIconAsSuffix}
              />
            )}
            {props.onSkip && props.showSkip && (
              <ActionLinks style={props?.skipStyle} label={t(`CS_SKIP_CONTINUE`)} id={`${fieldId}-links`} onClick={props.onSkip} />
            )}
          </Footer>
        )}
        {showErrorToast && <Toast type={"error"} label={t("ES_COMMON_PLEASE_ENTER_ALL_MANDATORY_FIELDS")} isDleteBtn={true} onClose={closeToast} />}
        {customToast && <Toast type={customToast?.type} label={t(customToast?.label)} isDleteBtn={true} onClose={closeToast} />}
      </form>
    </ButtonIdentificationProvider>
  );
};