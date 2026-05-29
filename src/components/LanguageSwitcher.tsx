import { useState } from 'react'
import styles from './LanguageSwitcher.module.scss'

const LANGUAGES = ['DE', 'FR'] as const
type Language = (typeof LANGUAGES)[number]

function LanguageSwitcher() {
  const [active, setActive] = useState<Language>('DE')

  return (
    <div className={styles.switcher} role="group" aria-label="Sprache wählen">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          className={styles.option}
          aria-pressed={active === lang}
          onClick={() => setActive(lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher