import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

const useMDMSPopupSearch = (criteria) => {
  const [moduleName, masterName] = criteria?.body?.MdmsCriteria?.schemaCode?.split(".");

  const reqCriteriaForSchema = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
    params: {},
    body: {
      SchemaDefCriteria: {
        tenantId: criteria?.body?.MdmsCriteria?.tenantId,
        codes: [criteria?.body?.MdmsCriteria?.schemaCode],
      },
    },
    config: {
      enabled: moduleName && masterName && true,
      select: (data) => {
        if (data?.SchemaDefinitions?.length == 0) {
          setNoSchema(true);
        }
        if (data?.SchemaDefinitions?.[0]?.definition?.["x-ui-schema"]?.["ui-apidetails"]) {
          setAPI(data?.SchemaDefinitions?.[0]?.definition?.["x-ui-schema"]?.["ui-apidetails"]);
        }
        return data?.SchemaDefinitions?.[0] || {};
      },
    },
    changeQueryName: "schema",
  };

  const { isSchemaLoading, data: schema } = Digit.Hooks.useCustomAPIHook(reqCriteriaForSchema);

  const updatedCriteria = { ...criteria };

  // Update filters
  if (updatedCriteria.state?.searchForm) {
    const { field, value } = updatedCriteria.state.searchForm;
    if (field && value !== undefined) {
      updatedCriteria.body.MdmsCriteria = {
        ...updatedCriteria.body.MdmsCriteria,
        tenantId: updatedCriteria.body.MdmsCriteria.tenantId,
        filters: {
          ...(updatedCriteria.body.MdmsCriteria.filters || {}),
          [field.code]: value,
        },
      };
    }
  }
  // Update limit and offset
  if (updatedCriteria.state?.tableForm) {
    const { limit, offset } = updatedCriteria.state.tableForm;
    updatedCriteria.body.MdmsCriteria = {
      ...updatedCriteria.body.MdmsCriteria,
      limit,
      offset,
    };
  }

  const { url, params, body, config = {}, changeQueryName = "Random" } = updatedCriteria;
  const client = useQueryClient();

  const fetchData = async () => {
    try {
      const response = await axios.post(url, body, { params }, config);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };

  const { isLoading, data, isFetching, refetch, error } = useQuery(
    [url, params, body, "popup"].filter((e) => e),
    fetchData,
    {
      cacheTime: 0,
      ...config,
      select: (data) => {
        const respData = data?.mdms?.map((e) => ({ label: e?.uniqueIdentifier, value: e?.uniqueIdentifier }));

        if (schema?.definition?.["x-ref-schema"]?.length > 0) {
          schema?.definition?.["x-ref-schema"]?.map((dependent) => {
            if (dependent?.fieldPath) {
              let updatedPath = Digit.Utils.workbench.getUpdatedPath(dependent?.fieldPath);
              const property = _.get(schema?.definition?.properties, updatedPath);
              if (property) {
                const existingEnum = property.enum || [];
                const newValues = respData?.map((e) => e.value).filter((value) => !existingEnum.includes(value));
                if (newValues && newValues.length > 0) {
                  const updatedEnum = [...existingEnum, ...newValues];
                  _.set(schema?.definition?.properties, updatedPath, {
                    ...property,
                    enum: updatedEnum,
                  });
                }
              }
            }
          });
        }
        return data;
      },
    }
  );

  return {
    isLoading,
    data,
    isFetching,
    revalidate: () => {
      data && client.invalidateQueries([url].filter((e) => e));
    },
    refetch,
    error,
  };
};

export default useMDMSPopupSearch;