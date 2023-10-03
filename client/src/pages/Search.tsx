import React, { useState } from 'react'
import axios from 'axios'
import { numResultsOptions, regionOptions, regionOptionLabels, orderByOptionLabels } from '../constants'
import '../styles/search.css'

interface OutcodeSearchResults {
  [key: string]: number | string
}

const SearchComponent: React.FC = () => {
  const [searchType, setSearchType] = useState<string>('outcode')
  const [region, setRegion] = useState<string>('')
  const [orderBy, setOrderBy] = useState<string>('default')
  const [numResults, setNumResults] = useState<number>(10)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [outcode, setOutcode] = useState<string>('')
  const [outcodeSearchResults, setOutcodeSearchResults] = useState<OutcodeSearchResults | null>(null)
  const [regionSearchResults, setRegionSearchResults] = useState<OutcodeSearchResults[] | null>(null)
  const [outcodeError, setOutcodeError] = useState<string | null>(null);
  const [regionError, setRegionError] = useState<string | null>(null);

  const handleSearchTypeChange = (type: string) => {
    setSearchType(type)
    setOutcodeSearchResults(null)
    setRegionSearchResults(null)
    setOutcodeError(null)
    setRegionError(null)
  }

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value)
  }

  const handleOrderByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderBy(e.target.value)
  }

  const handleNumResultsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumResults(Number(e.target.value))
  }

  const handleOutcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutcode(e.target.value)
  }

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  const fetchOutcodeData = async () => {
        try {
          const response = await axios.get(`http://localhost:8040/search-by-outcode-stub`, {
            params: { outcode: outcode },
          })
  
          const outcodeData: OutcodeSearchResults = response.data.data
  
          setOutcodeSearchResults(outcodeData)
        } catch (error) {
          console.error(`Error fetching data for outcode ${outcode}:`, error)
          setOutcodeError(`Failed to fetch data for outcode ${outcode}. Please try again later.`)
        }
  }

  const fetchRegionData = async () => {
    try {
      const response = await axios.get(`http://localhost:8040/search-by-region-stub`, {
        params: { 
          region: region,
          orderBy: orderBy,
          numOfResults: numResults
        },
      })

      const regionData: OutcodeSearchResults[] = response.data.data.outcodeResults

      setRegionSearchResults(regionData)
    } catch (error) {
      console.error(`Error fetching data for region ${region}:`, error)
      setRegionError(`Error fetching data for region ${regionOptionLabels[region]}. Please try again later`)
    }
  }

  const dashboardMappings: { [key: string]: string } = {
    avgPrice: 'Average Price',
    avgRent: 'Average Rent',
    avgYield: 'Average Yield',
    oneYrGrowth: '1 Year Growth',
    threeYrGrowth: '3 Year Growth',
    fiveYrGrowth: '5 Year Growth',
  }

  const renderOutcodeDashboard = (results: OutcodeSearchResults | null) => {
    if (outcodeError || !results) {
      return <div className="outcode-error">{outcodeError}</div>
    } 
    return (
      <div>
        {Object.keys(dashboardMappings).map((key) => (
          <div key={key}>
            <p>
              {dashboardMappings[key]}: {results[key]}
            </p>
          </div>
        ))}
      </div>
    )
  }

  const renderRegionDashboard = (results: OutcodeSearchResults[] | null) => {
    if (regionError || !results) {
      return <div className="region-error">{`Issue during data retrieval: ${regionError}`}</div>
    } else if (!results) {
      return
    }
    return (
      <div>
        {results.map((result: OutcodeSearchResults, index: number) => (
          <div key={index}>
            <h3>{result.outcode}</h3>
            <p>Average Price: {result.avgPrice}</p>
            <p>Average Rent: {result.avgRent}</p>
            <p>Average Yield: {result.avgYield}</p>
            <p>One-Year Growth: {result.oneYrGrowth}</p>
            <p>Three-Year Growth: {result.threeYrGrowth}</p>
            <p>Five-Year Growth: {result.fiveYrGrowth}</p>
          </div>
        ))}
      </div>
    )
  }


  return (
    <div className="container">
      <div>
        <button
          onClick={() => handleSearchTypeChange('outcode')}
          className={`search-button ${searchType === 'outcode' ? 'active' : ''}`}
        >
          Search By Outcode
        </button>
        <button
          onClick={() => handleSearchTypeChange('region')}
          className={`search-button ${searchType === 'region' ? 'active' : ''}`}
        >
          Search By Region
        </button>
      </div>

      {searchType === 'outcode' ? (
        <div>
          <input
            type="text"
            placeholder="Enter outcode here"
            value={outcode}
            onChange={handleOutcodeChange}
            className="input-field"
          />
          

          <button onClick={fetchOutcodeData} className="search-button">Search</button>
          <button onClick={toggleInfo} className="info-button"  data-testid="info-button">
            <i className="fa fa-info-circle"></i>
          </button>
          {showInfo && <p className="information">An outcode is the first part of a UK postcode. <br/>For e.g if the postcode is W1 1NF, then the outcode is W1.</p>}
          <div className="dashboard">{renderOutcodeDashboard(outcodeSearchResults)}</div>
        </div>
      ) : (
        <div>
          <label>
            Region:
            <select value={region} onChange={handleRegionChange} className="input-field">
              {regionOptions.map((option) => (
                <option key={option} value={option}>
                  {regionOptionLabels[option]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Order by:
            <select value={orderBy} onChange={handleOrderByChange} className="input-field">
              <option value="asc">{orderByOptionLabels['asc']}</option>
              <option value="desc">{orderByOptionLabels['desc']}</option>
            </select>
          </label>
          <label>
            Number of results:
            <select value={numResults} onChange={handleNumResultsChange} className="input-field">
              {numResultsOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <button onClick={fetchRegionData} className="search-button">Search</button>
          <div className="dashboard">{renderRegionDashboard(regionSearchResults)}</div>
        </div>
      )}
    </div>
  )
}

export default SearchComponent
