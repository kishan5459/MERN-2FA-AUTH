import React from 'react'
import { useNavigate } from 'react-router-dom'

// Payment Success Page Component
export function PaymentSuccess() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className='p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8'>
      {/* Success Icon */}
      <div className='text-center mb-6'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h2 className='text-2xl font-semibold text-green-600 mb-2'>Payment Successful!</h2>
        <p className='text-gray-600'>Your subscription has been activated successfully.</p>
      </div>

      {/* Action Buttons */}
      <div className='space-y-3'>
        <button 
          onClick={handleGoHome}
          className='w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          Go to Home Page
        </button>
      </div>

      {/* Additional Info */}
      <div className='mt-6 text-center text-sm text-gray-500'>
        <p>A confirmation email has been sent to your registered email address.</p>
      </div>
    </div>
  )
}