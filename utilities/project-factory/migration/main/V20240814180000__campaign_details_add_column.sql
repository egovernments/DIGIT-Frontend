-- Drop the columns if they exist
ALTER TABLE eg_cm_campaign_details
DROP COLUMN IF EXISTS "parentId";

ALTER TABLE eg_cm_campaign_details
DROP COLUMN IF EXISTS "isActive";

-- Add the columns with lowercase names
ALTER TABLE eg_cm_campaign_details
ADD COLUMN parentid character varying(128);

ALTER TABLE eg_cm_campaign_details
ADD COLUMN isactive boolean;
