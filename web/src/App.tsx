import Home from '@/pages'
import LoginModal from '@/components/LoginModal'
import { useEffect, useState } from 'react'
import { getTokenFromLocalStorage, setAuthToken } from '@/services/api/auth'

export default function App() {
  const [token, setToken] = useState<string>()

  useEffect(() => {
    const token = getTokenFromLocalStorage()
    setAuthToken(token)
    setToken(token)
  }, [])

  if (!token) {
    return <LoginModal onLogin={setToken} />
  }

  return <Home />
}
