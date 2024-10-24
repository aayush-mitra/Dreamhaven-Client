'use client'

import '../globals.css'
import {useSession, signIn} from 'next-auth/react'
import {redirect, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const {data: session, status} = useSession()
  const router = useRouter()

  // Redirect if the user is already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const onChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value)
    } else {
      setPassword(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')  // Clear previous error messages
    const res = await signIn("credentials", {
      redirect: false, // Prevent redirect
      email,
      password,
    })

    if (res?.error) {
      setError('Invalid email or password.')
    } else {
      // Redirect to dashboard upon successful login
      router.push('/dashboard')
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div> // Show a loading state
  }

  return (
    <div className="auth-background">
      <form onSubmit={handleSubmit}>
        <div className="auth-container">
          <div className="auth-form">
            <h1>Login</h1>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Login</button>
          </div>
          <div className="auth-right">
            <h1>Welcome to DreamHaven.</h1>
            <h4>Don't have an account?</h4>
            <button onClick={() => window.location.href='/signUp'}>Sign Up</button>
          </div>
        </div>
      </form>
    </div>
  )
}
