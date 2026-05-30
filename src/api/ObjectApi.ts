import type { ObjectData } from '../types/ObjectData'

const API_URL = 'https://backend-dfb.onrender.com/api/objects'

async function handleObjectResponse(response: Response, fallbackMessage: string) {
  if (!response.ok) {
    let message = fallbackMessage
    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      // Falls das Backend keine JSON-Fehlermeldung liefert.
    }
    throw new Error(message)
  }

  return response.json()
}

export async function saveObject(formData: FormData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  })

  return handleObjectResponse(response, 'Objekt konnte nicht gespeichert werden.')
}

export async function updateObject(id: string, formData: FormData) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: formData,
  })

  return handleObjectResponse(response, 'Objekt konnte nicht aktualisiert werden.')
}

export async function getObjects(): Promise<ObjectData[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Objekte konnten nicht geladen werden.')
  }

  return response.json()
}

export async function getObjectById(id: string): Promise<ObjectData> {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`)

  if (!response.ok) {
    throw new Error('Objekt konnte nicht geladen werden.')
  }

  return response.json()
}

export async function deleteObject(id: string) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })

  return handleObjectResponse(response, 'Objekt konnte nicht gelöscht werden.')
}