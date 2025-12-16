-- DANGEROUS: Trace Reset
-- Drops existing tables to rebuild from scratch with optimal schema

DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.words CASCADE;

-- 1. Recreate Words Table (The Source of Truth)
CREATE TABLE public.words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word varchar(100) NOT NULL,
  
  -- Core English Data
  phonetic varchar(100),
  part_of_speech varchar(50),
  definition text NOT NULL,
  example_sentence text,
  
  -- Source Metadata
  book_number int NOT NULL,
  unit_number int NOT NULL,
  
  -- Arabic Localization (Bridge Method)
  arabic_translation varchar(255),
  arabic_definition text,
  arabic_example text,
  
  -- Rich Media (Static Assets)
  image_url text, -- /assets/images/[id].webp
  video_url text, -- /assets/videos/[id].mp4
  audio_url text, -- /assets/audio/[id].mp3
  
  -- Game Data
  synonyms text[],
  antonyms text[],
  topic_tags text[], -- e.g. ['travel', 'food']
  difficulty_level int default 1,
  
  created_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT words_word_unique UNIQUE (word)
);

-- 2. User Progress (Learning System)
CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word_id uuid REFERENCES public.words(id) ON DELETE CASCADE NOT NULL,
  
  -- SM-2 Algorithm State
  familiarity_level int DEFAULT 0, -- 0=New, 1-5=Learning, 6=Mastered
  ease_factor float DEFAULT 2.5,
  interval_days float DEFAULT 0,
  
  -- Review Stats
  next_review_at timestamptz DEFAULT now(),
  last_reviewed_at timestamptz,
  review_count int DEFAULT 0,
  correct_count int DEFAULT 0,
  incorrect_count int DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, word_id)
);

-- 3. Sessions (Analytics)
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type varchar(50), -- 'learn', 'review', 'game'
  words_studied int DEFAULT 0,
  duration_seconds int DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- 4. Security Policies (RLS)
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Public Read for Words
CREATE POLICY "Public read words" ON public.words FOR SELECT USING (true);

-- Admin Insert/Update for Words (Assume Anon for ingestion or specific admin role)
-- For now, allow Anon text-to-db ingestion script to work:
CREATE POLICY "Public insert words" ON public.words FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update words" ON public.words FOR UPDATE USING (true);

-- User Progress Policies
CREATE POLICY "Users manage own progress" ON public.user_progress 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own sessions" ON public.sessions 
FOR ALL USING (auth.uid() = user_id);

-- Indexes for Performance
CREATE INDEX idx_words_book_unit ON public.words(book_number, unit_number);
CREATE INDEX idx_progress_next_review ON public.user_progress(user_id, next_review_at);
