
const SidebarAddEditConfig = ({ t, typeOfAction, icon, users }) => {
    return [
        {
            head: t("SIDEBAR_CONTENT"),
            body: [
                {
                    label: t("SIDEBAR_DISPLAY_NAME"),
                    type: "text",
                    disable: false,
                    populators: {
                        name: "displayName",
                    },
                    isMandatory: true,
                },
                {
                    label: t("SIDEBAR_PATH"),
                    type: "text",
                    disable: false,
                    isMandatory: true,
                    populators: {
                        name: "path",
                    },
                },
                {
                    label: t("SIDEBAR_LEFT_ICON"),
                    type: "dropdown",
                    disable: false,
                    isMandatory: true,
                    populators: {
                        name: "leftIcon",
                        optionsKey: "code",
                        options: icon
                    },
                },
                {
                    label: t("SIDEBAR_ENABLED"),
                    type: "component",
                    component: "CustomSwitch",
                    populators: {
                        name: "enabled",
                    },
                    customProps: {
                        module: "HCM",
                    },

                },
                {
                    label: t("SIDEBAR_NAVIGATION_URL"),
                    type: "text",
                    disable: false,
                    isMandatory: true,
                    populators: {
                        name: "navigationURL",
                    }
                },
                {
                    label: t("SIDEBAR_ORDER_NUMBER"),
                    type: "text",
                    disable: false,
                    isMandatory: false,
                    populators: {
                        name: "orderNumber",
                    }
                },
                {
                    label: t("SIDEBAR_USERS"),
                    isMandatory: true,
                    type: "multiselectdropdown",
                    disable: false,
                    populators: {
                        name: "users",
                        optionsKey: "name",
                        defaultText: '',
                        // selectedText: "SIDEBAR_SELECTED",
                        allowMultiSelect: true,
                        options: users,
                        isDropdownWithChip: true
                    }
                }
            ],
        },
    ];
};
export default SidebarAddEditConfig;
