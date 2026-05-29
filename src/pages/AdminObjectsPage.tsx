import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { deleteObject, getObjects } from '../api/ObjectApi'
import type { ObjectData } from '../types/ObjectData'

function AdminObjectsPage() {
  const [objects, setObjects] = useState<ObjectData[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [printIds, setPrintIds] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadObjects() {
      try {
        const loadedObjects = await getObjects()
        setObjects(loadedObjects)
      } catch {
        setError('Objekte konnten nicht geladen werden.')
      } finally {
        setIsLoading(false)
      }
    }

    loadObjects()
  }, [])

  useEffect(() => {
    function clearPrintSelection() {
      setPrintIds([])
    }

    window.addEventListener('afterprint', clearPrintSelection)

    return () => {
      window.removeEventListener('afterprint', clearPrintSelection)
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const activeElement = document.activeElement
      const isTyping =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement

      if (isTyping) {
        return
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'a') {
        event.preventDefault()

        setSelectedIds((currentIds) =>
          currentIds.length === objects.length
            ? []
            : objects.map((object) => object.id),
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [objects])

  function toggleSelectedId(id: string) {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    )
  }

  function printSingleObject(id: string) {
    setPrintIds([id])

    setTimeout(() => {
      window.print()
    }, 100)
  }

  function printSelectedObjects() {
    if (selectedIds.length === 0) {
      return
    }

    setPrintIds(selectedIds)

    setTimeout(() => {
      window.print()
    }, 100)
  }

  async function handleDeleteObject(id: string) {
    const shouldDelete = window.confirm('Soll dieses Objekt wirklich gelöscht werden?')

    if (!shouldDelete) {
      return
    }

    try {
      await deleteObject(id)

      setObjects((currentObjects) =>
        currentObjects.filter((object) => object.id !== id),
      )

      setSelectedIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== id),
      )
    } catch {
      setError('Objekt konnte nicht gelöscht werden.')
    }
  }

  return (
    <main className="app-page admin-page">
      <section className="card no-print">
        <p className="eyebrow">Admin</p>
        <h1>Objektübersicht</h1>
        <p>
          Hier werden alle gespeicherten Objekte angezeigt. Der QR-Code
          verweist automatisch auf die passende Objektseite.
        </p>

        <div className="action-list">
          <Link className="primary-link" to="/admin">
            Neues Objekt erfassen
          </Link>

          <button
            className="primary-button"
            type="button"
            disabled={selectedIds.length === 0}
            onClick={printSelectedObjects}
          >
            Ausgewählte QR-Codes drucken
          </button>

          <Link className="secondary-link" to="/">
            Zurück
          </Link>
        </div>
      </section>

      {isLoading && (
        <p className="empty-message no-print">
          Objekte werden geladen...
        </p>
      )}

      {error && <p className="error-message no-print">{error}</p>}

      {!isLoading && objects.length === 0 && !error && (
        <p className="empty-message no-print">
          Es sind noch keine Objekte gespeichert.
        </p>
      )}

      <section className="object-list">
        {objects.map((object) => {
          const objectUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/object/${object.id}`
          const isSelected = selectedIds.includes(object.id)
          const shouldPrint =
            printIds.length === 0 || printIds.includes(object.id)

          return (
            <article
              className={`object-card ${shouldPrint ? 'print-item' : 'no-print'}`}
              key={object.id}
            >
              <div className="print-area">
                <h2 className="print-title">{object.titleDe}</h2>

                <div className="qr-box">
                  <QRCodeSVG value={objectUrl} size={150} />
                </div>
              </div>

              <div className="object-card-meta no-print">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectedId(object.id)}
                  />
                  Für Mehrfachdruck auswählen
                </label>

                <p className="object-id">ID: {object.id}</p>
              </div>

              <div className="object-actions no-print">
                <Link className="secondary-link" to={`/object/${object.id}`}>
                  Objekt ansehen
                </Link>

                <Link className="secondary-link" to={`/admin/edit/${object.id}`}>
                  Bearbeiten
                </Link>

                <button
                  className="primary-button"
                  type="button"
                  onClick={() => printSingleObject(object.id)}
                >
                  QR-Code drucken
                </button>

                <button
                  className="danger-button"
                  type="button"
                  onClick={() => handleDeleteObject(object.id)}
                >
                  Löschen
                </button>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default AdminObjectsPage