import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, LabelFieldPair, HeaderComponent } from "@egovernments/digit-ui-components";

const SampleMultiComponent = ({ onSelect, ...props }) => {
  const { t } = useTranslation();
  // options for type
  const [type, setType] = useState([
    {
      code: "PERMANENT",
      category: true,
      role: true,
    },
    {
      code: "TEMPORARY",
    },
    {
      code: "CONTRACTOR",
    },
  ]);
  // options for sub-type
  const [subtype, setSubtype] = useState({
    PERMANENT: [{ code: "HRP" }, { code: "ITP" }, { code: "DEVP" }, { code: "CLOUDP" }],
    TEMPORARY: [{ code: "HRT" }, { code: "ITT" }, { code: "DEVT" }, { code: "CLOUDT" }],
    CONTRACTOR: [{ code: "HRC" }, { code: "ITC" }, { code: "DEVC" }, { code: "CLOUDC" }],
  });
  // options for category
  const [category, setCategory] = useState([
    {
      code: "CATEGORY1",
    },
    {
      code: "CATEGORY2",
    },
  ]);
  // options for role
  const [role, setRole] = useState([
    {
      code: "ROLE1",
    },
    {
      code: "ROLE2",
    },
  ]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSubType, setSelectedSubType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    onSelect("sampleDetails", {
      type: selectedType,
      subType: selectedSubType,
      category: selectedCategory,
      role: selectedRole,
    });
  }, [selectedType, selectedSubType, selectedCategory, selectedRole]);
  return (
    <>
      <LabelFieldPair>
        {/* <HeaderComponent className={`label`}>
          <div className={`label-container`}>
            <label className={`label-styles`}>{`${t("Select Type")}`}</label>
          </div>
        </HeaderComponent> */}
        <Dropdown
          style={{ width: "100%" }}
          t={t}
          option={type}
          optionKey={"code"}
          selected={type?.find((i) => i.code === selectedType?.code)}
          select={(value) => setSelectedType(value)}
        />
      </LabelFieldPair>
      <LabelFieldPair>
        {/* <HeaderComponent className={`label`}>
          <div className={`label-container`}>
            <label className={`label-styles`}>{`${t("Select Sub-Type")}`}</label>
          </div>
        </HeaderComponent> */}
        <Dropdown
          style={{ width: "100%" }}
          t={t}
          option={subtype?.[selectedType?.code]}
          optionKey={"code"}
          selected={subtype?.[selectedType?.code]?.find((i) => i.code === selectedSubType?.code)}
          select={(value) => setSelectedSubType(value)}
        />
      </LabelFieldPair>
      {selectedType?.category && (
        <LabelFieldPair>
          {/* <HeaderComponent className={`label`}>
            <div className={`label-container`}>
              <label className={`label-styles`}>{`${t("Select Catogory")}`}</label>
            </div>
          </HeaderComponent> */}
          <Dropdown
            style={{ width: "100%" }}
            t={t}
            option={category}
            optionKey={"code"}
            selected={category?.find((i) => i.code === selectedCategory)}
            select={(value) => setSelectedCategory(value)}
          />
        </LabelFieldPair>
      )}
      {selectedType?.role && (
        <LabelFieldPair>
          {/* <HeaderComponent className={`label`}>
            <div className={`label-container`}>
              <label className={`label-styles`}>{`${t("Select Role")}`}</label>
            </div>
          </HeaderComponent> */}
          <Dropdown
            style={{ width: "100%" }}
            t={t}
            option={role}
            optionKey={"code"}
            selected={role?.find((i) => i.code === selectedRole)}
            select={(value) => setSelectedRole(value)}
          />
        </LabelFieldPair>
      )}
    </>
  );
};

export default SampleMultiComponent;
