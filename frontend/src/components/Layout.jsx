import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import './Layout.css'

export default function Layout({ children }) {
  function logout() {
    axios
      .delete('http://localhost:4000/logout', { withCredentials: true })
      .then(response => console.log(response.data))
      .catch(error => console.log(error.message))
  }
  return (
    <>
      <header>
        <nav>
          <h2 className='nav-heading'>Stytch Email OTPs</h2>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
            <li onClick={logout} className='logout'>
              Logout
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </>
  )
}
