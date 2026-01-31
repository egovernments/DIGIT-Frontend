export const projectStaffData = (searchResult) => {
  const getRoles = searchResult?.user?.roles ? searchResult.user.roles.map((role) => `ACCESSCONTROL_ROLES_ROLES_${role?.code}`).join(",") : "NA";

  return {
    cards: [
      {
        sections: [
          {
            type: "DATA",
            values: [
              { key: "WBH_USERNAME", value: searchResult?.code || "NA" },
              { key: "WBH_NAME", value: searchResult?.user?.name || "NA" },
              { key: "WBH_MOBILENO", value: searchResult?.user?.mobileNumber || "NA" },
              { key: "WBH_BOUNDARY", value: searchResult?.jurisdictions?.[0]?.boundary || "NA" },
              { key: "WBH_BOUNDARY_TYPE", value: searchResult?.jurisdictions?.[0]?.boundaryType || "NA" },
              { key: "WBH_ROLES", value: getRoles },
            ],
          },
        ],
      },
    ],
  };
};
