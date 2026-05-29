import type { ReactNode } from 'react'
import AppBar from './AppBar'
import styles from './PageLayout.module.scss'

interface PageLayoutProps {
  title?: string
  showBack?: boolean
  headerLeft?: ReactNode
  hideHeader?: boolean
  footer?: ReactNode
  children: ReactNode
}

function PageLayout({
  title,
  showBack,
  headerLeft,
  hideHeader,
  footer,
  children,
}: PageLayoutProps) {
  return (
    <div className={styles.page}>
      {!hideHeader && (
        <AppBar title={title} showBack={showBack} left={headerLeft} />
      )}

      <main className={styles.content}>{children}</main>

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  )
}

export default PageLayout