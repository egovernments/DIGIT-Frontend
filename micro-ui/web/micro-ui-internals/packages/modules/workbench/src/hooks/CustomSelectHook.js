import { useState, useEffect } from "react";
import _ from "lodash"; // Make sure to import lodash

const useCustomSelectHook = (props) => {
    const {
        tenantId,
        schemaCode,
        fieldPath,
        setMainData
    } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            MdmsCriteria: {
                                tenantId: tenantId,
                                schemaCode: schemaCode,
                                limit: 100,
                                offset: 0,
                            },
                        }),
                    }
                );

                const responseData = await response.json();

                const options = responseData?.mdms?.map((e) => ({
                    label: e?.uniqueIdentifier,
                    value: e?.uniqueIdentifier,
                }));

                const finalJSONPath = `registry.rootSchema.properties.${Digit.Utils.workbench.getUpdatedPath(
                    fieldPath
                )}.enum`;

                if (_.has(props, finalJSONPath)) {
                    _.set(props, finalJSONPath, options?.map((e) => e.value));
                }

                setMainData(responseData?.mdms);
                setData(options);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [tenantId, schemaCode, fieldPath, setMainData]);

    return { isLoading, data };
};

export default useCustomSelectHook;
