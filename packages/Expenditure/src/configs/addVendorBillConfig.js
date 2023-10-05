import { useTranslation } from "react-i18next";
import _ from "lodash";

const Vendors = [
    {
        name: 'Vendor1',
        code: 'vendor1',
        i18nKey: 'vendor1'
    },
    {
        name: 'Vendor2',
        code: 'vendor2',
        i18nKey: 'vendor2'
    }
]
export const addVendorBillConfig = (contractType) => {
    const { t } = useTranslation()

    const { data } = Digit.Hooks.useCustomMDMS(
        Digit.ULBService.getStateId(),
        'works',
        [{ name: 'BillAmountPaidTo' }],
        {
          select: (data) => {
            const optionsData = _.get(data, 'works.BillAmountPaidTo', []);
            const fllteredData = optionsData.filter((opt) => opt?.active).map((opt) => ({ ...opt, name: `EXP_${opt.code}` }));
            return {
                'Organisation_Work_Order' : fllteredData.filter(opt => (opt?.code === 'ORGANISATION' || opt?.code === 'VENDOR')),
                'Department_Purchase_Order': fllteredData.filter(opt => (opt?.code === 'DEPARTMENT' || opt?.code === 'VENDOR'))
            }
          },
          enabled: true,
        }
      );

    return {
        label: {
            submit: t("CS_COMMON_PROCEED")
        }, 
        form: [
            {
                head: t("EXP_ADD_VENDOR_BILL"),
                body: [
                {
                    isMandatory: true,
                    key: "vendor",
                    type: "dropdown",
                    label: t("VENDOR"),
                    disable: false,
                    populators: {
                        name: "vendor",
                        optionsKey: "i18nKey",
                        error: t("WORKS_REQUIRED_ERR"),
                        required: true,
                        options: Vendors
                    },
                },,
                {
                    inline: true,
                    label:t("VENDOR_ID"),
                    isMandatory: false,
                    key: "vendor_id",
                    type: "text",
                    disable: true,
                    populators: { 
                        name: "vendor_id"
                    }
                },
                {
                    inline: true,
                    label: t("EXP_BILL_AMOUNT"),
                    isMandatory: true,
                    key: "bill_amount",
                    type: "number",
                    disable: false,
                    populators: { name: "bill_amount", error: t("WORKS_REQUIRED_ERR")},
                },
                {
                    isMandatory: true,
                    key: "amount_paid_to",
                    type: "radio",
                    label: t("EXP_BILL_AMOUNT_PAID_TO"),
                    disable: false,
                    populators: {
                        name: "amount_paid_to",
                        optionsKey: "name",
                        error: t("WORKS_REQUIRED_ERR"),
                        options : data && data[contractType]
                    },
                },
                {
                    type:"multiupload",
                    label: t("WORKS_UPLOAD_FILES"),
                    populators:{
                        name: "upload_files",
                        allowedMaxSizeInMB:2,
                        maxFilesAllowed:3,
                        hintText:t("WORKS_DOC_UPLOAD_HINT_2MB"),
                        allowedFileTypes : /(.*?)(pdf|docx|msword|openxmlformats-officedocument|wordprocessingml|document|spreadsheetml|sheet)$/i,
                    }
                }
                ],
            }
        ]
    }

}