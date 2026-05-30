import { useEffect, useState } from 'react'
import { getObjectById } from '../api/ObjectApi'
import type { ObjectData } from '../types/ObjectData'

export function useObject(objectId?: string) {
  const [object, setObject] = useState<ObjectData | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

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
      } catch {
        setError('Objekt konnte nicht geladen werden.')
      } finally {
        setIsLoading(false)
      }
    }

    loadObject()
  }, [objectId])

  return { object, error, isLoading }
}