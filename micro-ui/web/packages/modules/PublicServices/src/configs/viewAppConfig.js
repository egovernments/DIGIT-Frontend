
export const ViewApplicationConfig = (response,code,t,cardItems) => {
    const values = response?.attributes?.map(attr => {
        const matchingItem = cardItems?.attributes?.find(a => a?.code == attr?.attributeCode);
        const isSingleValueList = matchingItem?.dataType === "SingleValueList";
        // Handle null/undefined values
        const attrValue = attr.value;
        let displayValue;
        if (attrValue === null || attrValue === undefined || attrValue === "") {
            displayValue = "-";
        } else if (isSingleValueList) {
            displayValue = t(`${code}.${attrValue}`);
        } else {
            displayValue = attrValue;
        }
        return {
            key: `${code}.${attr.attributeCode}`,
            value: displayValue
        };
    });

    const config = {
        cards: [
            {
                sections: [
                    {
                        type: "DATA",
                        cardHeader: { value: "View Application", inlineStyles: { marginTop: "2rem" } },
                        values: values
                    },
                ],
            },
        ],
        apiResponse: response,
        additionalDetails: {},
    };
    return config;
}

export default ViewApplicationConfig;
