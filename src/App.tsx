import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InteractivePage from './pages/InteractivePage'
import InformationPage from './pages/InformationPage'
import QuizPage from './pages/QuizPage'
import AdminPage from './pages/AdminPage'
import AdminObjectsPage from './pages/AdminObjectsPage'
import EditObjectPage from './pages/EditObjectPage'
import ObjectPage from './pages/Objectpage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Objektbezogene Besucherrouten */}
      <Route path="/object/:objectId" element={<ObjectPage />} />
      <Route path="/object/:objectId/interactive" element={<InteractivePage />} />
      <Route path="/object/:objectId/information" element={<InformationPage />} />
      <Route path="/object/:objectId/quiz" element={<QuizPage />} />

      {/* Allgemeine Routen (Fallback) */}
      <Route path="/interaktiv" element={<Navigate to="/" replace />} />
      <Route path="/information" element={<Navigate to="/" replace />} />
      <Route path="/quiz" element={<Navigate to="/" replace />} />

      {/* Admin-Routen */}
      <Route path="/admin" element={<AdminObjectsPage />} />
      <Route path="/admin/objects" element={<AdminObjectsPage />} />
      <Route path="/admin/create" element={<AdminPage />} />
      <Route path="/admin/edit/:objectId" element={<EditObjectPage />} />
    </Routes>
  )
}

export default App
