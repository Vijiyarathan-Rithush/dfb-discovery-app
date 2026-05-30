import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getObjectById } from '../api/ObjectApi'
import type { ObjectData } from '../types/ObjectData'
import type { Language } from '../components/LanguageSwitcher'
import { getStoredLanguage, persistLanguage, textForLanguage } from '../utils/language'
import styles from './ObjectPage.module.scss'

const DISCOVERED_KEY = 'dfb-discovered-objects'

function getDiscovered(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(DISCOVERED_KEY) ?? '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function markDiscovered(objectId: string) {
  const discovered = getDiscovered()

  if (!discovered.includes(objectId)) {
    localStorage.setItem(DISCOVERED_KEY, JSON.stringify([...discovered, objectId]))
  }
}

function ObjectPage() {
  const { objectId } = useParams()
  const [object, setObject] = useState<ObjectData | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<Language>(getStoredLanguage)

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
        markDiscovered(objectId)
      } catch {
        setError('Objekt konnte nicht geladen werden.')
      } finally {
        setIsLoading(false)
      }
    }

    loadObject()
  }, [objectId])

  function handleLanguageChange(nextLanguage: Language) {
    setLanguage(nextLanguage)
    persistLanguage(nextLanguage)
  }

  if (isLoading) {
    return (
      <main className={styles.loading}>
        <p>Objekt wird geladen...</p>
      </main>
    )
  }

  if (error || !object) {
    return (
      <main className={styles.error}>
        <section className={styles.errorCard}>
          <h1 className={styles.errorTitle}>Objekt nicht gefunden</h1>
          <p>{error || 'Das gewünschte Objekt konnte nicht geladen werden.'}</p>
          <Link className={styles.backLink} to="/admin">
            Zurück zur Übersicht
          </Link>
        </section>
      </main>
    )
  }

  const isFr = language === 'FR'
  const title = textForLanguage(language, object.titleDe, object.titleFr)
  const shortText = textForLanguage(language, object.shortDe, object.shortFr)
  const imageAlt = textForLanguage(language, object.imageAltDe || title, object.imageAltFr)
  const audioUrl = textForLanguage(language, object.audioUrlDe, object.audioUrlFr)
  const audioTranscript = textForLanguage(
    language,
    object.audioTranscriptDe,
    object.audioTranscriptFr,
  )

  return (
    <main className={styles.shell}>
      <section className={styles.hero} aria-label={title}>
        {object.imageUrl ? (
          <img className={styles.heroImage} src={object.imageUrl} alt={imageAlt} />
        ) : (
          <div className={styles.heroPlaceholder} role="img" aria-label={imageAlt}>
            {isFr ? 'Image non disponible' : 'Bild nicht verfügbar'}
          </div>
        )}

        <div className={styles.languageOverlay} role="group" aria-label={isFr ? 'Choisir la langue' : 'Sprache wählen'}>
          <span className={styles.languageLabel}>{isFr ? 'Langue' : 'Sprache'}</span>

          <div className={styles.languageOptions}>
            {(['DE', 'FR'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                className={styles.languageButton}
                aria-pressed={language === lang}
                onClick={() => handleLanguageChange(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{shortText}</p>

        {audioUrl && (
          <div className={styles.audioBlock}>
            <audio className={styles.audio} controls src={audioUrl}>
              {isFr
                ? 'Votre navigateur ne supporte pas la lecture audio.'
                : 'Ihr Browser unterstützt die Audiowiedergabe nicht.'}
            </audio>
          </div>
        )}

        {audioTranscript && (
          <details className={styles.transcript}>
            <summary>{isFr ? 'Transcription audio' : 'Textversion zum Audio anzeigen'}</summary>
            <p>{audioTranscript}</p>
          </details>
        )}

        <Link className={styles.primaryAction} to={`/object/${object.id}/interactive`}>
          {isFr ? 'Vue interactive' : 'Interaktive ansicht'}
        </Link>
      </section>
    </main>
  )
}

export default ObjectPage
