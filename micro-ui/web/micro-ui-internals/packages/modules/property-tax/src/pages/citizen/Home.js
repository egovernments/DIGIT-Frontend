import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Loader, MenuCard, MenuCardWrapper, Accordion, AccordionList } from "@egovernments/digit-ui-components";
import { useHistory } from "react-router-dom";

const Home = ({ }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const onClickHandler = (link) => {
        history.push(`/${window.contextPath}/citizen/pt/${link}`);
    };

    return (
        <React.Fragment>
            <div style={{ display: 'flex', flexDirection: "column", gap: "24px" }}>
                <MenuCardWrapper>
                    <MenuCard
                        icon="PropertyHouse"
                        menuName={t("PAY_PROPERTY_TAX")}
                        onClick={() => onClickHandler("search-property")}
                        styles={{}}
                    />
                    <MenuCard
                        icon="PropertyHouse"
                        menuName={t("PT_CREATE_NEW_PROPERTY_BUTTON")}
                        onClick={() => onClickHandler("assessment-form")}
                        styles={{}}
                    />
                    <MenuCard
                        icon="PropertyHouse"
                        menuName={t("PT_MY_PROPERTIES")}
                        onClick={() => onClickHandler("my-properties")}
                        styles={{}}
                    />
                    <MenuCard
                        icon="PropertyHouse"
                        menuName={t("PT_MY_APPLICATIONS")}
                        onClick={() => onClickHandler("my-applications")}
                        styles={{}}
                    />
                </MenuCardWrapper>

                <AccordionList>
                    <Accordion
                        number={1}
                        title={t("HOW_IT_WORKS")}
                    >
                        <p>{t("HOW_IT_WORKS_DESCRIPTION")}</p>
                    </Accordion>
                    <Accordion
                        number={2}
                        title={t("PT_EXAMPLE")}
                    >
                        <>
                            <p>{t("Property Tax is calculated based on rates stipulated by the Department of Local Government, Punjab.")}</p>
                            <AccordionList allowMultipleOpen={true} addDivider={true}>
                                <Accordion number={1} title={t("Residential Example")}>
                                    <div className="pt-example-details">
                                        <p style={{ margin: "0px" }}>
                                            a. Plot Size: 200 sq yards
                                        </p>
                                        <p style={{ margin: "0px" }}>
                                            b. Ground Floor total built-up area: 150 sq yards (1350 sq ft)
                                        </p>
                                        <p style={{ margin: "0px" }}>
                                            c. Vacant Land (a-b): 50 sq yards (450 sqft)
                                        </p>
                                        <p style={{ margin: "0px" }}>
                                            d. 1st Floor built-up area: 100 sq yards (900 sq ft)
                                        </p>
                                        <p style={{ margin: "0px" }}>
                                            Calculation of Property Tax:
                                            <br />
                                            150 (b) × Rs. 2/sq yard = Rs. 300
                                            <br />
                                            50 (c) × Re. 1/sq yard = Rs. 50
                                            <br />
                                            100 (d) × Re. 1/sq yard = Rs. 100
                                            <br />
                                            Net Property Tax: Rs. 450
                                        </p>
                                    </div>
                                </Accordion>

                                <Accordion number={2} title={t("Commercial Example")}>
                                    <div className="pt-example-details">
                                        <p style={{ margin: "0px" }}>
                                            a. Total Super Built-up area: 150 sq yards
                                        </p>
                                        <p style={{ margin: "0px" }}>
                                            Calculation of Property Tax:
                                            <br />
                                            150 (a) × Rs. 36/sq yard = Rs. 5,400
                                            <br />
                                            Net Property Tax: Rs. 5,400
                                        </p>
                                    </div>
                                </Accordion>
                            </AccordionList>
                        </>

                    </Accordion>
                </AccordionList>
            </div>
        </React.Fragment>
    );
};

export default Home;