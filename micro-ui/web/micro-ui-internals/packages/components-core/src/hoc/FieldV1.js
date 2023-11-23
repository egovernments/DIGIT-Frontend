import React, { Fragment } from "react";
import {
    CardText,
    ErrorMessage,
    Header,
    TextArea,
    TextInput,
    CheckBox,
    ToggleSwitch,
} from "../atoms";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { CustomDropdown } from "../molecules";


const FieldV1 = ({
    type = "",
    value = "",
    onChange = () => { },
    error = "",
    label = "",
    disabled = false,
    nonEditable = false,
    placeholder = "",
    inline = false,
    required = false,
    description = "",
    charCount = false,
    populators = {},
    withoutLabel = false,
    props = {},
    ref,
    onBlur,
    config,
    errors
}) => {
    const { t } = useTranslation();

    const [currentCharCount, setCurrentCharCount] = useState(0);

    useEffect(() => {
        setCurrentCharCount(value.length);
    }, [value]);

    const renderCharCount = () => {
        if (charCount) {
            const maxCharacters = populators?.validation?.maxlength || 50;
            return (
                <CardText>
                    {currentCharCount}/{maxCharacters}
                </CardText>
            );
        }
    }

    const renderField = () => {
        switch (type) {
            case "text":
            case "date":
            case "time":
            case "geolocation":
            case "password":
            case "search":
            case "number":
            case "numeric":
                return (
                    <TextInput
                        type={type}
                        value={value}
                        onChange={onChange}
                        error={error}
                        label={label}
                        disabled={disabled}
                        nonEditable={nonEditable}
                        placeholder={placeholder}
                        inline={inline}
                        required={required}
                        description={description}
                        charCount={charCount}
                        withoutLabel={withoutLabel}
                        populators={populators}
                        inputRef={ref}
                    />
                );
            case "textarea":
                return (
                    <div className="digit-field-container">
                        <TextArea
                            type={type}
                            value={value}
                            onChange={onChange}
                            error={error}
                            label={label}
                            disabled={disabled}
                            nonEditable={nonEditable}
                            placeholder={placeholder}
                            inline={inline}
                            required={required}
                            description={description}
                            charCount={charCount}
                            withoutLabel={withoutLabel}
                            populators={populators}
                            inputRef={ref}
                        />
                    </div>
                );
            case "radio":
            case "dropdown":
            case "select":
            case "radioordropdown":
                return (
                    <CustomDropdown
                        t={t}
                        label={label}
                        type={type}
                        onBlur={onBlur}
                        value={value}
                        inputRef={ref}
                        onChange={onChange}
                        config={config}
                        disabled={disabled}
                        errorStyle={errors?.[populators.name]}
                    />
                );
            case "toggle":
                return (
                    <div className="toggle-container" style={{ width: '7rem', height: '2rem' }} onClick={() => onChange(!value)}>
                        <ToggleSwitch
                            t={t}
                            label={label}
                            type={type}
                            onBlur={onBlur}
                            value={value}
                            inputRef={ref}
                            onChange={onChange}
                            config={config}
                            disabled={disabled}
                            errorStyle={errors?.[populators.name]}
                        />
                    </div>
                );
            case "checkbox":
                return (
                    <div style={{ display: "grid", gridAutoFlow: "row" }}>
                        <CheckBox
                            onChange={(e) => {
                                onChange(e.target.checked);
                            }}
                            value={value}
                            checked={config.checked}
                            label={label}
                            styles={populators?.styles}
                            style={populators?.labelStyles}
                            customLabelMarkup={populators?.customLabelMarkup}
                            disabled={disabled}
                        />
                     </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {!withoutLabel && (
                <Header
                    className="label"
                >
                    {t(label)}
                    {required ? " * " : null}
                </Header>
            )}
            <div style={withoutLabel ? { width: "100%", ...props?.fieldStyle } : { ...props?.fieldStyle }} className="digit-field">
                {renderField()}
                <div className="digit-description">
                    {description && <CardText >{t(description)}</CardText>}
                    {renderCharCount()}
                </div>
                <div className="digit-error">
                    {error ? (
                        <ErrorMessage message={t(error)} />
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default FieldV1;
