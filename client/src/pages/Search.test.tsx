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
    outcodeResults: [
      {
        outcode: 'W1',
        avgPrice: 1000,
        avgRent: 800,
        avgYield: 5,
        oneYrGrowth: 2,
        threeYrGrowth: 5,
        fiveYrGrowth: 10,
      },
      {
        outcode: 'W2',
        avgPrice: 1000,
        avgRent: 800,
        avgYield: 5,
        oneYrGrowth: 2,
        threeYrGrowth: 5,
        fiveYrGrowth: 10,
      },
    ],
  },
}

describe('SearchComponent', () => {
  afterEach(() => {
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

    const { getByText, getByPlaceholderText, getByTestId } = render(
      <SearchComponent />
    )

    const outcodeInput = getByPlaceholderText('Enter outcode here')
    fireEvent.change(outcodeInput, { target: { value: 'W1' } })

    const searchButton = getByText('Search')
    await act(async () => {
        fireEvent.click(searchButton)
         
    })
    screen.debug()
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8040/search-by-outcode-stub',
        { params: { outcode: 'W1' } }
      )
      expect(screen.getByText('Average Price: 1000')).toBeInTheDocument()
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
  
    expect(infoElements.length).toBeGreaterThan(0); // 
  })
})
