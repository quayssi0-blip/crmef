-- Ar-Ra'id Connect Database Schema
-- Action Research: Peer-to-Peer Video Training for Pioneer School Teachers

-- Enable Row Level Security
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create custom types
create type pedagogical_approach as enum ('tal', 'explicit_teaching', 'other');
create type grade_level as enum ('1st', '2nd', '3rd', '4th', '5th', '6th');
create type subject_type as enum ('arabic', 'french', 'math', 'science', 'islamic', 'geography', 'history');
create type user_role as enum ('teacher', 'mentor', 'admin', 'researcher');

-- Profiles table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  taalim_ma_id text, -- Moroccan education system ID (@taalim.ma)
  school_name text,
  location text, -- City/region
  role user_role default 'teacher',
  specialization subject_type,
  years_experience int default 0,
  avatar_url text,
  bio text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Video capsules table
create table if not exists videos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  video_url text not null, -- Supabase storage URL
  thumbnail_url text,
  duration_seconds int not null,
  pedagogical_approach pedagogical_approach not null,
  subject subject_type not null,
  grade_level grade_level not null,
  tags text[] default '{}',
  view_count int default 0,
  like_count int default 0,
  comment_count int default 0,
  is_featured boolean default false,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Video likes (many-to-many)
create table if not exists video_likes (
  id uuid default gen_random_uuid() primary key,
  video_id uuid references videos(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(video_id, user_id)
);

-- Comments (threaded)
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  video_id uuid references videos(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  like_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comment likes
create table if not exists comment_likes (
  id uuid default gen_random_uuid() primary key,
  comment_id uuid references comments(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(comment_id, user_id)
);

-- Resources repository (documents, presentations)
create table if not exists resources (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  resource_type text not null, -- 'latex', 'beamer', 'exam', 'worksheet'
  subject subject_type not null,
  grade_level grade_level not null,
  file_url text not null,
  file_size int,
  download_count int default 0,
  tags text[] default '{}',
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Resource downloads tracking
create table if not exists resource_downloads (
  id uuid default gen_random_uuid() primary key,
  resource_id uuid references resources(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade,
  downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Video views (for analytics)
create table if not exists video_views (
  id uuid default gen_random_uuid() primary key,
  video_id uuid references videos(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade,
  watched_for_seconds int default 0,
  completed boolean default false,
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Search index (using GIN for full-text search)
create table if not exists search_index (
  id uuid default gen_random_uuid() primary key,
  searchable tsvector,
  video_id uuid references videos(id) on delete cascade,
  resource_id uuid references resources(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Indexes for performance
create index if not exists videos_user_id_idx on videos(user_id);
create index if not exists videos_published_idx on videos(is_published) where is_published = true;
create index if not exists videos_subject_idx on videos(subject);
create index if not exists videos_grade_idx on videos(grade_level);
create index if not exists videos_pedagogy_idx on videos(pedagogical_approach);
create index if not exists videos_featured_idx on videos(is_featured) where is_featured = true;

create index if not exists comments_video_id_idx on comments(video_id);
create index if not exists comments_parent_id_idx on comments(parent_id);

create index if not exists resources_subject_idx on resources(subject);
create index if not exists resources_grade_idx on resources(grade_level);

create index if not exists video_likes_video_id_idx on video_likes(video_id);
create index if not exists video_likes_user_id_idx on video_likes(user_id);

-- Full-text search index for videos
create index if not exists videos_search_idx on videos using gin(
  setweight(to_tsvector('arabic', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('arabic', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(array_to_string(tags, ' '), '')), 'C')
);

-- Triggers for updating timestamps
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

create trigger update_videos_updated_at
  before update on videos
  for each row execute procedure update_updated_at();

create trigger update_comments_updated_at
  before update on comments
  for each row execute procedure update_updated_at();

create trigger update_resources_updated_at
  before update on resources
  for each row execute procedure update_updated_at();

-- Function to update counts (like, comment, view counts)
create or replace function update_video_counts()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update videos
    set
      like_count = like_count + 1,
      comment_count = comment_count + 1
    where id = new.video_id;
    return new;
  elsif tg_op = 'DELETE' then
    update videos
    set
      like_count = greatest(0, like_count - 1),
      comment_count = greatest(0, comment_count - 1)
    where id = old.video_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger comment_count_trigger
  after insert or delete on comments
  for each row execute procedure update_video_counts();

-- View count trigger
create or replace function update_view_count()
returns trigger as $$
begin
  update videos
  set view_count = view_count + 1
  where id = new.video_id;
  return new;
end;
$$ language plpgsql;

create trigger view_count_trigger
  after insert on video_views
  for each row execute procedure update_view_count();

-- RLS Policies

-- Profiles: Users can view all profiles, edit own
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Videos: Published videos viewable by all, draft by owner only
create policy "Published videos are viewable by everyone"
  on videos for select using (is_published = true);

create policy "Users can insert own videos"
  on videos for insert with check (auth.uid() = user_id);

create policy "Users can update own videos"
  on videos for update using (auth.uid() = user_id);

create policy "Users can delete own videos"
  on videos for delete using (auth.uid() = user_id);

-- Comments: Viewable by all, insert by authenticated, edit/delete by author
create policy "Comments are viewable by everyone"
  on comments for select using (true);

create policy "Authenticated users can comment"
  on comments for insert with check (auth.uid() = user_id);

create policy "Users can update own comments"
  on comments for update using (auth.uid() = user_id);

create policy "Users can delete own comments"
  on comments for delete using (auth.uid() = user_id);

-- Resources: Viewable by all authenticated users
create policy "Resources are viewable by authenticated users"
  on resources for select using (auth.role() = 'authenticated');

create policy "Users can insert own resources"
  on resources for insert with check (auth.uid() = user_id);

create policy "Users can update own resources"
  on resources for update using (auth.uid() = user_id);

create policy "Users can delete own resources"
  on resources for delete using (auth.uid() = user_id);

-- Storage buckets (to be created via Supabase CLI or dashboard)
-- Create buckets: videos, thumbnails, resources, avatars

-- Row Level Security enabled on all tables (already done by Supabase)
-- Storage RLS policies will be set separately
-- RPC function for incrementing download count
create or replace function increment_download(resource_uuid uuid)
returns void as $$
begin
  update resources
  set download_count = download_count + 1
  where id = resource_uuid;
end;
$$ language plpgsql security definer;
