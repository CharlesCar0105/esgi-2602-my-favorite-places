import { useState, useEffect } from 'react'
import axios from 'axios'
import './Addresses.css'

interface Address {
  id: number
  name: string
  description: string
  lat: number
  lng: number
}

interface AddressesProps {
  token: string
}

export default function Addresses({ token }: AddressesProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [searchWord, setSearchWord] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
      Cookie: `token=${token}`
    }
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/api/addresses')
      setAddresses(response.data.items)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch addresses')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      await axiosInstance.post('/api/addresses', {
        searchWord,
        name,
        description
      })
      await fetchAddresses()
      setSearchWord('')
      setName('')
      setDescription('')
      setShowForm(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add address')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="addresses-container">
      <div className="addresses-header">
        <h2>Your Favorite Places</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="add-btn"
        >
          {showForm ? '✕ Cancel' : '+ Add Place'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddAddress} className="add-form">
          <div className="form-group">
            <label htmlFor="searchWord">Search for place</label>
            <input
              type="text"
              id="searchWord"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="e.g., Paris, France"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Place name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Eiffel Tower"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Your favorite memory..."
              rows={3}
            />
          </div>
          <button type="submit" disabled={formLoading} className="submit-btn">
            {formLoading ? 'Adding...' : 'Add Place'}
          </button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading your places...</div>
      ) : addresses.length === 0 ? (
        <div className="empty-state">
          <p>No favorite places yet. Add one to get started! 🌍</p>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map(address => (
            <div key={address.id} className="address-card">
              <h3>{address.name}</h3>
              <p className="description">{address.description}</p>
              <div className="coordinates">
                <small>📍 {address.lat.toFixed(4)}, {address.lng.toFixed(4)}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
