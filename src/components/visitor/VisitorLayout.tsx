import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './VisitorLayout.module.scss'

interface VisitorLayoutProps {
  title: string
  children: ReactNode
}

function VisitorLayout({ title, children }: VisitorLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
          aria-label="Zurück"
        >
          <ArrowLeft size={24} aria-hidden="true" strokeWidth={1.75} />
        </button>

        <h1 className={styles.title}>{title}</h1>
      </header>

      <main className={styles.content}>{children}</main>
    </div>
  )
}

export default VisitorLayout
