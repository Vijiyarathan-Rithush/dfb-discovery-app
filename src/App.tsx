import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InteractivePage from './pages/InteractivePage'
import InformationPage from './pages/InformationPage'
import QuizPage from './pages/QuizPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/interaktiv" element={<InteractivePage />} />
      <Route path="/information" element={<InformationPage />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  )
}

export default App
