import React from "react";
import { PopUp, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const FinalPopup = ({ showFinalPopUp, setShowFinalPopup, onConfirmClick})=> {
    const { t } = useTranslation();
    return (
        showFinalPopUp &&  (
            <PopUp 
                className={"custom-popup"}
                type={"alert"}
                alertMessage={t("YOU_WON'T_BE_ABLE_TO_UNDO_THIS_STEP_OF_CREATING_HIERARCHY")}
                alertHeading={t(I18N_KEYS.COMPONENTS.CREATE_BOUNDARY_HIERARCHY)}
                children={[
                ]}
                onClose={()=>{
                    setShowFinalPopup(false);
                }}
                onOverlayClick={()=>{
                    setShowFinalPopup(false);
                }}
                style={{
                    // height:"11rem"
                    width: "50rem"
                }}
                footerChildren={[
                    <Button
                        type={"button"}
                        size={"large"}
                        variation={"secondary"}
                        label={t(I18N_KEYS.COMMON.CANCEL)}
                        title={t(I18N_KEYS.COMMON.CANCEL)}
                        onClick={() => {
                            setShowFinalPopup(false);
                        }}
                    />,
                    <Button
                        type={"button"}
                        size={"large"}
                        variation={"primary"}
                        label={t(I18N_KEYS.COMPONENTS.CREATE)}
                        title={t(I18N_KEYS.COMPONENTS.CREATE)}
                        onClick={() => {
                            onConfirmClick();
                            setShowFinalPopup(false);
                        }}
                    />
                ]}
                sortFooterChildren={true}
            >
            </PopUp>

        )
    );
};

export default FinalPopup;