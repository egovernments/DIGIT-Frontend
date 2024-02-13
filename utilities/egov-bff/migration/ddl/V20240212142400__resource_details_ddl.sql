CREATE TABLE eg_resource_details (
    id varchar(128) PRIMARY KEY,
    "status" varchar(128),
    tenantId varchar(128),
    processReferenceNumber varchar(128),
    fileStoreId varchar(128),
    "type" varchar(64),
    createdBy varchar(128),
    createdTime bigint,
    lastModifiedBy varchar(128),
    lastModifiedTime bigint,
    additionalDetails varchar(1000)
);

CREATE TABLE eg_resource_activity (
    id varchar(128) PRIMARY KEY,
    retryCount integer,
    "type" varchar(64),
    "url" varchar(128),
    requestPayload json,
    responsePayload json,
    "status" bigint,
    createdBy varchar(128),
    createdTime bigint,
    lastModifiedBy varchar(128),
    lastModifiedTime bigint,
    additionalDetails varchar(1000),
    resourceDetailsId varchar(128),
    FOREIGN KEY (resourceDetailsId) REFERENCES eg_resource_details(id)
);

CREATE TABLE eg_generated_resource_details (
    id varchar(128) PRIMARY KEY,
    fileStoreId varchar(128),
    "status" varchar(128),
    "type" varchar(64),
    createdBy varchar(128),
    createdTime bigint,
    lastModifiedBy varchar(128),
    lastModifiedTime bigint,
    additionalDetails varchar(1000)
);
