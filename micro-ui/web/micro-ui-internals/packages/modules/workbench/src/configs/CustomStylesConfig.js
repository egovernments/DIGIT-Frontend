export const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? "#f47738" : "#505a5f",
        borderRadius: "unset",
        "&:hover": {
            borderColor: "#f47738",
        },
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#f47738" : "white",
        color: state.isSelected ? "white" : "black",
        "&:hover": {
            backgroundColor: "#ffe6cc",
        },
    }),
};