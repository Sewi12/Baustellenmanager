
-- Baustellenmanager
-- Migration 002: Explizite Tabellenrechte und RLS
-- Voraussetzung: Migration 001 wurde erfolgreich ausgeführt.
-- Noch NICHT in Production ausführen.

begin;

-- Keine anonymen Zugriffe auf die BM-Tabellen.
revoke all on table
    public.bm_organizations,
    public.bm_memberships,
    public.bm_projects
from anon;

-- Rechte zunächst vollständig entziehen und gezielt vergeben.
revoke all on table
    public.bm_organizations,
    public.bm_memberships,
    public.bm_projects
from authenticated;

grant select on table
    public.bm_organizations,
    public.bm_memberships,
    public.bm_projects
to authenticated;

grant update on table public.bm_organizations
to authenticated;

grant insert, update, delete on table public.bm_projects
to authenticated;

-- RLS muss auf allen drei Tabellen aktiv bleiben.
alter table public.bm_organizations enable row level security;
alter table public.bm_memberships enable row level security;
alter table public.bm_projects enable row level security;

-- Mitgliedschaft prüfen.
create or replace function public.bm_is_org_member(p_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.bm_memberships m
        where m.organization_id = p_org_id
          and m.user_id = (select auth.uid())
    );
$$;

-- Verwaltungsrolle prüfen.
create or replace function public.bm_is_org_admin(p_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.bm_memberships m
        where m.organization_id = p_org_id
          and m.user_id = (select auth.uid())
          and m.role in ('owner', 'admin')
    );
$$;

-- Funktionen nicht öffentlich ausführbar machen.
revoke all on function public.bm_is_org_member(uuid) from public;
revoke all on function public.bm_is_org_admin(uuid) from public;

grant execute on function public.bm_is_org_member(uuid)
to authenticated;
grant execute on function public.bm_is_org_admin(uuid)
to authenticated;

-- Organisationen: Mitglieder dürfen ihre Organisation sehen.
create policy "bm_organizations_select_member"
on public.bm_organizations
for select to authenticated
using (public.bm_is_org_member(id));

-- Organisationen: nur Owner/Admin dürfen sie ändern.
create policy "bm_organizations_update_admin"
on public.bm_organizations
for update to authenticated
using (public.bm_is_org_admin(id))
with check (public.bm_is_org_admin(id));

-- Mitgliedschaften: nur die eigene Organisation sehen.
-- Keine INSERT-, UPDATE- oder DELETE-Policy für normale Nutzer.
create policy "bm_memberships_select_member"
on public.bm_memberships
for select to authenticated
using (public.bm_is_org_member(organization_id));

-- Projekte: Mitglieder sehen nur Projekte ihrer Organisation.
create policy "bm_projects_select_member"
on public.bm_projects
for select to authenticated
using (public.bm_is_org_member(organization_id));

create policy "bm_projects_insert_admin"
on public.bm_projects
for insert to authenticated
with check (public.bm_is_org_admin(organization_id));

create policy "bm_projects_update_admin"
on public.bm_projects
for update to authenticated
using (public.bm_is_org_admin(organization_id))
with check (public.bm_is_org_admin(organization_id));

create policy "bm_projects_delete_admin"
on public.bm_projects
for delete to authenticated
using (public.bm_is_org_admin(organization_id));

commit;
