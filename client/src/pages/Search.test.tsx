import { render, fireEvent, waitFor, screen, act} from '@testing-library/react'
import axios from 'axios'
import SearchComponent from './Search'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockOutcodeData = {
  data: {
    data: {
        avgPrice: 1000,
        avgRent: 800,
        avgYield: 5,
        oneYrGrowth: 2,
        threeYrGrowth: 5,
        fiveYrGrowth: 10,
    }
    
  },
}

const mockRegionData = {
  data: {
    data: {
      outcodeResults: [
        {
          outcode: 'SW1A',
          avgPrice: 1000000,
          avgRent: 2000,
          avgYield: 5.0,
          oneYrGrowth: 0.05,
          threeYrGrowth: 0.15,
          fiveYrGrowth: 0.25,
        },
        {
          outcode: 'W1A',
          avgPrice: 1200000,
          avgRent: 2200,
          avgYield: 4.5,
          oneYrGrowth: 0.06,
          threeYrGrowth: 0.16,
          fiveYrGrowth: 0.26,
        },
      ],
    }
  },
}

describe('SearchComponent', () => {
  afterEach(() => {
    jest.setTimeout(60000);
    jest.clearAllMocks()
  })

  it('should render the component', () => {
    const { container } = render(<SearchComponent />)
    expect(container).toMatchSnapshot()
  })

  it('should handle search type change', () => {
    const { getByText } = render(<SearchComponent />)
    const regionButton = getByText('Search By Region')
    fireEvent.click(regionButton)
    expect(regionButton.classList.contains('active')).toBe(true)
  })

  it('should fetch outcode data', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockOutcodeData)

    render(<SearchComponent />)

    const outcodeInput = screen.getByPlaceholderText('Enter outcode here')
    fireEvent.change(outcodeInput, { target: { value: 'W1' } })

    const searchButton = screen.getByText('Search')
    await act(async () => {
        fireEvent.click(searchButton)
         
    })
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8040/search-by-outcode-stub',
        { params: { outcode: 'W1' } }
      )
      expect(screen.getByText('Average Price: 1000')).toBeInTheDocument()
    })
  })

  it('should fetch region data', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockRegionData)
    const mockRegion = 'mock_region'
    const mockNumOfResults = 5
    const mockOrderBy = 'asc'

    render(<SearchComponent />)

    const regionButton = screen.getByText('Search By Region')
    act (() => {
      fireEvent.click(regionButton)
    })
    
    const regionSelect = screen.getByLabelText('Region:')
    const numOfResSelect = screen.getByLabelText('Order by:')
    const orderBySelect = screen.getByLabelText('Number of results:')
    const searchButton = screen.getByText('Search')

    await act(async() => {
      fireEvent.change(regionSelect, { target: { value: mockRegion}})
      fireEvent.change(numOfResSelect, { target: { value: mockNumOfResults}})
      fireEvent.change(orderBySelect, { target: { value: mockOrderBy}})
      fireEvent.click(searchButton)
    })

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      expect(screen.getByText('SW1A')).toBeInTheDocument()
      expect(screen.getByText('W1A')).toBeInTheDocument()
      expect(screen.getByText('Three-Year Growth: 0.16')).toBeInTheDocument()
    })
  })

  it('should toggle info', async () => {
    render(<SearchComponent />)
    const infoButton = screen.getByTestId('info-button')
    console.log(infoButton.textContent);

    await act(async() => {
        fireEvent.click(infoButton)
    })
    const infoTextSubstring = 'An outcode is the first part of a UK postcode.';

    const infoElements = screen.getAllByText((content, node) => {
      const elementText = node?.textContent || '';
      return elementText.includes(infoTextSubstring);
    });
  
    expect(infoElements.length).toBeGreaterThan(0);
  })
})
