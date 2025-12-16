-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Core vocabulary table
create table public.words (
  id uuid primary key default gen_random_uuid(),
  word varchar(100) not null,
  phonetic varchar(100),
  part_of_speech varchar(50),
  definition text not null,
  example_sentence text,
  book_number int,
  unit_number int,
  audio_url text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.words enable row level security;

-- Create policy to allow read access to everyone
create policy "Allow public read access"
  on public.words for select
  using (true);

-- User progress tracking
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  word_id uuid references public.words(id) not null,
  familiarity_level int default 0, -- 0=new, 1-5=learning, 6=mastered
  next_review_at timestamptz,
  review_count int default 0,
  correct_count int default 0,
  last_reviewed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, word_id)
);

-- Enable RLS
alter table public.user_progress enable row level security;

-- Create policy to allow users to manage their own progress
create policy "Users can manage their own progress"
  on public.user_progress for all
  using (auth.uid() = user_id);

-- Learning sessions
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  session_type varchar(50), -- 'learn', 'review', 'quiz'
  words_studied int default 0,
  correct_answers int default 0,
  duration_seconds int,
  started_at timestamptz default now(),
  ended_at timestamptz
);

-- Enable RLS
alter table public.sessions enable row level security;

-- Create policy to allow users to manage their own sessions
create policy "Users can manage their own sessions"
  on public.sessions for all
  using (auth.uid() = user_id);
