import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const logout = () => {
    localStorage.removeItem('serv_token')
    setUser(null)
    setError('')
  }

  useEffect(() => {
    const controller = new AbortController()

    const unauthorized = () => {
      localStorage.removeItem('serv_token')
      setUser(null)
    }

    window.addEventListener('serv:unauthorized', unauthorized)

    const initialToken = localStorage.getItem('serv_token')

    if (!initialToken) {
      setLoading(false)
    } else {
      api('/auth/me', {
        signal: controller.signal,
      })
        .then(value => {
          if (
            !controller.signal.aborted &&
            localStorage.getItem('serv_token') === initialToken
          ) {
            setUser(value)
          }
        })
        .catch(error => {
          if (
            error.name !== 'AbortError' &&
            error.status !== 401
          ) {
            setError(error.message)
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setLoading(false)
          }
        })
    }

    return () => {
      controller.abort()
      window.removeEventListener('serv:unauthorized', unauthorized)
    }
  }, [])

  // Cadastro normal
  const authenticate = async (mode, data) => {
    const result = await api(`/auth/${mode}`, {
      method: 'POST',
      data,
      auth: false,
    })

    // O cadastro continua retornando JWT normalmente
    if (result.token) {
      localStorage.setItem('serv_token', result.token)
      setUser(result.usuario)
    }

    setError('')
    setLoading(false)

    return result
  }

  // Primeiro passo do login:
  // verifica e-mail + senha e solicita o MFA
  const requestMFA = async data => {
    const result = await api('/auth/login', {
      method: 'POST',
      data,
      auth: false,
    })

    setError('')

    return result
  }

  // Segundo passo do login:
  // envia o código recebido por e-mail
  const verifyMFA = async data => {
    const result = await api('/auth/verificar-mfa', {
      method: 'POST',
      data,
      auth: false,
    })

    // O JWT só aparece depois da validação do MFA
    if (result.token) {
      localStorage.setItem('serv_token', result.token)
      setUser(result.usuario)
    }

    setError('')
    setLoading(false)

    return result
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        logout,
        authenticate,
        requestMFA,
        verifyMFA,
        updateUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)