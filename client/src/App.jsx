
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

import Dashboard from './pages/Dashboard.jsx';
import CropAdvisory from './pages/CropAdvisory.jsx';
import Weather from './pages/Weather.jsx';
import DiseaseDetection from './pages/DiseaseDetection.jsx';
import MandiPrices from './pages/MandiPrices.jsx';
import GovernmentSchemes from './pages/GovernmentSchemes.jsx';
import ExpertAdvice from './pages/ExpertAdvice.jsx';
import AIAssistant from './pages/AIAssistant.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardLayout from './DashboardLayout.jsx';

import './styles.css';
```

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Protected dashboard pages */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/crop-advisory"
          element={<CropAdvisory />}
        />

        <Route
          path="/weather"
          element={<Weather />}
        />

        <Route
          path="/disease-detection"
          element={<DiseaseDetection />}
        />

        <Route
          path="/mandi-prices"
          element={<MandiPrices />}
        />

        <Route
          path="/government-schemes"
          element={<GovernmentSchemes />}
        />

        <Route
          path="/expert-advice"
          element={<ExpertAdvice />}
        />

        <Route
          path="/ai-assistant"
          element={<AIAssistant />}
        />
      </Route>

      {/* Invalid URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;

