import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, LabelFieldPair, TextInput, Dropdown, CheckBox, Header, RadioButtons } from "@egovernments/digit-ui-react-components";

const EstimateComponent = ({ onSelect, ...props }) => {
    const { t } = useTranslation();

    // Options for dropdown fields (example options, adjust as needed)

    const [paymentType, setPaymentType] = useState(t("CS_PAYMENT_FULL_AMOUNT"));

    const categoryOptions = [
        { code: "CAT1", name: "Category 1" },
        { code: "CAT2", name: "Category 2" },
        { code: "CAT3", name: "Category 3" },
    ];

    const categoryOptions1 = [
        "Category 1" ,
        "Category 2" ,
        "Category 3"
    ];

    const uomOptions = [
        { code: "METER", name: "Meter" },
        { code: "KG", name: "Kilogram" },
        { code: "LITRE", name: "Litre" },
    ];

    // State for storing estimate data
    const [estimateData, setEstimateData] = useState({
        sorId: "",
        category: null,
        name: "",
        description: "",
        unitRate: "",
        numberOfUnits: "",
        uom: null,
        length: "",
        width: "",
        isActive: false,
    });

    // Function to update the field value
    const handleUpdateField = (field, value) => {
        setEstimateData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Calling onSelect to update the value in form data
    useEffect(() => {
        onSelect("estimateDetails", estimateData);
    }, [estimateData]);

    return (
        <div>

            <Header styles={{ fontSize: "24px", color: "blue" }}>
                Provide the following details
            </Header>

            <p>
                Please answer the following questions with appropriate answers so that
                we can provide an ideal estimate assumption form for .
            </p>

            <div style={{ backgroundColor: "#eee", border: "1px solid #d6d5d4", padding: "1.5rem", marginBottom: "1.5rem" }}>

                <LabelFieldPair style={{ display: "block" }}>
                    <div>
                        <div style={{fontSize:"1rem", fontWeight:"bold"}}>{t("How is the campaign distribution process happening?")}</div>
                    </div>

                    <Dropdown
                        style={{ width: "100%", display: "block", marginTop: "1rem" }}
                        t={t}
                        option={categoryOptions}
                        optionKey={"name"}
                        selected={categoryOptions.find(i => i.code === estimateData.category)}
                        select={(value) => handleUpdateField("category", value.code)}
                    />

                </LabelFieldPair>
            </div>

            


            <div style={{ backgroundColor: "#eee", border: "1px solid #d6d5d4", padding: "1.5rem", marginBottom: "1.5rem" }}>
                <LabelFieldPair style={{ display: "block" }}>
                    <div>
                        <div style={{fontSize:"1rem", fontWeight:"bold"}}>{t("Is the registration and distribution process happening together or separately? ")}</div>
                    </div>
                    <Dropdown
                        style={{ width: "100%", display: "block", marginTop: "1rem" }}
                        t={t}
                        option={uomOptions}
                        optionKey={"name"}
                        selected={uomOptions.find(i => i.code === estimateData.uom)}
                        select={(value) => handleUpdateField("uom", value.code)}
                    />
                </LabelFieldPair>

            </div>

            <div style={{ backgroundColor: "#eee", border: "1px solid #d6d5d4", padding: "1.5rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column" }}>

                <LabelFieldPair style={{ display: "block" }}>
                    <div style={{ width: "30%" }}>
                        <div style={{fontSize:"1rem", fontWeight:"bold"}}>{t("Name*")}</div>
                    </div>
                    <TextInput
                        name="name"
                        value={estimateData.name}
                        onChange={(event) => handleUpdateField("name", event.target.value)}
                        style={{ width: "100%", display: "block", marginTop: "1rem" }}
                    />
                </LabelFieldPair>
            </div>
            <div style={{ backgroundColor: "#eee", border: "1px solid #d6d5d4", padding: "1.5rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column" }}>

<LabelFieldPair style={{ display: "block" }}>
    <div style={{ width: "30%" }}>
        <div style={{fontSize:"1rem", fontWeight:"bold"}}>{t("Name*")}</div>
    </div>
    <RadioButtons
              selectedOption={paymentType}
              onSelect={setPaymentType}
              options={
                categoryOptions1
              }
            />

</LabelFieldPair>
</div>



        </div>
    );
};

export default EstimateComponent;





















// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Button, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";

// const EstimateComponent = ({ onSelect, ...props }) => {
//   const { t } = useTranslation();

//   // State for storing address data
//   const [addressData, setAddressData] = useState({
//     tenantId: "",
//     latitude: "",
//     longitude: "",
//     city: ""
//   });

//   // Function to update the field value
//   const handleUpdateField = (field, value) => {
//     setAddressData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Calling onSelect to update the value in form data
//   useEffect(() => {
//     onSelect("address", addressData);
//   }, [addressData]);

//   return (
//     <div style={{ backgroundColor: "#eee", border: "1px solid #d6d5d4", padding: "1.5rem", marginBottom: "1.5rem" }}>
//       <LabelFieldPair>
//         <div style={{ width: "30%" }}>
//           <span>{t("Tenant ID*")}</span>
//         </div>
//         <TextInput
//           name="tenantId"
//           value={addressData.tenantId}
//           onChange={(event) => handleUpdateField("tenantId", event.target.value)}
//         />
//       </LabelFieldPair>
//       <LabelFieldPair>
//         <div style={{ width: "30%" }}>
//           <span>{t("Latitude*")}</span>
//         </div>
//         <TextInput
//           name="latitude"
//           value={addressData.latitude}
//           onChange={(event) => handleUpdateField("latitude", event.target.value)}
//         />
//       </LabelFieldPair>
//       <LabelFieldPair>
//         <div style={{ width: "30%" }}>
//           <span>{t("Longitude*")}</span>
//         </div>
//         <TextInput
//           name="longitude"
//           value={addressData.longitude}
//           onChange={(event) => handleUpdateField("longitude", event.target.value)}
//         />
//       </LabelFieldPair>
//       <LabelFieldPair>
//         <div style={{ width: "30%" }}>
//           <span>{t("City*")}</span>
//         </div>
//         <TextInput
//           name="city"
//           value={addressData.city}
//           onChange={(event) => handleUpdateField("city", event.target.value)}
//         />
//       </LabelFieldPair>
//     </div>
//   );
// };

// export default EstimateComponent;

