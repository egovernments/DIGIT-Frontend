import { AddNewIcon } from "@egovernments/digit-ui-components";
import { AddIcon, Button, Dropdown, DustbinIcon, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import {} from "./";

const AddressDetailsComponent = ({ onSelect, ...props }) => {
  const { t } = useTranslation();

  //   const [documentData, setDocumentData] = useState({});

  const [options, setOptions] = useState([true, false]);

  const [addressData, setAddressData] = useState([
    {
      tenantid: "12",
      longitude: 21,
      latitude: 21,
      city: "city",
    },
  ]);

  // when doc update calling onselect for update the value in formdata
  useEffect(() => {
    onSelect("address", addressData);
  }, [addressData]);

  //   fn to update the value based on key.
  const handleUpdateField = ({ key, value, item, index }) => {
    setAddressData((prev) => {
      return prev.map((i, n) => {
        if (n === index) {
          return {
            ...i,
            [key]: value,
          };
        }
        return i;
      });
    });
  };

  return (
    <>
      {addressData?.map((item, index) => (
        <div
          style={{
            backgroundColor: "#eee",
            border: "1px solid #d6d5d4",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* // tenantId*/}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Tenant Id")}`}</span>
            </div>
            <TextInput
              name="name"
              key="tenantid"
              value={item.tenantid || ""}
              onChange={(event) => {
                handleUpdateField({ key: "tenantid", value: event.target.value, item: item, index: index });
                console.log(event);
                console.log(item);
                console.log(index);
              }}
            />
          </LabelFieldPair>

          {/* Longitude */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Longitude")}`}</span>
            </div>
            <TextInput
              name="name"
              key="longitude"
              value={item.longitude}
              onChange={(event) => handleUpdateField({ key: "longitude", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* Latitude */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Latitude")}`}</span>
            </div>
            <TextInput
              name="name"
              key="latitude"
              value={item.latitude || ""}
              onChange={(event) => handleUpdateField({ key: "latitude", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* City  */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("City ")}`}</span>
            </div>
            <TextInput
              name="name"
              key="city"
              value={item.city || ""}
              onChange={(event) => handleUpdateField({ key: "city", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>
        </div>
      ))}
    </>
  );
};

export default AddressDetailsComponent;
