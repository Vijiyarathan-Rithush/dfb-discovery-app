import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="app-page">
      <section className="card">
        <p className="eyebrow">DFB-Entdecker-App</p>
        <h1>Interaktive Erlebnisführung</h1>
        <p>
          Scanne einen QR-Code am Objekt und entdecke Informationen,
          Hotspots und Quizfragen zur Furka-Bergstrecke.
        </p>

        <div className="action-list">
          <Link className="primary-link" to="/admin">
            Admin öffnen
          </Link>
          <Link className="secondary-link" to="/object/hg34">
            Beispielobjekt ansehen
          </Link>
        </div>
      </section>
    </main>
  )
}

export default HomePage