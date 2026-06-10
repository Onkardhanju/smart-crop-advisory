import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Weather from './pages/Weather'
import Advisory from './pages/Advisory'
import Farms from './pages/Farms'
import Crops from './pages/Crops'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/advisory" element={<Advisory />} />
        <Route path="/farms" element={<Farms />} />
        <Route path="/crops" element={<Crops />} />
      </Routes>
    </Router>
  )
}

export default App