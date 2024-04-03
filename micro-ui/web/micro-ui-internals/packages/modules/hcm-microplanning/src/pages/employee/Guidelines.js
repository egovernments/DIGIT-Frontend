import React from 'react'
import { useTranslation } from 'react-i18next'
const Guidelines = () => {
  const {t} = useTranslation()

  // Keeping inline style for now because design for this screen is not given yet
  return (
    <div style={{
      "position": "absolute",
    "top": "50%",
    "left": "50%",
    "transform": "translate(-50%, -50%)",
    "padding": "2rem",
    "font-weight": "700",
    "font-size": "2rem",
    }}>{t("CREATE_MICROPLAN_GUIDELINES")}</div>
  )
}

export default Guidelines