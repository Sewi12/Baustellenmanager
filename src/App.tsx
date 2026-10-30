import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "./supabase";

type View = "login" | "reset";
function currentView(): View {
  return new URLSearchParams(window.location.search).get("view") === "reset" ? "reset" : "login";
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>(currentView());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;
    let registration: ServiceWorkerRegistration | undefined;
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        registration = reg;
        if (reg.waiting) setUpdateReady(true);
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          installing?.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) setUpdateReady(true);
          });
        });
        reg.update().catch(() => undefined);
      })
      .catch(() => undefined);
    const onController = () => window.location.reload();
    navigator.serviceWorker.addEventListener("controllerchange", onController);
    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onController);
      void registration;
    };
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    if (!supabase) { setError("Supabase ist noch nicht konfiguriert."); setBusy(false); return; }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setError("Anmeldung nicht erfolgreich. Bitte E-Mail und Passwort prüfen.");
    setBusy(false);
  }

  async function requestReset(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    if (!supabase) { setError("Supabase ist noch nicht konfiguriert."); setBusy(false); return; }
    const redirectTo = `${window.location.origin}${window.location.pathname}?view=reset`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (error) setError(`Versand fehlgeschlagen: ${error.message}`);
    else setMessage("Falls ein Konto zu dieser Adresse existiert, wurde eine E-Mail versendet.");
    setBusy(false);
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    if (!supabase) { setError("Supabase ist noch nicht konfiguriert."); setBusy(false); return; }
    if (password.length < 12) { setError("Das Passwort muss mindestens 12 Zeichen haben."); setBusy(false); return; }
    if (password !== password2) { setError("Die Passwörter stimmen nicht überein."); setBusy(false); return; }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError("Passwortänderung fehlgeschlagen. Bitte fordere einen neuen Link an.");
    else {
      setMessage("Passwort geändert. Du kannst dich jetzt anmelden.");
      await supabase.auth.signOut();
      window.history.replaceState({}, "", window.location.pathname);
      setView("login");
    }
    setBusy(false);
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setSession(null);
    setMessage("Du wurdest abgemeldet.");
  }

  function applyUpdate() {
    navigator.serviceWorker.getRegistration().then((reg) => {
      reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
      if (!reg?.waiting) window.location.reload();
    });
  }

  if (!supabaseConfigured) return <main className="shell"><section className="card"><h1>Supabase nicht konfiguriert</h1><p>Bitte die lokalen Umgebungsvariablen bzw. GitHub-Pages-Konfiguration prüfen.</p></section></main>;

  return <main className="shell">
    {updateReady && <div className="update"><div><strong>Neue Version verfügbar</strong><p>Eine neue Version des Baustellenmanagers ist verfügbar.</p></div><button onClick={applyUpdate}>Update downloaden</button></div>}
    {!session ? <section className="card login">
      <div className="eyebrow">Projekt Baustellenmanagement</div>
      <h1>Baustellenmanager</h1>
      <p className="lead">Melde dich an, um deine Projekte und Baustellendaten aufzurufen.</p>
      {view === "reset" ? <form onSubmit={savePassword}>
        <h2>Neues Passwort festlegen</h2>
        <label>Neues Passwort<input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} minLength={12} required /></label>
        <label>Passwort wiederholen<input type="password" autoComplete="new-password" value={password2} onChange={e => setPassword2(e.target.value)} minLength={12} required /></label>
        <button disabled={busy}>{busy ? "Bitte warten…" : "Passwort speichern"}</button>
      </form> : <>
        <form onSubmit={signIn}>
          <label>E-Mail-Adresse<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /></label>
          <label>Passwort<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
          <button disabled={busy}>{busy ? "Bitte warten…" : "Anmelden"}</button>
        </form>
        <details><summary>Passwort vergessen?</summary><p>Gib deine E-Mail-Adresse ein. Wir senden dir einen Link zum Zurücksetzen.</p>
          <form onSubmit={requestReset}>
            <label>E-Mail-Adresse<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
            <button className="secondary" disabled={busy}>Link zum Zurücksetzen senden</button>
          </form>
        </details>
      </>}
      {error && <p className="error" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}
      <p className="notice">Die Anmeldung und Passwortverwaltung erfolgen über Supabase Auth.</p>
    </section> : <section className="content">
      <header className="topbar"><strong>Baustellenmanager</strong><button className="secondary small" onClick={signOut}>Abmelden</button></header>
      <div className="eyebrow">Übersicht</div><h1>Deine Baustellen. Ein zentraler Ort.</h1>
      <p className="lead">Die Anmeldung funktioniert. Die Projektverwaltung wird als nächster Schritt ergänzt.</p>
      <div className="grid">
        <article className="card"><span className="pill">Als Nächstes</span><h2>Projekte</h2><p>Baustellen und Firmenzugehörigkeit verwalten.</p><b className="stat">01</b></article>
        <article className="card"><span className="pill">Kernfunktion</span><h2>Pläne & Pins</h2><p>PDF öffnen, Position markieren und Aufgabe verknüpfen.</p><b className="stat">02</b></article>
        <article className="card"><span className="pill">Kernfunktion</span><h2>Aufgaben</h2><p>Prioritäten, Fälligkeiten und Wiedervorlagen.</p><b className="stat">03</b></article>
      </div>
      <p className="notice">Angemeldet als {session.user.email ?? "Benutzer"} · Version 1.0 · Noch keine Projektdaten angelegt</p>
    </section>}
  </main>;
}
