import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom'; // Import Navigate

function ProtectedRoute() {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // Initialize as null
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');

            if (token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                // Use Navigate component instead of navigate() directly
                // navigate('/login'); // REMOVE THIS LINE
            }
        };

        checkLoginStatus();
    }, [navigate]); // Add navigate to the dependency array

    // Handle the loading state explicitly
    if (isLoggedIn === null) {
        return <div>Loading...</div>; // Or a more sophisticated loading indicator
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;