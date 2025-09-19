import { useNavigate } from "react-router-dom"

export function PaymentCancelled() {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1) // Go back to previous page
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className='p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8'>
      {/* Cancel Icon */}
      <div className='text-center mb-6'>
        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg className='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </div>
        <h2 className='text-2xl font-semibold text-red-600 mb-2'>Payment Cancelled</h2>
        <p className='text-gray-600'>Your payment was cancelled and no charges were made.</p>
      </div>

      {/* Action Buttons */}
      <div className='space-y-3'>
        <button 
          onClick={handleGoHome}
          className='w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200'
        >
          Go to Home Page
        </button>
        <button 
          onClick={handleGoBack}
          className='w-full bg-gray-50 text-gray-600 px-4 py-2 rounded hover:bg-gray-100'
        >
          Go Back
        </button>
      </div>

      {/* Support Info */}
      <div className='mt-6 text-center text-sm text-gray-500'>
        <p>Need help? <span className='text-blue-500 cursor-pointer hover:underline'>Contact Support</span></p>
      </div>
    </div>
  )
}