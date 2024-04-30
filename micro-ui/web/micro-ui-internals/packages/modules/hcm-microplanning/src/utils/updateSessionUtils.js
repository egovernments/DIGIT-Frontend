import { Request } from "@egovernments/digit-ui-libraries";
import { parseXlsxToJsonMultipleSheets } from "../utils/exceltojson";
import { convertJsonToXlsx } from "../utils/jsonToExcelBlob";
import JSZip from "jszip";

function parseBlobToExcel(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const result = event.target.result;
      const parsedData = [];

      // Assuming the CSV data is comma-separated
      const rows = result.split("\n");
      rows.forEach((row) => {
        parsedData.push(row.split(","));
      });

      resolve(parsedData);
    };

    reader.onerror = function (event) {
      reject(event.target.error);
    };

    reader.readAsText(blob);
  });
}

export const updateSessionUtils = {
  computeSessionObject: async (row,state) => {
    const sessionObj = {};
    const setCurrentPage = () => {
      sessionObj.currentPage = {
        id: 0,
        name: "MICROPLAN_DETAILS",
        component: "MicroplanDetails",
        checkForCompleteness: true,
      };
    };

    //currently hardcoded
    const setMicroplanStatus = () => {
      sessionObj.status = {
        MICROPLAN_DETAILS: true,
        UPLOAD_DATA: true,
        HYPOTHESIS: true,
        FORMULA_CONFIGURATION: true,
      };
    };

    const setMicroplanDetails = () => {
      if (row.name) {
        sessionObj.microplanDetails = {
          name: row?.name,
        };
      }
    };

    const setMicroplanHypothesis = () => {
      if (row.assumptions.length > 0) {
        sessionObj.hypothesis = row.assumptions;
      }
    };

    const setMicroplanRuleEngine = () => {
      if (row.operations.length > 0) {
        sessionObj.ruleEngine = row.operations;
      }
    };

    const setMicroplanUpload = async () => {
      const upload = {};
      const files = row?.files;
      if (!files || files.length === 0) {
        return;
      }

      let promises = [];

      // Loop through each URL
      for (let file of files) {
        //here every file will have {inputFileTyp,templateIdentifier(use this key to set data on upload object)}
        const { inputFileType, templateIdentifier, filestoreId } = file || {};

        upload[templateIdentifier] = {
          id: templateIdentifier,
          section: templateIdentifier,
          fileName: templateIdentifier,
          fileType: inputFileType,
          file: {},
          error: null,
          resourceMapping: row?.resourceMapping?.filter((resourse) => resourse.filestoreId === filestoreId),
          data: {},
        };

        //we need to set id,fileName,section,fileType,data,file,error,resourceMapping(filter with filestoreId) (for every file)
        let promise = Request({
          url: "/filestore/v1/files/id",
          data: {},
          useCache: false,
          userService: true,
          method: "GET",
          auth: false,
          params: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            // fileStoreId: filestoreId,
            fileStoreId: "733b2d5f-9876-4622-931f-9b265f7879b0",//geoj
          },
          plainAccessRequest: {},
          userDownload: false,
          setTimeParam: false,
          headers: {
            "auth-token": Digit.UserService.getUser()?.["access_token"],
          },
        });

        promises.push(promise); // Push the promise into the array
      }
      //this will have data corresponding to all the files
      let results = await Promise.all(promises);
      //do other async operations here only for files such as shp and xlsx
      


      // var binary = atob(results?.[0]?.split(',')[1]);
      // var binary = btoa(encodeURIComponent(results?.[0]))

      // // const fileBlob = new Blob([binary], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // const fileBlob = new Blob([binary], { type: 'application/octet-stream' });
      // const file = new File([fileBlob], "filename");

      // shp
      // ------------
      // const zip = await JSZip.loadAsync(file);
      // let regx = new RegExp(namingConvension.replace(".zip$", ".shp$"));
      // const shpFile = zip.file(regx)[0];
      // regx = new RegExp(namingConvension.replace(".zip$", ".shx$"));
      // const shxFile = zip.file(regx)[0];
      // regx = new RegExp(namingConvension.replace(".zip$", ".dbf$"));
      // const dbfFile = zip.file(regx)[0];
      // let geojson;
      // if (shpFile && dbfFile) {
      //   const shpArrayBuffer = await shpFile.async("arraybuffer");
      //   const dbfArrayBuffer = await dbfFile.async("arraybuffer");
      //   geojson = shp.combine([shp.parseShp(shpArrayBuffer), shp.parseDbf(dbfArrayBuffer)]);
      // }
      // ----------


      const handleGeoJson = (file,idx) => {
        upload[files[idx].templateIdentifier].data = results[idx];
          const newFeatures = results[idx]["features"].map((item) => {
            let newProperties = {};
            row?.resourceMapping
              ?.filter((resourse) => resourse.filestoreId === file.filestoreId)
              .forEach((e) => {
                newProperties[e["mappedTo"]] = item["properties"][e["mappedFrom"]];
              });
            item["properties"] = newProperties;
            return item;
          });
          upload[files[idx].templateIdentifier].data.features = newFeatures;
      }

      


      // let fileDataToStore = await parseXlsxToJsonMultipleSheets(file, { header: 1 });
      //run a loop and set the data object of every file
      files.forEach((file, idx) => {
        switch (file.inputFileType) {
          case "Shapefile":
            break;
          case "Excel":
            break;
          case "GeoJSON":
            handleGeoJson();
          default:
            break;
        }
        //this logic is for geoJson file type only
        handleGeoJson(file,idx)
      });
      //now map over this results and for each file (currently only geojson) set upload object in sessionObj
      //also preprocess with computeGeojsonWithMappedProperties before setting on sessionObj

      return upload;
    };

    try {
      setCurrentPage();
      setMicroplanStatus();
      setMicroplanDetails();
      setMicroplanHypothesis();
      setMicroplanRuleEngine();
      const upload = await setMicroplanUpload(); //should return upload object
      sessionObj.upload = upload;
      return sessionObj;
    } catch (error) {
      console.log("error occured in updateSeshUtils", error.message);
    }
  },
};
