import React, { useState } from 'react'
import axios from 'axios'
import { numResultsOptions, regionOptions, regionOptionLabels, orderByOptionLabels } from '../constants'
import '../styles/search.css'
import 'font-awesome/css/font-awesome.min.css'

interface OutcodeSearchResults {
  [key: string]: number | string
}

const SearchComponent: React.FC = () => {
  const [searchType, setSearchType] = useState<string>('outcode')
  const [region, setRegion] = useState<string>(regionOptions[0])
  const [orderBy, setOrderBy] = useState<string>('desc')
  const [numResults, setNumResults] = useState<number>(5)
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
    setOutcodeError(null)
    setOutcodeSearchResults(null)
  }

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  const fetchOutcodeData = async () => {
    try {
      const response = await axios.get(`http://localhost:8040/search-by-outcode`, {
        params: { outcode: outcode },
      })

      if (response.status === 200 && response.data.data) {
        const outcodeData: OutcodeSearchResults = response.data.data
        setOutcodeSearchResults(outcodeData)
      } else if (!response.data.data) {
        console.error(`No results retrieved for outcode ${outcode}`)
        setOutcodeError(`No results retrieved for outcode ${outcode}`)
      } else {
        console.error(`Received a non 200 status from elasticsearch service, code is: ${response.status}`)
        setOutcodeError(`Error when retrieving data for ${outcode}`)
      }

    } catch (error) {
      console.error(`Error fetching data for outcode ${outcode}:`, error)
      setOutcodeError(`Failed to fetch data for outcode ${outcode}. Please try again later.`)
    }
  }

  const fetchRegionData = async () => {
    try {
      const response = await axios.get(`http://localhost:8040/search-by-region`, {
        params: { 
          region: region,
          orderBy: 'desc',
          numOfResults: numResults
        },
      })

      const regionData: OutcodeSearchResults[] = response.data.data

      // implement ordering
      if (regionData) {
        const sortByAvgYield = orderBy === 'desc' ? -1 : 1
        regionData.sort((a:OutcodeSearchResults, b: OutcodeSearchResults) => {
          return ((a.avg_yield as number) - (b.avg_yield as number)) * sortByAvgYield
        })
      }

      setRegionSearchResults(regionData)
    } catch (error) {
      console.error(`Error fetching data for region ${region}:`, error)
      setRegionError(`Error fetching data for region ${regionOptionLabels[region]}. Please try again later`)
    }
  }

  const dashboardMappings: { [key: string]: string } = {
    avg_yield: 'Average Yield',
    avg_price: 'Average Price',
    avg_rent: 'Average Weekly Rent',
    growth_1y: '1 Year Growth',
    growth_3y: '3 Year Growth',
    growth_5y: '5 Year Growth',
    region: 'Region',
  }

  const formatNumericalElems = (key: string, value: number | string) => {
    if (typeof value === 'number') {
      if (key.includes('growth') || key.includes('avg_yield')) {
        return `${value.toFixed(1)}%`
      } else if (typeof value === 'string') {
        return value
      } else { // All of the currency amounts
        return `${value.toLocaleString('en-GB', { 
          style: 'currency', 
          currency: 'GBP',
          maximumFractionDigits: 0
        })}`
      }
    }

  }


  const renderOutcodeDashboard = (results: OutcodeSearchResults | null) => {
    if (outcodeError) {
      return <div className="outcode-error">{outcodeError}</div>
    } 
    return (
      <div>
        {results && (
        <>
          <h3>{typeof results['outcode'] === 'string' ? results['outcode'].toLocaleUpperCase() : results['outcode']}</h3>
          {Object.keys(dashboardMappings).map((key) => (
            <div key={key}>
              {key === 'region' ? (
                <p>
                  {dashboardMappings[key]}: {regionOptionLabels[results[key]]}
                </p>
              ) : (
                <p>
                  {dashboardMappings[key]}: {formatNumericalElems(key, results[key])}
                </p>
              )}
            </div>
          ))}
        </>
      )}
      </div>
    )
  }

  const renderRegionDashboard = (results: OutcodeSearchResults[] | null) => {
    if (regionError || !results) {
      return <div className="region-error">{regionError}</div>
    }
    else if (!results) {
      return null
    }
    return (
      <div>
        {results.map((result: OutcodeSearchResults, index: number) => (
          <div>
            <h3>{result.outcode}</h3>
            {Object.keys(dashboardMappings).map((key) => (
              <div key={key}>
                {key === 'region' ? (
                  <p>
                    {dashboardMappings[key]}: {regionOptionLabels[result[key]]}
                  </p>
                ) : (
                  <p>
                    {dashboardMappings[key]}: {formatNumericalElems(key, result[key])}
                  </p>
                )}
            </div>
          ))}
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
