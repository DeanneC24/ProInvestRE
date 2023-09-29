import React from 'react'
import Header from './Header'

const Banner: React.FC = () => {
  const bannerStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto', // to do check height
    display: 'block',
  }

  return (
    <div id='banner-container'>
      <Header/>
      <div style={bannerStyle}>
      <img
        src="/hotels-flats.jpg"
        alt="Banner"
        style={bannerStyle}
      />
    </div>
    </div>
    
  )
}

export default Banner

