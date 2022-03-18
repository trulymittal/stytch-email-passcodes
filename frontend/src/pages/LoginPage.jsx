import axios from 'axios'
import React, { useState } from 'react'
import Layout from '../components/Layout'
import './LoginPage.css'

export default function LoginPage() {
  const [method_id, setMethod_id] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  function requestOTP(e) {
    e.preventDefault()
    if (!email) {
      return
    }
    axios
      .post(
        'http://localhost:4000/send-email',
        { email },
        { withCredentials: true }
      )
      .then(response => {
        console.log(response.data)
        setMethod_id(response.data.email_id)
      })
      .catch(error => console.log(error.message))
  }

  function verifyOTP(e) {
    e.preventDefault()
    if (!method_id || !code) {
      return
    }
    axios
      .post(
        'http://localhost:4000/verify-otp',
        { method_id, code },
        { withCredentials: true }
      )
      .then(response => console.log(response.data))
      .catch(error => console.log(error.message))
  }

  return (
    <Layout>
      <div className='container'>
        {!method_id && (
          <form className='email-container' onSubmit={requestOTP}>
            <h2>Login or Sign-up</h2>
            <p>Please use your email to get OTP for login or sign-up</p>
            <input
              type='email'
              id='email'
              name='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type='submit'>Request OTP</button>
          </form>
        )}
        {method_id && (
          <div className='otp-container'>
            <form className='otp-form-container' onSubmit={verifyOTP}>
              <h2>Enter your OTP</h2>
              <p>Check your email and use the OTP sent to you.</p>
              <input
                type='number'
                id='otp'
                name='otp'
                value={code}
                onChange={e => setCode(e.target.value)}
              />
              <button type='submit'>Verify OTP</button>
            </form>
            <button
              className='change-email'
              onClick={() => {
                axios
                  .post('http://localhost:4000', {}, { withCredentials: true })
                  .then(response => console.log(response.data))
              }}
            >
              Change Email
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
