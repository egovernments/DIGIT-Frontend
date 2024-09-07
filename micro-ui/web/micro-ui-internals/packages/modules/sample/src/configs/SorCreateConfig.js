export const SorConfig = [
    {
        head:"Create_Estimate",
        body:[
            {
                inline:true,
                label:"Proposal date",
                isMandatory:true,
                key:"proposalDate",
                type:"date",
                disable:false,
                populators:{name:"proposalDate", error:"Required", }

            },
            {
                inline:true,
                label:"Status",
                isMandatory:true,
                key:"status",
                type:"text",
                disable:false,
                populators:{name:"status", error:"Required", validation:{ pattern:/^[A-Za-z]+$/i}}
            },
            {
                inline:true,
                label:"Workflow Status",
                isMandatory:true,
                key:"wfStatus",
                type:"text",
                disable:false,
                populators:{name:"wfStatus", error:"Required", validation:{ pattern:/^[A-Za-z]+$/i}}
            },
            {
                inline:true,
                label:"Name",
                isMandatory:true,
                key:"name",
                type:"text",
                disable:false,
                populators:{name:"name", error:"Required", validation:{ pattern:/^[A-Za-z]+$/i}}
            },
            {
                inline:true,
                label:"Description",
                isMandatory:true,
                key:"description",
                type:"text",
                disable:false,
                populators:{name:"description", error:"Required", validation:{pattern:/^[A-Za-z]+$/i}}
            },
            {
                inline:true,
                label:"Executing Department",
                isMandatory:true,
                key:"executingDepartment",
                type:"dropdown",
                disable:false,
                populators:{name:"executingDepartment", error:"Required", optionsKey:"name", required:true, options:[
                    {
                        code:"DEP01",
                        name:"Department-01",
                        label:"executingDepartment"
                    },
                    {
                        code:"DEP02",
                        name:"Department-02",
                         label:"executingDepartment"
                    }
                ]},
                
            },

        
        ]
    },


    {
        head:"Address",
        key:"address",
        body:[
            {
                isMandatory:true,
                // name:"addressDetails",
                key:"address",
                type:"component", // This is for custom component
                component:"AddressComponent",
                disable:false,
                withoutLabel:true,
                customProps:{},
                populators:{name:"address", required:true}
            }
        ]
    },

    {
        head:"Estimate Details",
        key:"estimateDetails",
        body:[
            {
                isMandatory:true,
                key:"estimateDetails",
                type:"component",
                component:"EstimateComponent",
                disablel:false,
                withoutLabel:true,
                customProps:{},
                populators:{name:"estimateDetails", required:true}
            }
        ]
    },

    {
        head:"Additional Details",
        key:"additionalDetails",
        body:[
            {
                isMandatory:false,
                key:"additionalDetails",
                type:"component",
                component:"SampleAdditionalComponent",
                disable:false,
                withoutLabel:true,
                customProps:{},
                populators:{name:"additionalDetails", required:true}
            },

        ],
    },


]