import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import LanguageSwitcher from '../components/LanguageSwitcher'

function HomePage() {
  return (
    <PageLayout headerLeft={<LanguageSwitcher />}>
      <section className="home-hero">
        <p className="eyebrow">DFB-Entdecker-App</p>

        <h1>Entdecke die Furka-Bergstrecke interaktiv</h1>

        <p className="home-intro">
          Scanne den QR-Code an einem Objekt und erhalte passende Informationen,
          interaktive Hotspots und Quizfragen direkt auf deinem Smartphone.
        </p>

        <div className="action-list">
          <Link className="primary-link" to="/admin/objects">
            Objekte ansehen
          </Link>

          <Link className="secondary-link" to="/admin">
            Adminbereich
          </Link>
        </div>
      </section>

      <section className="home-section">
        <h2>So funktioniert es</h2>

        <div className="home-steps">
          <article className="home-step">
            <span className="home-step-number">1</span>
            <h3>QR-Code scannen</h3>
            <p>
              Besucherinnen und Besucher starten direkt beim Objekt über den
              QR-Code.
            </p>
          </article>

          <article className="home-step">
            <span className="home-step-number">2</span>
            <h3>Objekt entdecken</h3>
            <p>
              Bilder, Kurzinfos, technische Details und Hotspots erklären das
              Objekt verständlich.
            </p>
          </article>

          <article className="home-step">
            <span className="home-step-number">3</span>
            <h3>Wissen testen</h3>
            <p>
              Am Schluss können Besucherinnen und Besucher ihr Wissen in einem
              kurzen Quiz überprüfen.
            </p>
          </article>
        </div>
      </section>
    </PageLayout>
  )
}

export default HomePage