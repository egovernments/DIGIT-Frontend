import React, { useEffect, useRef } from "react";
import { mount } from "hrms/HrmsModule";
import { History } from "history";

// interface AuthProps {
//   login: VoidFunction;
//   history: History<unknown>;
// }

export default ({ login, history }) => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current, { login, history });
  }, []);

  return <div ref={ref} />;
};
