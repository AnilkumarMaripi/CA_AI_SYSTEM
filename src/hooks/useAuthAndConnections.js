import { useState, useEffect, useCallback } from 'react'
import {
  checkAuthStatus,
  loginLocalUser,
  signInWithGoogle,
  signInWithGithub,
  logoutUser,
  fetchConnections,
  fetchUsers,
  toggleConnection,
  fetchPendingFollowRequests,
  confirmFollowRequest,
  rejectFollowRequest,
} from '../services/authService'

export function useAuthAndConnections() {
  const [activeUser, setActiveUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connections, setConnections] = useState([])
  const [availableUsers, setAvailableUsers] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [error, setError] = useState('')

  // 1. Initialize Auth Session on load
  const initAuth = useCallback(async () => {
    setLoading(true)
    try {
      const data = await checkAuthStatus()
      if (data && data.user) {
        setActiveUser(data.user)
      } else {
        setActiveUser(null)
      }
    } catch (err) {
      setActiveUser(null)
      setError('Failed to authenticate session.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  // 2. Load Connections & Networking Data
  const loadConnectionsData = useCallback(async () => {
    if (!activeUser) return
    try {
      const [userConnections, allUsers, pending] = await Promise.all([
        fetchConnections(),
        fetchUsers(),
        fetchPendingFollowRequests(),
      ])
      setConnections(userConnections || [])
      setAvailableUsers(allUsers || [])
      setPendingRequests(pending || [])
    } catch (err) {
      console.error('Error loading connections:', err)
    }
  }, [activeUser])

  useEffect(() => {
    if (activeUser) {
      loadConnectionsData()
    }
  }, [activeUser, loadConnectionsData])

  // 3. Login Handlers
  const handleLogin = async (email, password) => {
    setError('')
    try {
      const data = await loginLocalUser({ email, password })
      setActiveUser(data.user)
      return data.user
    } catch (err) {
      setError(err.message || 'Login failed')
      throw err
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    try {
      const data = await signInWithGoogle()
      setActiveUser(data.user)
      return data.user
    } catch (err) {
      setError(err.message || 'Google login failed')
      throw err
    }
  }

  const handleGithubLogin = async () => {
    setError('')
    try {
      const data = await signInWithGithub()
      setActiveUser(data.user)
      return data.user
    } catch (err) {
      setError(err.message || 'GitHub login failed')
      throw err
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    setActiveUser(null)
    setConnections([])
    setPendingRequests([])
  }

  // 4. Connection Handlers
  const handleToggleConnection = async (targetUserId) => {
    const res = await toggleConnection(targetUserId)
    await loadConnectionsData()
    return res
  }

  const handleAcceptRequest = async (requestId) => {
    await confirmFollowRequest(requestId)
    await loadConnectionsData()
  }

  const handleRejectRequest = async (requestId) => {
    await rejectFollowRequest(requestId)
    await loadConnectionsData()
  }

  return {
    activeUser,
    loading,
    error,
    connections,
    availableUsers,
    pendingRequests,
    login: handleLogin,
    loginWithGoogle: handleGoogleLogin,
    loginWithGithub: handleGithubLogin,
    logout: handleLogout,
    toggleConnection: handleToggleConnection,
    acceptRequest: handleAcceptRequest,
    rejectRequest: handleRejectRequest,
    refreshConnections: loadConnectionsData,
  }
}
