import React from "react";
import { PopUp, Button } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";

const FinalPopup = ({ showFinalPopUp, setShowFinalPopup, onConfirmClick})=> {
    const { t } = useTranslation();
    return (
        showFinalPopUp &&  (
            <PopUp 
                className={"custom-popup"}
                type={"default"}
                heading={t("CREATE_BOUNDARY_HIERARCHY")}
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
                        label={t("CANCEL")}
                        onClick={() => {
                            setShowFinalPopup(false);
                        }}
                    />,
                    <Button
                        type={"button"}
                        size={"large"}
                        variation={"primary"}
                        label={t("CREATE")}
                        onClick={() => {
                            onConfirmClick();
                            setShowFinalPopup(false);
                        }}
                    />
                ]}
                sortFooterChildren={true}
            >
            <div>
                {<div>{t("YOU_WON'T_BE_ABLE_TO_UNDO_THIS_STEP_OF_CREATING_HIERARCHY")}</div>}
            </div>
            </PopUp>

        )
    );
};

export default FinalPopup;