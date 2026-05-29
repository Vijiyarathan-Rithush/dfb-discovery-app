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
  const imageUrl = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : req.body.imageUrl || ''

  const newObject = {
    id: req.body.id,
    titleDe: req.body.titleDe,
    titleFr: req.body.titleFr,
    shortDe: req.body.shortDe,
    shortFr: req.body.shortFr || '',
    technicalDe: req.body.technicalDe || '',
    technicalFr: req.body.technicalFr || '',
    imageUrl,
  }

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

app.delete('/api/objects/:id', (req, res) => {
  const objects = readObjects()
  const updatedObjects = objects.filter((item) => item.id !== req.params.id)

  if (objects.length === updatedObjects.length) {
    return res.status(404).json({ message: 'Objekt nicht gefunden.' })
  }

  writeObjects(updatedObjects)

  res.json({
    message: 'Objekt wurde gelöscht.',
    id: req.params.id,
  })
})

app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`)
})