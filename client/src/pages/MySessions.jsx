import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { getMySessions, deleteMySession } from "../services/userApi"
import { logoutUser } from '../services/authApi'

function MySessionsPage() {
  const navigate = useNavigate()
  const { logout } = useSession()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleLogout = async () => {
    try {
      const { data } = await logoutUser()
      logout(data)
      navigate("/login")
    } catch (error) {
      console.log("Error : ", error.message)
    }
  }

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await getMySessions();
        console.log("Sessions response:", response)
        let data = response.data.sessions;
  
        // If sessions are stored as stringified JSON, parse them
        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        console.log("Parsed sessions data:", data)
  
        // If it's not an array, wrap it in an array
        if (!Array.isArray(data)) {
          data = [data];
        }
  
        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch sessions", error);
        setError("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    }
  
    fetchSessions();
  }, []);

  const handleDeleteSession = async (sessionId) => {
    if (!confirm("Are you sure you want to delete this session? This will log you out from that device.")) {
      return;
    }

    try {
      await deleteMySession(sessionId)
      setSessions((prev) => prev.filter((s) => s._id !== sessionId))
    } catch (err) {
      console.log("Error deleting session: ", err)
      alert("Failed to delete session")
    }
  }

  const parseSessionData = (session) => {
    let parsedData = {}
    try {
      parsedData = typeof session.session === "string" 
        ? JSON.parse(session.session) 
        : session.session || {}
    } catch (err) {
      console.log("Error parsing session: ", err)
    }
    return parsedData
  }

  const getDeviceInfo = (userAgent) => {
    if (!userAgent) return "Unknown Device"
    
    // Simple device detection
    if (userAgent.includes("Mobile") || userAgent.includes("Android")) {
      return "📱 Mobile Device"
    } else if (userAgent.includes("iPad") || userAgent.includes("Tablet")) {
      return "📟 Tablet"
    } else if (userAgent.includes("Windows")) {
      return "💻 Windows PC"
    } else if (userAgent.includes("Mac")) {
      return "🖥️ Mac"
    } else if (userAgent.includes("Linux")) {
      return "🐧 Linux"
    } else {
      return "🖥️ Desktop"
    }
  }

  const getBrowserInfo = (userAgent) => {
    if (!userAgent) return "Unknown Browser"
    
    if (userAgent.includes("Chrome")) return "Chrome"
    else if (userAgent.includes("Firefox")) return "Firefox"
    else if (userAgent.includes("Safari")) return "Safari"
    else if (userAgent.includes("Edge")) return "Edge"
    else return "Unknown Browser"
  }

  const getSessionStatus = (sessionData, expires) => {
    const now = new Date()
    const expireDate = new Date(expires)
    
    if (expireDate < now) {
      return { status: "Expired", color: "text-red-600 bg-red-50 border-red-200" }
    } else {
      return { status: "Active", color: "text-green-600 bg-green-50 border-green-200" }
    }
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now - past
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <div 
        className='fixed inset-0 overflow-y-auto'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onLoad={(e) => {
          const style = document.createElement('style');
          style.textContent = `
            .scrollable-container::-webkit-scrollbar {
              display: none;
            }
          `;
          document.head.appendChild(style);
          e.target.classList.add('scrollable-container');
        }}
      >
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div 
        className='fixed inset-0 overflow-y-auto'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onLoad={(e) => {
          const style = document.createElement('style');
          style.textContent = `
            .scrollable-container::-webkit-scrollbar {
              display: none;
            }
          `;
          document.head.appendChild(style);
          e.target.classList.add('scrollable-container');
        }}
      >
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Sessions</h3>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className='fixed inset-0 overflow-y-auto'
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      onLoad={(e) => {
        const style = document.createElement('style');
        style.textContent = `
          .scrollable-container::-webkit-scrollbar {
            display: none;
          }
        `;
        document.head.appendChild(style);
        e.target.classList.add('scrollable-container');
      }}
    >
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
        {/* Header */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">My Sessions</h2>
              <p className="text-gray-600">Manage your active login sessions across different devices</p>
            </div>
            <button 
              type="button" 
              className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          
          {/* Quick Navigation */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Access</h3>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate('/my-payments')}
                className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>My Payments</span>
              </button>
              
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>My Profile</span>
              </button>

              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Sessions</h3>
            <p className="text-gray-500">You don't have any active sessions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const sessionData = parseSessionData(session)
              const reqMeta = sessionData.reqMeta || {}
              const cookie = sessionData.cookie || {}
              const { status, color } = getSessionStatus(sessionData, session.expires)
              
              return (
                <div
                  key={session._id}
                  className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        {getDeviceInfo(reqMeta.userAgent)}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({getBrowserInfo(reqMeta.userAgent)})
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500">
                        Session ID: {session._id.substring(0, 20)}...
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${color}`}>
                      {status}
                    </span>
                  </div>

                  {/* Session Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">IP Address</p>
                        <p className="font-semibold text-gray-900">{reqMeta.ip || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Last Activity</p>
                        <p className="font-semibold text-gray-900">
                          {reqMeta.lastVisited ? formatTimeAgo(reqMeta.lastVisited) : "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">User ID</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {session.userId ? session.userId.substring(0, 12) + "..." : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Time Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Cookie Expires</p>
                      <p className="text-sm text-gray-700">
                        {cookie.expires ? new Date(cookie.expires).toLocaleString() : "Session cookie"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Session Expires</p>
                      <p className="text-sm text-gray-700">
                        {new Date(session.expires).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Security Settings</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${cookie.secure ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {cookie.secure ? '🔒 Secure' : '⚠️ Not Secure'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${cookie.httpOnly ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {cookie.httpOnly ? '🛡️ HTTP Only' : '❌ Not HTTP Only'}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        🍪 {cookie.sameSite || 'none'}
                      </span>
                    </div>
                  </div>

                  {/* User Agent Details */}
                  {reqMeta.userAgent && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Browser Details</p>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono break-all">
                        {reqMeta.userAgent}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDeleteSession(session._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm transition-colors"
                    >
                      Terminate Session
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer spacing */}
        <div className='pb-6'></div>
      </div>
    </div>
  )
}

export default MySessionsPage