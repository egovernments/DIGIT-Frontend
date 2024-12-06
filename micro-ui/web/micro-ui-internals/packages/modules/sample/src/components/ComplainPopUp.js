import React , {Fragment , useState} from "react";
import { PopUp, Button , LabelFieldPair , TextInput  , Dropdown, TextArea} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const ComplainPopup = ({ showPopUp, header })=> {
    const { t } = useTranslation();
    const history = useHistory();
    const [showPopUpHere , setShowPopUp] = useState(showPopUp);
    const [date, setDate] = useState({});
    const [comment , setComment] = useState("");
    const getDownloadLabel = () => {
          if (header === "assign") {
            return "Assign Complaint";
          } else if (header === "reject") {
            return "Reject Complaint";
          } else {
            return "Resolve Complaint";
          }
      };

    return (
        showPopUpHere &&  (
            <PopUp 
                className={"custom-popup-boundary"}
                type={"default"}
                heading={getDownloadLabel()}
                children={[
                ]}
                onClose={()=>{
                    setShowPopUp(false);
                }}
                footerChildren={[
                    <Button
                      type={"button"}
                      size={"large"}
                      variation={"secondary"}
                      label={t("CANCEL")}
                      onClick={() => {
                        setShowPopUp(false);
                      }}
                    />,
                    <Button
                      type={"button"}
                      size={"large"}
                      variation={"primary"}
                      label={getDownloadLabel()}
                      onClick={() => {
                        setShowPopUp(false);
                      }}
                    />,
                  ]}
                sortFooterChildren={true}
            >
            {header === "assign" && (
              <>
                <LabelFieldPair>
                <div className="product-label-field">
                  <span>{"Date"}</span>
                  <span className="mandatory-span">*</span>
                </div>
                <TextInput
                  name="name"
                  type="date"
                  value={date}
                  onChange={(d) => {
                    setDate(d);
                  }}
                />
                </LabelFieldPair>
                <LabelFieldPair>
                <div className="product-label-field">
                  <span>{"Asssign To"}</span>
                  <span className="mandatory-span">*</span>
                </div>
                <Dropdown
                  t={t}
                  option={[
                    {
                      code: "Myself",
                      name: "Myself",
                    },
                    {
                      code: "Another User",
                      name: "Another User",
                    },
                  ]}
                  optionKey={"code"}
                  // selected={type}
                  // select={(value) => {
                  //   setStartValidation(true);
                  //   handleChange(value);
                  // }}
                  disabled= {true}
                  
                />
                </LabelFieldPair>
                <LabelFieldPair>
                <div className="product-label-field">
                  <span>{"Additional Comments"}</span>
                  <span className="mandatory-span">*</span>
                </div>
                <TextInput
                  // style={{ maxWidth: "40rem" }}
                  name="comment"
                  value={comment}
                  onChange={(event) => {
                    setComment(event.target.value);
                  }}
                />
                </LabelFieldPair>
             </>   
            )
             }
             {header === "reject" && (
              <>
                <LabelFieldPair>
                <div>
                  <span>{"Reason for rejection"}</span>
                  <span className="mandatory-span">*</span>
                </div>
                <Dropdown
                  t={t}
                  option={[
                    {
                      code: "Myself",
                      name: "Myself",
                    },
                    {
                      code: "Another User",
                      name: "Another User",
                    },
                  ]}
                  optionKey={"code"}
                  // selected={type}
                  // select={(value) => {
                  //   setStartValidation(true);
                  //   handleChange(value);
                  // }}
                  disabled= {true}
                  
                />
                </LabelFieldPair>
                <LabelFieldPair>
                <div className="product-label-field">
                  <span>{"Additional Comments"}</span>
                  <span className="mandatory-span">*</span>
                </div>
                <TextArea
                  // style={{ maxWidth: "40rem" }}
                  name="comment"
                  value={comment}
                  onChange={(event) => {
                    setComment(event.target.value);
                  }}
                />
                </LabelFieldPair>
             </>   
            )
             }
             {header === "resolve" && (
              <>
                <LabelFieldPair>
                <div className="product-label-field">
                  <span>{"Additional Comments"}</span>
                </div>
                <TextArea
                  // style={{ maxWidth: "40rem" }}
                  name="comment"
                  value={comment}
                  onChange={(event) => {
                    setComment(event.target.value);
                  }}
                />
                </LabelFieldPair>
             </>   
            )
             }
            </PopUp>

        )
    );
};

export default ComplainPopup;