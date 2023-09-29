import React from 'react'
import '../styles/header.css'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className='header'>
        <div className="left-content">
            <div className="website-title">ProInvestRE</div>
        </div>
        <div className='right-content'>
          <Link to='/admin-login'>
            <button className='button'>Admin Login</button>
          </Link>
        </div>
    </header>
  )
}


export default Header
