import React from 'react'
import { useTranslation } from "react-i18next";

const configSHGHOME = () => {
    const { t } = useTranslation()
    const configObj = {
        "attendencemgmt": {
            links:[
                {
                    link:`/${window?.contextPath}/citizen/attendencemgmt/view-projects`,
                    i18nKey: t("MANAGE_WAGE_SEEKERS")
                },
                {
                    link: `/${window?.contextPath}/citizen/attendencemgmt/trackattendence`,
                    i18nKey: t("TRACK_ATTENDENCE")
                },
                {
                    link: `/${window?.contextPath}/citizen/attendencemgmt/shghome`,
                    i18nKey: t("REGISTER_INDIVIDUAL")
                },
                {
                    link: `/${window?.contextPath}/citizen/attendencemgmt/shghome`,
                    i18nKey: t("INBOX")
                }
            ]
        },
        "works": {
            links:[
                {
                    link: `/${window?.contextPath}/citizen/attendencemgmt/shghome`,
                    i18nKey: t("WORK_ORDERS")
                }
            ]
        }
    }

    return configObj
}

export default configSHGHOME