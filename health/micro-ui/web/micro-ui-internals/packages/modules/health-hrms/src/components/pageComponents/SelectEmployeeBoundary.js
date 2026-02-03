import { LabelFieldPair, CardLabel, Loader } from "@egovernments/digit-ui-components";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BoundaryComponent = ({ t, config, onSelect, formData, index, hierarchy }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: childrenData, isLoading } = Digit.Hooks.hrms.useBoundriesFetch({
    tenantId,
    hierarchyType: hierarchy?.hierarchyType,
    config: { enabled: !!hierarchy?.hierarchyType },
  });

  // list of all levels, e.g. ["COUNTRY","STATE","LGA",...]
  const levels = hierarchy?.boundaryHierarchy?.map((i) => i.boundaryType) || [];

  const [optionsByType, setOptionsByType] = useState({});
  const [selectedByType, setSelectedByType] = useState({});

  useEffect(() => {
    // 1) wait for your array
    if (!Array.isArray(childrenData) || childrenData.length === 0) return;

    // 2) pull out the single root node
    const root = childrenData[0].boundary?.[0];
    if (!root) return;

    // DFS: find path from root → formData.code (if editing)
    const findPath = (node, code, trail = []) => {
      const here = [...trail, node];
      if (node.code === code) return here;
      for (const c of node.children || []) {
        const p = findPath(c, code, here);
        if (p.length) return p;
      }
      return [];
    };

    const path = formData?.code
      ? findPath(root, formData.code)
      : [];

    const newOpts = {};
    const newSel = {};

    if (path.length) {
      // editing: pre-populate every level in path
      path.forEach((node, idx) => {
        const type = node.boundaryType;
        newSel[type] = { ...node, hierarchyType: hierarchy.hierarchyType };

        // siblings at this level
        newOpts[type] = idx === 0
          ? [root]
          : (path[idx - 1].children || []);

        // next-level options
        if ((node.children || []).length) {
          const next = node.children[0].boundaryType;
          newOpts[next] = node.children;
        }
      });
    } else {
      // brand-new: only show root + its children
      newOpts[root.boundaryType] = [root];
    }

    setOptionsByType(newOpts);
    setSelectedByType(newSel);
  }, [childrenData, formData?.code, hierarchy.hierarchyType]);

  const handleSelection = (node) => {
    if (!node) return;
    const type = node.boundaryType;
    const idx = levels.indexOf(type);

    const opts = { ...optionsByType };
    const sel = { ...selectedByType, [type]: { ...node, hierarchyType: hierarchy.hierarchyType } };

    // clear deeper levels
    for (let i = idx + 1; i < levels.length; i++) {
      delete opts[levels[i]];
      delete sel[levels[i]];
    }

    // populate children of the selected node
    if (Array.isArray(node.children) && node.children.length) {
      opts[node.children[0].boundaryType] = node.children;
    }

    setOptionsByType(opts);
    setSelectedByType(sel);
    onSelect(config.key, sel[type]);
  };

  if (isLoading) {
    return <div
      style={{
        display: "flex",
        justifyContent: "center",  // horizontal center
        alignItems: "center",      // vertical center
        height: "100vh",           // take full viewport height
        width: "100%",             // full width
      }}
    >
      {<Loader />}
    </div>;
  }

  return (
    <LabelFieldPair>
      <CardLabel style={{ width: "50.1%" }} className="digit-card-label-smaller">
        {t("HRMS_BOUNDARY_LABEL")} {index}*
      </CardLabel>
      <div style={{ width: "100%" }}>
        {levels.map((lvl) =>
          Array.isArray(optionsByType[lvl]) && optionsByType[lvl].length > 0 ? (
            <BoundaryDropdown
              key={lvl}
              label={t(`${hierarchy.hierarchyType}_${lvl}`)}
              data={optionsByType[lvl]}
              selected={selectedByType[lvl] || null}
              onChange={handleSelection}
            />
          ) : null
        )}
      </div>
    </LabelFieldPair>
  );
};

const BoundaryDropdown = ({ label, data, onChange, selected }) => {
  const { t } = useTranslation();
  return (
    <div style={{ width: "100%", marginTop: 0, paddingLeft: 0 }}>
      <div className="comment-label">{t(label)}</div>
      <Dropdown
        style={{ width: "100%", maxWidth: "37.5rem" }}
        option={data}
        optionKey="code"
        selected={selected}
        t={t}
        select={onChange}
      />
    </div>
  );
};

export default BoundaryComponent;
