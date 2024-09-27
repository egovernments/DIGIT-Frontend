import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  BreakLine,
  Card,
  CardLabel,
  CardLabelError,
  CardSubHeader,
  CardSectionHeader,
  TextArea,
  TextInput,
  ActionBar,
  SubmitBar,
  LabelFieldPair,
} from "@egovernments/digit-ui-react-components";

import { useTranslation } from "react-i18next";

export const FormComposer = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { t } = useTranslation();

  function onSubmit(data) {
    props.onSubmit(data);
  }

  const fieldSelector = (type, populators) => {
    switch (type) {
      case "text":
        return (
          <div className="field-container">
            {populators.componentInFront ? populators.componentInFront : null}
            <TextInput className="field desktop-w-full" {...populators} inputRef={register(populators.validation)} />
          </div>
        );
      case "textarea":
        return <TextArea className="field desktop-w-full" name={populators.name || ""} {...populators} inputRef={register(populators.validation)} />;
      default:
        return populators.dependency !== false ? populators : null;
    }
  };

  const formFields = useMemo(
    () =>
      props.config?.map((section, index, array) => {
        return (
          <React.Fragment key={index}>
            <CardSectionHeader>{section.head}</CardSectionHeader>
            {section.body.map((field, index) => {
              return (
                <React.Fragment key={index}>
                  <LabelFieldPair className={props?.fieldClassName ? props?.fieldClassName : ""}>
                    <CardLabel>
                      {field.label}
                      {field.isMandatory ? " * " : null}
                    </CardLabel>
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                      <div className="field">{fieldSelector(field.type, field.populators)}</div>
                      {errors[field.populators.name] ? <CardLabelError>{field.populators.error}</CardLabelError> : null}
                    </div>
                  </LabelFieldPair>
                </React.Fragment>
              );
            })}
            {array.length - 1 === index ? null : <BreakLine />}
          </React.Fragment>
        );
      }),
    [props.config, errors, errors?.mobileNumber, errors?.name]
  );

  const isDisabled = props.isDisabled || false;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardSubHeader>{props.heading}</CardSubHeader>
        {formFields}
        {props.children}
        <ActionBar>
          <SubmitBar disabled={isDisabled} label={t(props.label)} submit="submit" />
        </ActionBar>
      </Card>
    </form>
  );
};
