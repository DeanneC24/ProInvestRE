import React from 'react';
import { render, screen } from '@testing-library/react'
import Banner from './Banner'

jest.mock('./Header', () => () => <div data-testid="header-mock">Header Mock</div>)

describe('Banner Component', () => {
  it('renders the Banner component with the correct image source and alt text', () => {
    render(<Banner />)
    
    const headerElement = screen.getByTestId('header-mock')
    expect(headerElement).toBeInTheDocument()

    const bannerImage = screen.getByAltText('Banner')
    expect(bannerImage).toBeInTheDocument()
    expect(bannerImage).toHaveAttribute('src', '/hotels-flats.jpg')
  })

  // it('should have the correct CSS styles', () => {
  //   render(<Banner />);
    
  //   // Verify that the banner container has the correct styles
  //   const bannerContainer = screen.getByRole('div', { name: 'banner-container' });
  //   expect(bannerContainer).toHaveStyle({
  //     width: '100%',
  //     height: 'auto',
  //     display: 'block',
  //   });

  //   // Verify that the image has the correct styles
  //   const bannerImage = screen.getByAltText('Banner');
  //   expect(bannerImage).toHaveStyle({
  //     width: '100%',
  //     height: 'auto',
  //     display: 'block',
  //   });
  // });
});