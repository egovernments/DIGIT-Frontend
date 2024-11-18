import { AddNewIcon } from "@egovernments/digit-ui-components";
import { AddIcon, Button, Dropdown, DustbinIcon, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import {} from "./";

const EstimateDetailsComponent = ({ onSelect, ...props }) => {
  const { t } = useTranslation();

  //   const [documentData, setDocumentData] = useState({});

  const [options, setOptions] = useState([true, false]);

  const [documentData, setDocumentData] = useState([
    {
      sorId: "21",
      category: "category",
      name: "name",
      description: "desc",
      unitRate: 12,
      noOfunit: 21,
      uom: "uom",
      length: 2,
      width: 3,
      amountDetail: [
        {
          type: "EstimatedAmount",
          amount: 111386,
          isActive: true,
        },
      ],
      isActive: true,
    },
  ]);

  // when doc update calling onselect for update the value in formdata
  useEffect(() => {
    onSelect("estimateDetails", documentData);
  }, [documentData]);

  //   fn to update the value based on type.
  const handleUpdateField = ({ key, value, item, index }) => {
    setDocumentData((prev) => {
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
      {documentData?.map((item, index) => (
        <div
          style={{
            backgroundColor: "#eee",
            border: "1px solid #d6d5d4",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* // Sor Id */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("SOR Id")}`}</span>
            </div>
            <TextInput
              name="name"
              key="sor"
              value={item.sorId || ""}
              onChange={(event) => {
                handleUpdateField({ key: "sorId", value: event.target.value, item: item, index: index });
                console.log(event);
                console.log(item);
                console.log(index);
              }}
            />
          </LabelFieldPair>

          {/* category */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Category")}`}</span>
            </div>
            <TextInput
              name="name"
              key="category"
              value={item.category}
              onChange={(event) => handleUpdateField({ key: "category", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* Name */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Name")}`}</span>
            </div>
            <TextInput
              name="name"
              key="name"
              value={item.name || ""}
              onChange={(event) => handleUpdateField({ key: "name", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* Description  */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Description ")}`}</span>
            </div>
            <TextInput
              name="name"
              key="description"
              value={item.description || ""}
              onChange={(event) => handleUpdateField({ key: "description", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* Unit Rate */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Unit Rate")}`}</span>
            </div>
            <TextInput
              name="name"
              key="unitRate"
              value={item.unitRate || ""}
              onChange={(event) => handleUpdateField({ key: "unitRate", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* No of Unit */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("No of Unit")}`}</span>
            </div>
            <TextInput
              name="name"
              key="noOfunit"
              value={item.noOfunit || ""}
              onChange={(event) => handleUpdateField({ key: "noOfunit", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* UOM */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("UOM")}`}</span>
            </div>
            <TextInput
              name="name"
              key="uom"
              value={item.uom || ""}
              onChange={(event) => handleUpdateField({ key: "uom", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* Length */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Length")}`}</span>
            </div>
            <TextInput
              name="name"
              key="length"
              value={item.length || ""}
              onChange={(event) => handleUpdateField({ key: "length", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* Width */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("Width")}`}</span>
            </div>
            <TextInput
              name="name"
              key="width"
              value={item?.width || ""}
              onChange={(event) => handleUpdateField({ key: "width", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* isActive */}
          <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("isActive")}`}</span>
            </div>
            <TextInput
              name="name"
              key="isActive"
              value={item?.isActive || ""}
              onChange={(event) => handleUpdateField({ key: "isActive", value: event.target.value, item: item, index: index })}
            />
          </LabelFieldPair>

          {/* <LabelFieldPair>
            <div style={{ width: "30%" }}>
              <span>{`${t("isActive")}`}</span>
            </div>
            <Dropdown
              style={{ width: "100%" }}
              t={t}
              option={options}
              optionKey={"name"}
              selected={options?.find((i) => i.code === item?.type)}
              select={(value) => {
                handleUpdateField({ value: value, item: item, index: index });
              }}
            />
          </LabelFieldPair> */}
        </div>
      ))}
    </>
  );
};

export default EstimateDetailsComponent;
