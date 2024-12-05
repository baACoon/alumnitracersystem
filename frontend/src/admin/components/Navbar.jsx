import React from 'react'
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav>
      <link to='/'>Home</link>
      <link to='/Register'>Register</link>
      <link to='/Login'>Login</link> 
    </nav>
  )
}
