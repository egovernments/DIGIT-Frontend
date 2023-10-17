import React from "react";
import { Amount } from '@egovernments/digit-ui-react-components'

const GetCell = (value) => <span className="cell-text">{value}</span>;

const renderTotalLabel = (value) => {
  return (
    <div className="total-attendence-label">
      <span>{value}</span>
    </div>
  );
};

const renderBankAccountDetails = (value) => {
    return (
      <div className="column-bank-details">
        <p className="detail">{value?.accountNo}</p>
        <p className="detail">{value?.ifsc}</p>
      </div>
    );
};

export const mustorRollDetailsTableColumns = (t) => [
  {
    Header: () => <p>{t("WORKS_SNO")}</p>,
    accessor: "sno",
    Cell: ({ value, column, row }) => {
      if (row.original.type === "total") {
        return renderTotalLabel(t(row.original.sno));
      }
      return String(t(value));
    },
  },
  {
    Header: () => <p>{t("EXP_REG_ID")}</p>,
    accessor: "registerId",
    Cell: ({ value, column, row }) => {
      return String(t(value));
    },
  },
  {
    Header: () => <p>{t("CORE_COMMON_NAME")}</p>,
    accessor: "nameOfIndividual",
    Cell: ({ value, column, row }) => {
      return String(t(value));
    },
  },
  {
    Header: () => <p>{t("EXP_FATHER_GUARDIAN_NAME")}</p>,
    accessor: "guardianName",
    Cell: ({ value, column, row }) => {
      return String(t(value));
    },
  },
  {
    Header: () => <p>{t("EXP_TOTAL_WAGE")}</p>,
    accessor: "amount",
    Cell: ({ value, column, row }) => {
      return <Amount customStyle={{ textAlign: 'right'}} value={value} t={t}></Amount>
    }
  },
  {
    Header: () => <p>{t("EXP_BANK_ACCOUNT_DETAILS")}</p>,
    accessor: "bankAccountDetails",
    Cell: ({ value, column, row }) => {
      return renderBankAccountDetails(value);
    }
  },
  // {
  //   Header: () => <p>{t("ES_COMMON_PAYMENT_STATUS")}</p>,
  //   accessor: "paymentStatus",
  //   Cell: ({ value, column, row }) => {
  //     if (row.original.type === "total") {
  //       return String(t(value));
  //     }
  //     if(value === 'PAYMENT_SUCCESS') {
  //       return <span style={{ "color":"#00703C"}}>{t(`BILL_STATUS_${value}`)}</span>
  //     } 
  //     else if(value==="PAYMENT_PENDING"){
  //       return <span style={{ "color": "#F47738" }}>{t(`BILL_STATUS_${value}`)}</span>
  //     }
  //     else {
  //       return <span style={{ "color":"#ff0000"}}>{t(`BILL_STATUS_${value}`)}</span>
  //     }
  //   }
  // }   
]