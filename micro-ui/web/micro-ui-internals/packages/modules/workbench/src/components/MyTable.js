import React from 'react'
import { useTranslation } from 'react-i18next'

const MyTable = () => {
    const {t} = useTranslation();
  return (
    <table style={{border: "2px solid black", marginBottom: "12px"}}>
        <tr style={{border: "2px solid black", margin: "12px"}}>
            <th> {t("Usage Type")}</th>
            <th> {t("Usage Name")}</th>
            <th> {t("Qty.")} </th>
        </tr>
        <tr style={{border: "2px solid black", margin: "12px"}}>
        <td>
          <select>
            <option value="Material">{t("Material")}</option>
            <option value="Linguistic">{t("Linguistic")}</option>
          </select>
        </td>
        <td><input type="text" placeholder="Enter Usage Name"/></td>
        <td><input type="number" placeholder="Enter Quantity"/></td>
      </tr>
    </table>
  )
}

export default MyTable