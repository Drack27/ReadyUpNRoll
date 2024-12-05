import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

function AccountCreationSuccess() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <header>
        <h1>Account Successfully Created!</h1>
      </header>

      <main>
        <h2>This is you:</h2>
        <div className="profile-image">
          <img src="placeholder.png" alt="Profile Image" />
        </div>
        <p>
          <strong>Username:</strong>{' '}
          <span className="username">placeholder_username</span>
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <span className="email">placeholder_email</span>
        </p>
        <p>
          <strong>Password:</strong>{' '}
          <span className="password">
            {showPassword ? 'placeholder_password' : '********'}
          </span>
          <button className="show-password" onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </p>
      </main>

      <footer>
        <Link to="/login" className="return-button">
          Return to Login
        </Link>
      </footer>
    </div>
  );
}

export default AccountCreationSuccess;