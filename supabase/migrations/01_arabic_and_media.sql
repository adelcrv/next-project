-- Add Arabic Localization columns
ALTER TABLE public.words 
ADD COLUMN IF NOT EXISTS arabic_translation varchar(255),
ADD COLUMN IF NOT EXISTS arabic_definition text,
ADD COLUMN IF NOT EXISTS arabic_example text,
ADD COLUMN IF NOT EXISTS topic_tags text[];

-- Add Game Metadata columns
ALTER TABLE public.words
ADD COLUMN IF NOT EXISTS synonyms text[],
ADD COLUMN IF NOT EXISTS antonyms text[];

-- Add Rich Media columns (Static Assets)
ALTER TABLE public.words
ADD COLUMN IF NOT EXISTS image_url text, -- Path to image (e.g., /visuals/cat.webp)
ADD COLUMN IF NOT EXISTS video_url text; -- Path to video (e.g., /videos/cat.mp4)

-- Add index for topic based queries (useful for games)
CREATE INDEX IF NOT EXISTS idx_words_topic_tags ON public.words USING GIN (topic_tags);
