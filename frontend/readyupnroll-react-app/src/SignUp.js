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
  
    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Password:', password);
  
    try {
      const response = await fetch('/api/users', { // Send a POST request to your backend API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
  
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return; // Stop further execution
      }

      if (response.ok) {
        // Account creation successful
        // Redirect to success page
        window.location.href = '/success';
      } else {
        // Account creation failed
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to create account'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };
  return (
    <div   
 className="signup-page">
      <header className="signup-page-header">
        <h1>Create An Account</h1>
      </header>

      <div className="signup-content"> {/* Container for form and avatar */}
      <form className="signup-form" onSubmit={handleSubmit}> 
        {
      <><div className="input-group">
              <label htmlFor="email">What's your email?</label>
              <input
                type="email"
                id="email"
                placeholder="I.E.: coolguy@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}/>
              </div>
              
              <div className="input-group">
                <label htmlFor="password">
                  Come up with a password. Cool Passwords only.
                </label>
                <div className="password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
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
                    value={confirmPassword} // Bind to state
                    onChange={(e) => setConfirmPassword(e.target.value)} // Update state on change
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
              <div className="avatar-container">
          {/* Add your avatar display and upload functionality here */}
          <img src="default-avatar.png" alt="Avatar" /> {/* Placeholder */}
          <button>Upload Avatar</button>
        </div>
      </div{'>'}

      <button type="submit" className="create-account-button">
        BRING ME INTO EXISTENCE! <br />
        (click to finish & create account)
      </button>
    </div>
    </>
    }   
        </form>

        
  );
}
export default SignupPage;