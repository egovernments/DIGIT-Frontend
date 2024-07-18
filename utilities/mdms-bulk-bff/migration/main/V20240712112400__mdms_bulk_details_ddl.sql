CREATE TABLE "eg_mdms_bulk_details" (
    "id" VARCHAR(128) PRIMARY KEY,
    "tenantId" VARCHAR(128) NOT NULL,
    "schemaCode" VARCHAR(256) NOT NULL,
    "fileStoreId" VARCHAR(128) NOT NULL,
    "status" VARCHAR(128) NOT NULL,
    "processedFileStoreId" VARCHAR(128),
    "additionalDetails" JSONB,
    "createdTime" BIGINT NOT NULL,
    "lastModifiedTime" BIGINT,
    "createdBy" VARCHAR(128) NOT NULL,
    "lastModifiedBy" VARCHAR(128)
);
