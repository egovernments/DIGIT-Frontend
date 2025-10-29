import { Card, Header } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { diffAsText } from "unidiff";
import { parseDiff, Diff, Hunk } from "react-diff-view";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { TextBlock } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-components";


const formatString = (value) => {
  const updatedValue = typeof value == "string" ? value : JSON.stringify(value);
  return JSON.stringify(JSON.parse(updatedValue), null, 4);
};

const getDataPath = (module) => {
  switch (module) {
    case "MDMS":
      return "keyValueMap.data.value";
    default:
      return "keyValueMap";
  }
};
const User = (props) => {
  const reqCriteria = {
    url: `/user/_search`,
    params: {},
    body: {
      uuid: [props.id],
    },
    config: {
      enabled: true,
      select: (data) => {
        return data?.user?.[0]?.name || "";
      },
    },
  };
  const { isLoading, data, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);
  if (isLoading) {
    return null;
  }
  return <span>{data}</span>;
};

const AuditHistory = (props) => {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const { id, tenantId } = Digit.Hooks.useQueryParams();
  const reqCriteria = {
    url: `/audit-service/log/v1/_search`,
    params: {
      offset: pagination?.offset,
      limit: pagination?.limit,
      tenantId: tenantId,
      objectId: id,
    },
    body: {},
    config: {
      enabled: true,
      select: (data) => {
        return data?.AuditLogs?.sort((x, y) => y?.changeDate - x?.changeDate) || [];
      },
    },
  };
  const { isLoading, data, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);
  return (
    <React.Fragment>
      {isLoading || (isFetching &&   <Loader page={false} variant={"Basic"} />
)}

      <Header>{t("AUDIT_HISTORY")}</Header>

      {data?.map((row, index) => {
        const value = _.get(row, getDataPath(row.module), "");
        const currentData = formatString(value);
        const oldData = data.length > index + 1 ? formatString(_.get(data?.[index + 1], getDataPath(row.module), "")) : "";
        const diffText = diffAsText(oldData, currentData);
        const [diff] = parseDiff(diffText, { nearbySequences: "zip" });
        return (
          <Card>
            <div className="audit-history">
              <main>
                <Diff viewType="split" diffType="" hunks={diff.hunks || EMPTY_HUNKS}>
                  {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
                </Diff>
              </main>
              <span>
                <TextBlock
                  // body={`${index + 1 == data.length ? t("CORE_CREATED_BY") : t("CORE_UPDATED_BY")}  $}`}
                  subHeader={`${index + 1 == data.length ? t("CORE_CREATED_ON") : t("CORE_UPDATED_ON")} ${Digit.DateUtils.ConvertEpochToDate(
                    row?.changeDate
                  )}`}
                />
                <span>
                  {index + 1 == data.length ? t("CORE_CREATED_BY") : t("CORE_UPDATED_BY")} <User id={row?.userUUID}></User>
                </span>
              </span>
            </div>
          </Card>
        );
      })}
    </React.Fragment>
  );
};

export default AuditHistory;
