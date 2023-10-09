import { render, fireEvent, waitFor, screen, act} from '@testing-library/react'
import axios from 'axios'
import SearchComponent from './Search'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockOutcodeData = {
  data: {
    outcode: 'SW1A',
    avg_price: 1000000,
    avg_rent: 2000,
    avg_yield: 5.0,
    growth_1y: 0.05,
    growth_3y: 0.2,
    growth_5y: 0.25,
    region: 'south_east'
  }
}

const mockRegionData = {
  data: {
    data: [
      {
        outcode: 'SW1A',
        avg_price: 1000000,
        avg_rent: 2000,
        avg_yield: 5.0,
        growth_1y: 0.05,
        growth_3y: 0.15,
        growth_5y: 0.25
      },
      {
        outcode: 'W1A',
        avg_price: 1200000,
        avg_rent: 2200,
        avg_yield: 4.5,
        growth_1y: 6.0,
        growth_3y: 12.8,
        growth_5y: 24.2
      }
    ]
  }
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
    // Given
    const { getByText } = render(<SearchComponent />)
    const regionButton = getByText('Search By Region')
    // When changing the search by type to region
    fireEvent.click(regionButton)
    // Then expect that the "active" class has been added to the button
    expect(regionButton.classList.contains('active')).toBe(true)
  })

  it('should fetch outcode data', async () => {
    // Given search component and successful response from outcode elasticsearch query
    const mockOutcodeResponse = {
      status: 200,
      data: mockOutcodeData
    }
    mockedAxios.get.mockResolvedValueOnce(mockOutcodeResponse)

    render(<SearchComponent />)

    // When a valid outcode in input and the search button is clicked
    const outcodeInput = screen.getByPlaceholderText('Enter outcode here')
    fireEvent.change(outcodeInput, { target: { value: 'W1' } })

    const searchButton = screen.getByText('Search')
    await act(async () => {
      fireEvent.click(searchButton)
    })
    // Then the metrics in the document should be displayed as follows
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Average Price: £1,000,000')).toBeInTheDocument()
      expect(screen.getByText('Average Weekly Rent: £2,000')).toBeInTheDocument()
      expect(screen.getByText('Average Yield: 5.0%')).toBeInTheDocument()
      expect(screen.getByText('1 Year Growth: 0.1%')).toBeInTheDocument()
      expect(screen.getByText('3 Year Growth: 0.2%')).toBeInTheDocument()
      expect(screen.getByText('5 Year Growth: 0.3%')).toBeInTheDocument()
    })
  })

  it('should fetch region data', async () => {
    // Given search component and successful response from region elasticsearch query
    mockedAxios.get.mockResolvedValueOnce(mockRegionData)
    const mockRegion = 'south_east'
    const mockNumOfResults = 5
    const mockOrderBy = 'asc'

    render(<SearchComponent />)

    // When search by region is selected and the search parameters are set
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
    // Then the results in the list of documents are displayed
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
      expect(screen.getByText('SW1A')).toBeInTheDocument()
      expect(screen.getByText('W1A')).toBeInTheDocument()
      expect(screen.getByText('3 Year Growth: 12.8%')).toBeInTheDocument()
    })
  })

  it('should toggle info', async () => {
    // Given the search component
    render(<SearchComponent />)
    const infoButton = screen.getByTestId('info-button')
    console.log(infoButton.textContent);

    // When the information button is clicked
    await act(async() => {
        fireEvent.click(infoButton)
    })
    const infoTextSubstring = 'An outcode is the first part of a UK postcode.';

    const infoElements = screen.getAllByText((content, node) => {
      const elementText = node?.textContent || '';
      return elementText.includes(infoTextSubstring);
    });
    // Then the information text is displayed
    expect(infoElements.length).toBeGreaterThan(0);
  })
})
