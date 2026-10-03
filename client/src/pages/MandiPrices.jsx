import { useEffect, useMemo, useState } from 'react';

import {
  IndianRupee,
  Search,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarDays,
  Store,
  Filter,
  RefreshCw
} from 'lucide-react';

const API_URL = 'http://localhost:5001/api/mandi';

export default function MandiPrices() {
  const [mandiData, setMandiData] = useState([]);

  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All Crops');
  const [stateFilter, setStateFilter] = useState('All States');

  const [lastUpdated, setLastUpdated] = useState('Not loaded');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // -----------------------------------------
  // FETCH MANDI DATA
  // -----------------------------------------
  const fetchPrices = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please login to view mandi prices.');
        return;
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch mandi prices.'
        );
      }

      setMandiData(data);

      setLastUpdated('Updated just now');

    } catch (error) {
      console.error('Mandi prices error:', error);

      setError(
        error.message ||
        'Unable to connect to the mandi price server.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // -----------------------------------------
  // LOAD DATA WHEN PAGE OPENS
  // -----------------------------------------
  useEffect(() => {
    fetchPrices();
  }, []);

  // -----------------------------------------
  // CROP OPTIONS
  // -----------------------------------------
  const cropOptions = useMemo(() => {
    const crops = [
      ...new Set(
        mandiData.map(item => item.crop)
      )
    ];

    return ['All Crops', ...crops];
  }, [mandiData]);

  // -----------------------------------------
  // STATE OPTIONS
  // -----------------------------------------
  const stateOptions = useMemo(() => {
    const states = [
      ...new Set(
        mandiData.map(item => item.state)
      )
    ];

    return ['All States', ...states];
  }, [mandiData]);

  // -----------------------------------------
  // FILTER DATA
  // -----------------------------------------
  const filteredData = useMemo(() => {
    return mandiData.filter(item => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.crop
          ?.toLowerCase()
          .includes(searchText) ||

        item.market
          ?.toLowerCase()
          .includes(searchText) ||

        item.variety
          ?.toLowerCase()
          .includes(searchText) ||

        item.state
          ?.toLowerCase()
          .includes(searchText);

      const matchesCrop =
        cropFilter === 'All Crops' ||
        item.crop === cropFilter;

      const matchesState =
        stateFilter === 'All States' ||
        item.state === stateFilter;

      return (
        matchesSearch &&
        matchesCrop &&
        matchesState
      );
    });
  }, [
    mandiData,
    search,
    cropFilter,
    stateFilter
  ]);

  // -----------------------------------------
  // REFRESH
  // -----------------------------------------
  const refreshPrices = () => {
    fetchPrices(true);
  };

  // -----------------------------------------
  // TREND ICON
  // -----------------------------------------
  const getTrendIcon = trend => {
    if (trend === 'up') {
      return <TrendingUp size={16} />;
    }

    if (trend === 'down') {
      return <TrendingDown size={16} />;
    }

    return <Minus size={16} />;
  };

  // -----------------------------------------
  // TREND CLASS
  // -----------------------------------------
  const getTrendClass = trend => {
    if (trend === 'up') {
      return 'trend-up';
    }

    if (trend === 'down') {
      return 'trend-down';
    }

    return 'trend-neutral';
  };

  // -----------------------------------------
  // TREND TEXT
  // -----------------------------------------
  const getTrendText = trend => {
    if (trend === 'up') {
      return 'Up';
    }

    if (trend === 'down') {
      return 'Down';
    }

    return 'Stable';
  };

  // -----------------------------------------
  // UNIQUE MARKETS
  // -----------------------------------------
  const marketCount = new Set(
    mandiData.map(item => item.market)
  ).size;

  // -----------------------------------------
  // UNIQUE CROPS
  // -----------------------------------------
  const cropCount = new Set(
    mandiData.map(item => item.crop)
  ).size;

  return (
    <div className="mandi-page">

      {/* Header */}
      <header className="feature-header mandi-header">

        <div>

          <span className="eyebrow">
            SMART MARKET INFORMATION
          </span>

          <h1>
            Mandi <em>Prices</em>
          </h1>

          <p>
            Check crop prices across different agricultural markets
            and make better selling decisions.
          </p>

        </div>

        <div className="feature-header-icon">
          <IndianRupee size={42} />
        </div>

      </header>


      <main className="mandi-container">

        {/* Top Information Cards */}
        <section className="mandi-summary">

          <div className="mandi-summary-card">

            <div className="mandi-summary-icon">
              <Store size={21} />
            </div>

            <div>
              <span>Markets Covered</span>
              <strong>
                {loading ? '...' : marketCount}
              </strong>
            </div>

          </div>


          <div className="mandi-summary-card">

            <div className="mandi-summary-icon">
              <IndianRupee size={21} />
            </div>

            <div>
              <span>Crops Tracked</span>
              <strong>
                {loading ? '...' : cropCount}
              </strong>
            </div>

          </div>


          <div className="mandi-summary-card">

            <div className="mandi-summary-icon">
              <TrendingUp size={21} />
            </div>

            <div>
              <span>Price Updates</span>
              <strong>Daily</strong>
            </div>

          </div>


          <div className="mandi-summary-card">

            <div className="mandi-summary-icon">
              <CalendarDays size={21} />
            </div>

            <div>
              <span>Last Updated</span>
              <strong>{lastUpdated}</strong>
            </div>

          </div>

        </section>


        {/* Error */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        {/* Search & Filters */}
        <section className="mandi-filter-card">

          <div className="mandi-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search crop, mandi, variety or state..."
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="mandi-filters">

            <div className="mandi-filter">

              <Filter size={15} />

              <select
                value={cropFilter}
                onChange={e =>
                  setCropFilter(e.target.value)
                }
              >

                {cropOptions.map(crop => (
                  <option
                    key={crop}
                    value={crop}
                  >
                    {crop}
                  </option>
                ))}

              </select>

            </div>


            <div className="mandi-filter">

              <MapPin size={15} />

              <select
                value={stateFilter}
                onChange={e =>
                  setStateFilter(e.target.value)
                }
              >

                {stateOptions.map(state => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                ))}

              </select>

            </div>


            <button
              className="mandi-refresh"
              onClick={refreshPrices}
              type="button"
              disabled={refreshing}
            >

              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? 'mandi-refresh-spin'
                    : ''
                }
              />

              {refreshing
                ? 'Refreshing...'
                : 'Refresh'}

            </button>

          </div>

        </section>


        {/* Price Table */}
        <section className="mandi-table-card">

          <div className="mandi-table-heading">

            <div>

              <span className="eyebrow">
                MARKET PRICES
              </span>

              <h2>
                Today's <em>Crop Prices</em>
              </h2>

            </div>

            <span className="mandi-result-count">
              {filteredData.length} results
            </span>

          </div>


          {loading ? (

            <div className="mandi-empty">

              <RefreshCw
                size={35}
                className="mandi-refresh-spin"
              />

              <h3>
                Loading market prices...
              </h3>

              <p>
                Fetching the latest mandi data.
              </p>

            </div>

          ) : filteredData.length > 0 ? (

            <div className="mandi-table-wrapper">

              <table className="mandi-table">

                <thead>

                  <tr>

                    <th>Crop</th>
                    <th>Market</th>
                    <th>Location</th>
                    <th>Min Price</th>
                    <th>Max Price</th>
                    <th>Modal Price</th>
                    <th>Trend</th>

                  </tr>

                </thead>


                <tbody>

                  {filteredData.map((item, index) => (

                    <tr
                      key={
                        item._id ||
                        `${item.crop}-${item.market}-${index}`
                      }
                    >

                      <td>

                        <div className="crop-name-cell">

                          <div className="crop-symbol">
                            {item.crop?.charAt(0)}
                          </div>

                          <div>

                            <strong>
                              {item.crop}
                            </strong>

                            <span>
                              {item.variety}
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>

                        <strong className="mandi-name">
                          {item.market}
                        </strong>

                      </td>


                      <td>

                        <span className="location-cell">

                          <MapPin size={13} />

                          {item.state}

                        </span>

                      </td>


                      <td>

                        <span className="price">
                          ₹
                          {Number(
                            item.minPrice
                          ).toLocaleString('en-IN')}
                        </span>

                      </td>


                      <td>

                        <span className="price">
                          ₹
                          {Number(
                            item.maxPrice
                          ).toLocaleString('en-IN')}
                        </span>

                      </td>


                      <td>

                        <strong className="modal-price">
                          ₹
                          {Number(
                            item.modalPrice
                          ).toLocaleString('en-IN')}
                        </strong>

                      </td>


                      <td>

                        <span
                          className={`price-trend ${getTrendClass(
                            item.trend
                          )}`}
                        >

                          {getTrendIcon(item.trend)}

                          {getTrendText(item.trend)}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="mandi-empty">

              <Search size={35} />

              <h3>
                No market prices found
              </h3>

              <p>
                Try changing your search or filter selection.
              </p>

            </div>

          )}

        </section>


        {/* Farmer Tip */}
        <section className="mandi-tip">

          <div className="mandi-tip-icon">
            <IndianRupee size={22} />
          </div>

          <div>

            <span className="eyebrow">
              FARMER TIP
            </span>

            <h3>
              Compare prices before selling your crop.
            </h3>

            <p>
              Mandi prices can vary between markets.
              Compare nearby markets, transportation costs
              and current demand before deciding where to sell.
            </p>

          </div>

        </section>


        <p className="mandi-disclaimer">
          Price information shown here is for demonstration purposes.
          Actual mandi prices may change throughout the day and should
          be verified through official market sources before making
          trading decisions.
        </p>

      </main>

    </div>
  );
}