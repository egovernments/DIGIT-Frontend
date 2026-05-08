export const PGR_BASE = `/${window?.contextPath}/pgr/citizen/`;

// Employee route segments (relative, appended to match.url)
export const Employee = {
  Home: `/${window?.contextPath}/employee`,
  Inbox: "/inbox",
  ComplaintDetails: "/complaint/details/",
  CreateComplaint: "/complaint/create",
  Response: "/response",
};

// Citizen route segments (relative to citizen base path)
export const PgrRoutes = {
  ComplaintsPage: "/complaints",
  RatingAndFeedBack: "/rate/:id",
  ComplaintDetailsPage: "/complaint/details/:id",
  ReopenComplaint: "/reopen",
  Response: "/response",
};
