import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import VisitorLayout from '../components/visitor/VisitorLayout'
import type { Hotspot } from '../types/ObjectData'
import { getStoredLanguage, textForLanguage } from '../utils/language'
import { resolveAssetUrl } from '../utils/assetUrl'
import { useObject } from '../hooks/useObject'
import styles from './InteractivePage.module.scss'

function InteractivePage() {
  const { objectId } = useParams()
  const { object, error, isLoading } = useObject(objectId)
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)

  const language = getStoredLanguage()
  const isFr = language === 'FR'

  const labels = isFr
    ? {
        pageTitle: 'Vue interactive',
        loading: 'Chargement de l’objet...',
        notFound: 'Objet introuvable.',
        back: 'Retour',
        imageMissing: 'Image non disponible',
        emptyHint: 'Touchez les symboles pour découvrir les détails',
        more: 'En savoir plus',
      }
    : {
        pageTitle: 'Interaktive Ansicht',
        loading: 'Objekt wird geladen...',
        notFound: 'Objekt nicht gefunden.',
        back: 'Zurück',
        imageMissing: 'Bild nicht verfügbar',
        emptyHint: 'Tippen Sie auf die Symbole, um Details zu entdecken',
        more: 'Mehr erfahren',
      }

  if (isLoading) {
    return (
      <VisitorLayout title={labels.pageTitle}>
        <section className={styles.messageCard}>
          <p>{labels.loading}</p>
        </section>
      </VisitorLayout>
    )
  }

  if (error || !object) {
    return (
      <VisitorLayout title={labels.pageTitle}>
        <section className={styles.messageCard}>
          <p>{error || labels.notFound}</p>
          <Link className={styles.moreLink} to={objectId ? `/object/${objectId}` : '/'}>
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

  const hotspots = object.hotspots ?? []

  const selectedTitle = activeHotspot
    ? textForLanguage(language, activeHotspot.titleDe, activeHotspot.titleFr)
    : ''

  const selectedText = activeHotspot
    ? textForLanguage(language, activeHotspot.textDe, activeHotspot.textFr)
    : ''

  return (
    <VisitorLayout title={labels.pageTitle}>
      <section className={styles.hero} aria-label={title}>
        {imageUrl ? (
          <img className={styles.heroImage} src={imageUrl} alt={imageAlt} />
        ) : (
          <div className={styles.placeholder} role="img" aria-label={imageAlt}>
            {labels.imageMissing}
          </div>
        )}

        {hotspots.map((hotspot) => {
          const hotspotTitle = textForLanguage(
            language,
            hotspot.titleDe,
            hotspot.titleFr,
          )

          return (
            <button
              key={hotspot.id}
              type="button"
              className={styles.hotspotButton}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              aria-label={hotspotTitle}
              aria-pressed={activeHotspot?.id === hotspot.id}
              onClick={() =>
                setActiveHotspot((current) =>
                  current?.id === hotspot.id ? null : hotspot,
                )
              }
            >
              <Info size={22} aria-hidden="true" strokeWidth={2.2} />
            </button>
          )
        })}
      </section>

      <section className={styles.body} aria-live="polite">
        {!activeHotspot ? (
          <article className={`${styles.card} ${styles.emptyCard}`}>
            <p className={styles.emptyText}>{labels.emptyHint}</p>
          </article>
        ) : (
          <article className={styles.card}>
            <h2 className={styles.hotspotTitle}>{selectedTitle}</h2>
            <p className={styles.hotspotText}>{selectedText}</p>
            <Link className={styles.moreLink} to={`/object/${object.id}/information`}>
              {labels.more}
            </Link>
          </article>
        )}
      </section>
    </VisitorLayout>
  )
}

export default InteractivePage