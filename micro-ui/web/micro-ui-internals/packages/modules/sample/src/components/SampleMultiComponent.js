import { AddNewIcon } from "@egovernments/digit-ui-components";
import { AddIcon, Button, Dropdown, DustbinIcon, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
        <div style={{ width: "30%" }}>
          <span>{`${t("Select Type")}`}</span>
        </div>
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
        <div style={{ width: "30%" }}>
          <span>{`${t("Select Sub-Type")}`}</span>
        </div>
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
          <div style={{ width: "30%" }}>
            <span>{`${t("Select Catogory")}`}</span>
          </div>
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
          <div style={{ width: "30%" }}>
            <span>{`${t("Select Role")}`}</span>
          </div>
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
