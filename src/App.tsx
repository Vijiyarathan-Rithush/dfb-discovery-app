import { Route, Routes } from 'react-router-dom'
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

      <Route path="/interaktiv" element={<InteractivePage />} />
      <Route path="/information" element={<InformationPage />} />
      <Route path="/quiz" element={<QuizPage />} />

      <Route path="/adminobjects" element={<AdminObjectsPage />} />
      <Route path="/admin/objects" element={<AdminPage/>} />
      <Route path="/admin/edit/:objectId" element={<EditObjectPage />} />
      <Route path="/object/:objectId" element={<ObjectPage />} />
    </Routes>
  )
}

export default App