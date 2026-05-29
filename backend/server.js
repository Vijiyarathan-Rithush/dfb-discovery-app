import express from 'express'
import cors from 'cors'
import fs from 'fs'

const app = express()
const port = process.env.PORT || 3001
const filePath = './backend/objects.json'

app.use(cors())
app.use(express.json())

function readObjects() {
  if (!fs.existsSync(filePath)) {
    writeObjects([])
    return []
  }

  const data = fs.readFileSync(filePath, 'utf8').trim()

  if (!data) {
    writeObjects([])
    return []
  }

  return JSON.parse(data)
}

function writeObjects(objects) {
  fs.writeFileSync(filePath, JSON.stringify(objects, null, 2))
}

app.get('/api/objects', (req, res) => {
  res.json(readObjects())
})

app.get('/api/objects/:id', (req, res) => {
  const objects = readObjects()
  const object = objects.find((item) => item.id === req.params.id)

  if (!object) {
    return res.status(404).json({ message: 'Objekt nicht gefunden.' })
  }

  res.json(object)
})

app.post('/api/objects', (req, res) => {
  const newObject = req.body

  if (!newObject.id || !newObject.titleDe || !newObject.titleFr || !newObject.shortDe) {
    return res.status(400).json({ message: 'Pflichtfelder fehlen.' })
  }

  const objects = readObjects()
  const updatedObjects = objects.filter((item) => item.id !== newObject.id)

  updatedObjects.push(newObject)
  writeObjects(updatedObjects)

  res.status(201).json({
    message: 'Objekt wurde gespeichert.',
    object: newObject,
  })
})

app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`)
})