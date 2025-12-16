-- Add extra_meanings column to words table if it doesn't exist
ALTER TABLE public.words 
ADD COLUMN IF NOT EXISTS extra_meanings JSONB DEFAULT '[]'::jsonb;

-- Comment describing the structure
COMMENT ON COLUMN public.words.extra_meanings IS 'Array of additional meanings, e.g., [{ "meaning": "...", "example": "..." }]';
