import { useState } from 'react';

import {
  Upload,
  Image as ImageIcon,
  Bug,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Sprout
} from 'lucide-react';

// ======================================================
// HARD-CODED DISEASE DATA
// ======================================================

const diseaseData = {
  Wheat: {
    disease: 'Wheat Leaf Rust',
    confidence: 89,
    status: 'Possible rust symptoms',
    symptoms:
      'Orange or reddish-brown pustules on wheat leaves can be associated with rust diseases.',
    prevention:
      'Use recommended varieties, maintain field monitoring and follow regional disease-management recommendations.',
    action:
      'Inspect surrounding plants and consult an agricultural expert for appropriate disease-management measures.'
  },

  Rice: {
    disease: 'Rice Blast',
    confidence: 91,
    status: 'Possible fungal disease symptoms',
    symptoms:
      'Diamond-shaped or spindle-shaped lesions may appear on leaves, often with gray centers and darker margins.',
    prevention:
      'Use healthy seed, maintain proper plant spacing and avoid excessive nitrogen application.',
    action:
      'Monitor the field carefully and seek local agricultural guidance if symptoms spread rapidly.'
  },

  Maize: {
    disease: 'Maize Leaf Blight',
    confidence: 88,
    status: 'Possible leaf blight symptoms',
    symptoms:
      'Long grayish or brown lesions on maize leaves may indicate a common leaf blight condition.',
    prevention:
      'Use recommended varieties, maintain field sanitation and avoid excessive moisture around plants.',
    action:
      'Remove severely affected plant material where appropriate and consult an agricultural expert.'
  },

  Potato: {
    disease: 'Potato Leaf Blight',
    confidence: 91,
    status: 'Possible fungal infection',
    symptoms:
      'Dark spots and browning on leaves can be associated with potato blight.',
    prevention:
      'Maintain proper field sanitation, avoid excessive leaf moisture and monitor plants regularly.',
    action:
      'Remove severely affected plant material where appropriate and seek local agricultural guidance.'
  },

  Tomato: {
    disease: 'Tomato Leaf Disease',
    confidence: 94,
    status: 'Possible infection detected',
    symptoms:
      'Leaf discoloration, spots or curling may indicate a common tomato disease.',
    prevention:
      'Maintain good field ventilation, avoid excessive moisture on leaves and remove severely affected plant parts.',
    action:
      'Monitor nearby plants and consult a local agricultural expert before applying any crop-protection product.'
  },

  Cotton: {
    disease: 'Cotton Leaf Spot',
    confidence: 90,
    status: 'Possible fungal or bacterial leaf symptoms',
    symptoms:
      'Brown or dark spots on cotton leaves may be associated with common leaf-spot conditions.',
    prevention:
      'Maintain proper field sanitation, monitor crop health regularly and avoid unnecessary leaf wetness.',
    action:
      'Inspect nearby plants and consult a qualified agricultural expert before using crop-protection products.'
  }
};

// ======================================================
// COMPONENT
// ======================================================

export default function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState('');
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // ----------------------------------------------------
  // IMAGE UPLOAD
  // ----------------------------------------------------

  const handleImageUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleFileChange = (e) => {
    handleImageUpload(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    handleImageUpload(file);
  };

  // ----------------------------------------------------
  // HARD-CODED ANALYSIS
  // ----------------------------------------------------

  const analyzeImage = () => {
    if (!image) {
      alert('Please upload a crop image first.');
      return;
    }

    if (!crop) {
      alert('Please select the crop type.');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setResult(diseaseData[crop]);
      setAnalyzing(false);
    }, 1500);
  };

  // ----------------------------------------------------
  // RESET
  // ----------------------------------------------------

  const resetDetection = () => {
    setImage(null);
    setPreview(null);
    setCrop('');
    setResult(null);
    setAnalyzing(false);
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------

  return (
    <div className="disease-page">

      {/* HEADER */}

      <header className="feature-header disease-header">

        <div>
          <span className="eyebrow">
            SMART AGRICULTURE
          </span>

          <h1>
            Crop Disease <em>Detection</em>
          </h1>

          <p>
            Upload a crop image and get information about
            possible diseases, symptoms and preventive actions.
          </p>
        </div>

        <div className="feature-header-icon">
          <Bug size={42} />
        </div>

      </header>

      <main className="disease-container">

        {/* UPLOAD CARD */}

        <section className="disease-upload-card">

          <div className="feature-title">

            <div className="feature-icon">
              <ImageIcon size={21} />
            </div>

            <div>
              <h2>
                Analyze your crop
              </h2>

              <p>
                Upload a clear image of the affected leaf or crop.
              </p>
            </div>

          </div>

          {/* UPLOAD */}

          {!preview && (

            <label
              className="upload-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />

              <div className="upload-icon">
                <Upload size={28} />
              </div>

              <h3>
                Upload your crop image
              </h3>

              <p>
                Drag & drop an image here or click to browse
              </p>

              <span>
                JPG, JPEG or PNG
              </span>

            </label>

          )}

          {/* PREVIEW */}

          {preview && (

            <div className="image-preview-section">

              <div className="image-preview">

                <img
                  src={preview}
                  alt="Uploaded crop"
                />

                <button
                  className="remove-image"
                  onClick={resetDetection}
                  type="button"
                >
                  ×
                </button>

              </div>

              <div className="analysis-options">

                <div className="form-group">

                  <label>
                    Select Crop
                  </label>

                  <select
                    value={crop}
                    onChange={(e) => {
                      setCrop(e.target.value);
                      setResult(null);
                    }}
                  >

                    <option value="">
                      Select crop type
                    </option>

                    <option value="Wheat">
                      Wheat
                    </option>

                    <option value="Rice">
                      Rice
                    </option>

                    <option value="Maize">
                      Maize
                    </option>

                    <option value="Potato">
                      Potato
                    </option>

                    <option value="Tomato">
                      Tomato
                    </option>

                    <option value="Cotton">
                      Cotton
                    </option>

                  </select>

                </div>

                <button
                  className="btn btn-primary analyze-btn"
                  onClick={analyzeImage}
                  disabled={analyzing}
                >

                  {analyzing ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="spin"
                      />

                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bug size={17} />

                      Analyze Crop
                    </>
                  )}

                </button>

              </div>

            </div>

          )}

        </section>

        {/* INSTRUCTIONS */}

        {!result && !preview && (

          <section className="detection-info">

            <div className="detection-info-card">

              <div>
                <ShieldCheck size={22} />
              </div>

              <h3>
                Use a clear image
              </h3>

              <p>
                Make sure the affected leaf or crop is clearly
                visible and well lit.
              </p>

            </div>

            <div className="detection-info-card">

              <div>
                <Sprout size={22} />
              </div>

              <h3>
                Focus on the affected area
              </h3>

              <p>
                Take a close-up photo of visible spots,
                discoloration or damage.
              </p>

            </div>

            <div className="detection-info-card">

              <div>
                <AlertTriangle size={22} />
              </div>

              <h3>
                Verify the result
              </h3>

              <p>
                Use detection results as guidance and confirm
                serious cases with an agricultural expert.
              </p>

            </div>

          </section>

        )}

        {/* RESULT */}

        {result && (

          <section className="disease-result">

            <div className="result-heading">

              <div>

                <span className="eyebrow">
                  ANALYSIS COMPLETE
                </span>

                <h2>
                  {result.disease}
                </h2>

                <p>
                  {result.status}
                </p>

              </div>

              <div className="result-check">
                <CheckCircle2 size={28} />
              </div>

            </div>

            <div className="disease-result-grid">

              {/* IMAGE */}

              <div className="disease-image-result">

                <img
                  src={preview}
                  alt="Analyzed crop"
                />

              </div>

              {/* DETAILS */}

              <div className="disease-result-details">

                {/* CONFIDENCE */}

                <div className="confidence-card">

                  <span>
                    Detection Confidence
                  </span>

                  <strong>
                    {result.confidence}%
                  </strong>

                  <div className="confidence-bar">

                    <span
                      style={{
                        width: `${result.confidence}%`
                      }}
                    />

                  </div>

                </div>

                {/* SYMPTOMS */}

                <div className="result-detail-card">

                  <AlertTriangle size={19} />

                  <div>

                    <h3>
                      Symptoms
                    </h3>

                    <p>
                      {result.symptoms}
                    </p>

                  </div>

                </div>

                {/* PREVENTION */}

                <div className="result-detail-card">

                  <ShieldCheck size={19} />

                  <div>

                    <h3>
                      Prevention
                    </h3>

                    <p>
                      {result.prevention}
                    </p>

                  </div>

                </div>

                {/* ACTION */}

                <div className="result-detail-card">

                  <Sprout size={19} />

                  <div>

                    <h3>
                      Recommended Action
                    </h3>

                    <p>
                      {result.action}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* WARNING */}

            <div className="detection-warning">

              <strong>
                Important:
              </strong>

              <span>
                This is an informational detection interface.
                Disease identification should be verified by a
                qualified agricultural expert before applying
                pesticides or other crop-protection products.
              </span>

            </div>

            {/* RESET */}

            <button
              className="reset-detection-btn"
              onClick={resetDetection}
            >

              <RefreshCw size={16} />

              Analyze Another Image

            </button>

          </section>

        )}

      </main>

    </div>
  );
}