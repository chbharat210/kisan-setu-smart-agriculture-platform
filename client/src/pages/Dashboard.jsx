import { useEffect, useState } from 'react';

import {
  Sprout,
  CloudSun,
  Bug,
  IndianRupee,
  Landmark,
  Bot,
  Bell,
  Plus,
  ArrowRight,
  LogOut,
  X,
  Pencil,
  Trash2
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

const quickServices = [
  {
    icon: Sprout,
    title: 'Crop Advisory',
    description: 'Get personalized crop guidance',
    path: '/crop-advisory'
  },
  {
    icon: CloudSun,
    title: 'Weather',
    description: 'Check weather & farming alerts',
    path: '/weather'
  },
  {
    icon: Bug,
    title: 'Disease Detection',
    description: 'Analyze your crop health',
    path: '/disease-detection'
  },
  {
    icon: IndianRupee,
    title: 'Mandi Prices',
    description: 'Check current market prices',
    path: '/mandi-prices'
  },
  {
    icon: Landmark,
    title: 'Government Schemes',
    description: 'Explore farmer benefits',
    path: '/government-schemes'
  },
  {
    icon: Bot,
    title: 'AI Farming Assistant',
    description: 'Ask your farming questions',
    path: '/ai-assistant'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [crops, setCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [cropError, setCropError] = useState('');

  const [showCropForm, setShowCropForm] = useState(false);
  const [addingCrop, setAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);

  const [cropForm, setCropForm] = useState({
    name: '',
    season: 'Rabi',
    status: 'Growing',
    health: 'Healthy'
  });

  const userName = user?.name || 'Farmer';
  const userEmail = user?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();

  // =========================================
  // FETCH CROPS
  // =========================================

  const fetchCrops = async () => {
    try {
      setLoadingCrops(true);
      setCropError('');

      const token = localStorage.getItem('token');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/crops/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch crops.'
        );
      }

      setCrops(data);
    } catch (error) {
      console.error('Crop fetch error:', error);
      setCropError(error.message);
    } finally {
      setLoadingCrops(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // =========================================
  // FORM INPUT
  // =========================================

  const handleCropChange = (e) => {
    setCropForm({
      ...cropForm,
      [e.target.name]: e.target.value
    });
  };

  // =========================================
  // OPEN ADD FORM
  // =========================================

  const openAddForm = () => {
    setEditingCropId(null);

    setCropForm({
      name: '',
      season: 'Rabi',
      status: 'Growing',
      health: 'Healthy'
    });

    setCropError('');
    setShowCropForm(true);
  };

  // =========================================
  // OPEN EDIT FORM
  // =========================================

  const openEditForm = (crop) => {
    setEditingCropId(crop._id);

    setCropForm({
      name: crop.name,
      season: crop.season,
      status: crop.status,
      health: crop.health
    });

    setCropError('');
    setShowCropForm(true);
  };

  // =========================================
  // CLOSE FORM
  // =========================================

  const closeCropForm = () => {
    setShowCropForm(false);
    setEditingCropId(null);

    setCropForm({
      name: '',
      season: 'Rabi',
      status: 'Growing',
      health: 'Healthy'
    });
  };

  // =========================================
  // ADD / UPDATE CROP
  // =========================================

  const handleCropSubmit = async (e) => {
    e.preventDefault();

    if (!cropForm.name.trim()) {
      setCropError('Please enter a crop name.');
      return;
    }

    try {
      setAddingCrop(true);
      setCropError('');

      const token = localStorage.getItem('token');

      const url = editingCropId
        ? `${import.meta.env.VITE_API_URL}/api/crops/${editingCropId}`
        : `${import.meta.env.VITE_API_URL}/api/crops`;

      const method = editingCropId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cropForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${
              editingCropId ? 'update' : 'add'
            } crop.`
        );
      }

      closeCropForm();
      await fetchCrops();
    } catch (error) {
      console.error('Crop save error:', error);
      setCropError(error.message);
    } finally {
      setAddingCrop(false);
    }
  };

  // =========================================
  // DELETE CROP
  // =========================================

  const handleDeleteCrop = async (cropId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this crop?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setCropError('');

      const token = localStorage.getItem('token');

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/crops/${cropId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete crop.'
        );
      }

      await fetchCrops();
    } catch (error) {
      console.error('Delete crop error:', error);
      setCropError(error.message);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  return (
    <div className="dashboard">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="dashboard-header">

        <div>
          <span className="eyebrow">
            FARMER DASHBOARD
          </span>

          <h1>
            Welcome back, {userName}! 👋
          </h1>

          <p>
            Here's what's happening with your farm today.
          </p>
        </div>

        <div className="dashboard-header-actions">

          <button className="notification-btn">
            <Bell size={20} />
            <span></span>
          </button>

          <div className="user-profile">

            <div className="user-avatar">
              {userInitial}
            </div>

            <div>
              <strong>{userName}</strong>

              <span>
                {userEmail || 'My Profile'}
              </span>
            </div>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </header>


      {/* =====================================
          STATS
      ===================================== */}

      <section className="dashboard-stats">

        <div className="dashboard-stat">

          <div className="stat-icon">
            <CloudSun size={20} />
          </div>

          <div>
            <span>Today's Weather</span>
            <strong>28°C</strong>
            <small>Partly cloudy</small>
          </div>

        </div>


        <div className="dashboard-stat">

          <div className="stat-icon">
            <Sprout size={20} />
          </div>

          <div>
            <span>My Crops</span>
            <strong>{crops.length}</strong>
            <small>Active crops</small>
          </div>

        </div>


        <div className="dashboard-stat">

          <div className="stat-icon">
            <IndianRupee size={20} />
          </div>

          <div>
            <span>Wheat Price</span>
            <strong>₹2,450</strong>
            <small>Per quintal</small>
          </div>

        </div>


        <div className="dashboard-stat">

          <div className="stat-icon">
            <Bug size={20} />
          </div>

          <div>
            <span>Crop Health</span>
            <strong>92%</strong>
            <small>Looking healthy</small>
          </div>

        </div>

      </section>


      {/* =====================================
          SMART SERVICES
      ===================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>
            <h2>Smart Services</h2>

            <p>
              Everything you need for better farming decisions.
            </p>
          </div>

        </div>


        <div className="quick-service-grid">

          {quickServices.map(
            ({
              icon: Icon,
              title,
              description,
              path
            }) => (

              <Link
                to={path}
                className="quick-service-card"
                key={title}
              >

                <div className="quick-service-icon">
                  <Icon size={21} />
                </div>

                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>

                <ArrowRight size={17} />

              </Link>

            )
          )}

        </div>

      </section>


      {/* =====================================
          MY CROPS
      ===================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>
            <h2>My Crops</h2>

            <p>
              Monitor your current crops and their health.
            </p>
          </div>

          <button
            className="add-crop-btn"
            onClick={openAddForm}
          >
            <Plus size={16} />
            Add Crop
          </button>

        </div>


        {/* CROP FORM */}

        {showCropForm && (

          <div className="crop-form-card">

            <div className="crop-form-header">

              <div>

                <h3>
                  {editingCropId
                    ? 'Edit Crop'
                    : 'Add New Crop'}
                </h3>

                <p>
                  {editingCropId
                    ? 'Update your crop information.'
                    : 'Add a crop to your farm.'}
                </p>

              </div>

              <button
                type="button"
                className="crop-form-close"
                onClick={closeCropForm}
              >
                <X size={18} />
              </button>

            </div>


            <form onSubmit={handleCropSubmit}>

              <div className="crop-form-grid">

                {/* CROP NAME */}

                <div className="form-group">

                  <label>
                    Crop Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Wheat"
                    value={cropForm.name}
                    onChange={handleCropChange}
                  />

                </div>


                {/* SEASON */}

                <div className="form-group">

                  <label>
                    Season
                  </label>

                  <select
                    name="season"
                    value={cropForm.season}
                    onChange={handleCropChange}
                  >

                    <option value="Rabi">
                      Rabi
                    </option>

                    <option value="Kharif">
                      Kharif
                    </option>

                    <option value="Zaid">
                      Zaid
                    </option>

                    <option value="Winter">
                      Winter
                    </option>

                    <option value="Summer">
                      Summer
                    </option>

                  </select>

                </div>


                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={cropForm.status}
                    onChange={handleCropChange}
                  >

                    <option value="Growing">
                      Growing
                    </option>

                    <option value="Recently Planted">
                      Recently Planted
                    </option>

                    <option value="Flowering">
                      Flowering
                    </option>

                    <option value="Harvest Ready">
                      Harvest Ready
                    </option>

                    <option value="Harvested">
                      Harvested
                    </option>

                  </select>

                </div>


                {/* HEALTH */}

                <div className="form-group">

                  <label>
                    Health
                  </label>

                  <select
                    name="health"
                    value={cropForm.health}
                    onChange={handleCropChange}
                  >

                    <option value="Healthy">
                      Healthy
                    </option>

                    <option value="Good">
                      Good
                    </option>

                    <option value="Needs Attention">
                      Needs Attention
                    </option>

                    <option value="Poor">
                      Poor
                    </option>

                  </select>

                </div>

              </div>


              {/* FORM ACTIONS */}

              <div className="crop-form-actions">

                <button
                  type="button"
                  className="crop-cancel-btn"
                  onClick={closeCropForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={addingCrop}
                >

                  {addingCrop
                    ? 'Saving...'
                    : editingCropId
                    ? 'Update Crop'
                    : 'Add Crop'}

                </button>

              </div>

            </form>

          </div>

        )}


        {/* ERROR */}

        {cropError && (
          <div className="auth-error">
            {cropError}
          </div>
        )}


        {/* LOADING */}

        {loadingCrops && (
          <div className="crop-empty">
            Loading your crops...
          </div>
        )}


        {/* NO CROPS */}

        {!loadingCrops &&
          !cropError &&
          crops.length === 0 && (

            <div className="crop-empty">

              <Sprout size={28} />

              <strong>
                No crops added yet
              </strong>

              <p>
                Add your first crop to start tracking it.
              </p>

            </div>

          )}


        {/* CROP TABLE */}

        {!loadingCrops &&
          !cropError &&
          crops.length > 0 && (

            <div className="crop-table">

              <div className="crop-table-header">

                <span>Crop</span>
                <span>Season</span>
                <span>Status</span>
                <span>Health</span>
                <span>Actions</span>

              </div>


              {crops.map((crop) => (

                <div
                  className="crop-row"
                  key={crop._id}
                >

                  <div className="crop-name">

                    <div>
                      <Sprout size={18} />
                    </div>

                    <strong>
                      {crop.name}
                    </strong>

                  </div>


                  <span>
                    {crop.season}
                  </span>


                  <span className="status-badge">
                    {crop.status}
                  </span>


                  <span className="health-badge">
                    ✓ {crop.health}
                  </span>


                  <div className="crop-actions">

                    <button
                      className="crop-edit-btn"
                      onClick={() =>
                        openEditForm(crop)
                      }
                      title="Edit crop"
                    >
                      <Pencil size={15} />
                    </button>


                    <button
                      className="crop-delete-btn"
                      onClick={() =>
                        handleDeleteCrop(crop._id)
                      }
                      title="Delete crop"
                    >
                      <Trash2 size={15} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

      </section>

    </div>
  );
}