import React from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";
import { Card, TextBlock } from "@egovernments/digit-ui-components";
import { SCHEME } from "../configs/schemeConfigs";
import { useHistory } from "react-router-dom";

const Programs = ({}) => {
  // const Program=[]
  const history = useHistory();
  const reqCriteria = {
    url: "/mdms-v2/v2/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getStateId(),
        schemaCode: SCHEME.SCHEMES_SCHEMA_CODE,
      },
    },
    config: {
      select: (data) => {
        return data?.mdms?.map((obj) => ({ ...obj?.data?.en, id: obj?.data?.id }));
      },
    },
  };
  const { isLoading, data } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="programs-all">
      <Card type={"primary"} className="program-card-primary">
        <TextBlock
          caption=""
          captionClassName=""
          header="Schemes"
          headerClasName=""
          subHeader=""
          subHeaderClasName=""
          body="find all the schemes avallible here"
          bodyClasName=""
        ></TextBlock>

        {data?.map((prog) => {
          return (
            <div
              className="program-list"
              key={prog?.id}
              onClick={() => {
                history.push(`/${window?.contextPath}/individual/program/${prog?.id}`);
              }}
            >
              <Card type={"secondary"}>
                <TextBlock
                  caption={prog?.id}
                  captionClassName=""
                  header={prog?.schemeContent?.briefDescription}
                  headerClasName=""
                  subHeader={prog?.schemeContent?.detailedDescription?.[0]?.children?.[0]?.children?.[0]?.text}
                  subHeaderClasName=""
                  body={prog?.schemeContent?.benefits?.[0]?.children?.[0]?.text}
                  bodyClasName=""
                ></TextBlock>
              </Card>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default Programs;
