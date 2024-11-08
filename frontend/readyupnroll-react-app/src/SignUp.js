import React, { useState } from 'react';
import './SignUp.css'; // Import your CSS file

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);   

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword]   
 = useState('');

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  const toggleConfirmPasswordVisibility   
 = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const email = event.target.email.value;
    const username = event.target.username.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
  
    try {
      const response = await fetch('/api/users', { // Send a POST request to your backend API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
  
      if (response.ok) {
        // Account creation successful
        // ... (handle success, e.g., redirect to login page) ...
      } else {
        // Account creation failed
        const errorData = await response.json();
        // ... (handle error, e.g., display error message) ...
      }
    } catch (error) {
      // ... (handle network or other errors) ...
    }
  }
  return (
    <div   
 className="signup-page">
      <header className="signup-page-header">
        <h1>Create An Account</h1>
      </header>

      <div className="signup-content"> {/* Container for form and avatar */}
      <form className="signup-form" onSubmit={handleSubmit}> {/* Moved the closing curly brace */}
  <div className="input-group">
    <label htmlFor="email">What's your email?</label>
    <input
      type="email"
      id="email"
      placeholder="I.E.: coolguy@gmail.com"
    />
  </div>

          <div className="input-group">
            <label htmlFor="username">
              Come up with a username. Bonus points if it's dog related.
            </label>
            <input
              type="text"
              id="username"
              placeholder="I.E. DiceDawg27"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              Come up with a password. Cool Passwords only.
            </label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
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

          <div className="input-group">
            <label htmlFor="confirmPassword">
              You sure you want that as your password? Prove it - type it again.
            </label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
              />
              <button
                type="button"
                className="show-password-button"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </form>

        <div className="avatar-container">
          {/* Add your avatar display and upload functionality here */}
          <img src="default-avatar.png" alt="Avatar" /> {/* Placeholder */}
          <button>Upload Avatar</button>
        </div>
      </div>

      <button type="submit" className="create-account-button">
        BRING ME INTO EXISTENCE! <br />
        (click to finish & create account)
      </button>
    </div>
  );
}
export default SignupPage;