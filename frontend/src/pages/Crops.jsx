import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import API_URL from '../config'

const Crops = () => {
  const [crops, setCrops] = useState([])
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editCrop, setEditCrop] = useState(null)
  const [formData, setFormData] = useState({
    farmId: '', cropName: '', variety: '', sowingDate: '',
    expectedHarvestDate: '', growthStage: 'sowing', status: 'healthy',
    areaUsed: '', notes: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const token = localStorage.getItem('token')

  const fetchData = useCallback(async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const [cropsRes, farmsRes] = await Promise.all([
        axios.get(`${API_URL}/api/crops`, config),
        axios.get(`${API_URL}/api/farms`, config)
      ])
      setCrops(cropsRes.data.crops)
      setFarms(farmsRes.data.farms)
    } catch (error) { console.log(error) }
    setLoading(false)
  }, [token])

  useEffect(() => { fetchData() }, [fetchData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const openAddModal = () => {
    setEditCrop(null)
    setFormData({ farmId: farms[0]?._id || '', cropName: '', variety: '', sowingDate: '', expectedHarvestDate: '', growthStage: 'sowing', status: 'healthy', areaUsed: '', notes: '' })
    setShowModal(true)
  }

  const openEditModal = (crop) => {
    setEditCrop(crop)
    setFormData({
      farmId: crop.farmId?._id || crop.farmId, cropName: crop.cropName,
      variety: crop.variety, sowingDate: crop.sowingDate?.split('T')[0],
      expectedHarvestDate: crop.expectedHarvestDate?.split('T')[0],
      growthStage: crop.growthStage, status: crop.status,
      areaUsed: crop.areaUsed, notes: crop.notes
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    setError('')
    if (!formData.farmId || !formData.cropName || !formData.sowingDate) {
      setError('Please fill all required fields!'); return
    }
    try {
      if (editCrop) {
        await axios.put(`${API_URL}/api/crops/${editCrop._id}`, formData, { headers: { Authorization: `Bearer ${token}` } })
        setSuccess('Crop updated successfully!')
      } else {
        await axios.post(`${API_URL}/api/crops`, formData, { headers: { Authorization: `Bearer ${token}` } })
        setSuccess('Crop added successfully!')
      }
      setShowModal(false)
      fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this crop?')) return
    try {
      await axios.delete(`${API_URL}/api/crops/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setSuccess('Crop deleted!')
      fetchData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) { console.log(error) }
  }

  const statusColors = {
    healthy: 'bg-green-100 text-green-700',
    'needs attention': 'bg-yellow-100 text-yellow-700',
    critical: 'bg-red-100 text-red-700'
  }

  const stageColors = {
    sowing: 'bg-gray-100 text-gray-700', germination: 'bg-blue-100 text-blue-700',
    growing: 'bg-green-100 text-green-700', flowering: 'bg-pink-100 text-pink-700',
    harvesting: 'bg-orange-100 text-orange-700'
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🌱 My Crops</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage all your crops</p>
          </div>
          <button onClick={openAddModal} className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium">+ Add Crop</button>
        </div>

        {success && <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg mb-4">✅ {success}</div>}

        {loading ? (
          <div className="text-center py-16 text-gray-400"><div className="text-4xl mb-2">⏳</div><p>Loading crops...</p></div>
        ) : crops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No crops yet!</h3>
            <p className="text-gray-400 mb-6">Add your first crop to start tracking</p>
            <button onClick={openAddModal} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">+ Add Your First Crop</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map(crop => (
              <div key={crop._id} className="bg-white rounded-2xl shadow hover:shadow-md transition p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{crop.cropName}</h3>
                    {crop.variety && <p className="text-gray-400 text-xs mt-0.5">Variety: {crop.variety}</p>}
                    <p className="text-gray-500 text-sm mt-1">🏡 {crop.farmId?.farmName || 'Unknown Farm'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[crop.status]}`}>{crop.status}</span>
                </div>
                <div className="mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${stageColors[crop.growthStage]}`}>📈 {crop.growthStage}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Sown On</p>
                    <p className="font-semibold text-green-700 text-sm">{new Date(crop.sowingDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Harvest By</p>
                    <p className="font-semibold text-green-700 text-sm">{crop.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toLocaleDateString() : 'Not set'}</p>
                  </div>
                </div>
                {crop.notes && <p className="text-gray-500 text-sm mb-4 line-clamp-2">📝 {crop.notes}</p>}
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(crop)} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition">✏️ Edit</button>
                  <button onClick={() => handleDelete(crop._id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-bold text-gray-800">{editCrop ? '✏️ Edit Crop' : '🌱 Add New Crop'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">❌ {error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Farm *</label>
                <select name="farmId" value={formData.farmId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select a farm</option>
                  {farms.map(farm => <option key={farm._id} value={farm._id}>{farm.farmName} — {farm.location}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
                <input type="text" name="cropName" value={formData.cropName} onChange={handleChange} placeholder="e.g. Wheat, Rice, Tomato" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
                <input type="text" name="variety" value={formData.variety} onChange={handleChange} placeholder="e.g. HD-2967, Basmati" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sowing Date *</label>
                  <input type="date" name="sowingDate" value={formData.sowingDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                  <input type="date" name="expectedHarvestDate" value={formData.expectedHarvestDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Growth Stage</label>
                  <select name="growthStage" value={formData.growthStage} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="sowing">Sowing</option>
                    <option value="germination">Germination</option>
                    <option value="growing">Growing</option>
                    <option value="flowering">Flowering</option>
                    <option value="harvesting">Harvesting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="healthy">Healthy</option>
                    <option value="needs attention">Needs Attention</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area Used (acres)</label>
                <input type="number" name="areaUsed" value={formData.areaUsed} onChange={handleChange} placeholder="e.g. 2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any observations or notes..." rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium">{editCrop ? 'Update Crop' : 'Add Crop'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Crops