import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'

/** Information (/information) – Detailtexte zum Objekt. */
function InformationPage() {
  const navigate = useNavigate()

  return (
    <PageLayout
      title="Information"
      showBack
      footer={
        <button type="button" onClick={() => navigate('/quiz')}>
          Weiter zum Quiz
        </button>
      }
    >
      <h2>Kurz erklärt</h2>
      <p>Platzhalter – Informationstext folgt.</p>
    </PageLayout>
  )
}

export default InformationPage
