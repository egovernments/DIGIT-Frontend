// SelectComponent.js
import React from "react";
import Select, { components } from "react-select";
import { customStyles } from "../configs/CustomStylesConfig";

const SelectComponent = (props) => {
    const {
        data,
        value,
        disabled,
        placeholder,
        multiple = false,
        formattedOptions,
        handleSelect,
        handleChange,
        isSeeAll,
        limitedOptions,
        mainData,
        setShowTooltipFlag,
        setShowModal,
        setSelectedDetails
    } = props;

    const OptionWithInfo = (props) => {
        const { data } = props;
        const index = limitedOptions.findIndex(
            (option) => option.value === data.value
        );
        const handleInfoBannerClick = () => {
            const selectedDetail = mainData[index];
            setSelectedDetails([selectedDetail]);
            setShowTooltipFlag(true);
        };

        return (
            <components.Option {...props}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>{data.label}</span>
                    {/* <span
                style={{ cursor: "pointer" }}
                onClick={handleInfoBannerClick} // Add the click event handler
              >
                <InfoBannerIcon fill={"#f47738"} style={{ marginLeft: "10px" }} />
              </span> */}
                </div>
            </components.Option>
        );
    };

    const SelectMenuButton = (props) => (
        <div>
            <components.MenuList {...props}>{props.children}</components.MenuList>
            <div className="link-container">
                <div
                    onClick={() => setShowModal(true)}
                    className="view-all-link"
                >
                    View All
                </div>
            </div>
        </div>
    );

    return (
        <Select
            className="form-control form-select"
            classNamePrefix="digit"
            options={formattedOptions}
            isDisabled={disabled}
            placeholder={placeholder}
            value={formattedOptions.filter((obj) =>
                multiple ? value?.includes(obj.value) : obj.value == value
            )}
            onChange={data ? handleChange : handleSelect}
            isSearchable={true}
            isMulti={multiple}
            styles={customStyles}
            components={
                isSeeAll
                    ? { MenuList: SelectMenuButton, Option: OptionWithInfo }
                    : { Option: OptionWithInfo }
            }
        />
    );
};

export default SelectComponent;
