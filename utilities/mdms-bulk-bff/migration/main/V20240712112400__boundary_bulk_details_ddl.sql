CREATE TABLE eg_mdms_bulk_details (
    id varchar(128) PRIMARY KEY,
    tenantId VARCHAR(128) NOT NULL,
    schemaName VARCHAR(256) NOT NULL,
    fileStoreId VARCHAR(128) NOT NULL,
    "status" VARCHAR(128) NOT NULL,
    processedFileStoreId VARCHAR(128),
    additionalDetails jsonb,
    createdTime bigint NOT NULL,
    lastModifiedTime bigint,
    createdBy varchar(128) NOT NULL,
    lastModifiedBy varchar(128)
);
