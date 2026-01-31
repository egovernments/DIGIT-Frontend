import { useState } from "react";

const data_hook = () => {
  const [defaultData, setDefaultData] = useState([]);

  return { defaultData, setDefaultData };
};

export default data_hook;
