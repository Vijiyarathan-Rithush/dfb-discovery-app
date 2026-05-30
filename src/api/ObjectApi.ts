import type { ObjectData } from '../types/ObjectData'

const API_URL = 'http://localhost:3001/api/objects'

export async function saveObject(formData: FormData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Objekt konnte nicht gespeichert werden.')
  }

  return response.json()
}

export async function getObjects(): Promise<ObjectData[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Objekte konnten nicht geladen werden.')
  }

  return response.json()
}

export async function getObjectById(id: string): Promise<ObjectData> {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Objekt konnte nicht geladen werden.')
  }

  return response.json()
}

export async function deleteObject(id: string) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Objekt konnte nicht gelöscht werden.')
  }

  return response.json()
}