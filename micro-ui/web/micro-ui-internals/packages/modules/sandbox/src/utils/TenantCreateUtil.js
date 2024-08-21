export const transformCreateData = (data)=>{
    return {
        tenant: {
          name:data.tenantName,
          email: data.emailId,
          code:data.tenantCode,
          userDetails: {
              "username": "AllAcessNewMDMSAd",
              "tenantId": "pg",
              "roles": [
                {
                    "name": "FSM Administrator",
                    "code": "FSM_ADMIN",
                    "tenantId": "pg"
                },
                {
                    "name": "Grievance Routing Officer",
                    "code": "GRO",
                    "tenantId": "pg"
                },
                {
                    "name": "Employee",
                    "code": "EMPLOYEE",
                    "tenantId": "pg"
                },
                {
                    "name": "FSM Desluding Operator",
                    "code": "FSM_DSO",
                    "tenantId": "pg"
                },
                {
                    "name": "FSM Employee Report Viewer",
                    "code": "FSM_REPORT_VIEWER",
                    "tenantId": "pg"
                },
                {
                    "name": "PGR Last Mile Employee",
                    "code": "PGR_LME",
                    "tenantId": "pg"
                },
                {
                    "name": "System",
                    "code": "SYSTEM",
                    "tenantId": "pg"
                },
                {
                    "name": "MDMS Admin",
                    "code": "MDMS_ADMIN",
                    "tenantId": "pg"
                },
                {
                    "name": "SUPER USER",
                    "code": "SUPERUSER",
                    "tenantId": "pg"
                },
                {
                    "name": "Citizen",
                    "code": "CITIZEN",
                    "tenantId": "pg"
                },
                {
                    "name": "Department Grievance Routing Officer",
                    "code": "DGRO",
                    "tenantId": "pg"
                },
                {
                    "name": "HRMS Admin",
                    "code": "HRMS_ADMIN",
                    "tenantId": "pg"
                }
            ],
              "type": "EMPLOYEE"
          },
      },
    }

}