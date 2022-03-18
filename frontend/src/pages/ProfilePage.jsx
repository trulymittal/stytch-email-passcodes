import axios from 'axios'
import React, { useEffect } from 'react'
import Layout from '../components/Layout'

export default function ProfilePage() {
  useEffect(() => {
    axios
      .get('http://localhost:4000/profile', { withCredentials: true })
      .then(response => console.log(response.data))
      .catch(error => console.log(error.message))
  }, [])

  return (
    <Layout>
      <h2>ProfilePage</h2>
    </Layout>
  )
}
