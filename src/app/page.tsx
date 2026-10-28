import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">Baustellenmanager</div>
        <form action={signOut}><button className="button secondary" type="submit">Abmelden</button></form>
      </header>
      <div className="eyebrow">Übersicht</div>
      <h1>Deine Baustellen. Ein zentraler Ort.</h1>
      <p className="lead">Das Grundgerüst ist vorbereitet. Als Nächstes verbinden wir die geschützte Projektstruktur mit der Datenbank und bauen danach Pläne, Pins und Aufgaben.</p>
      <div className="grid">
        <section className="card"><span className="pill">Als Nächstes</span><h2>Projekte</h2><p className="lead">Baustellen und Firmenzugehörigkeit verwalten.</p><div className="stat">01</div></section>
        <section className="card"><span className="pill">Kernfunktion</span><h2>Pläne & Pins</h2><p className="lead">PDF öffnen, Position markieren und Aufgabe verknüpfen.</p><div className="stat">02</div></section>
        <section className="card"><span className="pill">Kernfunktion</span><h2>Aufgaben</h2><p className="lead">Prioritäten, Fälligkeiten und Wiedervorlagen.</p><div className="stat">03</div></section>
      </div>
      <div className="footer">Angemeldet als {user.email ?? "Benutzer"} · Entwicklungsstand 0.1 · Noch keine Projektdaten angelegt</div>
    </main>
  );
}
