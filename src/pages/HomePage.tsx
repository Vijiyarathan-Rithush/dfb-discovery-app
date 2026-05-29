import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import LanguageSwitcher from '../components/LanguageSwitcher'

function HomePage() {
  const navigate = useNavigate()

  return (
    <PageLayout
      headerRight={<LanguageSwitcher />}
      footer={
        <div className="action-list">
          <button type="button" onClick={() => navigate('/quiz')}>
            Weiter zum Quiz
          </button>
        </div>
      }
    >
      <h1>Dampflokomotive</h1>
      <p>
        Scanne einen QR-Code am Objekt und entdecke Informationen,
        Hotspots und Quizfragen zur Furka-Bergstrecke.
      </p>
    </PageLayout>
  )
}

export default HomePage