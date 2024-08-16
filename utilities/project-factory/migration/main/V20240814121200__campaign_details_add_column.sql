ALTER TABLE eg_cm_campaign_details
ADD COLUMN "parentId" character varying(128);

ALTER TABLE eg_cm_campaign_details
ADD COLUMN "isActive" boolean;

ALTER TABLE eg_cm_campaign_details
DROP CONSTRAINT eg_cm_campaign_details_campaignName_key;

