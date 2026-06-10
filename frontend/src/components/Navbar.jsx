import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="bg-green-700 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">🌾</span>
          <span className="font-bold text-lg">Smart Crop Advisory</span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition"
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => navigate('/weather')}
            className="px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition"
          >
            🌦️ Weather
          </button>
          <button
            onClick={() => navigate('/advisory')}
            className="px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition"
          >
            🤖 AI Advisory
          </button>
          <button
            onClick={() => navigate('/farms')}
            className="px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition"
          >
            🏡 Farms
          </button>
          <button
            onClick={() => navigate('/crops')}
            className="px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition"
          >
            🌱 Crops
          </button>
        </div>

        {/* User & Logout */}
        <div className="flex items-center gap-4">
          <span className="text-green-200 text-sm">
            👋 {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar