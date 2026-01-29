import React, { useState } from "react";

const useTenants = () => {
    const tenantInfo = Digit.SessionStorage.get("initData")?.tenants;
    const [tenants, setTenants] = useState(tenantInfo || []);
    return tenants;
};

export default useTenants;
