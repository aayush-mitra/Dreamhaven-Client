'use client'

import '../globals.css'
import {useSession, signIn} from 'next-auth/react'
import {redirect, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

export default function SignUp() {
  const [name, setName] = useState('')
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
    } else if (e.target.name === 'name') {
      setName(e.target.value)
    } else {
      setPassword(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')  // Clear previous error messages
    const response = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/users/`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password
      })
    })

    const res1 = await response.json()
    if (res1?.success) {
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
    } else {
      setError('Error')
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
            <h1>Register</h1>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>
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
            <button type="submit">Register</button>
          </div>
          <div className="auth-right">
            <h1>Welcome to DreamHaven.</h1>
            <h4>Already have an account?</h4>
            <button onClick={() => window.location.href = '/signIn'}>Sign In</button>
          </div>
        </div>
      </form>
    </div>
  )
}
