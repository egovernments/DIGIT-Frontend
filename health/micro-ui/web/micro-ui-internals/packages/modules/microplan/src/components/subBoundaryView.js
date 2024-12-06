import React, { useState } from 'react'
import { Header } from '@egovernments/digit-ui-react-components';
import { Card, Button, PopUp, Chip, Loader } from '@egovernments/digit-ui-components';
import { ShowMoreWrapper } from './ShowMoreWrapper';
import { useTranslation } from 'react-i18next';

const SubBoundaryView = ({ title, arr, style, editHandler, isEditable, headerStyle={fontSize:"1rem"} }) => {

  const [showPopUp, setShowPopUp] = useState(false);
  const { t } = useTranslation();

  const openPopUp = () => {
    setShowPopUp(true);
  };

  return (
    <div>
      {
        arr && arr.length > 0 ? (
          <Card type={"secondary"} className={"sub-boundary-summary-card"} style={style}>

            <div className="mp-header-container" style={{ marginBottom: "0px" }}>
              <Header className="summary-sub-heading subBoundary" styles={headerStyle}>
                {t(title)}
              </Header>
              {isEditable && editHandler && <Button
                label={t("WBH_EDIT")}
                title={t("WBH_EDIT")}
                variation="secondary"
                size="medium"
                icon={"Edit"}
                type="button"
                onClick={(e) => {
                  editHandler();
                }}
              />}
            </div>
            {/* Flex container for the chips */}
            <div className="digit-tag-container userAccessCell">
              {arr?.slice(0, 10)?.map((el, ind) => {
                return (
                  <Chip
                    key={ind}
                    className=""
                    error=""
                    extraStyles={{}}
                    iconReq=""
                    hideClose={true}
                    text={t(el)}
                  />
                );
              }


              )}
              {arr?.length > (10) && (
                <Button
                  label={`+${arr?.length - (10)} ${t("ES_MORE")}`}
                  title={`+${arr?.length - (10)} ${t("ES_MORE")}`}
                  onClick={() => openPopUp()}
                  variation="link"
                  style={{
                    height: "2rem",
                    minWidth: "4.188rem",
                    minHeight: "2rem",
                    padding: "0.5rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  textStyles={{
                    height: "auto",
                    fontSize: "0.875rem",
                    fontWeight: "400",
                    width: "100%",
                    lineHeight: "16px",
                    color: "#C84C0E",
                  }}
                />
              )}
              {showPopUp && (
                <ShowMoreWrapper
                  setShowPopUp={setShowPopUp}
                  alreadyQueuedSelectedState={arr}
                  heading={title}
                />
              )}
            </div>
          </Card>
        ) : (
          null
        )
      }

    </div>

  );

}

export default SubBoundaryView