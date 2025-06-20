
import React, { useState, useEffect, Fragment, useReducer } from "react";

export const Test = () => {
    

return (


<div class="app-container">
<div class="sidebar">
  Left Side Menu
</div>

<div class="main-content">
  <div class="top-bar">
     Top Heading / Navigation
  </div>
  <div class="preview-container">
    {/* <div class="mobile-preview">
       Mobile screen content
    </div> */}
    <div class="preview-container">
<div class="preview-group">
  <div class="mobile-preview">
     Your in-device form UI
  </div>

  <div class="navigation-controls">
    <button class="nav-button">← Previous</button>
    <div class="page-number">Page 2 / 7</div>
    <button class="nav-button">Next →</button>
  </div>
</div>
</div>
  </div>
</div>

<div class="settings-panel">
   Right-side Configuration
</div>
</div>)
}