import { CustomDropdown, Dropdown, MultiSelectDropdown, TreeSelect } from "@egovernments/digit-ui-components";
import { value } from "jsonpath";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseMapLayers } from "../../configs/BaseMapLayers.json";

const Mapping = ({ campaignType = "SMC", microplanData, setMicroplanData, checkDataCompletion, setCheckDataCompletion, currentPage, pages, ...props }) => {
  const [editable, setEditable] = useState(true);
  const { t } = useTranslation();
  var [map, setMap] = useState(null);
  var [_mapNode, set__mapNode] = useState("map");
  const [layers, setLayer] = useState();

  useEffect(() => {
    if (!BaseMapLayers && BaseMapLayers.length > 0) return;
    let baseMaps = {};
    let defaultBaseMap = undefined;
    BaseMapLayers.forEach((item)=>{
      if(item.url){
        const layer = L.tileLayer(item.url, {
          minZoom: item?.minZoom,
          maxZoom: item?.maxZoom,
          attribution: item?.attribution,
        });
        if(!defaultBaseMap)
          defaultBaseMap = layer;
        baseMaps[item.name] = layer
      }
    })
    var overlayMaps = {};
    console.log(BaseMapLayers, baseMaps)
    if (!map) {
      init(_mapNode, baseMaps, overlayMaps, defaultBaseMap);
    }
  }, []);

  const init = (id, baseMaps, overlayMaps, defaultBaseMap) => {
    if (map !== null) return;

    let mapConfig = {
      center: [-24.749434, 32.961285],
      zoomControl: false,
      zoom: 8, 
      scrollwheel: true,
      layers: defaultBaseMap,
    };
    
    let map_i = L.map(id, mapConfig);

    var customControl = L.control.layers(baseMaps, overlayMaps).addTo(map_i);
    // L.control.zoom({ position: "bottomleft" }).addTo(map_i);
    // L.control.scale({ position: "bottomleft" }).addTo(map_i);

    setMap(map_i);
  };

  //   // UseEffect to extract data on first render
  //   useEffect(() => {
  //     if (!microplanData || !microplanData.upload) return;
  //     setFileDataList(microplanData.upload);

  //     if (!pages) return;
  //     const previouspage = pages[currentPage?.id - 1];
  //     setEditable(!(previouspage?.checkForCompleteness && !microplanData?.status[previouspage?.name]));
  //   }, []);
  return (
    <div className={`jk-header-btn-wrapper mapping-section ${editable ? "" : "non-editable-component"}`}>
      <div className="heading">
        <p>{t("MAPPING")}</p>
      </div>
      <div className="mapping-body-comtainer">
        <div className="filter-container">
          <p className="filter-heading">{t("MAPPING_FILTER_HEADING")}</p>
          <p className="instructions">{t("MAPPING_FILTER_INSTRUCTIONS")}</p>
          <div>
            <p>{t("MAPPING_FILTER_BOUNDARIES")}</p>
            <div className="dropdown">
              {/* <MultiSelectDropdown
                label="Default"
                isMandatory={true}
                optionsKey="Category C.Option A"
                t={t}
                type="multiselectdropdown"
                variant="treemultiselect"
                options={temp}
                onSelect={(e) => {
                  console.log(e);
                }}
              /> */}
              <Dropdown type={"treemultiselect"} t={t} config={{}} select={() => {}} />
            </div>

            <p>{t("MAPPING_FILTER_LAYERS")}</p>
            <div className="dropdown">
              <Dropdown type={"treemultiselect"} t={t} config={{}} select={() => {}} />
            </div>

            <p>{t("MAPPING_FILTER_VIRTUALISATIONS")}</p>
            <div className="dropdown">
              <Dropdown type={"treemultiselect"} t={t} config={{}} select={() => {}} />
            </div>
          </div>
        </div>
        <div className="map-container">
          <div ref={(node) => (_mapNode = node)} id="map" />
        </div>
      </div>
    </div>
  );
};

export default Mapping;
