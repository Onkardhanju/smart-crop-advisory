import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [farms, setFarms] = useState([])
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')

  const fetchData = useCallback(async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const [farmsRes, cropsRes] = await Promise.all([
        axios.get(`${API_URL}/api/farms`, config),
        axios.get(`${API_URL}/api/crops`, config)
      ])
      setFarms(farmsRes.data.farms)
      setCrops(cropsRes.data.crops)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }, [token])

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    const userData = JSON.parse(localStorage.getItem('user'))
    if (userData) setUser(userData)
    fetchData()
  }, [token, navigate, fetchData])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-green-600 text-xl font-semibold">Loading... 🌾</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="font-bold text-lg">Smart Crop Advisory</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/dashboard')} className="px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition">🏠 Dashboard</button>
          <button onClick={() => navigate('/weather')} className="px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition">🌦️ Weather</button>
          <button onClick={() => navigate('/advisory')} className="px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition">🤖 AI Advisory</button>
          <button onClick={() => navigate('/farms')} className="px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition">🏡 Farms</button>
          <button onClick={() => navigate('/crops')} className="px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition">🌱 Crops</button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-200 text-sm">👋 Hello, {user?.name}!</span>
          <button onClick={handleLogout} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm font-medium transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6 rounded-2xl mb-8 shadow">
          <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name}! 🌱</h1>
          <p className="text-green-100">Here's an overview of your farms today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Farms</p>
                <p className="text-3xl font-bold text-green-700">{farms.length}</p>
              </div>
              <div className="text-4xl">🏡</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Active Crops</p>
                <p className="text-3xl font-bold text-green-700">{crops.length}</p>
              </div>
              <div className="text-4xl">🌱</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Healthy Crops</p>
                <p className="text-3xl font-bold text-green-700">{crops.filter(c => c.status === 'healthy').length}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">🏡 My Farms</h2>
              <button onClick={() => navigate('/farms')} className="text-green-600 text-sm hover:underline">View All</button>
            </div>
            {farms.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🌾</div>
                <p>No farms added yet</p>
                <button onClick={() => navigate('/farms')} className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Add Farm</button>
              </div>
            ) : (
              farms.slice(0, 3).map(farm => (
                <div key={farm._id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{farm.farmName}</p>
                    <p className="text-sm text-gray-500">📍 {farm.location} • {farm.farmSize} {farm.sizeUnit}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{farm.soilType}</span>
                </div>
              ))
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">🌱 My Crops</h2>
              <button onClick={() => navigate('/crops')} className="text-green-600 text-sm hover:underline">View All</button>
            </div>
            {crops.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🌱</div>
                <p>No crops added yet</p>
                <button onClick={() => navigate('/crops')} className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Add Crop</button>
              </div>
            ) : (
              crops.slice(0, 3).map(crop => (
                <div key={crop._id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{crop.cropName}</p>
                    <p className="text-sm text-gray-500">📅 Sown: {new Date(crop.sowingDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${crop.status === 'healthy' ? 'bg-green-100 text-green-700' : crop.status === 'needs attention' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {crop.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard