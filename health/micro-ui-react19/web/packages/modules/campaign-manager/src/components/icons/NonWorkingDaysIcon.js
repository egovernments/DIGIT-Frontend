import React from "react";
import { PRIMARY_COLOR } from "../../utils";

export const NonWorkingDaysIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="34" height="30" rx="3" stroke={PRIMARY_COLOR} strokeWidth="2.5" fill="none" />
    <line x1="3" y1="14" x2="37" y2="14" stroke={PRIMARY_COLOR} strokeWidth="2.5" />
    <line x1="12" y1="2" x2="12" y2="9" stroke={PRIMARY_COLOR} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="28" y1="2" x2="28" y2="9" stroke={PRIMARY_COLOR} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="14" y1="21" x2="26" y2="29" stroke={PRIMARY_COLOR} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="26" y1="21" x2="14" y2="29" stroke={PRIMARY_COLOR} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
