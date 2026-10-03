import { useEffect, useMemo, useState } from 'react';

import {
  Search,
  Landmark,
  CheckCircle2,
  FileText,
  IndianRupee,
  Users,
  ArrowRight,
  Filter,
  X,
  RefreshCw
} from 'lucide-react';

const API_URL = 'http://localhost:5001/api/schemes';

export default function GovernmentSchemes() {
  const [schemes, setSchemes] = useState([]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [level, setLevel] = useState('All');

  const [selectedScheme, setSelectedScheme] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);


  // -----------------------------------------
  // FETCH SCHEMES
  // -----------------------------------------
  const fetchSchemes = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please login to view government schemes.');
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
          data.message || 'Failed to fetch government schemes.'
        );
      }

      setSchemes(data);

    } catch (error) {
      console.error('Government schemes error:', error);

      setError(
        error.message ||
        'Unable to connect to the schemes server.'
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // -----------------------------------------
  // LOAD SCHEMES
  // -----------------------------------------
  useEffect(() => {
    fetchSchemes();
  }, []);


  // -----------------------------------------
  // CATEGORIES
  // -----------------------------------------
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        schemes.map(scheme => scheme.category)
      )
    ];

    return [
      'All Categories',
      ...uniqueCategories
    ];
  }, [schemes]);


  // -----------------------------------------
  // LEVELS
  // -----------------------------------------
  const levels = useMemo(() => {
    const uniqueLevels = [
      ...new Set(
        schemes.map(scheme => {
          if (scheme.state === 'All India') {
            return 'Central';
          }

          return scheme.state;
        })
      )
    ];

    return ['All', ...uniqueLevels];
  }, [schemes]);


  // -----------------------------------------
  // NORMALIZE LEVEL
  // -----------------------------------------
  const getLevel = scheme => {
    if (scheme.state === 'All India') {
      return 'Central';
    }

    return scheme.state || 'All India';
  };


  // -----------------------------------------
  // BENEFIT TEXT
  // -----------------------------------------
  const getBenefit = scheme => {
    if (
      scheme.benefits &&
      scheme.benefits.length > 0
    ) {
      return scheme.benefits[0];
    }

    return 'Agricultural support available under this scheme';
  };


  // -----------------------------------------
  // FILTER SCHEMES
  // -----------------------------------------
  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const text = search.toLowerCase();

      const matchesSearch =
        scheme.name
          ?.toLowerCase()
          .includes(text) ||

        scheme.category
          ?.toLowerCase()
          .includes(text) ||

        scheme.description
          ?.toLowerCase()
          .includes(text) ||

        scheme.state
          ?.toLowerCase()
          .includes(text);

      const matchesCategory =
        category === 'All Categories' ||
        scheme.category === category;

      const matchesLevel =
        level === 'All' ||
        getLevel(scheme) === level;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      );
    });
  }, [
    schemes,
    search,
    category,
    level
  ]);


  // -----------------------------------------
  // REFRESH
  // -----------------------------------------
  const refreshSchemes = () => {
    fetchSchemes(true);
  };


  return (
    <div className="schemes-page">

      {/* Header */}
      <header className="feature-header schemes-header">

        <div>

          <span className="eyebrow">
            FARMER SUPPORT
          </span>

          <h1>
            Government <em>Schemes</em>
          </h1>

          <p>
            Discover agricultural schemes, financial support,
            insurance, credit and other government assistance.
          </p>

        </div>

        <div className="feature-header-icon">
          <Landmark size={42} />
        </div>

      </header>


      <main className="schemes-container">

        {/* Quick Stats */}
        <section className="scheme-stats">

          <div className="scheme-stat-card">

            <div className="scheme-stat-icon">
              <Landmark size={20} />
            </div>

            <div>
              <span>Schemes Listed</span>

              <strong>
                {loading ? '...' : schemes.length}
              </strong>
            </div>

          </div>


          <div className="scheme-stat-card">

            <div className="scheme-stat-icon">
              <IndianRupee size={20} />
            </div>

            <div>
              <span>Financial Support</span>
              <strong>Available</strong>
            </div>

          </div>


          <div className="scheme-stat-card">

            <div className="scheme-stat-icon">
              <Users size={20} />
            </div>

            <div>
              <span>Farmer Focused</span>
              <strong>Yes</strong>
            </div>

          </div>


          <div className="scheme-stat-card">

            <div className="scheme-stat-icon">
              <FileText size={20} />
            </div>

            <div>
              <span>Information</span>
              <strong>Easy Access</strong>
            </div>

          </div>

        </section>


        {/* Error */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        {/* Search and Filters */}
        <section className="schemes-filter-card">

          <div className="schemes-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search schemes..."
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="schemes-filter">

            <Filter size={15} />

            <select
              value={category}
              onChange={e =>
                setCategory(e.target.value)
              }
            >

              {categories.map(item => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>


          <div className="schemes-filter">

            <Landmark size={15} />

            <select
              value={level}
              onChange={e =>
                setLevel(e.target.value)
              }
            >

              {levels.map(item => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>


          <button
            type="button"
            className="scheme-refresh-btn"
            onClick={refreshSchemes}
            disabled={refreshing}
          >

            <RefreshCw
              size={16}
              className={
                refreshing
                  ? 'scheme-refresh-spin'
                  : ''
              }
            />

            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}

          </button>

        </section>


        {/* Scheme Heading */}
        <div className="schemes-heading">

          <div>

            <span className="eyebrow">
              AVAILABLE PROGRAMS
            </span>

            <h2>
              Support for <em>Farmers</em>
            </h2>

          </div>

          <span className="scheme-result-count">
            {filteredSchemes.length} schemes
          </span>

        </div>


        {/* Loading */}
        {loading ? (

          <div className="schemes-empty">

            <RefreshCw
              size={35}
              className="scheme-refresh-spin"
            />

            <h3>
              Loading government schemes...
            </h3>

            <p>
              Fetching scheme information from the server.
            </p>

          </div>

        ) : filteredSchemes.length > 0 ? (

          /* Scheme Cards */
          <section className="scheme-grid">

            {filteredSchemes.map((scheme, index) => (

              <article
                className="scheme-card"
                key={
                  scheme._id ||
                  `${scheme.name}-${index}`
                }
              >

                <div className="scheme-card-top">

                  <div className="scheme-card-icon">
                    <Landmark size={21} />
                  </div>

                  <span
                    className={`scheme-status ${
                      scheme.active
                        ? 'active'
                        : 'check'
                    }`}
                  >
                    {scheme.active
                      ? 'Active'
                      : 'Check Availability'}
                  </span>

                </div>


                <span className="scheme-category">
                  {scheme.category}
                </span>


                <h3>
                  {scheme.name}
                </h3>


                <p className="scheme-description">
                  {scheme.description}
                </p>


                <div className="scheme-benefit">

                  <IndianRupee size={17} />

                  <div>

                    <span>
                      Key Benefit
                    </span>

                    <strong>
                      {getBenefit(scheme)}
                    </strong>

                  </div>

                </div>


                <div className="scheme-card-footer">

                  <span>

                    <MapPinIcon />

                    {getLevel(scheme)}

                  </span>


                  <button
                    type="button"
                    onClick={() =>
                      setSelectedScheme(scheme)
                    }
                  >

                    View Details

                    <ArrowRight size={15} />

                  </button>

                </div>

              </article>

            ))}

          </section>

        ) : (

          <div className="schemes-empty">

            <Search size={35} />

            <h3>
              No schemes found
            </h3>

            <p>
              Try another search term or change the filters.
            </p>

          </div>

        )}


        {/* Information Panel */}
        <section className="scheme-info-panel">

          <div className="scheme-info-icon">
            <CheckCircle2 size={24} />
          </div>

          <div>

            <span className="eyebrow">
              IMPORTANT
            </span>

            <h3>
              Always check the official scheme guidelines.
            </h3>

            <p>
              Eligibility, benefits, required documents and
              application procedures can vary by scheme and
              may change over time. Verify the latest information
              through the relevant government department or
              official portal before applying.
            </p>

          </div>

        </section>

      </main>


      {/* Details Modal */}
      {selectedScheme && (

        <div
          className="scheme-modal-overlay"
          onClick={() => setSelectedScheme(null)}
        >

          <div
            className="scheme-modal"
            onClick={e => e.stopPropagation()}
          >

            <button
              className="scheme-modal-close"
              onClick={() =>
                setSelectedScheme(null)
              }
              type="button"
            >
              <X size={19} />
            </button>


            <div className="scheme-modal-icon">
              <Landmark size={25} />
            </div>


            <span className="scheme-category">
              {selectedScheme.category}
            </span>


            <h2>
              {selectedScheme.name}
            </h2>


            <p className="scheme-modal-description">
              {selectedScheme.description}
            </p>


            {/* Benefit */}
            <div className="scheme-detail-box">

              <IndianRupee size={18} />

              <div>

                <span>
                  Key Benefit
                </span>

                <strong>
                  {getBenefit(selectedScheme)}
                </strong>

              </div>

            </div>


            {/* Eligibility */}
            <div className="scheme-detail-section">

              <h3>
                Eligibility
              </h3>

              {selectedScheme.eligibility?.length > 0 ? (

                <ul className="scheme-detail-list">

                  {selectedScheme.eligibility.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

              ) : (

                <p>
                  Refer to the official scheme guidelines
                  for current eligibility requirements.
                </p>

              )}

            </div>


            {/* Documents */}
            <div className="scheme-detail-section">

              <h3>
                Common Documents
              </h3>


              <div className="document-list">

                {selectedScheme.documents?.map(
                  document => (

                    <span key={document}>

                      <CheckCircle2 size={14} />

                      {document}

                    </span>

                  )
                )}

              </div>

            </div>


            {/* Ministry */}
            {selectedScheme.ministry && (

              <div className="scheme-detail-section">

                <h3>
                  Implementing Ministry / Department
                </h3>

                <p>
                  {selectedScheme.ministry}
                </p>

              </div>

            )}


            {/* Official Link */}
            {selectedScheme.officialLink && (

              <a
                href={selectedScheme.officialLink}
                target="_blank"
                rel="noreferrer"
                className="scheme-official-link"
              >
                Visit Official Portal
                <ArrowRight size={15} />
              </a>

            )}


            <div className="scheme-modal-note">

              Verify the latest eligibility and application
              procedure on the relevant official government
              portal before submitting an application.

            </div>


          </div>

        </div>

      )}


    </div>
  );
}


// -----------------------------------------
// LOCATION ICON
// -----------------------------------------
function MapPinIcon() {
  return (
    <span className="scheme-location-dot">
      •
    </span>
  );
}