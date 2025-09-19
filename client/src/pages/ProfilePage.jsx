import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { getMe } from "../services/userApi";
import { logoutUser } from '../services/authApi';

function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    async function fetchProfile() {
      try {
        const { data } = await getMe();
        if (data.success) {
          setUser(data.user);
        } else {
          setError("Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const getAccountAge = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const getMfaStatusDetails = (isMfaActive) => {
    return isMfaActive 
      ? { 
          status: "Enabled", 
          color: "text-green-600 bg-green-50 border-green-200",
          icon: "🛡️",
          description: "Your account is protected with two-factor authentication"
        }
      : { 
          status: "Disabled", 
          color: "text-red-600 bg-red-50 border-red-200",
          icon: "⚠️",
          description: "Enable MFA for enhanced security"
        };
  };

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
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
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
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Profile</h3>
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mfaDetails = getMfaStatusDetails(user.isMfaActive);

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
        
        {/* Header Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">My Profile</h2>
              <p className="text-gray-600">Manage your account information and security settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <button 
                type="button" 
                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
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
                onClick={() => navigate('/my-sessions')}
                className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>My Sessions</span>
              </button>

              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>

{/* Profile Information */}
<div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto">
            
            {/* Username */}
            <div className="bg-gray-50 rounded-lg p-4 h-24 flex flex-col justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Username</p>
              <p className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">👤</span>
                {user.username}
              </p>
            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-lg p-4 h-24 flex flex-col justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
              <p className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">📧</span>
                {user.email}
              </p>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-gray-50 rounded-lg p-4 h-24 flex flex-col justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Two-Factor Authentication</p>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${mfaDetails.color}`}>
                  {mfaDetails.icon} {mfaDetails.status}
                </span>
              </div>
            </div>

            {/* Account Age */}
            <div className="bg-gray-50 rounded-lg p-4 h-24 flex flex-col justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Age</p>
              <p className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">🎂</span>
                {getAccountAge(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Account Timeline */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Account Timeline</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Account Created</p>
                <p className="text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-600">
                  {new Date(user.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Account Management</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Profile</span>
            </button>

            <button className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{user.isMfaActive ? 'Manage' : 'Enable'} MFA</span>
            </button>

            <button className="flex items-center justify-center space-x-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Change Password</span>
            </button>

            <button className="flex items-center justify-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Footer spacing */}
        <div className='pb-6'></div>
      </div>
    </div>
  );
}

export default ProfilePage;