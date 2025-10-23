import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Loader, MenuCard, MenuCardWrapper, Accordion, AccordionList } from "@egovernments/digit-ui-components";
import { useHistory } from "react-router-dom";

const Home = ({ }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const tenantId = Digit.ULBService.getCitizenCurrentTenant(true) || Digit.ULBService.getCurrentTenantId();
    const user = Digit.UserService.getUser();
    const [openAccordionIndex, setOpenAccordionIndex] = useState(-1);

    // Fetch ALL properties once - matching mono-ui pattern (line 167-169: fetchProperties([]))
    const { isLoading: propertiesLoading, data: allProperties } = Digit.Hooks.useCustomAPIHook({
        url: "/property-services/property/_search",
        params: {}, // Empty params to match mono-ui curl exactly
        config: {
            enabled: true,
            select: (data) => {
                const properties = data?.Properties || [];
                // Return all properties (filter on client side)
                return properties.filter(property => property.status !== "INACTIVE");
            },
        },
    });

    // Count ALL properties for "My Properties" (mono-ui line 302)
    const propertiesCount = allProperties?.length || 0;

    // Count only MUTATION properties for "My Applications" (mono-ui uses separate fetch)
    const mutationCount = allProperties?.filter(property => property.creationReason === "MUTATION").length || 0;

    const onClickHandler = (link) => {
        history.push(`/${window.contextPath}/citizen/pt/${link}`);
    };

    if (propertiesLoading) {
        return <Loader />;
    }

    return (
        <React.Fragment>
            <div style={{ display: 'flex', flexDirection: "column", gap: "24px" }}>
                <MenuCardWrapper>
                    <MenuCard
                        icon="PropertyHouse"
                        menuName={t("PT_PAYMENT_PAY_PROPERTY_TAX")}
                        onClick={() => onClickHandler("search-property")}
                        styles={{}}
                    />
                    <MenuCard
                        icon="Receipt"
                        menuName={t("CS_TITLE_MY_BILLS") || "My Bills"}
                        onClick={() => onClickHandler("my-bills")}
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
                        menuName={`${t("PT_MY_PROPERTY_SCREEN_HEADER_NEW")} ${propertiesCount}`}
                        onClick={() => onClickHandler("my-properties")}
                        styles={{}}
                    />
                    <MenuCard
                        icon="PropertyHouse"
                        menuName={`${t("PT_MUTATION_MY_APPLICATIONS_NEW")} ${mutationCount}`}
                        onClick={() => onClickHandler("my-applications")}
                        styles={{}}
                    />
                    <MenuCard
                        icon="Payment"
                        menuName={t("PT_MY_PAYMENTS_HEADER") || "My Payments"}
                        onClick={() => onClickHandler("my-payments")}
                        styles={{}}
                    />
                </MenuCardWrapper>

                {/* Navigation Links Section - matching mono-ui structure */}
                <div className="digit-accordion-wrapper">
                    {[
                        { title: t("PT_HOW_IT_WORKS") || "How It Works", route: "pt-how-it-works", index: 0 },
                        { title: t("PT_EXAMPLE") || "Property Tax Examples", route: "faq", index: 1 }
                    ].map((item) => (
                        <Accordion
                            key={item.index}
                            title={item.title}
                            hideCardBorder={false}
                            hideDivider={true}
                            isClosed={openAccordionIndex !== item.index}
                            onToggle={() => {
                                // Toggle accordion state
                                setOpenAccordionIndex(openAccordionIndex === item.index ? -1 : item.index);
                                // Navigate to the route
                                onClickHandler(item.route);
                            }}
                        >
                            <div></div>
                        </Accordion>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Home;