import React, { Fragment, useEffect, useState } from "react";
import AppConfiguration from "./AppConfiguration";

function IntermediateWrapper({ variant, screenConfig, submit, back, showBack, parentDispatch, localeModule, pageTag, ...props }) {
  return <AppConfiguration />;
}

export default React.memo(IntermediateWrapper);
