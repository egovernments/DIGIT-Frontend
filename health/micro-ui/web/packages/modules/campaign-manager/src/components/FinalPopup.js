import React from "react";
import { PopUp, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { LOCALIZATION } from "../constants/localizationConstants";

const FinalPopup = ({ showFinalPopUp, setShowFinalPopup, onConfirmClick})=> {
    const { t } = useTranslation();
    return (
        showFinalPopUp &&  (
            <PopUp
                className={"custom-popup"}
                type={"alert"}
                alertMessage={t(LOCALIZATION.YOU_WONT_BE_ABLE_TO_UNDO_THIS_STEP)}
                alertHeading={t(LOCALIZATION.CREATE_BOUNDARY_HIERARCHY)}
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
                        label={t(LOCALIZATION.CANCEL)}
                        onClick={() => {
                            setShowFinalPopup(false);
                        }}
                    />,
                    <Button
                        type={"button"}
                        size={"large"}
                        variation={"primary"}
                        label={t(LOCALIZATION.CREATE)}
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