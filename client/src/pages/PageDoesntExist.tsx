import React from 'react'
import '../styles/pageDoesntExist.css'

const PageDoesntExist: React.FC = () => {
  return (
    <div className="doesnt-exist-container">
      <h1>404!</h1>
      <h2>Sorry, this page doesn't exist</h2>
    </div>
  )
}

export default PageDoesntExist
