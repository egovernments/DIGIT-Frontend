import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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

// React Hook Form v7: errors lives under formState, register is called inline (no inputRef)
export const FormComposer = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();

  const fieldSelector = (type, populators) => {
    switch (type) {
      case "text":
        return (
          <div className="field-container">
            {populators.componentInFront ? populators.componentInFront : null}
            <TextInput
              className="field desktop-w-full"
              {...populators}
              {...register(populators.name, populators.validation)}
            />
          </div>
        );
      case "textarea":
        return (
          <TextArea
            className="field desktop-w-full"
            name={populators.name || ""}
            {...populators}
            {...register(populators.name, populators.validation)}
          />
        );
      default:
        return populators.dependency !== false ? populators : null;
    }
  };

  const formFields = useMemo(
    () =>
      props.config?.map((section, index, array) => (
        <span key={index}>
          <CardSectionHeader>{section.head}</CardSectionHeader>
          {section.body.map((field, i) => (
            <span key={i}>
              <LabelFieldPair className={props?.fieldClassName || ""}>
                <CardLabel>
                  {field.label}
                  {field.isMandatory ? " * " : null}
                </CardLabel>
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                  <div className="field">{fieldSelector(field.type, field.populators)}</div>
                  {errors[field.populators.name] ? <CardLabelError>{field.populators.error}</CardLabelError> : null}
                </div>
              </LabelFieldPair>
            </span>
          ))}
          {array.length - 1 === index ? null : <BreakLine />}
        </span>
      )),
    [props.config, errors]
  );

  return (
    <form onSubmit={handleSubmit((data) => props.onSubmit(data))}>
      <Card>
        <CardSubHeader>{props.heading}</CardSubHeader>
        {formFields}
        {props.children}
        <ActionBar>
          <SubmitBar disabled={props.isDisabled || false} label={t(props.label)} submit="submit" />
        </ActionBar>
      </Card>
    </form>
  );
};
