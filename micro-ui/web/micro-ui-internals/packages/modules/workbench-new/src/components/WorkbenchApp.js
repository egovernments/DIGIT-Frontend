import React from "react";
import { Route, Routes } from "react-router-dom";
import { EmployeePages } from "../pages";

const WorkbenchApp = () => {
  return (
    <Routes>
      <Route path="/master-selection" element={<EmployeePages.MasterSelection />} />
      <Route path="/master/:id/view" element={<div>Master View Page (To be implemented)</div>} />
      <Route path="/master/:id/edit" element={<div>Master Edit Page (To be implemented)</div>} />
    </Routes>
  );
};

export default WorkbenchApp;