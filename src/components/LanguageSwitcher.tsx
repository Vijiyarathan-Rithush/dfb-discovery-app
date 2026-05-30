import { useState } from 'react'
import styles from './LanguageSwitcher.module.scss'

export const LANGUAGES = ['DE', 'FR'] as const
export type Language = (typeof LANGUAGES)[number]

interface LanguageSwitcherProps {
  language?: Language
  onChange?: (lang: Language) => void
}

function LanguageSwitcher({ language, onChange }: LanguageSwitcherProps) {
  const [internalLang, setInternalLang] = useState<Language>('DE')
  const active = language ?? internalLang

  function handleClick(lang: Language) {
    if (onChange) {
      onChange(lang)
    } else {
      setInternalLang(lang)
    }
  }

  return (
    <div className={styles.switcher} role="group" aria-label="Sprache wählen">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          className={styles.option}
          aria-pressed={active === lang}
          onClick={() => handleClick(lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
