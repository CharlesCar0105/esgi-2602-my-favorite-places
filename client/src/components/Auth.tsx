import { useState } from 'react'
import axios from 'axios'
import './Auth.css'

interface AuthProps {
  onLogin: (token: string) => void
}

export default function Auth({ onLogin }: AuthProps) {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignup) {
        // Signup
        await axios.post('/api/users', { email, password })
        // Then login
        const response = await axios.post('/api/users/tokens', { email, password })
        onLogin(response.data.token)
      } else {
        // Login
        const response = await axios.post('/api/users/tokens', { email, password })
        onLogin(response.data.token)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>📍 My Favorite Places</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <button
          onClick={() => setIsSignup(!isSignup)}
          className="toggle-btn"
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}
