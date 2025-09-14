-- Extend quick_tags table to support practice-specific configuration
ALTER TABLE public.quick_tags ADD COLUMN practice_config JSONB NULL;

-- Create a function to validate practice_config structure
CREATE OR REPLACE FUNCTION validate_practice_config(config JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- Allow null config (for non-practice tags)
  IF config IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Validate the structure for practice tags
  RETURN (
    config ? 'sources' AND
    config ? 'defaultDifficulty' AND
    config ? 'trackingPreferences' AND
    jsonb_typeof(config->'sources') = 'object' AND
    jsonb_typeof(config->'defaultDifficulty') = 'string' AND
    jsonb_typeof(config->'trackingPreferences') = 'object'
  );
END;
$$ LANGUAGE plpgsql;

-- Add a check constraint to validate practice_config
ALTER TABLE public.quick_tags ADD CONSTRAINT valid_practice_config 
CHECK (validate_practice_config(practice_config));

-- Add some example practice configs for existing practice tags
UPDATE public.quick_tags 
SET practice_config = '{
  "sources": {
    "Module": ["Ex 1", "Ex 1A", "Ex 2", "Ex 2A", "Ex 3", "Ex 3A", "Misc"],
    "PYQs": ["Mains", "Advanced"],
    "CPPs": ["Core Practice Problems"],
    "Reference Books": ["NCERT Questions"],
    "Custom": []
  },
  "defaultDifficulty": "Medium",
  "trackingPreferences": {
    "trackQuestions": true,
    "trackTime": true,
    "trackAccuracy": true,
    "trackDifficulty": true
  }
}'::jsonb
WHERE study_nature = 'Practice';