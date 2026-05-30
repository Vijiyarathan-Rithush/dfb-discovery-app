import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Language } from '../components/LanguageSwitcher'
import { getStoredLanguage, persistLanguage, textForLanguage } from '../utils/language'
import { resolveAssetUrl } from '../utils/assetUrl'
import { useObject } from '../hooks/useObject'
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
  const { object, error, isLoading } = useObject(objectId)
  const [language, setLanguage] = useState<Language>(getStoredLanguage)

  const isFr = language === 'FR'

  const labels = isFr
    ? {
        loading: 'Chargement de l’objet...',
        notFoundTitle: 'Objet introuvable',
        notFoundText: 'L’objet souhaité n’a pas pu être chargé.',
        back: 'Retour à l’aperçu',
        imageMissing: 'Image non disponible',
        languageGroup: 'Choisir la langue',
        language: 'Langue',
        audioUnsupported: 'Votre navigateur ne supporte pas la lecture audio.',
        transcript: 'Afficher la transcription audio',
        interactive: 'Vue interactive',
      }
    : {
        loading: 'Objekt wird geladen...',
        notFoundTitle: 'Objekt nicht gefunden',
        notFoundText: 'Das gewünschte Objekt konnte nicht geladen werden.',
        back: 'Zurück zur Übersicht',
        imageMissing: 'Bild nicht verfügbar',
        languageGroup: 'Sprache wählen',
        language: 'Sprache',
        audioUnsupported: 'Ihr Browser unterstützt die Audiowiedergabe nicht.',
        transcript: 'Textversion zum Audio anzeigen',
        interactive: 'Interaktive Ansicht',
      }

  useEffect(() => {
    if (objectId && object) {
      markDiscovered(objectId)
    }
  }, [objectId, object])

  function handleLanguageChange(nextLanguage: Language) {
    setLanguage(nextLanguage)
    persistLanguage(nextLanguage)
  }

  if (isLoading) {
    return (
      <main className={styles.loading}>
        <p>{labels.loading}</p>
      </main>
    )
  }

  if (error || !object) {
    return (
      <main className={styles.error}>
        <section className={styles.errorCard}>
          <h1 className={styles.errorTitle}>{labels.notFoundTitle}</h1>
          <p>{error || labels.notFoundText}</p>
          <Link className={styles.backLink} to="/admin">
            {labels.back}
          </Link>
        </section>
      </main>
    )
  }

  const title = textForLanguage(language, object.titleDe, object.titleFr)
  const shortText = textForLanguage(language, object.shortDe, object.shortFr)
  const imageUrl = resolveAssetUrl(object.imageUrl)

  const imageAlt = textForLanguage(
    language,
    object.imageAltDe || title,
    object.imageAltFr || object.imageAltDe || title,
  )

  const audioUrl = resolveAssetUrl(
    textForLanguage(language, object.audioUrlDe, object.audioUrlFr),
  )

  const audioTranscript = textForLanguage(
    language,
    object.audioTranscriptDe,
    object.audioTranscriptFr,
  )

  return (
    <main className={styles.shell}>
      <section className={styles.hero} aria-label={title}>
        {imageUrl ? (
          <img className={styles.heroImage} src={imageUrl} alt={imageAlt} />
        ) : (
          <div className={styles.heroPlaceholder} role="img" aria-label={imageAlt}>
            {labels.imageMissing}
          </div>
        )}

        <div
          className={styles.languageOverlay}
          role="group"
          aria-label={labels.languageGroup}
        >
          <span className={styles.languageLabel}>{labels.language}</span>

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
              {labels.audioUnsupported}
            </audio>
          </div>
        )}

        {audioTranscript && (
          <details className={styles.transcript}>
            <summary>{labels.transcript}</summary>
            <p>{audioTranscript}</p>
          </details>
        )}

        <Link className={styles.primaryAction} to={`/object/${object.id}/interactive`}>
          {labels.interactive}
        </Link>
      </section>
    </main>
  )
}

export default ObjectPage