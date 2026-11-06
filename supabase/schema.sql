-- À exécuter une seule fois dans Supabase > SQL Editor
create extension if not exists pgcrypto;
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(),
  name text not null, phone text not null, email text not null, subject text not null,
  message text not null, preferred_date date, status text default 'nouveau' check (status in ('nouveau','contacte','confirme','termine','annule')),
  admin_notes text
);
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now(),
  title text not null, slug text unique not null, excerpt text not null, content text not null,
  category text default 'Actualité juridique', image_url text, published boolean default false,
  published_at timestamptz, seo_title text, seo_description text
);
alter table public.appointments enable row level security;
alter table public.posts enable row level security;
create policy "public creates appointments" on public.appointments for insert to anon with check (true);
create policy "admins manage appointments" on public.appointments for all to authenticated using (true) with check (true);
create policy "public reads published posts" on public.posts for select to anon using (published = true);
create policy "admins manage posts" on public.posts for all to authenticated using (true) with check (true);
-- Créez ensuite l’utilisatrice du cabinet dans Authentication > Users.
