```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'https://kisan-setu-smart-agriculture-platform.onrender.com/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email.trim() })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Unable to process your request.');
        return;
      }

      setMessage(
        data.message ||
        'If your account exists, you will receive password reset instructions by email.'
      );
    } catch (err) {
      setError('Unable to connect to the server. Please try again.');
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

        <h1>Forgot Password?</h1>

        <p className="auth-subtitle">
          Enter your registered email to receive a password reset link.
        </p>

        {error && <div className="auth-error">{error}</div>}

        {message && (
          <div role="status" style={{ marginBottom: '16px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password?{' '}
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
```
