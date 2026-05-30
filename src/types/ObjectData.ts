export type Hotspot = {
  id: string
  titleDe: string
  titleFr: string
  textDe: string
  textFr: string
  x: number
  y: number
}

export type QuizQuestion = {
  id: string
  questionDe: string
  questionFr: string
  answersDe: string[]
  answersFr: string[]
  correctAnswerIndex: number
  explanationDe: string
  explanationFr: string
}

export type ObjectData = {
  id: string
  titleDe: string
  titleFr: string
  shortDe: string
  shortFr: string
  technicalDe: string
  technicalFr: string
  imageUrl: string
  imageAltDe: string
  imageAltFr: string
  audioUrlDe: string
  audioUrlFr: string
  audioTranscriptDe: string
  audioTranscriptFr: string
  locationHintDe: string
  locationHintFr: string
  hotspots: Hotspot[]
  quiz: QuizQuestion[]
}
