
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error('API URL is not configured.');
      }

      const response = await fetch(
        `${apiUrl.replace(/\/+$/, '')}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);

      setError(
        error.message === 'API URL is not configured.'
          ? 'Server configuration error. Please try again later.'
          : 'Unable to connect to server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="brand-mark">
            <Sprout size={22} />
          </div>

          <div>
            <strong>Kisan Setu</strong>
            <span>Smart Agriculture</span>
          </div>
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to access your smart farming dashboard.
        </p>

        {error && (
          <div className="auth-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              margin: '8px 0 16px'
            }}
          >
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
