import { RadioButtons, MultiUploadWrapper,CheckBox } from "@egovernments/digit-ui-react-components";
import { Controller,useForm } from "react-hook-form";
import React from "react";

const allowedFileTypes = /(.*?)(pdf|docx|msword|openxmlformats-officedocument|wordprocessingml|document|spreadsheetml|sheet)$/i;

// const [file, setFile] = useState(null);

// const getData = (state) => {
//     let data = Object.fromEntries(state);
//     let newArr = Object.values(data);
//     selectfile(newArr[newArr.length - 1]);
// }


// function selectfile(e) {
//     e && setFile(e.file);
// }

const getConfig = (question,t,index) => {

    switch (question.type) {
        //Yes / No
        case "MULTIPLE_ANSWER_TYPE":
            return {
                isMandatory: true,
                key: question.code,
                type: "radio",
                label: `${index+1}. ${t(question?.code)}`,
                disable: false,
                populators: {
                    name: question.code,
                    optionsKey: "name",
                    error: "Required",
                    required: true,
                    options: [
                        {
                            code: "YES",
                            name: "Yes",
                        },
                        {
                            code: "NO",
                            name: "No",
                        },
                    ],
                },
            }
        case "DATE_ANSWER_TYPE":
            return {
                inline: true,
                label: `${index + 1}. ${t(question?.code)}`,
                isMandatory: true,
                //description: "Field supporting description",
                type: "date",
                disable: false,
                populators: { name: question.code, error: "Required", validation: { required: true } },
            }
        case "UPLOAD_ANSWER_TYPE":
        return {    
            type:"multiupload",
            label: `${index + 1}. ${t(question?.code)}`,
            populators:{
                name: question.code,
                allowedMaxSizeInMB:2,
                maxFilesAllowed:4,
                hintText:t("WORKS_DOC_UPLOAD_HINT_2MB"),
                allowedFileTypes : /(.*?)(pdf|docx|msword|openxmlformats-officedocument|wordprocessingml|document|spreadsheetml|sheet)$/i,
                
            }
        }

        default:
            return {
                isMandatory: true,
                key: "opt",
                type: "radio",
                label: t(question?.code),
                disable: false,
                populators: {
                    name: question.code,
                    optionsKey: "name",
                    error: "sample required message",
                    required: true,
                    options: [
                        {
                            code: "YES",
                            name: "Yes",
                        },
                        {
                            code: "NO",
                            name: "No",
                        },
                    ],
                },
            }
    }
}

export const configChecklist = (t, setShowForm, showForm, checklistData) => {
    
    const { ClosureChecklist, KickoffChecklist } = checklistData?.works
    const handleChange = (props) => {
        setShowForm((prevState)=>!prevState)
    }
    return {
        form:[
            //every object in this array is a section and incase of multiple cards every section is rendered in a separate card
            {
                head: t("WORKS_KICKOFF_CHECKLIST"),
                body: KickoffChecklist.map((question,index)=> getConfig(question,t,index))
            },
            {
                head: t("WORKS_CLOSURE_CHECKLIST"),
                body:showForm ? [
                    {
                        populators: (
                            <CheckBox
                                onChange={handleChange}
                                checked={showForm}
                                label={t("WORKS_PROJECT_COMPLETED")}
                            />
                        ),
                        hideContainer: true
                    },
                    ...ClosureChecklist.map((question, index) => getConfig(question, t, index))
                ]:[
                        {
                            populators: (
                                <CheckBox
                                    onChange={handleChange}
                                    checked={showForm}
                                    label={t("WORKS_PROJECT_COMPLETED")}
                                    name={"Checkbox"}
                                />
                            ),
                            hideContainer: true
                        },
                ],
            }
        ]
    }
}