import React, { useEffect, useRef } from "react";
import { mount } from "dashboard/DashboardModule";

export default () => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current);
  }, []);

  return <div ref={ref} />;
};
