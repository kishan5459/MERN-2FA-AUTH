import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { logoutUser } from '../services/authApi'
import { checkoutAnnual, checkoutBasic, checkoutNewsletter } from "../services/paymentApi"

function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useSession()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [subscriptionMessage, setSubscriptionMessage] = useState('')

  const handleLogout = async () => {
    try {
      const { data } = await logoutUser()
      logout(data)
      navigate("/login")
    } catch (error) {
      console.log("Error : ", error.message)
    }
  }

  const handleSelectedPlanPayment = async (planType) => {
    let session;
    try {
      if(planType==='basic'){
        session = (await checkoutBasic()).data
      }
      else if(planType==='annual') {
        session = (await checkoutAnnual()).data
      }
    } catch (error) {
      console.log("Error Plan Payment : ", error)
    }
    
    if(session){
      if(session.url){
        window.location.href = session.url;
      }
      else {
        console.log("No URL=> Session : ", session)
      }
    }
  }

  const handleNewsletterSubscription = async () => {
    try {
      const { url } = (await checkoutNewsletter(user.email)).data
      window.location.href = url;
    } catch (error) {
      console.log(error)
      // Show error message if needed
      setSubscriptionMessage('Error subscribing. Please try again.')
      return
    }
    console.log(`Newsletter subscription for: ${user.email}`)
  }

  return (
    <div 
      className='fixed inset-0 overflow-y-auto'
      style={{
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE and Edge */
      }}
      onLoad={(e) => {
        // Hide webkit scrollbar
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
      <div className='max-w-4xl mx-auto py-6 px-4 space-y-6'>
        {/* User Info Section */}
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className='text-xl font-semibold mb-4'>Welcome, {user.username}!</h2>
              <p>You have successfully logged in and verified your 2FA</p>
              <p>Email : {user.email}</p>
            </div>
            <button 
              type="button" 
              className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          
          {/* Navigation Links */}
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
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>My Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Plans Section */}
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <h3 className='text-xl font-semibold mb-4'>Choose Your Plan</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            
            {/* Basic Plan */}
            <div className={`border rounded-lg p-4 ${selectedPlan === 'basic' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
              <h4 className='text-lg font-semibold mb-2'>Basic Plan</h4>
              <div className='mb-3'>
                <span className='text-2xl font-bold'>$10</span>
                <span className='text-gray-600'>/month</span>
              </div>
              <ul className='mb-4 space-y-1 text-sm'>
                <li>• Basic features</li>
                <li>• Email support</li>
                <li>• 5GB storage</li>
                <li>• Standard security</li>
              </ul>
              <button 
                className={`w-full py-2 px-4 rounded ${
                  selectedPlan === 'basic' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`
                }
                onClick={() => setSelectedPlan('basic')}
              >
                {selectedPlan === 'basic' ? 'Selected' : 'Select Basic'}
              </button>
            </div>

            {/* Annual Plan */}
            <div className={`border rounded-lg p-4 ${selectedPlan === 'annual' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
              <h4 className='text-lg font-semibold mb-2'>Annual Plan</h4>
              <div className='mb-3'>
                <span className='text-2xl font-bold'>$100</span>
                <span className='text-gray-600'>/year</span>
                <span className='ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>Save 17%</span>
              </div>
              <ul className='mb-4 space-y-1 text-sm'>
                <li>• All premium features</li>
                <li>• Priority support</li>
                <li>• Advanced security</li>
                <li>• Analytics dashboard</li>
              </ul>
              <button 
                className={`w-full py-2 px-4 rounded ${
                  selectedPlan === 'annual' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedPlan('annual')}
              >
                {selectedPlan === 'annual' ? 'Selected' : 'Select Annual'}
              </button>
            </div>
          </div>

          {selectedPlan && (
            <div className='mt-4 p-3 bg-gray-50 rounded border'>
              <p className='text-sm text-gray-700'>
                You've selected the <strong>{selectedPlan === 'basic' ? 'Basic' : 'Annual'}</strong> plan. 
                Click below to proceed with payment.
              </p>
              <div className='mt-2 flex gap-3'>
                <button 
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                onClick={() => handleSelectedPlanPayment(selectedPlan.toLowerCase())}
                >
                  Proceed to Payment
                </button>
                <button 
                className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                onClick={() => setSelectedPlan(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Newsletter Subscription Section */}
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <h3 className='text-xl font-semibold mb-4'>Stay Updated</h3>
          <p className='mb-4 text-gray-600'>Subscribe to our newsletter for the latest updates and features.</p>
          <p className='mb-4 text-sm text-gray-500'>Newsletter will be sent to: <strong>{user.email}</strong></p>
          
          <button 
            onClick={handleNewsletterSubscription}
            className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600'
          >
            Subscribe to Newsletter
          </button>

          {subscriptionMessage && (
            <div className={`mt-3 p-3 rounded ${
              subscriptionMessage.includes('Error') 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <p className={`text-sm ${
                subscriptionMessage.includes('Error') ? 'text-red-700' : 'text-green-700'
              }`}>
                {subscriptionMessage}
              </p>
            </div>
          )}
        </div>

        {/* Footer spacing */}
        <div className='pb-6'></div>
      </div>
    </div>
  )
}

export default HomePage