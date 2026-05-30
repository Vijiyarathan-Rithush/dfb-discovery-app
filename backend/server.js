import express from 'express'
import cors from 'cors'
import fs from 'fs'
import multer from 'multer'

const app = express()
const port = process.env.PORT || 3001
const filePath = './backend/objects.json'
const uploadDir = './backend/uploads'

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, callback) => {
    const cleanName = file.originalname.replace(/\s+/g, '-').toLowerCase()
    const fileName = `${Date.now()}-${cleanName}`
    callback(null, fileName)
  },
})

const upload = multer({ storage })

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadDir))

function writeObjects(objects) {
  fs.writeFileSync(filePath, JSON.stringify(objects, null, 2))
}

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

function parseJsonField(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function generateObjectId(titleDe, objects) {
  let slug = titleDe
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

  const existingIds = objects.map((o) => o.id)

  if (!existingIds.includes(slug)) {
    return slug
  }

  let counter = 2
  while (existingIds.includes(`${slug}-${counter}`)) {
    counter++
  }
  return `${slug}-${counter}`
}

app.get('/', (req, res) => {
  res.send('DFB Backend läuft. Nutze /api/objects für die Objektdaten.')
})

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

app.post('/api/objects', upload.single('image'), (req, res) => {
  const objects = readObjects()
  const shouldRemoveImage = req.body.removeImage === 'true'

  const imageUrl = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : shouldRemoveImage
      ? ''
      : req.body.imageUrl || ''

  // Determine ID: use existing if present, else generate new
  let id = req.body.id ? String(req.body.id).trim() : ''
  const isNew = !id

  if (isNew) {
    if (!req.body.titleDe) {
      return res.status(400).json({ message: 'Pflichtfelder fehlen.' })
    }
    id = generateObjectId(req.body.titleDe, objects)
  }

  if (!req.body.titleDe || !req.body.titleFr || !req.body.shortDe) {
    return res.status(400).json({ message: 'Pflichtfelder fehlen.' })
  }

  // If editing, keep existing imageUrl when no new image uploaded and not removing
  let finalImageUrl = imageUrl
  if (!isNew && !req.file && !shouldRemoveImage) {
    const existing = objects.find((o) => o.id === id)
    finalImageUrl = existing ? existing.imageUrl : req.body.imageUrl || ''
  }

  const newObject = {
    id,
    titleDe: req.body.titleDe,
    titleFr: req.body.titleFr,
    shortDe: req.body.shortDe,
    shortFr: req.body.shortFr || '',
    technicalDe: req.body.technicalDe || '',
    technicalFr: req.body.technicalFr || '',
    imageUrl: finalImageUrl,
    imageAltDe: req.body.imageAltDe || '',
    imageAltFr: req.body.imageAltFr || '',
    audioUrlDe: req.body.audioUrlDe || '',
    audioUrlFr: req.body.audioUrlFr || '',
    audioTranscriptDe: req.body.audioTranscriptDe || '',
    audioTranscriptFr: req.body.audioTranscriptFr || '',
    locationHintDe: req.body.locationHintDe || '',
    locationHintFr: req.body.locationHintFr || '',
    hotspots: parseJsonField(req.body.hotspots, []),
    quiz: parseJsonField(req.body.quiz, []),
  }

  const updatedObjects = objects.filter((item) => item.id !== id)
  updatedObjects.push(newObject)
  writeObjects(updatedObjects)

  res.status(201).json({
    message: 'Objekt wurde gespeichert.',
    object: newObject,
  })
})

app.delete('/api/objects/:id', (req, res) => {
  const objects = readObjects()
  const updatedObjects = objects.filter((item) => item.id !== req.params.id)
  if (objects.length === updatedObjects.length) {
    return res.status(404).json({ message: 'Objekt nicht gefunden.' })
  }
  writeObjects(updatedObjects)
  res.json({ message: 'Objekt wurde gelöscht.', id: req.params.id })
})

app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`)
})
