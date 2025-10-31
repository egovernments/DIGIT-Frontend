import React, { Fragment, useEffect, useState } from "react";
import AppConfiguration from "./AppConfiguration";

function IntermediateWrapper({ variant, screenConfig, submit, back, showBack, parentDispatch, localeModule, pageTag, onNext, isUpdating, ...props }) {
  return <AppConfiguration onNext={onNext} isUpdating={isUpdating} />;
}

export default React.memo(IntermediateWrapper);
