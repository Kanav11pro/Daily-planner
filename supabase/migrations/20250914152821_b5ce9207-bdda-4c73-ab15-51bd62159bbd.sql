-- Fix the function to set proper search_path for security
CREATE OR REPLACE FUNCTION public.validate_practice_config(config JSONB)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;