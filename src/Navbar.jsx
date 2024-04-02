import React from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav>
      <div className="container is--nav">
        <a className="nav-logo">Geothermal</a>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/explorer">Explorer</Link>
          </li>
          <li>
            <Link to="/hip-ra">HIP-RA</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
