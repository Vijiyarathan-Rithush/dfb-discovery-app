import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import LanguageSwitcher from '../components/LanguageSwitcher'

/** Hauptseite (/) – Einstieg mit Sprachwahl und Weg zum Quiz. */
function HomePage() {
  const navigate = useNavigate()

  return (
    <PageLayout
      headerRight={<LanguageSwitcher />}
      footer={
        <button type="button" onClick={() => navigate('/quiz')}>
          Weiter zum Quiz
        </button>
      }
    >
      <h1>Dampflokomotive</h1>
      <p>Platzhalter – Inhalt der Hauptseite folgt.</p>
    </PageLayout>
  )
}

export default HomePage
