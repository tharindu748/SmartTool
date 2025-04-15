import React from 'react'
import Slider from '../components/Slider' // Import the Slider component
import CustomerProfile from '../userprofile/customer' // Import the CustomerProfile component

export default function Home() {
  return (
    <div>
          <Slider />
          <CustomerProfile />
          <h1>Home</h1>
    </div>

  )
}
