import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const Advisory = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🌾 Hello! I am your AI Crop Advisor. Ask me anything about your crops, soil, fertilizers, or farming problems!'
    }
  ])
  const [input, setInput] = useState('')
  const [cropName, setCropName] = useState('')
  const [soilType, setSoilType] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(
        'http://localhost:5000/api/advisory/ask',
        {
          question: input,
          cropName,
          soilType,
          location: 'Punjab'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const aiMessage = {
        role: 'assistant',
        content: res.data.advisory.answer
      }
      setMessages(prev => [...prev, aiMessage])

    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, could not get response. Please try again!'
      }])
    }
    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-green-50">

      {/* Navbar */}
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">

        <h1 className="text-2xl font-bold text-green-700 mb-6">
          🤖 AI Crop Advisory
        </h1>

        {/* Crop Details */}
        <div className="bg-white p-4 rounded-2xl shadow mb-4">
          <p className="text-sm font-medium text-gray-600 mb-3">
            Optional: Add details for better advice
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Crop name (e.g. Wheat)"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select soil type</option>
              <option value="loamy">Loamy</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="silt">Silt</option>
            </select>
          </div>
        </div>

        {/* Chat Window */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {/* Chat Header */}
          <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">AI Crop Advisor — Online</span>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    🤖
                  </div>
                )}

                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>

                {/* User Avatar */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center ml-2 flex-shrink-0 text-white text-xs font-bold">
                    👤
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                  🤖
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your crops... (Press Enter to send)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">💡 Quick Questions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'How to increase wheat yield?',
              'Best fertilizer for rice?',
              'How to control aphids?',
              'When to irrigate crops?',
              'How to prevent fungal disease?',
              'Best time to sow wheat in Punjab?'
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="bg-white text-green-700 border border-green-300 px-3 py-1 rounded-full text-sm hover:bg-green-50 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Advisory