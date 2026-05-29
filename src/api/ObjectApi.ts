import type { ObjectData } from '../types/ObjectData'

const API_URL = 'http://localhost:3001/api/objects'

export async function saveObject(object: ObjectData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(object),
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