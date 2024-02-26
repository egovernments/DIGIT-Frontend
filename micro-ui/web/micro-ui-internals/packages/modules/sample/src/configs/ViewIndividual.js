import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const data = (individual) => {
  const { t } = useTranslation();

  return {
    cards: [
      {
        sections: [
          {
            type: "DATA",
            values: [
              {
                key: "Applicant name",
                value: individual?.Individual?.[0]?.name?.givenName || "NA" ,
              },
              {
                key : "Applicant Id",
                value :individual?.Individual?.[0]?.identifiers?.[0].id || "NA",
              }
            ],
          },
        ],
      },
    ]
  };
};