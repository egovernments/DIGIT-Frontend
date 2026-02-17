import React, { Fragment, useEffect, useState } from "react";
import AppConfiguration from "./AppConfiguration";

function IntermediateWrapper({ variant, screenConfig, submit, back, showBack, parentDispatch, localeModule, pageTag, onNext, isUpdating, pageType, viewMode, ...props }) {
  return <AppConfiguration onNext={onNext} isUpdating={isUpdating} pageType={pageType} viewMode={viewMode} />;
}

export default React.memo(IntermediateWrapper);
