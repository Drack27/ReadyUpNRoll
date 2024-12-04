import './LoginPage.css'; 
import { useState } from 'react';
import { Link } from 'react-router-dom';
import megamind from './Megamind.png';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <header className="login-page-header">
        <h1>Welcome to ReadyUp & Roll!</h1>
      </header>

      <div className="login-content"> {/* Added a container for flexbox */}
        <div className="login-form"> {/* Left side */}
          <div className="input-group">
            <label htmlFor="email">
              Who the heck are ye? <br /> (Email or Username)
            </label>
            <input
              type="text"
              id="email"
              placeholder="I.E. coolguy@gmail.com"
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
        </div> 

        <div className="signup-section"> {/* Right side */}
          <h2>No Account?</h2>
          <img src={megamind} alt="Signup Illustration" className="signup-image" /> 
          <Link to="/signup" className="signup-button">Sign Up</Link> 
        </div>
      </div>
    </div>
  );
}

export default LoginPage;