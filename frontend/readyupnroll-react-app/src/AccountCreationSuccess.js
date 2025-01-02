import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

function AccountCreationSuccess() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(''); // Assuming you have profile images
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setUsername(data.username);
            setEmail(data.email);
            setProfileImage(data.profileImage); // Assuming your API sends profile image URL
          } else {
            console.error('Failed to fetch user data:', response.status);
            // Consider handling the error, maybe redirect to login or an error page
            navigate('/login'); 
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Similar error handling as above
        }
      }
    };

    fetchUserData();
  }, [navigate]); // Add navigate to the dependency array

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
          {profileImage ? (
            <img src={profileImage} alt="Profile Image" />
          ) : (
            <img src="placeholder.png" alt="Profile Image" />
          )}
        </div>
        <p>
          <strong>Username:</strong> <span className="username">{username}</span>
        </p>
        <p>
          <strong>Email:</strong> <span className="email">{email}</span>
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