
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Importing from the new @tanstack/react-query package
import axios from "axios";

const useMDMSPopupSearch = (criteria) => {
  const [moduleName, masterName] = criteria?.body?.MdmsCriteria?.schemaCode?.split(".");

  const reqCriteriaForSchema = {
    queryKey: ["schema", criteria?.body?.MdmsCriteria?.tenantId, criteria?.body?.MdmsCriteria?.schemaCode].filter(Boolean), // Updated: Using queryKey for identification
    queryFn: async () => { // Updated: Using the queryFn option for the data fetching function
      const response = await axios.post(
        `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
        {
          SchemaDefCriteria: {
            tenantId: criteria?.body?.MdmsCriteria?.tenantId,
            codes: [criteria?.body?.MdmsCriteria?.schemaCode],
          },
        },
        {} // params are empty
      );
      return response.data;
    },
    enabled: !!(moduleName && masterName), // Updated: Ensuring query is only enabled when moduleName and masterName exist
    select: (data) => {
      // Updated: The 'select' function now operates on the data returned by queryFn
      if (data?.SchemaDefinitions?.length === 0) {
        // setNoSchema(true); // Assuming setNoSchema is defined elsewhere
      }
      if (data?.SchemaDefinitions?.[0]?.definition?.["x-ui-schema"]?.["ui-apidetails"]) {
        // setAPI(data?.SchemaDefinitions?.[0]?.definition?.["x-ui-schema"]?.["ui-apidetails"]); // Assuming setAPI is defined elsewhere
      }
      return data?.SchemaDefinitions?.[0] || {};
    },
    // queryName: "schema", // Removed: 'queryName' is not a standard option in @tanstack/react-query, the first element of 'queryKey' serves this purpose
  };

  // Updated: Using useQuery directly with the new options structure
  const {
    isLoading: isSchemaLoading,
    data: schema,
    // error: schemaError, // You can now access the error directly
  } = useQuery(reqCriteriaForSchema);

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

  const { url, params, body, config = {} } = updatedCriteria;
  const client = useQueryClient();

  // Updated: The fetchData function is now part of the queryFn in the useQuery call below
  const fetchData = async () => {
    try {
      const response = await axios.post(url, body, { params }, config);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };

  // Updated: Using the new useQuery hook from @tanstack/react-query
  const {
    isLoading,
    data,
    isFetching,
    refetch,
    error,
  } = useQuery({ // Updated: Passing an options object to useQuery
    queryKey: [url, params, body, "popup"].filter(Boolean), // Updated: Using queryKey for unique identification of the query
    queryFn: fetchData, // Updated: Providing the data fetching function
    cacheTime: 0,
    ...config,
    select: (data) => {
      // Updated: The 'select' function now operates on the data returned by queryFn
      const respData = data?.mdms?.map((e) => ({ label: e?.uniqueIdentifier, value: e?.uniqueIdentifier }));

      if (schema?.definition?.["x-ref-schema"]?.length > 0) {
        schema?.definition?.["x-ref-schema"]?.forEach((dependent) => { // Updated: Using forEach for clarity
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
  });

  return {
    isLoading,
    data,
    isFetching,
    revalidate: () => {
      // Updated: Using client.invalidateQueries with the queryKey
      client.invalidateQueries([url].filter((e) => e));
    },
    refetch,
    error,
  };
};

export default useMDMSPopupSearch;