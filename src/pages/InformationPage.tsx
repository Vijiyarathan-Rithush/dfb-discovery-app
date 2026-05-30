import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import VisitorLayout from '../components/visitor/VisitorLayout'
import { getObjectById } from '../api/ObjectApi'
import type { ObjectData } from '../types/ObjectData'
import { getStoredLanguage, textForLanguage } from '../utils/language'
import styles from './InformationPage.module.scss'

type InfoTab = 'short' | 'technical'

function resolveAssetUrl(url?: string) {
  if (!url) return ''
  if (
    url.startsWith('http') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url
  }

  if (url.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${url.slice(1)}`
  }

  return `${import.meta.env.BASE_URL}${url}`
}

function InformationPage() {
  const { objectId } = useParams()
  const [object, setObject] = useState<ObjectData | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<InfoTab>('short')

  const language = getStoredLanguage()
  const isFr = language === 'FR'

  useEffect(() => {
    async function loadObject() {
      if (!objectId) {
        setError('Keine Objekt-ID vorhanden.')
        setIsLoading(false)
        return
      }

      try {
        const loaded = await getObjectById(objectId)
        setObject(loaded)
      } catch {
        setError('Objekt konnte nicht geladen werden.')
      } finally {
        setIsLoading(false)
      }
    }

    loadObject()
  }, [objectId])

  if (isLoading) {
    return (
      <VisitorLayout title="Information">
        <section className={styles.messageCard}>
          <p>{isFr ? 'Chargement de l’objet...' : 'Objekt wird geladen...'}</p>
        </section>
      </VisitorLayout>
    )
  }

  if (error || !object) {
    return (
      <VisitorLayout title="Information">
        <section className={styles.messageCard}>
          <p>{error || (isFr ? 'Objet introuvable.' : 'Objekt nicht gefunden.')}</p>
          <Link to={objectId ? `/object/${objectId}` : '/'}>
            {isFr ? 'Retour' : 'Zurück'}
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
    object.imageAltFr || object.imageAltDe || title
  )

  const shortLabel = isFr ? 'Résumé' : 'Kurz erklärt'
  const technicalLabel = isFr ? 'Technique' : 'Technisch'

  const shortText = textForLanguage(
  language,
  object.shortDe,
  object.shortFr || object.shortDe
)

const technicalText = textForLanguage(
  language,
  object.technicalDe,
  object.technicalFr || object.technicalDe
)

const activeLabel = activeTab === 'short' ? shortLabel : technicalLabel
const activeText = activeTab === 'short' ? shortText : technicalText

  return (
    <VisitorLayout title="Information">
      <section className={styles.hero} aria-label={title}>
        {imageUrl ? (
          <img className={styles.heroImage} src={imageUrl} alt={imageAlt} />
        ) : (
          <div className={styles.placeholder} role="img" aria-label={imageAlt}>
            {isFr ? 'Image non disponible' : 'Bild nicht verfügbar'}
          </div>
        )}
      </section>

      <section className={styles.body}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label={isFr ? 'Type d’information' : 'Informationstiefe'}
        >
          <button
            type="button"
            className={styles.tab}
            role="tab"
            aria-selected={activeTab === 'short'}
            onClick={() => setActiveTab('short')}
          >
            {shortLabel}
          </button>

          <button
            type="button"
            className={styles.tab}
            role="tab"
            aria-selected={activeTab === 'technical'}
            onClick={() => setActiveTab('technical')}
          >
            {technicalLabel}
          </button>
        </div>

        <article className={styles.card} role="tabpanel">
          <h2 className={styles.cardTitle}>{activeLabel}</h2>
          <p className={styles.text}>
            {activeText ||
              (isFr
                ? 'Aucune information disponible.'
                : 'Keine Information vorhanden.')}
          </p>
        </article>

        <Link className={styles.quizButton} to={`/object/${object.id}/quiz`}>
          {isFr ? 'Continuer au quiz' : 'Weiter zum Quiz'}
        </Link>
      </section>
    </VisitorLayout>
  )
}

export default InformationPage