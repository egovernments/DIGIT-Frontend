import React from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";
import { Card, TextBlock, Button, ViewCardFieldPair, Tag } from "@egovernments/digit-ui-components";
import { SCHEME } from "../configs/schemeConfigs";
import { useParams, useHistory } from "react-router-dom";

const Program = ({}) => {
  // const Program=[]
  const history = useHistory();

  const { id } = useParams();

  const reqCriteria = {
    url: "/mdms-v2/v2/_search",
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getStateId(),
        schemaCode: SCHEME.SCHEMES_SCHEMA_CODE,
        uniqueIdentifiers: [id],
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
          header="Scheme"
          headerClasName=""
          subHeader={data?.[0]?.id}
          subHeaderClasName=""
          body=""
          bodyClasName=""
        ></TextBlock>

        {data?.map((prog) => {
          return (
            <div className="program-list" key={prog?.id}>
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
                {prog?.applicationProcess?.map((applicationProcess) => (
                  <ViewCardFieldPair
                    className=""
                    label={`Mode : ${applicationProcess?.mode}`}
                    style={{}}
                    value={`${applicationProcess?.process?.[0]?.children?.[0]?.children?.[0]?.text}`}
                  />
                ))}
                <ViewCardFieldPair
                  className=""
                  label={`${prog?.basicDetails?.schemeName}`}
                  style={{}}
                  value={`${prog?.basicDetails?.schemeShortTitle}`}
                />
                <ViewCardFieldPair className="" label={`${prog?.eligibilityCriteria?.eligibilityDescription_md}`} style={{}} value={""} />
                {prog?.eligibilityCriteria?.eligibilityDescription?.map((eligibilityDescription) => {
                  return eligibilityDescription?.children?.map((eligibilityDescriptionChildren) => {
                    return eligibilityDescriptionChildren?.children?.map((obj) => {
                      return <li>{obj?.text}</li>;
                    });
                  });
                })}
                <ViewCardFieldPair
                  className=""
                  label={`${prog?.basicDetails?.offeringEntity?.name}`}
                  style={{}}
                  value={`${prog?.basicDetails?.offeringEntity?.department?.label}`}
                />
                <ViewCardFieldPair className="" label={`Related to`} style={{}} value={``} />
                <div
                  style={{
                    display: "flex",
                    columnGap: "inherit",
                  }}
                >
                  {prog?.basicDetails?.tags?.map((tagname) => {
                    return <Tag icon="" label={tagname} labelStyle={{}} showIcon={false} style={{}} type="success" />;
                  })}
                </div>

                <div className="program-apply-wrapper">
                  <Button
                    className="custom-class"
                    icon="ArrowForward"
                    iconFill=""
                    isSuffix
                    label="Apply"
                    onClick={() => {
                      history.push(`/${window?.contextPath}/individual/enroll/${id}`);
                    }}
                    options={[]}
                    optionsKey=""
                    size=""
                    style={{}}
                    title=""
                  />
                </div>
              </Card>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default Program;
