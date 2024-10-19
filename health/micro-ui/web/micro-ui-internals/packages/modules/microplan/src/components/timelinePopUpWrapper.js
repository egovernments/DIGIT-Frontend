import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Timeline, TimelineMolecule } from '@egovernments/digit-ui-components';
import { useMyContext } from "../utils/context";





const TimelinePopUpWrapper = ({ onClose, businessId, heading }) => {
    const { state } = useMyContext();
    const { t } = useTranslation();

    // Assume tenantId and boundaryCode are derived from the context or another prop
    const tenantId = state?.tenantId;
    const boundaryCode = state?.boundaryCode;

    const { isLoading: isUserLoading, data: workflowData, revalidate } = Digit.Hooks.useCustomAPIHook({
        url: "/egov-workflow-v2/egov-wf/process/_search",
        params: {
            tenantId: tenantId,
            history: true,
            businessIds: [businessId],
        },
    }
    );

    const hardCodeData = {
        "ResponseInfo": null,
        "ProcessInstances": [
            {
                "id": "5d07020a-b70a-4c01-b2b5-f2886b0fae7f",
                "tenantId": "mz",
                "businessService": "PLAN_ESTIMATION",
                "businessId": "cba20335-ffb0-4fc2-94d8-cfe698c8ddb0",
                "action": "EDIT_AND_SEND_FOR_APPROVAL",
                "moduleName": "plan-service",
                "state": {
                    "auditDetails": null,
                    "uuid": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                    "tenantId": "mz",
                    "businessServiceId": "14f4fa84-5c50-42b9-afa5-45f155d61013",
                    "sla": null,
                    "state": "PENDING_FOR_APPROVAL",
                    "applicationStatus": "PENDING_FOR_APPROVAL",
                    "docUploadRequired": false,
                    "isStartState": false,
                    "isTerminateState": false,
                    "isStateUpdatable": null,
                    "actions": [
                        {
                            "auditDetails": null,
                            "uuid": "8f2f27fe-48ee-412c-a1a0-84f72668f6f9",
                            "tenantId": "mz",
                            "currentState": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                            "action": "SEND_BACK_FOR_CORRECTION",
                            "nextState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER",
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "d6c47c25-35a9-4c54-9b9a-090422c24fa6",
                            "tenantId": "mz",
                            "currentState": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                            "action": "ROOT_APPROVE",
                            "nextState": "1b94c7e8-c7d1-4419-be00-0faf7872e8af",
                            "roles": [
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "f226cddf-cd73-4bd3-b726-3f1b9899b32a",
                            "tenantId": "mz",
                            "currentState": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                            "action": "APPROVE",
                            "nextState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        }
                    ]
                },
                "comment": "EDIT_AND_SEND_FOR_APPROVAL",
                "documents": null,
                "assigner": {
                    "id": 10065,
                    "userName": "ESTIMATION_APPROVER1",
                    "name": "Root resource estimation approver",
                    "type": "EMPLOYEE",
                    "mobileNumber": "9898989301",
                    "emailId": "rohit@gmail.com",
                    "roles": [
                        {
                            "id": null,
                            "name": "Super User",
                            "code": "SUPERUSER",
                            "tenantId": "mz"
                        },
                        {
                            "id": null,
                            "name": "plan estimation approver",
                            "code": "PLAN_ESTIMATION_APPROVER",
                            "tenantId": "mz"
                        }
                    ],
                    "tenantId": "mz",
                    "uuid": "47a08ceb-462a-44d2-a378-2311b948b8d5"
                },
                "assignes": [
                    {
                        "id": 10064,
                        "userName": "ROOT_ESTIMATION_APPROVER2",
                        "name": "Root resource estimation approver",
                        "type": "EMPLOYEE",
                        "mobileNumber": "9898989300",
                        "emailId": "rohit@gmail.com",
                        "roles": [
                            {
                                "id": null,
                                "name": "Super User",
                                "code": "SUPERUSER",
                                "tenantId": "mz"
                            },
                            {
                                "id": null,
                                "name": "Root plan estimation approver",
                                "code": "ROOT_PLAN_ESTIMATION_APPROVER",
                                "tenantId": "mz"
                            }
                        ],
                        "tenantId": "mz",
                        "uuid": "b3340d94-239e-45e7-a1bc-2a8f7582091c"
                    }
                ],
                "nextActions": [],
                "stateSla": null,
                "businesssServiceSla": 334756941,
                "previousStatus": null,
                "entity": null,
                "auditDetails": {
                    "createdBy": "47a08ceb-462a-44d2-a378-2311b948b8d5",
                    "lastModifiedBy": "47a08ceb-462a-44d2-a378-2311b948b8d5",
                    "createdTime": 1729155386404,
                    "lastModifiedTime": 1729155386404
                },
                "rating": 0,
                "escalated": false
            },
            {
                "id": "44de7fd4-f5d7-4a44-a12b-25108b77c42e",
                "tenantId": "mz",
                "businessService": "PLAN_ESTIMATION",
                "businessId": "cba20335-ffb0-4fc2-94d8-cfe698c8ddb0",
                "action": "SEND_BACK_FOR_CORRECTION",
                "moduleName": "plan-service",
                "state": {
                    "auditDetails": null,
                    "uuid": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                    "tenantId": "mz",
                    "businessServiceId": "14f4fa84-5c50-42b9-afa5-45f155d61013",
                    "sla": null,
                    "state": "PENDING_FOR_VALIDATION",
                    "applicationStatus": "PENDING_FOR_VALIDATION",
                    "docUploadRequired": false,
                    "isStartState": false,
                    "isTerminateState": false,
                    "isStateUpdatable": null,
                    "actions": [
                        {
                            "auditDetails": null,
                            "uuid": "45bd9163-de55-4158-bdec-0e077aecc621",
                            "tenantId": "mz",
                            "currentState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "action": "EDIT_AND_SEND_FOR_APPROVAL",
                            "nextState": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "082b5870-d3e3-4aa3-ab17-34ba4935acde",
                            "tenantId": "mz",
                            "currentState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "action": "EDIT_AND_VALIDATE",
                            "nextState": "1b94c7e8-c7d1-4419-be00-0faf7872e8af",
                            "roles": [
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "8ee5c123-73cc-4f97-8654-5031fc2c1b20",
                            "tenantId": "mz",
                            "currentState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "action": "VALIDATE",
                            "nextState": "1b94c7e8-c7d1-4419-be00-0faf7872e8af",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER",
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        }
                    ]
                },
                "comment": "SEND_BACK_FOR_CORRECTION",
                "documents": null,
                "assigner": {
                    "id": 10065,
                    "userName": "ESTIMATION_APPROVER1",
                    "name": "Root resource estimation approver",
                    "type": "EMPLOYEE",
                    "mobileNumber": "9898989301",
                    "emailId": "rohit@gmail.com",
                    "roles": [
                        {
                            "id": null,
                            "name": "Super User",
                            "code": "SUPERUSER",
                            "tenantId": "mz"
                        },
                        {
                            "id": null,
                            "name": "plan estimation approver",
                            "code": "PLAN_ESTIMATION_APPROVER",
                            "tenantId": "mz"
                        }
                    ],
                    "tenantId": "mz",
                    "uuid": "47a08ceb-462a-44d2-a378-2311b948b8d5"
                },
                "assignes": [
                    {
                        "id": 10065,
                        "userName": "ESTIMATION_APPROVER1",
                        "name": "Root resource estimation approver",
                        "type": "EMPLOYEE",
                        "mobileNumber": "9898989301",
                        "emailId": "rohit@gmail.com",
                        "roles": [
                            {
                                "id": null,
                                "name": "Super User",
                                "code": "SUPERUSER",
                                "tenantId": "mz"
                            },
                            {
                                "id": null,
                                "name": "plan estimation approver",
                                "code": "PLAN_ESTIMATION_APPROVER",
                                "tenantId": "mz"
                            }
                        ],
                        "tenantId": "mz",
                        "uuid": "47a08ceb-462a-44d2-a378-2311b948b8d5"
                    }
                ],
                "nextActions": [],
                "stateSla": null,
                "businesssServiceSla": 334756941,
                "previousStatus": null,
                "entity": null,
                "auditDetails": {
                    "createdBy": "47a08ceb-462a-44d2-a378-2311b948b8d5",
                    "lastModifiedBy": "47a08ceb-462a-44d2-a378-2311b948b8d5",
                    "createdTime": 1729154693183,
                    "lastModifiedTime": 1729154693183
                },
                "rating": 0,
                "escalated": false
            },
            {
                "id": "1e0b23f7-7058-49b4-aabd-caa8feaea0a1",
                "tenantId": "mz",
                "businessService": "PLAN_ESTIMATION",
                "businessId": "cba20335-ffb0-4fc2-94d8-cfe698c8ddb0",
                "action": "VALIDATE",
                "moduleName": "plan-service",
                "state": {
                    "auditDetails": null,
                    "uuid": "1b94c7e8-c7d1-4419-be00-0faf7872e8af",
                    "tenantId": "mz",
                    "businessServiceId": "14f4fa84-5c50-42b9-afa5-45f155d61013",
                    "sla": null,
                    "state": "VALIDATED",
                    "applicationStatus": "VALIDATED",
                    "docUploadRequired": false,
                    "isStartState": false,
                    "isTerminateState": false,
                    "isStateUpdatable": null,
                    "actions": [
                        {
                            "auditDetails": null,
                            "uuid": "35257967-ed3a-4cb9-9bbb-1fcecbf5c775",
                            "tenantId": "mz",
                            "currentState": "1b94c7e8-c7d1-4419-be00-0faf7872e8af",
                            "action": "SEND_BACK_FOR_CORRECTION",
                            "nextState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER",
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        }
                    ]
                },
                "comment": "VALIDATE",
                "documents": null,
                "assigner": {
                    "id": 10064,
                    "userName": "ROOT_ESTIMATION_APPROVER2",
                    "name": "Root resource estimation approver",
                    "type": "EMPLOYEE",
                    "mobileNumber": "9898989300",
                    "emailId": "rohit@gmail.com",
                    "roles": [
                        {
                            "id": null,
                            "name": "Super User",
                            "code": "SUPERUSER",
                            "tenantId": "mz"
                        },
                        {
                            "id": null,
                            "name": "Root plan estimation approver",
                            "code": "ROOT_PLAN_ESTIMATION_APPROVER",
                            "tenantId": "mz"
                        }
                    ],
                    "tenantId": "mz",
                    "uuid": "b3340d94-239e-45e7-a1bc-2a8f7582091c"
                },
                "assignes": null,
                "nextActions": [],
                "stateSla": null,
                "businesssServiceSla": 334756941,
                "previousStatus": null,
                "entity": null,
                "auditDetails": {
                    "createdBy": "b3340d94-239e-45e7-a1bc-2a8f7582091c",
                    "lastModifiedBy": "b3340d94-239e-45e7-a1bc-2a8f7582091c",
                    "createdTime": 1729154444333,
                    "lastModifiedTime": 1729154444333
                },
                "rating": 0,
                "escalated": false
            },
            {
                "id": "98d6b21e-39c5-46b1-901b-5ba3b15a0e35",
                "tenantId": "mz",
                "businessService": "PLAN_ESTIMATION",
                "businessId": "cba20335-ffb0-4fc2-94d8-cfe698c8ddb0",
                "action": "APPROVE",
                "moduleName": "plan-service",
                "state": {
                    "auditDetails": null,
                    "uuid": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                    "tenantId": "mz",
                    "businessServiceId": "14f4fa84-5c50-42b9-afa5-45f155d61013",
                    "sla": null,
                    "state": "PENDING_FOR_VALIDATION",
                    "applicationStatus": "PENDING_FOR_VALIDATION",
                    "docUploadRequired": false,
                    "isStartState": false,
                    "isTerminateState": false,
                    "isStateUpdatable": null,
                    "actions": [
                        {
                            "auditDetails": null,
                            "uuid": "082b5870-d3e3-4aa3-ab17-34ba4935acde",
                            "tenantId": "mz",
                            "currentState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "action": "EDIT_AND_VALIDATE",
                            "nextState": "1b94c7e8-c7d1-4419-be00-0faf7872e8af",
                            "roles": [
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "8ee5c123-73cc-4f97-8654-5031fc2c1b20",
                            "tenantId": "mz",
                            "currentState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "action": "VALIDATE",
                            "nextState": "1b94c7e8-c7d1-4419-be00-0faf7872e8af",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER",
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "45bd9163-de55-4158-bdec-0e077aecc621",
                            "tenantId": "mz",
                            "currentState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "action": "EDIT_AND_SEND_FOR_APPROVAL",
                            "nextState": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        }
                    ]
                },
                "comment": "APPROVE",
                "documents": null,
                "assigner": {
                    "id": 10065,
                    "userName": "ESTIMATION_APPROVER1",
                    "name": "Root resource estimation approver",
                    "type": "EMPLOYEE",
                    "mobileNumber": "9898989301",
                    "emailId": "rohit@gmail.com",
                    "roles": [
                        {
                            "id": null,
                            "name": "Super User",
                            "code": "SUPERUSER",
                            "tenantId": "mz"
                        },
                        {
                            "id": null,
                            "name": "plan estimation approver",
                            "code": "PLAN_ESTIMATION_APPROVER",
                            "tenantId": "mz"
                        }
                    ],
                    "tenantId": "mz",
                    "uuid": "47a08ceb-462a-44d2-a378-2311b948b8d5"
                },
                "assignes": [
                    {
                        "id": 10064,
                        "userName": "ROOT_ESTIMATION_APPROVER2",
                        "name": "Root resource estimation approver",
                        "type": "EMPLOYEE",
                        "mobileNumber": "9898989300",
                        "emailId": "rohit@gmail.com",
                        "roles": [
                            {
                                "id": null,
                                "name": "Super User",
                                "code": "SUPERUSER",
                                "tenantId": "mz"
                            },
                            {
                                "id": null,
                                "name": "Root plan estimation approver",
                                "code": "ROOT_PLAN_ESTIMATION_APPROVER",
                                "tenantId": "mz"
                            }
                        ],
                        "tenantId": "mz",
                        "uuid": "b3340d94-239e-45e7-a1bc-2a8f7582091c"
                    }
                ],
                "nextActions": [],
                "stateSla": null,
                "businesssServiceSla": 334756941,
                "previousStatus": null,
                "entity": null,
                "auditDetails": {
                    "createdBy": "47a08ceb-462a-44d2-a378-2311b948b8d5",
                    "lastModifiedBy": "47a08ceb-462a-44d2-a378-2311b948b8d5",
                    "createdTime": 1729154203789,
                    "lastModifiedTime": 1729154203789
                },
                "rating": 0,
                "escalated": false
            },
            {
                "id": "a0fb045a-bbc2-48c2-be43-a5403912892f",
                "tenantId": "mz",
                "businessService": "PLAN_ESTIMATION",
                "businessId": "cba20335-ffb0-4fc2-94d8-cfe698c8ddb0",
                "action": "EDIT_AND_SEND_FOR_APPROVAL",
                "moduleName": "plan-service",
                "state": {
                    "auditDetails": null,
                    "uuid": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                    "tenantId": "mz",
                    "businessServiceId": "14f4fa84-5c50-42b9-afa5-45f155d61013",
                    "sla": null,
                    "state": "PENDING_FOR_APPROVAL",
                    "applicationStatus": "PENDING_FOR_APPROVAL",
                    "docUploadRequired": false,
                    "isStartState": false,
                    "isTerminateState": false,
                    "isStateUpdatable": null,
                    "actions": [
                        {
                            "auditDetails": null,
                            "uuid": "f226cddf-cd73-4bd3-b726-3f1b9899b32a",
                            "tenantId": "mz",
                            "currentState": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                            "action": "APPROVE",
                            "nextState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "d6c47c25-35a9-4c54-9b9a-090422c24fa6",
                            "tenantId": "mz",
                            "currentState": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                            "action": "ROOT_APPROVE",
                            "nextState": "1b94c7e8-c7d1-4419-be00-0faf7872e8af",
                            "roles": [
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "8f2f27fe-48ee-412c-a1a0-84f72668f6f9",
                            "tenantId": "mz",
                            "currentState": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                            "action": "SEND_BACK_FOR_CORRECTION",
                            "nextState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER",
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        }
                    ]
                },
                "comment": "EDIT_AND_SEND_FOR_APPROVAL",
                "documents": null,
                "assigner": {
                    "id": 10066,
                    "userName": "ESTIMATION_APPROVER2",
                    "name": "Root resource estimation approver",
                    "type": "EMPLOYEE",
                    "mobileNumber": "9898989302",
                    "emailId": "rohit@gmail.com",
                    "roles": [
                        {
                            "id": null,
                            "name": "Super User",
                            "code": "SUPERUSER",
                            "tenantId": "mz"
                        },
                        {
                            "id": null,
                            "name": "plan estimation approver",
                            "code": "PLAN_ESTIMATION_APPROVER",
                            "tenantId": "mz"
                        }
                    ],
                    "tenantId": "mz",
                    "uuid": "48eeee5d-2484-4b3e-a22e-e1e7e5f7e857"
                },
                "assignes": [
                    {
                        "id": 10065,
                        "userName": "ESTIMATION_APPROVER1",
                        "name": "Root resource estimation approver",
                        "type": "EMPLOYEE",
                        "mobileNumber": "9898989301",
                        "emailId": "rohit@gmail.com",
                        "roles": [
                            {
                                "id": null,
                                "name": "Super User",
                                "code": "SUPERUSER",
                                "tenantId": "mz"
                            },
                            {
                                "id": null,
                                "name": "plan estimation approver",
                                "code": "PLAN_ESTIMATION_APPROVER",
                                "tenantId": "mz"
                            }
                        ],
                        "tenantId": "mz",
                        "uuid": "47a08ceb-462a-44d2-a378-2311b948b8d5"
                    }
                ],
                "nextActions": [],
                "stateSla": null,
                "businesssServiceSla": 334756941,
                "previousStatus": null,
                "entity": null,
                "auditDetails": {
                    "createdBy": "48eeee5d-2484-4b3e-a22e-e1e7e5f7e857",
                    "lastModifiedBy": "48eeee5d-2484-4b3e-a22e-e1e7e5f7e857",
                    "createdTime": 1729154081826,
                    "lastModifiedTime": 1729154081826
                },
                "rating": 0,
                "escalated": false
            },
            {
                "id": "fd3bba78-896b-4de4-80f7-1bd3c0440c5a",
                "tenantId": "mz",
                "businessService": "PLAN_ESTIMATION",
                "businessId": "cba20335-ffb0-4fc2-94d8-cfe698c8ddb0",
                "action": "INITIATE",
                "moduleName": "plan-service",
                "state": {
                    "auditDetails": null,
                    "uuid": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                    "tenantId": "mz",
                    "businessServiceId": "14f4fa84-5c50-42b9-afa5-45f155d61013",
                    "sla": null,
                    "state": "PENDING_FOR_VALIDATION",
                    "applicationStatus": "PENDING_FOR_VALIDATION",
                    "docUploadRequired": false,
                    "isStartState": false,
                    "isTerminateState": false,
                    "isStateUpdatable": null,
                    "actions": [
                        {
                            "auditDetails": null,
                            "uuid": "8ee5c123-73cc-4f97-8654-5031fc2c1b20",
                            "tenantId": "mz",
                            "currentState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "action": "VALIDATE",
                            "nextState": "1b94c7e8-c7d1-4419-be00-0faf7872e8af",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER",
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "082b5870-d3e3-4aa3-ab17-34ba4935acde",
                            "tenantId": "mz",
                            "currentState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "action": "EDIT_AND_VALIDATE",
                            "nextState": "1b94c7e8-c7d1-4419-be00-0faf7872e8af",
                            "roles": [
                                "ROOT_PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        },
                        {
                            "auditDetails": null,
                            "uuid": "45bd9163-de55-4158-bdec-0e077aecc621",
                            "tenantId": "mz",
                            "currentState": "4d5ede81-b988-40b1-9d9e-ad501c4981b8",
                            "action": "EDIT_AND_SEND_FOR_APPROVAL",
                            "nextState": "e03a38de-fd09-416a-aafc-2a67e6c31ec7",
                            "roles": [
                                "PLAN_ESTIMATION_APPROVER"
                            ],
                            "active": null
                        }
                    ]
                },
                "comment": "initiate",
                "documents": null,
                "assigner": {
                    "id": 1289,
                    "userName": "MICROPLAN_ADMIN1",
                    "name": "Microplan Admin Rahul",
                    "type": "EMPLOYEE",
                    "mobileNumber": "9898989176",
                    "emailId": "rahul@gmail.com",
                    "roles": [
                        {
                            "id": null,
                            "name": "Super User",
                            "code": "SUPERUSER",
                            "tenantId": "mz"
                        },
                        {
                            "id": null,
                            "name": "Microplan Admin",
                            "code": "MICROPLAN_ADMIN",
                            "tenantId": "mz"
                        }
                    ],
                    "tenantId": "mz",
                    "uuid": "2825cb90-e304-4d75-a300-6430d71e6055"
                },
                "assignes": [
                    {
                        "id": 10066,
                        "userName": "ESTIMATION_APPROVER2",
                        "name": "Root resource estimation approver",
                        "type": "EMPLOYEE",
                        "mobileNumber": "9898989302",
                        "emailId": "rohit@gmail.com",
                        "roles": [
                            {
                                "id": null,
                                "name": "Super User",
                                "code": "SUPERUSER",
                                "tenantId": "mz"
                            },
                            {
                                "id": null,
                                "name": "plan estimation approver",
                                "code": "PLAN_ESTIMATION_APPROVER",
                                "tenantId": "mz"
                            }
                        ],
                        "tenantId": "mz",
                        "uuid": "48eeee5d-2484-4b3e-a22e-e1e7e5f7e857"
                    }
                ],
                "nextActions": [],
                "stateSla": null,
                "businesssServiceSla": 334756941,
                "previousStatus": null,
                "entity": null,
                "auditDetails": {
                    "createdBy": "2825cb90-e304-4d75-a300-6430d71e6055",
                    "lastModifiedBy": "2825cb90-e304-4d75-a300-6430d71e6055",
                    "createdTime": 1729151349626,
                    "lastModifiedTime": 1729151349626
                },
                "rating": 0,
                "escalated": false
            }
        ],
        "totalCount": 0
    }
    // Manage timeline data
    const [timelineSteps, setTimelineSteps] = useState([]);

    useEffect(() => {
        if (hardCodeData && hardCodeData.ProcessInstances) {


            // Map API response to timeline steps
            const steps = hardCodeData.ProcessInstances.map((instance, index) => ({
                label: instance.state.applicationStatus,
                variant: 'completed',
                subElements: [Digit.Utils.microplanv1.epochToDateTime(instance?.auditDetails?.lastModifiedTime),
                instance?.assignes?.length > 0 ? instance.assignes[0]?.name : 'NA',
                t(`${instance.comment}`)
                ],
                showConnector: true
            }));
            setTimelineSteps(steps);
        }
    }, []);

    return (
        <PopUp
            onClose={onClose}
            heading={t(heading)}
            onOverlayClick={onClose}
            children={[
                <TimelineMolecule key="timeline" initialVisibleCount={4}>
                    {timelineSteps.map((step, index) => (
                        <Timeline
                            key={index}
                            label={step.label}

                            subElements={step.subElements}
                            variant={step.variant}
                            showConnector={step.showConnector}
                        />
                    ))}
                </TimelineMolecule>
            ]}
        />
    );

};

export default TimelinePopUpWrapper;
