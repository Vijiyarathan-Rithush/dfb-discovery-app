import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import AdminObjectsPage from './pages/AdminObjectsPage'
import ObjectPage from './pages/Objectpage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/objects" element={<AdminObjectsPage />} />
      <Route path="/object/:objectId" element={<ObjectPage />} />
    </Routes>
  )
}

export default App