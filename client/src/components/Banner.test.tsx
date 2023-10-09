import React from 'react';
import { render, screen } from '@testing-library/react'
import Banner from './Banner'

jest.mock('./Header', () => () => <div data-testid="header-mock">Header Mock</div>)

describe('Banner Component', () => {
  it('renders the Banner component with the correct image source and alt text', () => {
    // Given Banner component and when render
    render(<Banner />)
    
    const headerElement = screen.getByTestId('header-mock')
    // Then expect the header component to be in the document
    expect(headerElement).toBeInTheDocument()

    const bannerImage = screen.getByAltText('Banner')
    // Then expect the banner component to be in the document
    expect(bannerImage).toBeInTheDocument()
    expect(bannerImage).toHaveAttribute('src', '/hotels-flats.jpg')
  })

});