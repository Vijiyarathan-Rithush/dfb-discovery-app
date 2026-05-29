import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import house from '../../assets/house.svg'
import styles from './AppBar.module.scss'

interface AppBarProps {
  title?: string
  showBack?: boolean
  left?: ReactNode
}

function AppBar({ title, showBack, left }: AppBarProps) {
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
        {left}
      </div>

      {title && <h1 className={styles.title}>{title}</h1>}

      <div className={`${styles.side} ${styles.right}`}>
        <button
          type="button"
          className={styles.logo}
          onClick={() => navigate('/')}
          aria-label="Zur Startseite"
        >
          <img src={house} alt="" className={styles.logoImage} />
        </button>
      </div>
    </header>
  )
}

export default AppBar