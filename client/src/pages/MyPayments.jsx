import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { getMyPayments, cancelSubscription } from "../services/userApi"
import { logoutUser } from '../services/authApi'

function MyPaymentsPage() {
  const navigate = useNavigate()
  const { logout } = useSession()
  const [payments, setPayments] = useState([])
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
    async function fetchPayments() {
      try {
        const res = await getMyPayments();
        console.log("Fetched payments:", res.data);
  
        setPayments(Array.isArray(res.data.payments) ? res.data.payments : []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    }
  
    fetchPayments();
  }, []);  

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      await cancelSubscription(subscriptionId)
      setPayments((prev) =>
        prev.map((p) =>
          p.stripeSubscriptionId === subscriptionId
            ? { ...p, status: "canceled" }
            : p
        )
      )
    } catch (err) {
      console.log("Error canceling subscription: ", err)
      alert("Failed to cancel subscription")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
      case "active":
        return "text-green-600 bg-green-50 border-green-200"
      case "canceled":
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getCurrencySymbol = (currency) => {
    switch (currency?.toLowerCase()) {
      case "usd":
        return "$"
      case "inr":
        return "₹"
      case "eur":
        return "€"
      case "gbp":
        return "£"
      default:
        return currency?.toUpperCase() || "$"
    }
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
            <p className="text-gray-600">Loading payments...</p>
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
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Payments</h3>
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
              <h2 className="text-2xl font-semibold mb-2">My Payments</h2>
              <p className="text-gray-600">View and manage your payment history</p>
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

              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payments List */}
        {payments.length === 0 ? (
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Payments Found</h3>
            <p className="text-gray-500">You haven't made any payments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)} Payment
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                    {payment.status.toUpperCase()}
                  </span>
                </div>

                {/* Payment Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Subtotal</p>
                      <p className="font-semibold text-gray-900">{getCurrencySymbol(payment.currency)}{(payment.amountSubtotal / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Tax</p>
                      <p className="font-semibold text-gray-900">{getCurrencySymbol(payment.currency)}{(payment.amountTax / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Shipping</p>
                      <p className="font-semibold text-gray-900">{getCurrencySymbol(payment.currency)}{(payment.amountShipping / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                      <p className="font-bold text-lg text-blue-600">
                        {getCurrencySymbol(payment.currency)}{(payment.amountTotal / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer & Promo Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                    <p className="font-medium text-gray-900">{payment.customerName}</p>
                    <p className="text-sm text-gray-600">{payment.customerEmail}</p>
                  </div>
                  {payment.promocodeId && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Promo Code</p>
                      <p className="font-medium text-green-600">{payment.promocodeId}</p>
                    </div>
                  )}
                </div>

                {/* Invoices Section */}
                {payment.invoices && payment.invoices.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Invoices</p>
                    <div className="space-y-2">
                      {payment.invoices.map((invoice, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">Invoice #{invoice.invoiceId}</p>
                              <p className="text-xs text-gray-600">
                                Paid: {getCurrencySymbol(invoice.currency)}{(invoice.amountPaid / 100).toFixed(2)} on{' '}
                                {new Date(invoice.paidAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {invoice.hostedInvoiceUrl && (
                                <button 
                                  onClick={() => window.open(invoice.hostedInvoiceUrl, '_blank')}
                                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                                >
                                  View Invoice
                                </button>
                              )}
                              {invoice.invoicePdf && (
                                <button 
                                  onClick={() => window.open(invoice.invoicePdf, '_blank')}
                                  className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600 transition-colors"
                                >
                                  Download PDF
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Address */}
                {payment.address && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Billing Address</p>
                    <div className="text-sm text-gray-700">
                      <p>{payment.address.line1}</p>
                      {payment.address.line2 && <p>{payment.address.line2}</p>}
                      <p>
                        {payment.address.city}, {payment.address.state} {payment.address.postal_code}
                      </p>
                      <p>{payment.address.country}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  {payment.receiptUrl && (
                    <button 
                      onClick={() => window.open(payment.receiptUrl, '_blank')}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm transition-colors"
                    >
                      View Receipt
                    </button>
                  )}
                  {payment.type === "subscription" && payment.status === "active" ? (
                    <button
                      onClick={() => handleCancelSubscription(payment.stripeSubscriptionId)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  ) : (
                    !payment.receiptUrl && (
                      <span className="text-gray-400 text-sm">No actions available</span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer spacing */}
        <div className='pb-6'></div>
      </div>
    </div>
  );  
}

export default MyPaymentsPage