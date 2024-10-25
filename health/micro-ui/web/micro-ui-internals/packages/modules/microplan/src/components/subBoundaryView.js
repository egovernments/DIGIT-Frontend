import React, { useState } from 'react'
import HeaderComp from './HeaderComp';
import { Card, Button, PopUp, Chip, Loader } from '@egovernments/digit-ui-components';
import { ShowMoreWrapper } from './ShowMoreWrapper';
import { useTranslation } from 'react-i18next';

const SubBoundaryView = ({ title, arr,style }) => {
    const [showPopUp, setShowPopUp] = useState(false);
    const { t } = useTranslation();

    const openPopUp = () => {
        setShowPopUp(true);
      };

    return (
        <div>
            {
                arr && arr.length > 0 ? (
                    <Card type={"secondary"} style={style}>
                        <HeaderComp title={title} />
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