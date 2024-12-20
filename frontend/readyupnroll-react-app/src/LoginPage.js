import './LoginPage.css'; 
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import megamind from './Megamind.png';

function LoginPage() {
  const [email, setEmail] = useState(''); // Add state for email/username
  const [password, setPassword] = useState(''); // Add state for password
  const [error, setError] = useState(null); // Add state for error messages
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(null);

    try {
      console.log('Request body:', { email: email, username: email, password: password }); // Log the request body with email and username
    
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, username: email, password: password }), // Send email and password as both email and username
      });

      const data = await response.json(); // Read the response only once

      if (!response.ok) {
        // Display the errors from the response
        setError(data.errors.join(' ')); 
        return; // Stop further execution
      }
    
      const token = data.token; // Now data is defined in this scope

      // Store the JWT (e.g., in local storage)
      localStorage.setItem('token', token);

      // Redirect to a protected page (e.g., the home page)
      navigate('/home'); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <header className="login-page-header">
        <h1>Welcome to ReadyUp & Roll!</h1>
      </header>
  
      <div className="login-content">
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">
                Who the heck are ye? <br /> (Email or Username)
              </label>
              <input
                type="text"
                id="email"
                placeholder="I.E. coolguy@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
  
            <div className="input-group">
              <label htmlFor="password">
                What's the magic word? <br /> (Password)
              </label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="I.E. DiceD@wg27"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="show-password-button"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
  
            <button type="submit" className="submit-button">
              LEMME IN
            </button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
  
        <div className="signup-section">
          <h2>No Account?</h2>
          <img src={megamind} alt="Signup Illustration" className="signup-image" />
          <Link to="/signup" className="signup-button">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;