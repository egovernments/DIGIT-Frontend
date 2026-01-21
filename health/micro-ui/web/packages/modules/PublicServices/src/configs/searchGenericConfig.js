import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const useSearchGenericConfig = () => {
  const { module } = useParams();
  const {t} = useTranslation();
  const prefix = `${module?.toUpperCase()}`;

  return {
    headerLabel: `${prefix}_SEARCH_HEADER`,
    type: "search",
    apiDetails: {
      serviceName: `/public-service/v1/application`,
      requestParam: {},
      requestBody: {
        SearchCriteria: {},
      },
      minParametersForSearchForm: 0,
      masterName: "commonUiConfig",
      moduleName: "searchGenericConfig",
      tableFormJsonPath: "requestBody.SearchCriteria",
      filterFormJsonPath: "requestBody.SearchCriteria.custom",
      searchFormJsonPath: "requestBody.SearchCriteria.custom",
    },
    sections: {
      search: {
        uiConfig: {
          headerStyle: {},
          formClassName: "custom-digit--search-field-wrapper-classname",
          primaryLabel: "ES_COMMON_SEARCH",
          secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
          minReqFields: 1,
          defaultValues: {
            applicationNumber: "",
            status: "",
            todate: "",
            fromdate: "",
            businessService: "",
          },
          fields: [
            {
              inline: true,
              label: `${prefix}_APPLICATION_NUMBER`,
              isMandatory: false,
              type: "text",
              disable: false,
              populators: { name: "applicationNumber", error: "Error!" },
            },
            // {
            //   inline: true,
            //   label: `${prefix}_STATUS`,
            //   isMandatory: false,
            //   type: "text",
            //   disable: true,
            //   populators: { name: "status", error: "Error!" },
            // },
            // {
            //   inline: true,
            //   label: `${prefix}_TODATE`,
            //   isMandatory: false,
            //   type: "date",
            //   disable: true,
            //   populators: { name: "todate", error: "Error!" },
            // },
            // {
            //   inline: true,
            //   label: `${prefix}_FROMDATE`,
            //   isMandatory: false,
            //   type: "date",
            //   disable: true,
            //   populators: { name: "fromdate", error: "Error!" },
            // },
            {
              label: `${prefix}_BUSINESS_SERVICE`,
              isMandatory: true,
              key: "businessService",
              type: "dropdown",
              disable: false,
              preProcess: {
                updateDependent: ["populators.options"],
              },
              populators: {
                name: "businessService",
                optionsKey: "name",
                error: t("BUSSINESS_SERVICE_REQUIRED"),
                options: [],
              },
            },
          ],
        },
        label: "",
        show: true,
      },
      searchResult: {
        uiConfig: {
          columns: [
            {
              label: `${prefix}_APPLICATION_NUMBER`,
              jsonPath: "applicationNumber",
              additionalCustomization: true,
            },
            {
              label: `${prefix}_STATUS`,
              jsonPath: "workflowStatus",
            },
            {
              label: `${prefix}_BUSINESS_SERVICE`,
              jsonPath: "businessService",
            },
            {
              label: `${prefix}_SERVICE_CODE`,
              jsonPath: "serviceCode",
            },
          ],
          tableProps: {
            tableClassName: "custom-classname-resultsdatatable",
          },
          actionProps: {
            actions: [
              {
                label: "Action1",
                variation: "secondary",
                icon: "Edit",
              },
              {
                label: "Action2",
                variation: "primary",
                icon: "CheckCircle",
              },
            ],
          },
          enableColumnSort: true,
          resultsJsonPath: "Application",
          defaultSortAsc: true,
        },
        children: {},
        show: true,
      },
    },
  };
};
