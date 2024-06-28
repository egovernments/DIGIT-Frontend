-- Check if column exists before adding
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'eg_cm_generated_resource_details' 
          AND column_name = 'campaignId'
    ) THEN
        ALTER TABLE eg_cm_generated_resource_details
        ADD COLUMN campaignId character varying(128);
    END IF;
END $$;
