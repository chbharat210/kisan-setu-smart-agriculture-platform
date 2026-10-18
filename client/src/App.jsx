```jsx
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import Dashboard from './pages/Dashboard';
import CropAdvisory from './pages/CropAdvisory';
import Weather from './pages/Weather';
import DiseaseDetection from './pages/DiseaseDetection';
import MandiPrices from './pages/MandiPrices';
import GovernmentSchemes from './pages/GovernmentSchemes';
import ExpertAdvice from './pages/ExpertAdvice';
import AIAssistant from './pages/AIAssistant';

import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from './DashboardLayout';

import './styles.css';

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
```
