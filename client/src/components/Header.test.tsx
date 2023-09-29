import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from './Header'

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Header Component', () => {
  it('renders website title', () => {
    renderWithRouter(<Header />)
    const titleElement = screen.getByText('ProInvestRE')
    expect(titleElement).toBeInTheDocument()
  })

  it('renders Admin Login button with the correct link', () => {
    renderWithRouter(<Header />)
    const loginButton = screen.getByText('Admin Login')
    expect(loginButton).toBeInTheDocument()
    
    const link = screen.getByRole('link', { name: 'Admin Login' })
    expect(link.getAttribute('href')).toBe('/admin-login')
  })
})
