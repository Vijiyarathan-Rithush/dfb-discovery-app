import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import VisitorLayout from '../components/visitor/VisitorLayout'
import { getStoredLanguage, textForLanguage } from '../utils/language'
import { resolveAssetUrl } from '../utils/assetUrl'
import { useObject } from '../hooks/useObject'
import styles from './InformationPage.module.scss'

type InfoTab = 'short' | 'technical'

function InformationPage() {
  const { objectId } = useParams()
  const { object, error, isLoading } = useObject(objectId)
  const [activeTab, setActiveTab] = useState<InfoTab>('short')

  const language = getStoredLanguage()
  const isFr = language === 'FR'

  const labels = isFr
    ? {
        title: 'Information',
        loading: 'Chargement de l’objet...',
        notFound: 'Objet introuvable.',
        back: 'Retour',
        imageMissing: 'Image non disponible',
        tabLabel: 'Type d’information',
        short: 'Résumé',
        technical: 'Technique',
        noInfo: 'Aucune information disponible.',
        noTechnicalInfo: 'Aucune description technique disponible.',
        continueQuiz: 'Continuer au quiz',
      }
    : {
        title: 'Information',
        loading: 'Objekt wird geladen...',
        notFound: 'Objekt nicht gefunden.',
        back: 'Zurück',
        imageMissing: 'Bild nicht verfügbar',
        tabLabel: 'Informationstiefe',
        short: 'Kurz erklärt',
        technical: 'Technisch',
        noInfo: 'Keine Information vorhanden.',
        noTechnicalInfo: 'Keine technische Beschreibung vorhanden.',
        continueQuiz: 'Weiter zum Quiz',
      }

  if (isLoading) {
    return (
      <VisitorLayout title={labels.title}>
        <section className={styles.messageCard}>
          <p>{labels.loading}</p>
        </section>
      </VisitorLayout>
    )
  }

  if (error || !object) {
    return (
      <VisitorLayout title={labels.title}>
        <section className={styles.messageCard}>
          <p>{error || labels.notFound}</p>
          <Link to={objectId ? `/object/${objectId}` : '/'}>
            {labels.back}
          </Link>
        </section>
      </VisitorLayout>
    )
  }

  const title = textForLanguage(language, object.titleDe, object.titleFr)
  const imageUrl = resolveAssetUrl(object.imageUrl)

  const imageAlt = textForLanguage(
    language,
    object.imageAltDe || title,
    object.imageAltFr || object.imageAltDe || title,
  )

  const shortText =
    language === 'FR'
      ? object.shortFr?.trim() || object.shortDe?.trim() || ''
      : object.shortDe?.trim() || ''

  const technicalText =
    language === 'FR'
      ? object.technicalFr?.trim() || object.technicalDe?.trim() || ''
      : object.technicalDe?.trim() || ''

  const activeLabel = activeTab === 'short' ? labels.short : labels.technical
  const activeText = activeTab === 'short' ? shortText : technicalText
  const emptyText =
    activeTab === 'technical' ? labels.noTechnicalInfo : labels.noInfo

  return (
    <VisitorLayout title={labels.title}>
      <section className={styles.hero} aria-label={title}>
        {imageUrl ? (
          <img className={styles.heroImage} src={imageUrl} alt={imageAlt} />
        ) : (
          <div className={styles.placeholder} role="img" aria-label={imageAlt}>
            {labels.imageMissing}
          </div>
        )}
      </section>

      <section className={styles.body}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label={labels.tabLabel}
        >
          <button
            type="button"
            className={styles.tab}
            role="tab"
            aria-selected={activeTab === 'short'}
            onClick={() => setActiveTab('short')}
          >
            {labels.short}
          </button>

          <button
            type="button"
            className={styles.tab}
            role="tab"
            aria-selected={activeTab === 'technical'}
            onClick={() => setActiveTab('technical')}
          >
            {labels.technical}
          </button>
        </div>

        <article className={styles.card} role="tabpanel">
          <h2 className={styles.cardTitle}>{activeLabel}</h2>
          <p className={styles.text}>{activeText || emptyText}</p>
        </article>

        <Link className={styles.quizButton} to={`/object/${object.id}/quiz`}>
          {labels.continueQuiz}
        </Link>
      </section>
    </VisitorLayout>
  )
}

export default InformationPage