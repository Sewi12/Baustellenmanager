-- Baustellenmanager
-- Migration 001: Mandanten, Mitgliedschaften und Projekte
-- Diese Datei ist nur für die Versionsverwaltung.
-- Vor dem Einsatz in Production prüfen und testen.

begin;

create table public.bm_organizations (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    created_at timestamptz not null default now()
);

create table public.bm_memberships (
    organization_id uuid not null
        references public.bm_organizations(id) on delete cascade,
    user_id uuid not null
        references auth.users(id) on delete cascade,
    role text not null default 'member'
        check (role in ('owner', 'admin', 'site_manager', 'member', 'external')),
    created_at timestamptz not null default now(),
    primary key (organization_id, user_id)
);

create table public.bm_projects (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null
        references public.bm_organizations(id) on delete cascade,
    name text not null,
    description text,
    status text not null default 'active'
        check (status in ('active', 'archived')),
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index bm_projects_organization_idx
    on public.bm_projects(organization_id);

create index bm_memberships_user_idx
    on public.bm_memberships(user_id);

alter table public.bm_organizations enable row level security;
alter table public.bm_memberships enable row level security;
alter table public.bm_projects enable row level security;

-- Zunächst keine API-Zugriffsrechte vergeben.
-- Explizite Grants und geprüfte Policies folgen in einer
-- separaten Migration nach Festlegung des Onboardings.

commit;
