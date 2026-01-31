const SidebarItemsConfig = ({ t, data }) => {
    return [
        {
            head: t("SIDEBAR_CONTENT"),
            body: [
                {
                    label: t("SIDEBAR_DISPLAY_NAME"),
                    type: "text",
                    disable: true,
                    populators: {
                        name: "displayName",
                    },
                },
                {
                    label: t("SIDEBAR_PATH"),
                    type: "text",
                    disable: true,
                    populators: {
                        name: "path",
                    },
                },
                {
                    label: t("SIDEBAR_LEFT_ICON"),
                    type: "text",
                    disable: true,
                    populators: {
                        name: "leftIcon",
                    },
                },
                {
                    label: t("SIDEBAR_NAVIGATION_URL"),
                    type: "text",
                    disable: true,
                    populators: {
                        name: "navigationURL",
                    }
                },
                {
                    label: t("SIDEBAR_ORDER_NUMBER"),
                    type: "text",
                    disable: true,
                    populators: {
                        name: "orderNumber",
                    }
                },
            ],
        },
    ];
};
export default SidebarItemsConfig;
