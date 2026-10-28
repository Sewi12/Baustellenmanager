# Baustellenmanager – Starter 0.3

Dieses ZIP ist ein Entwicklungsgrundgerüst, keine produktionsfertige App.

## Aktueller Stand
- Login-Grundgerüst mit Supabase Auth
- Server- und Browser-Client über `@supabase/ssr`
- Middleware prüft die Auth-Sitzung und verweigert Zugriff, wenn die Supabase-Konfiguration fehlt
- Projektübersicht ist derzeit nur ein Platzhalter

## Voraussetzungen
- Node.js und npm
- Ein bestehendes Supabase-Projekt
- Umgebungsvariablen aus `.env.example`

## Lokal starten
1. ZIP entpacken.
2. Im Ordner `baustellenmanager` eine Kopie von `.env.example` als `.env.local` anlegen.
3. Die Supabase-URL und den öffentlichen Publishable-/Anon-Key lokal in `.env.local` eintragen.
4. `npm install`
5. `npm run dev`

Niemals einen `service_role`-Schlüssel in `.env.local` für den Browser, in GitHub oder in eine `NEXT_PUBLIC_`-Variable eintragen.

## Datenbank-Sicherheit – WICHTIG
Die SQL-Dateien unter `supabase/migrations` sind weiterhin Entwürfe und wurden nicht als vollständiges, getestetes Migrationspaket freigegeben.
Sie dürfen nicht in der produktiven Supabase-Datenbank ausgeführt werden, bis Tabellenrechte, RLS-Policies, Ersteinrichtung des ersten `owner` und die Admin-Einladungsfunktion gemeinsam geprüft und getestet wurden.

Das bestehende Supabase-Projekt enthält weitere Apps. Änderungen für den Baustellenmanager müssen ausschließlich `bm_`-Objekte betreffen und dürfen keine bestehenden Tabellen, Benutzer oder Daten verändern.

## Noch nicht implementiert
- sichere Ersteinrichtung des ersten Administrators
- serverseitiger Endpunkt zum Einladen von Mitarbeitern
- Prüfung der Baustellenmanager-Mitgliedschaft und Rollen nach dem Login
- Projekte, Pläne, Pins, Aufgaben, Erinnerungen und Dateiablage
- automatisierte Tests der Zugriffsrechte

Vor einem produktiven Einsatz sind diese Punkte umzusetzen und zu testen.
