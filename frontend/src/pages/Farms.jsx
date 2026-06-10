import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const Farms = () => {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editFarm, setEditFarm] = useState(null)
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    soilType: 'loamy',
    farmSize: '',
    sizeUnit: 'acres',
    description: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const token = localStorage.getItem('token')

  const fetchFarms = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/farms', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFarms(res.data.farms)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }, [token])

  useEffect(() => {
    fetchFarms()
  }, [fetchFarms])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const openAddModal = () => {
    setEditFarm(null)
    setFormData({
      farmName: '',
      location: '',
      soilType: 'loamy',
      farmSize: '',
      sizeUnit: 'acres',
      description: ''
    })
    setShowModal(true)
  }

  const openEditModal = (farm) => {
    setEditFarm(farm)
    setFormData({
      farmName: farm.farmName,
      location: farm.location,
      soilType: farm.soilType,
      farmSize: farm.farmSize,
      sizeUnit: farm.sizeUnit,
      description: farm.description
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    setError('')
    if (!formData.farmName || !formData.location || !formData.farmSize) {
      setError('Please fill all required fields!')
      return
    }
    try {
      if (editFarm) {
        await axios.put(
          `http://localhost:5000/api/farms/${editFarm._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setSuccess('Farm updated successfully!')
      } else {
        await axios.post(
          'http://localhost:5000/api/farms',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setSuccess('Farm added successfully!')
      }
      setShowModal(false)
      fetchFarms()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farm?')) return
    try {
      await axios.delete(`http://localhost:5000/api/farms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Farm deleted!')
      fetchFarms()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.log(error)
    }
  }

  const soilColors = {
    clay: 'bg-red-100 text-red-700',
    loamy: 'bg-green-100 text-green-700',
    sandy: 'bg-yellow-100 text-yellow-700',
    silt: 'bg-blue-100 text-blue-700',
    peaty: 'bg-purple-100 text-purple-700'
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🏡 My Farms</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage all your farms here
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            + Add Farm
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg mb-4">
            ✅ {success}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">⏳</div>
            <p>Loading farms...</p>
          </div>
        ) : farms.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <div className="text-6xl mb-4">🏡</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No farms yet!
            </h3>
            <p className="text-gray-400 mb-6">
              Add your first farm to get started
            </p>
            <button
              onClick={openAddModal}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              + Add Your First Farm
            </button>
          </div>
        ) : (
          /* Farms Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map(farm => (
              <div key={farm._id}
                className="bg-white rounded-2xl shadow hover:shadow-md transition p-6">

                {/* Farm Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {farm.farmName}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      📍 {farm.location}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${soilColors[farm.soilType] || 'bg-gray-100 text-gray-700'}`}>
                    {farm.soilType}
                  </span>
                </div>

                {/* Farm Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Farm Size</p>
                    <p className="font-semibold text-green-700">
                      {farm.farmSize} {farm.sizeUnit}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Soil Type</p>
                    <p className="font-semibold text-green-700 capitalize">
                      {farm.soilType}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {farm.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {farm.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(farm)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(farm._id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {editFarm ? '✏️ Edit Farm' : '🏡 Add New Farm'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  ❌ {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Name *
                </label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="e.g. Onkar Farm"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Punjab, Ludhiana"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Size *
                  </label>
                  <input
                    type="number"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    name="sizeUnit"
                    value={formData.sizeUnit}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="bigha">Bigha</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soil Type
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="loamy">Loamy</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="silt">Silt</option>
                  <option value="peaty">Peaty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Any additional details about your farm..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                {editFarm ? 'Update Farm' : 'Add Farm'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Farms