import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const logout = () => { localStorage.removeItem('serv_token'); setUser(null); setError('') }
  useEffect(() => {
    const controller = new AbortController()
    const unauthorized = () => { localStorage.removeItem('serv_token'); setUser(null) }
    window.addEventListener('serv:unauthorized', unauthorized)
    const initialToken = localStorage.getItem('serv_token')
    if (!initialToken) setLoading(false)
    else api('/auth/me', { signal: controller.signal }).then(value => {
      if (!controller.signal.aborted && localStorage.getItem('serv_token') === initialToken) setUser(value)
    }).catch(error => {
      if (error.name !== 'AbortError' && error.status !== 401) setError(error.message)
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => { controller.abort(); window.removeEventListener('serv:unauthorized', unauthorized) }
  }, [])
  const authenticate = async (mode, data) => {
    const result = await api(`/auth/${mode}`, { method: 'POST', data, auth: false })
    localStorage.setItem('serv_token', result.token)
    setUser(result.usuario); setError(''); setLoading(false)
  }
  return <AuthContext.Provider value={{ user, loading, error, logout, authenticate, updateUser: setUser }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
