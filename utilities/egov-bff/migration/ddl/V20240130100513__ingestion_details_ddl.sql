CREATE TABLE eg_campaign_details (
  id character varying(128) NOT NULL,
  fileStoreId character varying(128) NOT NULL,
  tenantId character varying(50) NOT NULL,
  "status" character varying(50) NOT NULL,
  campaignType character varying(128) NOT NULL,
  projectTypeId character varying(128) NOT NULL,
  campaignName character varying(256) NOT NULL,
  campaignNumber character varying(128) NOT NULL,
  createdby character varying(128),
  lastmodifiedby character varying(128),
  createdtime bigint,
  lastmodifiedtime bigint,
  additionalDetails character varying(512) NOT NULL,
  CONSTRAINT eg_campaign_details_pkey PRIMARY KEY (id)
);

CREATE TABLE eg_campaign_ingestionDetails (
  id character varying(128) NOT NULL,
  campaignId character varying(128) NOT NULL,
  fileStoreId character varying(128) NOT NULL,
  tenantId character varying(50) NOT NULL,
  ingestionNumber character varying(128) NOT NULL,
  jobId character varying(128) NOT NULL,
  "status" character varying(50) NOT NULL,
  ingestionType character varying(128) NOT NULL,
  createdby character varying(128),
  lastmodifiedby character varying(128),
  createdtime bigint,
  lastmodifiedtime bigint,
  additionalDetails character varying(512) NOT NULL,
  CONSTRAINT eg_campaign_ingestionDetails_pkey PRIMARY KEY (id),
  CONSTRAINT fk_campaignId FOREIGN KEY (campaignId) REFERENCES eg_campaign_details(id)
);
