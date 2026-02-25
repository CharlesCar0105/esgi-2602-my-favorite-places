import { useState } from 'react'
import axios from 'axios'
import './App.css'
import Auth from './components/Auth'
import Addresses from './components/Addresses'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<any>(null)

  const handleLogin = (newToken: string) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  if (!token) {
    return <Auth onLogin={handleLogin} />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📍 My Favorite Places</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      <main className="app-main">
        <Addresses token={token} />
      </main>
    </div>
  )
}

export default App
