import React from 'react'
import { render, screen } from '@testing-library/react'
import PageDoesntExist from './PageDoesntExist'

describe('PageDoesntExist Component', () => {
  it('renders the error messages', () => {
    render(<PageDoesntExist />)
    const unfoundMessageElement = screen.getByText('404!')
    const errorMessageElement = screen.getByText("Sorry, this page doesn't exist")
    expect(errorMessageElement).toBeInTheDocument()
    expect(unfoundMessageElement).toBeInTheDocument()
  })
})