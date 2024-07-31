ALTER TABLE eg_cm_campaign_process
ADD CONSTRAINT uq_campaignId_type UNIQUE (campaignId, type);