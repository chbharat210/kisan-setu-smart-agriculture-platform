import { useState } from 'react';

import {
  Sprout,
  Droplets,
  CalendarDays,
  FlaskConical,
  Sun,
  CheckCircle2,
  ArrowRight,
  MapPin
} from 'lucide-react';

// ======================================================
// HARD-CODED CROP ADVISORY DATA
// ======================================================

const advisoryData = {
  Wheat: {
    season: 'Rabi',
    sowing: 'October – December',
    harvest: 'March – April',
    soil: 'Well-drained loamy soil is generally suitable.',
    irrigation:
      'Irrigate at important growth stages, especially crown root initiation and flowering.',
    fertilizer:
      'Use nitrogen, phosphorus and potassium according to soil-test recommendations.',
    tips: [
      'Use certified and quality seeds.',
      'Avoid excessive irrigation.',
      'Control weeds during early crop growth.',
      'Monitor regularly for rust and pest attacks.'
    ]
  },

  Rice: {
    season: 'Kharif',
    sowing: 'June – July',
    harvest: 'October – November',
    soil:
      'Clayey and loamy soils with good water retention are generally suitable.',
    irrigation:
      'Maintain appropriate water levels and avoid unnecessary continuous flooding.',
    fertilizer:
      'Apply nitrogen, phosphorus and potassium according to soil-test recommendations.',
    tips: [
      'Use healthy seedlings.',
      'Maintain proper plant spacing.',
      'Control weeds during early crop growth.',
      'Monitor for stem borer and blast disease.'
    ]
  },

  Tomato: {
    season: 'Kharif / Rabi depending on region',
    sowing: 'Nursery followed by transplanting',
    harvest: 'Approximately 60–90 days after transplanting',
    soil:
      'Well-drained sandy loam or loamy soil is generally suitable.',
    irrigation:
      'Provide regular irrigation while avoiding waterlogging.',
    fertilizer:
      'Use balanced nutrients with appropriate potassium during fruit development.',
    tips: [
      'Use healthy seedlings.',
      'Provide plant support when necessary.',
      'Monitor for leaf curl and fungal diseases.',
      'Remove severely infected plant parts.'
    ]
  },

  Potato: {
    season: 'Rabi',
    sowing: 'October – November',
    harvest: 'January – March',
    soil:
      'Loose, well-drained sandy loam soil is generally suitable.',
    irrigation:
      'Provide light and timely irrigation according to soil and crop stage.',
    fertilizer:
      'Balanced fertilizer with adequate potassium supports tuber development.',
    tips: [
      'Use disease-free seed potatoes.',
      'Avoid waterlogging.',
      'Earth up the plants at the appropriate stage.',
      'Monitor for late blight and insect pests.'
    ]
  },

  Cotton: {
    season: 'Kharif',
    sowing: 'April – June',
    harvest: 'October – January',
    soil:
      'Deep, well-drained black or loamy soil is generally suitable.',
    irrigation:
      'Irrigation should depend on rainfall, soil and crop growth stage.',
    fertilizer:
      'Balanced nutrition with appropriate nitrogen and potassium is important.',
    tips: [
      'Use recommended varieties for your region.',
      'Maintain appropriate plant spacing.',
      'Monitor bollworm and sucking pests.',
      'Keep the field free from excessive weeds.'
    ]
  },

  Maize: {
    season: 'Kharif / Rabi / Zaid',
    sowing: 'June – July for Kharif',
    harvest: 'Approximately 80–120 days depending on variety',
    soil:
      'Well-drained fertile loamy soil is generally suitable.',
    irrigation:
      'Maintain adequate moisture, particularly during flowering and grain filling.',
    fertilizer:
      'Balanced nitrogen, phosphorus and potassium application is recommended.',
    tips: [
      'Use suitable high-quality seeds.',
      'Maintain proper plant spacing.',
      'Control weeds during early growth.',
      'Monitor for fall armyworm and other pests.'
    ]
  }
};

// ======================================================
// COMPONENT
// ======================================================

export default function CropAdvisory() {
  const [form, setForm] = useState({
    crop: '',
    soil: '',
    season: '',
    irrigation: '',
    area: '',
    location: ''
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // ----------------------------------------------------
  // FORM CHANGE
  // ----------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ----------------------------------------------------
  // CROP SELECTION
  // ----------------------------------------------------

  const handleCropSelection = (e) => {
    const crop = e.target.value;

    setForm((previous) => ({
      ...previous,
      crop,
      season: advisoryData[crop]?.season?.split(' / ')[0] || ''
    }));

    setResult(null);
    setError('');
  };

  // ----------------------------------------------------
  // GENERATE HARD-CODED ADVISORY
  // ----------------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    setResult(null);

    if (!form.crop) {
      setError('Please select a crop.');
      return;
    }

    const cropAdvisory = advisoryData[form.crop];

    if (!cropAdvisory) {
      setError('Advisory is not available for this crop.');
      return;
    }

    // Small delay to make the UI feel like an advisory
    // generation process.
    setTimeout(() => {
      setResult({
        ...cropAdvisory,
        selectedSoil: form.soil,
        selectedSeason: form.season,
        selectedIrrigation: form.irrigation,
        area: form.area,
        location: form.location
      });
    }, 500);
  };

  // ----------------------------------------------------
  // RESET
  // ----------------------------------------------------

  const resetAdvisory = () => {
    setForm({
      crop: '',
      soil: '',
      season: '',
      irrigation: '',
      area: '',
      location: ''
    });

    setResult(null);
    setError('');
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------

  return (
    <div className="advisory-page">

      {/* HEADER */}

      <header className="feature-header">
        <div>
          <span className="eyebrow">
            SMART AGRICULTURE
          </span>

          <h1>
            Crop <em>Advisory</em>
          </h1>

          <p>
            Get personalized farming guidance based on your
            crop, soil, season and irrigation conditions.
          </p>
        </div>

        <div className="feature-header-icon">
          <Sprout size={42} />
        </div>
      </header>

      <main className="advisory-container">

        {/* FORM */}

        <section className="advisory-form-card">

          <div className="feature-title">
            <div className="feature-icon">
              <Sprout size={21} />
            </div>

            <div>
              <h2>Tell us about your farm</h2>

              <p>
                Enter your farm details to receive
                personalized crop guidance.
              </p>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* CROP */}

              <div className="form-group">
                <label>Crop</label>

                <select
                  name="crop"
                  value={form.crop}
                  onChange={handleCropSelection}
                >
                  <option value="">
                    Select your crop
                  </option>

                  {Object.keys(advisoryData).map((crop) => (
                    <option
                      key={crop}
                      value={crop}
                    >
                      {crop}
                    </option>
                  ))}
                </select>
              </div>

              {/* SOIL */}

              <div className="form-group">
                <label>Soil Type</label>

                <select
                  name="soil"
                  value={form.soil}
                  onChange={handleChange}
                >
                  <option value="">
                    Select soil type
                  </option>

                  <option value="Loamy">
                    Loamy Soil
                  </option>

                  <option value="Clay">
                    Clay Soil
                  </option>

                  <option value="Sandy">
                    Sandy Soil
                  </option>

                  <option value="Black">
                    Black Soil
                  </option>

                  <option value="Red">
                    Red Soil
                  </option>
                </select>
              </div>

              {/* SEASON */}

              <div className="form-group">
                <label>Season</label>

                <select
                  name="season"
                  value={form.season}
                  onChange={handleChange}
                >
                  <option value="">
                    Select season
                  </option>

                  <option value="Kharif">
                    Kharif
                  </option>

                  <option value="Rabi">
                    Rabi
                  </option>

                  <option value="Zaid">
                    Zaid
                  </option>
                </select>
              </div>

              {/* IRRIGATION */}

              <div className="form-group">
                <label>
                  Irrigation Availability
                </label>

                <select
                  name="irrigation"
                  value={form.irrigation}
                  onChange={handleChange}
                >
                  <option value="">
                    Select availability
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Low">
                    Low
                  </option>
                </select>
              </div>

              {/* AREA */}

              <div className="form-group">
                <label>
                  Farm Area (acres)
                </label>

                <input
                  type="number"
                  name="area"
                  min="0"
                  step="0.1"
                  placeholder="Example: 2.5"
                  value={form.area}
                  onChange={handleChange}
                />
              </div>

              {/* LOCATION */}

              <div className="form-group">
                <label>
                  Farm Location
                </label>

                <div className="location-input">
                  <MapPin size={16} />

                  <input
                    type="text"
                    name="location"
                    placeholder="Example: Firozabad, Uttar Pradesh"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>

            <div className="advisory-form-actions">

              <button
                type="submit"
                className="btn btn-primary advisory-btn"
              >
                Get My Advisory
                <ArrowRight size={17} />
              </button>

              {result && (
                <button
                  type="button"
                  className="reset-btn"
                  onClick={resetAdvisory}
                >
                  Reset
                </button>
              )}

            </div>

          </form>
        </section>

        {/* RESULT */}

        {result && (
          <section className="advisory-result">

            <div className="result-heading">

              <div>
                <span className="eyebrow">
                  PERSONALIZED RECOMMENDATION
                </span>

                <h2>
                  {form.crop} Farming Advisory
                </h2>

                <p>
                  Advisory generated from the selected
                  crop and farming conditions.
                </p>
              </div>

              <div className="result-check">
                <CheckCircle2 size={28} />
              </div>

            </div>

            {/* FARM DETAILS */}

            <div className="advisory-info-grid">

              <div className="info-card">
                <CalendarDays />

                <span>Sowing Period</span>

                <strong>
                  {result.sowing}
                </strong>
              </div>

              <div className="info-card">
                <CalendarDays />

                <span>Harvest Period</span>

                <strong>
                  {result.harvest}
                </strong>
              </div>

              <div className="info-card">
                <Droplets />

                <span>Irrigation</span>

                <strong>
                  {form.irrigation || 'Not specified'}
                </strong>
              </div>

              <div className="info-card">
                <Sun />

                <span>Recommended Season</span>

                <strong>
                  {result.season}
                </strong>
              </div>

            </div>

            {/* DETAILS */}

            <div className="advisory-details">

              <div>
                <FlaskConical />

                <div>
                  <h3>
                    Soil & Fertilizer
                  </h3>

                  <p>
                    <strong>
                      Suitable soil:
                    </strong>{' '}
                    {result.soil}
                  </p>

                  <p>
                    <strong>
                      Fertilizer:
                    </strong>{' '}
                    {result.fertilizer}
                  </p>
                </div>
              </div>

              <div>
                <Droplets />

                <div>
                  <h3>
                    Irrigation Guidance
                  </h3>

                  <p>
                    {result.irrigation}
                  </p>
                </div>
              </div>

            </div>

            {/* FARM INFORMATION */}

            {(form.area || form.location || form.soil) && (
              <div className="farming-tips">

                <h3>
                  🌱 Your Farm Details
                </h3>

                <div>

                  {form.soil && (
                    <span>
                      <CheckCircle2 size={16} />
                      Soil: {form.soil}
                    </span>
                  )}

                  {form.area && (
                    <span>
                      <CheckCircle2 size={16} />
                      Area: {form.area} acres
                    </span>
                  )}

                  {form.location && (
                    <span>
                      <CheckCircle2 size={16} />
                      Location: {form.location}
                    </span>
                  )}

                </div>
              </div>
            )}

            {/* TIPS */}

            <div className="farming-tips">

              <h3>
                🌱 Smart Farming Tips
              </h3>

              <div>
                {result.tips.map((tip) => (
                  <span key={tip}>
                    <CheckCircle2 size={16} />
                    {tip}
                  </span>
                ))}
              </div>

            </div>

            {/* DISCLAIMER */}

            <div className="advisory-note">

              <strong>
                Important:
              </strong>

              <span>
                This advisory provides general agricultural
                guidance. For fertilizer quantities, pesticide
                use and crop-specific treatment, farmers should
                follow local agricultural department or qualified
                agricultural expert recommendations.
              </span>

            </div>

          </section>
        )}

      </main>
    </div>
  );
}