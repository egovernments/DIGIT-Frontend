import {
    Button,
    FieldV1,
    FileUpload,
    FormCard,
    TextBlock,
  } from "@egovernments/digit-ui-components";
  import React, { useState, useEffect, useMemo } from "react";
  
  // Get MDMS context path from global config or use default fallback
  const mdms_context_path =
    window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
  
  const MDMSManager = () => {
    // States for schema query params and data management
    const [key, setKey] = useState("");
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [data, setData] = useState([]);
    const [clientFilter, setClientFilter] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [uploadData, setUploadData] = useState(null);
    const [uploadResponse, setUploadResponse] = useState(null);
  
    // Memoized request config for schema download
    const criteriaToDownload = useMemo(() => {
      return {
        url: `/${mdms_context_path}/schema/v1/_search`,
        body: {
          SchemaDefCriteria: {
            tenantId: Digit.ULBService.getStateId(),
            limit: limit,
            ...(key ? { codes: [key] } : {}),
          },
        },
        changeQueryName: `MDMSSCHEMA_${limit},${offset},${key}`,
        config: {
          enabled: true,
          cacheTime: Infinity,
          staleTime: Infinity,
          select: (data) => data?.SchemaDefinitions,
        },
      };
    }, [limit, offset, key]);
  
    // Fetch MDMS schema data using custom hook
    const {
      isLoading,
      data: schema,
      error,
    } = Digit.Hooks.useCustomAPIHook(criteriaToDownload);
  
    // Set raw data on successful fetch
    useEffect(() => {
      setData(schema);
    }, [schema]);
  
    // Apply client-side filtering on schema code
    useEffect(() => {
      if (!clientFilter) {
        setFilteredData(data);
      } else {
        setFilteredData(
          data.filter((item) =>
            JSON.stringify(item?.code)
              .toLowerCase()
              .includes(clientFilter.toLowerCase())
          )
        );
      }
    }, [data, clientFilter]);
  
    // Trigger download of filtered schema as JSON file
    const downloadJson = () => {
      const blob = new Blob([JSON.stringify(filteredData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
  
      const dateTime = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `mdms-schema-backup-${dateTime}.json`;
  
      link.href = url;
      link.download = filename;
      link.click();
    };
  
    // Handle uploaded file (expects valid JSON array)
    const handleFileChange = (file) => {
      const fileReader = new FileReader();
  
      fileReader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          !uploadData && setUploadData(parsed);
        } catch {
          alert("Invalid JSON file");
        }
      };
  
      file?.[0] && fileReader.readAsText(file[0]);
    };
  
    // Upload schemas in parallel API calls
    const uploadJsonInParallel = async () => {
      if (!Array.isArray(uploadData) || uploadData.length === 0) {
        alert("Upload data must be a non-empty array.");
        return;
      }
  
      try {
        const responses = await Promise.all(
          uploadData.map((schema, index) =>Digit.CustomService.getResponse({
                url: "/egov-mdms-service/schema/v1/_create",
                body: JSON.stringify({ SchemaDefinition: schema }),
                params:{},
              }).then((data) => ({ success: true, data, index }))
              .catch((error) => ({ success: false, error, index }))
          )
        )
        setUploadResponse(responses);
        alert("All schema uploads completed.");
      } catch (error) {
        console.error("Unexpected error:", error);
        alert("Something went wrong.");
      }
    };
  
    const uploadJson = async () => {
      uploadJsonInParallel();
    };
  
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Download Section */}
        <FormCard
          equalWidthButtons
          footerData={[
            <Button
              icon=""
              label="Cancel"
              onClick={function noRefCheck() {}}
              type="button"
              variation="secondary"
            />,
            <Button
              icon=""
              label="Download JSON"
              onClick={downloadJson}
              type="submit"
            />,
          ]}
          headerData={[<TextBlock header="MDMS Schema Manager Download" />]}
          layout=""
          type="primary"
          variant="form"
          withDivider
          children={[
            // Schema key field
            <FieldV1
              label="Enter schema key"
              description="Help Text"
              infoMessage="Tooltip"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              type="text"
              required
              populators={{}}
            />,
            // Offset field
            <FieldV1
              label="Offset"
              description="Help Text"
              infoMessage="Tooltip"
              value={offset}
              onChange={(value) => setOffset(value)}
              type="numeric"
              required
              populators={{}}
            />,
            // Limit field
            <FieldV1
              label="Limit"
              description="Help Text"
              infoMessage="Tooltip"
              value={limit}
              onChange={(value) => setLimit(value)}
              type="numeric"
              required
              populators={{}}
            />,
            // Filter input
            <FieldV1
              label="Client-side Filter on schemacode"
              description="Help Text"
              infoMessage="Tooltip"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              type="text"
              required
              populators={{}}
            />,
          ]}
        />
  
        {/* Upload Section */}
        <FormCard
          equalWidthButtons
          footerData={[
            <Button
              icon=""
              label="Cancel"
              onClick={function noRefCheck() {}}
              type="button"
              variation="secondary"
            />,
            <Button
              icon=""
              label="Upload JSON"
              onClick={uploadJson}
              type="submit"
            />,
          ]}
          headerData={[<TextBlock header="MDMS Schema Manager Upload" />]}
          layout=""
          type="primary"
          variant="form"
          withDivider
          children={[
            <FileUpload
              multiple
              accept="application/json"
              onUpload={(file) => handleFileChange(file)}
              showAsTags
              uploadedFiles={uploadData}
              variant="uploadField"
            />,
          ]}
        />
      </div>
    );
  };
  
  export default MDMSManager;
  