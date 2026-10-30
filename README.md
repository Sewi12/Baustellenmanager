# Baustellenmanager – GitHub Pages Starter 1.0

Statische PWA mit React/Vite und Supabase Auth. Für GitHub Pages; kein Vercel und kein lokaler Entwicklungsserver für die normale Nutzung erforderlich.

## GitHub-Einrichtung
1. Repository muss `Baustellenmanager` heißen und den Branch `main` verwenden.
2. Repository → Settings → Pages → Build and deployment: **GitHub Actions** auswählen.
3. Repository → Settings → Secrets and variables → Actions → Variables: folgende Repository Variables anlegen:
   - `VITE_SUPABASE_URL` = vollständige Project URL, z. B. `https://<project-ref>.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = öffentlicher `sb_publishable_...` Key
4. Den gesamten Inhalt dieses Pakets in das Repository übernehmen und committen. `.env.local` NICHT hochladen.
5. Unter Actions den Workflow „Deploy Baustellenmanager to GitHub Pages“ prüfen.

## Supabase-Einstellungen
Authentication → URL Configuration:
- Site URL: später die veröffentlichte GitHub-Pages-Adresse eintragen.
- Redirect URLs zusätzlich: `https://<github-benutzer>.github.io/Baustellenmanager/` sowie für lokale Tests `http://localhost:5173/`.
Die echte GitHub-Adresse nach dem ersten Deployment einsetzen. Supabase erlaubt Recovery-Redirects nur, wenn sie in der Allow List stehen.

## Passwort-Reset
Die App verwendet Supabase JS im Browser. Der Recovery-Link führt zur GitHub-Pages-App; Supabase erkennt die Recovery-Session über die URL und `updateUser({ password })` setzt das Passwort.

## Update-Ablauf
Jeder Commit auf `main` löst automatisch einen neuen GitHub-Pages-Build aus. Der Service Worker erkennt eine wartende Version und zeigt „Neue Version verfügbar“ / „Update downloaden“.

## Sicherheit
- Nur Publishable Key im Browser verwenden. Niemals `service_role` oder Secret Key.
- GitHub Variables sind für die öffentliche URL und den Publishable Key ausreichend; diese Werte sind öffentlich verwendbar, RLS muss alle Daten schützen.
- Die Migrationen aus dem bisherigen Next.js-Prototyp wurden absichtlich nicht übernommen. Die bisherigen `bm_`-Migrationen sind noch Entwürfe und müssen separat geprüft werden. Vorhandene Supabase-Tabellen und Daten bleiben unangetastet.
- Diese Version enthält noch keine Projektverwaltung und keine Datenbankabfragen. Sie ist die statische Auth-/PWA-Basis.
