import React from "react";
import { Route, Routes } from "react-router-dom";
import { EmployeePages, CitizenPages } from "../pages";
import "./CoreNewApp.scss";

const CoreNewApp = () => {
  return (
    <Routes>
      {/* Employee Routes */}
      <Route path="/employee/language-selection" element={<EmployeePages.LanguageSelection />} />
      
      {/* Citizen Routes */}
      <Route path="/citizen/language-selection" element={<CitizenPages.LanguageSelection />} />
    </Routes>
  );
};

export default CoreNewApp;