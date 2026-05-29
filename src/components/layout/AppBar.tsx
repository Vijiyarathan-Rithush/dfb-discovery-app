import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './AppBar.module.scss'

interface AppBarProps {
  /** Im Header zentriert angezeigter Titel. */
  title?: string
  /** Zeigt links einen Zurück-Pfeil, der eine Seite zurück navigiert. */
  showBack?: boolean
  /** Slot für Aktionen rechts im Header, z.B. den Sprachumschalter. */
  right?: ReactNode
}

/** Dunkler Espresso-Kopfbereich, der auf jeder Seite gleich aussieht. */
function AppBar({ title, showBack, right }: AppBarProps) {
  const navigate = useNavigate()

  return (
    <header className={styles.appBar}>
      <div className={styles.side}>
        {showBack && (
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => navigate(-1)}
            aria-label="Zurück"
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
        )}
      </div>

      {title && <h1 className={styles.title}>{title}</h1>}

      <div className={`${styles.side} ${styles.right}`}>{right}</div>
    </header>
  )
}

export default AppBar
