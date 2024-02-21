import React, { useEffect, useRef } from "react";
import { mount } from "common/CommonModule";

export default ({ login, history }) => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current, { login, history });
  }, []);

  return <div ref={ref} />;
};
