import React from 'react';
import { Link } from 'react-router-dom';

function SuccessPage() {
  return (
    <div className="success-page">
      <h1>Account successfully created! Heck yeah!</h1>
      <Link to="/login">
        <button>Return to Login</button>
      </Link>
    </div>
  );
}

export default SuccessPage;