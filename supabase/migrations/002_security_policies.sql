
-- Baustellenmanager
-- Migration 002: Sicherheitsregeln
-- Nur in Verbindung mit Migration 001 verwenden.
-- Noch NICHT in der produktiven Datenbank ausführen.

begin;

-- Prüft, ob ein Benutzer Mitglied einer Organisation ist.
-- SECURITY DEFINER verhindert rekursive RLS-Prüfungen.
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

-- Prüft, ob ein Benutzer eine Verwaltungsrolle besitzt.
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

revoke all on function public.bm_is_org_member(uuid) from public;
revoke all on function public.bm_is_org_admin(uuid) from public;
grant execute on function public.bm_is_org_member(uuid) to authenticated;
grant execute on function public.bm_is_org_admin(uuid) to authenticated;

-- Organisationen: nur Mitglieder dürfen ihre Organisation sehen.
create policy "bm_organizations_select_member"
on public.bm_organizations
for select to authenticated
using (public.bm_is_org_member(id));

-- Mitgliedschaften: Mitglieder dürfen die Mitgliedsliste
-- ihrer eigenen Organisation sehen.
create policy "bm_memberships_select_member"
on public.bm_memberships
for select to authenticated
using (public.bm_is_org_member(organization_id));

-- Projekte: Mitglieder dürfen Projekte ihrer Organisation sehen.
create policy "bm_projects_select_member"
on public.bm_projects
for select to authenticated
using (public.bm_is_org_member(organization_id));

-- Projekte anlegen, ändern oder löschen: nur Owner/Admin.
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

-- Organisationen ändern: nur Owner/Admin.
create policy "bm_organizations_update_admin"
on public.bm_organizations
for update to authenticated
using (public.bm_is_org_admin(id))
with check (public.bm_is_org_admin(id));

-- Mitgliedschaften verwalten: nur Owner/Admin.
create policy "bm_memberships_insert_admin"
on public.bm_memberships
for insert to authenticated
with check (public.bm_is_org_admin(organization_id));

create policy "bm_memberships_update_admin"
on public.bm_memberships
for update to authenticated
using (public.bm_is_org_admin(organization_id))
with check (public.bm_is_org_admin(organization_id));

create policy "bm_memberships_delete_admin"
on public.bm_memberships
for delete to authenticated
using (public.bm_is_org_admin(organization_id));

commit;

