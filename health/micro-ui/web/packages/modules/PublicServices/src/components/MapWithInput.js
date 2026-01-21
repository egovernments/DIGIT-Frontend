import React, { useState, useRef, useEffect } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CustomSVG, Button, TextInput } from "@egovernments/digit-ui-components";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// Fix default icon issue in React builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapWithInput = (props) => {
  const user_type = window?.Digit?.SessionStorage?.get("userType")||"employee";
  const { t } = useTranslation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [markerPos, setMarkerPos] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);

  // Extract field name and value from props structure
  const fieldName = props?.config?.populators?.name || "mapcoord";
  const fieldValue = props?.data?.[fieldName] || "";
  const fieldLabel = props?.config?.label || "Map Coordinates";
  const isRequired = props?.config?.isMandatory || false;
  const isDisabled = props?.config?.populators?.disable || false;

  // Initialize coordinates from props value and update when fieldValue changes
  useEffect(() => {
    if (fieldValue) {
      const coords = parseCoordinates(fieldValue?.value);
      if (coords) {
        setCoords(coords);
        setMarkerPos([coords.lat, coords.lng]);
      }
    } else {
      // Reset coordinates if field value is empty
      setCoords({ lat: "", lng: "" });
      setMarkerPos(null);
    }
  }, [fieldValue]);

  const parseCoordinates = (value) => {
    if (!value) return null;
    const parts = value.split(",").map(part => part.trim());
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return null;
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
    setMarkerPos([lat, lng]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Use a geocoding service (you can replace with your preferred service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        setCoords({ lat: latitude.toFixed(6), lng: longitude.toFixed(6) });
        setMarkerPos([latitude, longitude]);
        
        // Center map on the found location
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
        }
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = () => {
    const coordinateString = `${coords.lat}, ${coords.lng}`;

    // Update the form data directly
    if (props?.data && fieldName) {
      props.data[fieldName] = coordinateString;
    }

    props.setValue(fieldName, coordinateString);
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    // Reset to original value
    if (fieldValue) {
      const originalCoords = parseCoordinates(fieldValue?.value);
      if (originalCoords) {
        setCoords(originalCoords);
        setMarkerPos([originalCoords.lat, originalCoords.lng]);
      }
    } else {
      setCoords({ lat: "", lng: "" });
      setMarkerPos(null);
    }
    setIsPopupOpen(false);
  };

  const handleIconClick = () => {
    if (isDisabled) return;
    setIsPopupOpen(true);
    // Focus search input when popup opens
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleInputChange = (event) => {
    // Allow manual input changes
    if (props?.onChange) {
      props.onChange(event);
    }
    
    // Update internal state if the input contains valid coordinates
    const value = event.target.value;
    if (value) {
      const coords = parseCoordinates(value?.value);
      if (coords) {
        setCoords(coords);
        setMarkerPos([coords.lat, coords.lng]);
      }
    } else {
      setCoords({ lat: "", lng: "" });
      setMarkerPos(null);
    }
  };

  const disabledColor = "#D6D5D4";
  const iconColor = "#505A5F";

  const inputClassNameForMandatory = `${
    user_type ? "digit-employeeCard-inputError" : "digit-card-inputError"
  } ${isDisabled ? "disabled" : ""} ${props.customClass || ""} ${
    props.nonEditable ? "noneditable" : ""
  }`;

  const inputClassName = `${
    user_type ? "digit-employeeCard-input" : "digit-citizenCard-input"
  } ${isDisabled ? "disabled" : ""} focus-visible ${
    props.errorStyle ? "digit-employeeCard-inputError" : ""
  } ${props.nonEditable ? "noneditable" : ""} ${props.customClass || ""}`;

  const inputContainerClass = `input-container ${props.populators?.customIcon ? "withIcon" : ""}`;

  return (
    <React.Fragment>
      <div
        className={`digit-text-input-field ${
          user_type === "employee" ? "" : "digit-text-input-field-width"
        } ${props?.className ? props?.className : ""} ${
          isDisabled ? "disabled" : ""
        } ${props.nonEditable ? "noneditable" : ""} ${
          props.error ? "error" : ""
        }`}
        style={props?.textInputStyle ? { ...props.textInputStyle } : {}}
      >
        {isRequired ? (
          <div className={inputContainerClass}>
            <input
              type="text"
              name={fieldName}
              id={props?.id}
              className={inputClassNameForMandatory}
              placeholder={t("MAP_PLACEHOLDER")}
              value={fieldValue || ""}
              onChange={handleInputChange}
              ref={props.inputRef}
              style={{ ...props.style }}
              readOnly={props.nonEditable}
              disabled={isDisabled}
              autoComplete="off"
            />
            <span
              className="digit-cursor-pointer"
              onClick={isDisabled || props.nonEditable ? undefined : handleIconClick}
            >
              <CustomSVG.LocationIcon
                fill={isDisabled ? disabledColor : props?.nonEditable ? "#b1b4b6" : iconColor}
                className={`digit-text-input-customIcon ${
                  isDisabled ? "disabled" : ""
                } ${props.nonEditable ? "nonEditable" : ""}`}
              />
            </span>
          </div>
        ) : (
          <div className={inputContainerClass}>
            <input
              type="text"
              name={fieldName}
              id={props.id}
              className={inputClassName}
              placeholder={t("MAP_PLACEHOLDER")}
              value={fieldValue || ""}
              onChange={handleInputChange}
              ref={props.inputRef}
              style={{ ...props.style }}
              readOnly={props.nonEditable}
              disabled={isDisabled}
              autoComplete="off"
            />
            <span
              className="digit-cursor-pointer"
              onClick={isDisabled || props.nonEditable ? undefined : handleIconClick}
            >
              <CustomSVG.LocationIcon
                fill={isDisabled ? disabledColor : props?.nonEditable ? "#b1b4b6" : iconColor}
                className={`digit-text-input-customIcon ${
                  isDisabled ? "disabled" : ""
                } ${props.nonEditable ? "nonEditable" : ""}`}
              />
            </span>
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="digit-map-popup-overlay" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div className="digit-map-popup" style={{
            backgroundColor: "white",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "800px",
            height: "80%",
            maxHeight: "600px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
          }}>
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                Select Location
              </h3>
              <button
                onClick={handleCancel}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#666"
                }}
              >
                ×
              </button>
            </div>

            {/* Search Bar */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e0e0e0"
            }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <TextInput
                  ref={searchInputRef}
                  type="text"
                  placeholder={t("MAP_SEARCH_FOR_LOCATION")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  style={{
                    flex: 1
                  }}
                  textInputStyle={{ width: "84%" }}
                />
                <Button
                  label={isSearching ? "Searching..." : "Search"}
                  onClick={handleSearch}
                  disabled={isSearching}
                  type="button"
                />
              </div>
            </div>

            {/* Map Container */}
            <div style={{ flex: 1, position: "relative" }}>
              <Map
                ref={mapRef}
                center={markerPos || [20.5937, 78.9629]}
                zoom={markerPos ? 15 : 5}
                style={{ height: "100%", width: "100%" }}
                onClick={handleMapClick}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markerPos && <Marker position={markerPos} />}
              </Map>
            </div>

            {/* Coordinates Display */}
            <div style={{
              padding: "12px 20px",
              backgroundColor: "#f8f9fa",
              borderTop: "1px solid #e0e0e0"
            }}>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
                Selected Coordinates:
              </div>
              <div style={{ fontSize: "16px", fontWeight: "500" }}>
                {coords.lat && coords.lng ? `${coords.lat}, ${coords.lng}` : "Click on the map to select coordinates"}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              padding: "16px 20px",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end"
            }}>
              <Button
                label="Cancel"
                onClick={handleCancel}
                type="button"
                variation="secondary"
              />
              <Button
                label="Submit"
                onClick={handleSubmit}
                disabled={!coords.lat || !coords.lng}
                type="button"
                variation="primary"
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

MapWithInput.propTypes = {
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  value: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  nonEditable: PropTypes.bool,
  errorStyle: PropTypes.bool,
  customClass: PropTypes.string,
  textInputStyle: PropTypes.object,
  error: PropTypes.string,
  id: PropTypes.string,
};

MapWithInput.defaultProps = {
  required: false,
};

export default MapWithInput; 