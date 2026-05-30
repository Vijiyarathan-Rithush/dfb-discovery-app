import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import VisitorLayout from '../components/visitor/VisitorLayout'
import { getObjectById } from '../api/ObjectApi'
import type { Hotspot, ObjectData } from '../types/ObjectData'
import { getStoredLanguage, textForLanguage } from '../utils/language'
import styles from './InteractivePage.module.scss'

function InteractivePage() {
  const { objectId } = useParams()
  const [object, setObject] = useState<ObjectData | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)
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
        setActiveHotspot(null)
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
      <VisitorLayout title="Interaktive Ansicht">
        <section className={styles.messageCard}>
          <p>{isFr ? 'Chargement de l’objet...' : 'Objekt wird geladen...'}</p>
        </section>
      </VisitorLayout>
    )
  }

  if (error || !object) {
    return (
      <VisitorLayout title="Interaktive Ansicht">
        <section className={styles.messageCard}>
          <p>{error || (isFr ? 'Objet introuvable.' : 'Objekt nicht gefunden.')}</p>
          <Link className={styles.moreLink} to={objectId ? `/object/${objectId}` : '/'}>
            {isFr ? 'Retour' : 'Zurück'}
          </Link>
        </section>
      </VisitorLayout>
    )
  }

  const title = textForLanguage(language, object.titleDe, object.titleFr)
  const imageAlt = textForLanguage(language, object.imageAltDe || title, object.imageAltFr)
  const hotspots = object.hotspots ?? []
  const selectedTitle = activeHotspot
    ? textForLanguage(language, activeHotspot.titleDe, activeHotspot.titleFr)
    : ''
  const selectedText = activeHotspot
    ? textForLanguage(language, activeHotspot.textDe, activeHotspot.textFr)
    : ''

  return (
    <VisitorLayout title={isFr ? 'Vue interactive' : 'Interaktive Ansicht'}>
      <section className={styles.hero} aria-label={title}>
        {object.imageUrl ? (
          <img className={styles.heroImage} src={object.imageUrl} alt={imageAlt} />
        ) : (
          <div className={styles.placeholder} role="img" aria-label={imageAlt}>
            {isFr ? 'Image non disponible' : 'Bild nicht verfügbar'}
          </div>
        )}

        {hotspots.map((hotspot) => {
          const hotspotTitle = textForLanguage(language, hotspot.titleDe, hotspot.titleFr)

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
            <p className={styles.emptyText}>
              {isFr
                ? 'Touchez les symboles pour découvrir les détails'
                : 'Tippen Sie auf die Symbole, um Details zu entdecken'}
            </p>
          </article>
        ) : (
          <article className={styles.card}>
            <h2 className={styles.hotspotTitle}>{selectedTitle}</h2>
            <p className={styles.hotspotText}>{selectedText}</p>
            <Link className={styles.moreLink} to={`/object/${object.id}/information`}>
              {isFr ? 'En savoir plus' : 'Mehr erfahren'}
            </Link>
          </article>
        )}
      </section>
    </VisitorLayout>
  )
}

export default InteractivePage
