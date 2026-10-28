# Baustellenmanager – Starter 0.2

Responsives Next.js-Grundgerüst für PC und iPad mit Supabase Auth (E-Mail/Passwort). Dieses Paket ist ein Entwicklungsstarter, keine fertig deployte App.

## Wichtige Sicherheitsregeln

- Noch keine SQL-Migration in Supabase ausführen. Die Migrationen sind Entwürfe und müssen vor Production nochmals gemeinsam geprüft und getestet werden.
- Dieses Paket verwendet Tabellen mit dem Präfix `bm_`, um die bestehenden Tabellen von Baustellenzeit nicht zu verändern.
- Es wird kein Supabase-Service-Role-Schlüssel im Browser benötigt oder mitgeliefert. Niemals einen solchen Schlüssel in GitHub eintragen.
- Der erste `owner` und die Mitarbeitereinladungen sind noch nicht eingerichtet. Keine offene Registrierung aktivieren.
- Die Migrationen sind nicht idempotent (Policies/Tabellen können bei erneuter Ausführung Fehler auslösen). Vor einem Einsatz braucht es ein sauberes Migration-/Testverfahren.

## Voraussetzungen

- Node.js 20.9 oder neuer
- npm
- bestehendes Supabase-Projekt, auf das die App später gezielt konfiguriert wird

## Lokal starten

1. Ordner entpacken.
2. Im Ordner `baustellenmanager` eine Kopie von `.env.example` als `.env.local` anlegen.
3. In `.env.local` die Supabase Project URL und den öffentlichen Publishable-/Anon-Key eintragen.
4. Im Ordner eine Eingabeaufforderung öffnen und `npm install` ausführen.
5. `npm run dev` ausführen.
6. `http://localhost:3000` öffnen.

Für die reine Anzeige kann die Startseite ohne Supabase-Konfiguration aufrufbar sein. Die Login-Funktion benötigt gültige Supabase-Umgebungsvariablen.

## Verzeichnis

- `src/app/login`: Login-Oberfläche und Server Action
- `src/lib/supabase`: Supabase SSR-Clients
- `supabase/migrations`: Entwürfe für die `bm_`-Tabellen und RLS

## Noch nicht enthalten

- initiale Owner-Einrichtung
- Admin-Funktion zum Einladen von Mitarbeitern
- private Storage-Buckets und Datei-Policies
- Projekte, PDF-Pläne, Pins, Aufgaben und Erinnerungen
- handschriftliche Besprechungsnotizen und E-Mail-Updates
- automatisierte Sicherheits- und Zugriffstests

## Hinweis

Da dieses Projekt das bestehende Supabase-Projekt teilen soll, müssen Auth-Benutzer, Tabellenrechte und RLS vor dem produktiven Einsatz sorgfältig geprüft werden. Bestehende Tabellen und Daten dürfen nicht verändert werden.
