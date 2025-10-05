import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { register, loginUser } from "../services/authApi"

function LoginForm({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const { data } = await register(email, password, username)
      setIsRegister(false)
      setMessage(data.message)
      setError("")
    } catch (error) {
      console.log(error)
      console.log("The err is : ", error.message)
      setMessage("")
      setError("Someting went wrong during user registration")
    }
    finally {
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await loginUser(email, password)
      setMessage(data.message)
      setError("")
      onLoginSuccess(data)
    } catch (error) {
      console.log("The err is : ", error.message)
      setMessage("")
      setError("Invalid login credentials")
      
    }
    finally {
      setEmail("")
      setPassword("")
    }
  }

  const handleLoginWithGoogle = (e) => {
    window.open(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/google`,
      "_blank"
    )
  }

  const handleRegisterToggle = () => {
    setIsRegister(!isRegister)
    setError("")
    setMessage("")
  }

  return (
    <div className='bg-white rounded-lg shadow-md w-full max-w-sm mx-auto'>
    <form 
      onSubmit={isRegister ? handleRegister : handleLogin}
      
    >
      <div className='pt-3'>
        <h2 className="text-3xl text-center font-extralight">
          { 
            isRegister 
              ? "Create Account" 
              : "Login" 
          }
        </h2>
      </div>
      <hr className='text-gray-200 mt-4 mb-4'/>
      <p className="text-center text-gray-600 text-lg font-light mb-[-10px]">
        {
          isRegister
            ? "Looks like you are new here!"
            : "We are glad to see you again!"
        }
      </p>
      <div className="p-6">
        <div className="mb-4">
          <label className='text-gray-600 text-sm'>Email</label>
          <input 
            label="Email" 
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-2 rounded border mt-2' 
            placeholder='Enter Your Email'
            required
          />
        </div>
        <div className="mb-4">
          <label className='text-gray-600 text-sm'>Passowrd</label>
          <input 
            label="Passowrd" 
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full p-2 rounded border mt-2' 
            placeholder='Enter Your Passowrd'
            required
          />
        </div>
        {isRegister ? (
          <div className="mb-4">
            <label className='text-gray-600 text-sm'>Username</label>
            <input 
              label="Username" 
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full p-2 rounded border mt-2' 
              placeholder='Enter Username'
              required
            />
          </div>
        ) : null}
        { error && <p className='text-red-500 text-sm mb-3'>{error}</p> }
        { message && <p className='text-green-600 text-sm mb-3'>{message}</p> }
        <button type='submit' className='w-full bg-blue-500 text-white py-2 rounded-md my-4'>
          { isRegister ? "Register" : "Login" }
        </button>
        <div className='mb-[-10px]'>
          {isRegister ? (
            <p className='text-sm text-gray-700 text-center'>
            Already have an account ? <Link to="" className="text-blue-500 underline" onClick={handleRegisterToggle}>Login</Link>
          </p>
          ) : (
            <p className='text-sm text-gray-700 text-center'>
              Dont have an account ? <Link to="" className="text-blue-500 underline" onClick={handleRegisterToggle}>Create Account</Link>
            </p>
          )}
        </div>
      </div>
    </form>
    <hr className='text-gray-200 mb-4'/>
    <div className='px-6'>
    <button 
      className='w-full bg-blue-500 text-white py-2 rounded-md mb-3' 
      onClick={handleLoginWithGoogle}
    >Login with google</button>
    </div>
    </div>
  )
}

export default LoginForm
