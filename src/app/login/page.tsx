import { signIn } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="shell">
      <section className="card login">
        <div className="eyebrow">Projekt Baustellenmanagement</div>
        <h1>Baustellenmanager</h1>
        <p className="lead">Melde dich an, um deine Projekte und Baustellendaten aufzurufen.</p>
        <form action={signIn}>
          <div className="field"><label htmlFor="email">E-Mail-Adresse</label><input id="email" name="email" type="email" autoComplete="username" required /></div>
          <div className="field"><label htmlFor="password">Passwort</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
          {error ? <p role="alert" style={{color:"#b42318"}}>{error}</p> : null}
          <button className="button" type="submit" style={{width:"100%"}}>Anmelden</button>
        </form>
        <p className="notice" style={{marginTop:18}}>Der Login wird über Supabase Auth abgewickelt. Es werden keine Passwörter in der App gespeichert.</p>
      </section>
    </main>
  );
}
