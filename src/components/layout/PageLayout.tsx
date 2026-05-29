import type { ReactNode } from 'react'
import AppBar from './AppBar'
import styles from './PageLayout.module.scss'

interface PageLayoutProps {
  /** Titel im Header (zentriert). */
  title?: string
  /** Zeigt im Header einen Zurück-Pfeil. */
  showBack?: boolean
  /** Slot für Aktionen rechts im Header, z.B. <LanguageSwitcher />. */
  headerRight?: ReactNode
  /** Blendet den Header komplett aus (z.B. Hauptseite mit Hero-Bild). */
  hideHeader?: boolean
  /** Fixierter Bereich am unteren Rand, üblicherweise ein CTA-Button. */
  footer?: ReactNode
  /** Seiteninhalt im scrollbaren Bereich. */
  children: ReactNode
}

/**
 * Grundgerüst für jede Seite: dunkler Header (optional), scrollbarer Inhalt
 * und ein optionaler fixierter Aktionsbereich unten.
 */
function PageLayout({
  title,
  showBack,
  headerRight,
  hideHeader,
  footer,
  children,
}: PageLayoutProps) {
  return (
    <div className={styles.page}>
      {!hideHeader && (
        <AppBar title={title} showBack={showBack} right={headerRight} />
      )}

      <main className={styles.content}>{children}</main>

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  )
}

export default PageLayout
