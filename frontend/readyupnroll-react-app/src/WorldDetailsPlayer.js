import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./WorldDetailsPlayer.css";
import TopBar from "./TopBar";


function WorldDetailsPlayer() {
    const { worldId } = useParams(); // Get the worldId from the URL
    const navigate = useNavigate();
    const [worldData, setWorldData] = useState(null);
    const [userIsMember, setUserIsMember] = useState(false); // New state for membership
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state


    useEffect(() => {

        const fetchWorldData = async () => {
            setLoading(true); // Set loading to true before fetching
            setError(null);    // Clear any previous errors
            try {
              const token = localStorage.getItem('token'); // Get the token
            console.log("Token retrieved from localStorage:", token); // LOG THE TOKEN
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsplayer/${worldId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Send the token
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    // Handle 404 and other errors more gracefully
                    if (response.status === 404) {
                        throw new Error("World not found"); // Specific error message
                    } else if (response.status === 401) {
                        navigate('/login'); // Redirect to login if unauthorized
                        return;
                    }
                    else if (response.status === 403) {
                        throw new Error("You are not authorized to view this world.");
                    }
                    else {
                        throw new Error(`Failed to fetch world data: ${response.status}`);
                    }
                }

                const data = await response.json();
                setWorldData(data); // Set the world data in state
                setUserIsMember(data.isMember); // Set the membership status

            } catch (error) {
                console.error("Error fetching world data:", error);
                setError(error.message); // Set the error message
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchWorldData();
    }, [worldId, navigate]); // Run the effect whenever worldId changes.  Include navigate in dependency array

    // Join World logic (Placeholder - you'll need to implement this)
    const handleJoinWorld = async () => {
      alert("Join world functionality not yet implemented.");
    }

    // Leave World logic (Placeholder - you'll need to implement this)
    const handleLeaveWorld = async () => {
       alert("Leave world functionality not yet implemented.");
    }

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message
    }

    if (!worldData) {
        return <div>World not found.</div>; // Handle case where world is not found (shouldn't happen with 404 handling)
    }

    return (
        <div className="world-details-page">
            <TopBar />
            {/* World Details Content */}
            <div className="world-details-content">
                {/* World Name Title */}
                <h1 className="world-name-title">{worldData.name}</h1>

                {/* Image Carousel/Panorama */}
                <div className="world-image-carousel">
                    {/* Implement your image carousel/panorama here */}
                    {worldData.thumbnailImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${worldData.name} thumbnail ${index + 1}`}
                        />
                    ))}
                </div>

                {/* World Details */}
                <div className="world-details-section">
                    <h2>{worldData.name}</h2>
                    <p className="world-tagline">{worldData.tagline}</p>
                    <p className="world-description">{worldData.description}</p>

                    {/* Game Systems */}
                    <h3>Game System(s):</h3>
                        {worldData.gameSystem}
                    <br></br>
                    {worldData.gameSystemDescription}

                    {/* Modules */}
                    <h3>Module(s):</h3>
                    <ul>
                        {worldData.modules.map((module, index) => (
                            <li key={index}>{module.name}</li>
                        ))}
                    </ul>

                    {/* GM and Player Info */}
                    <p>GM: {worldData.gmUsername}</p>
                    {/*<p>Current Players: {worldData.players.length}</p> */}  {/*You don't have a players array yet!*/}

                    {/* Buttons */}
                    <div className="world-buttons">
                        <button onClick={() => navigate("/join-world")}>
                            Back to World Menu
                        </button>

                        {!worldData.isGM && !userIsMember && (
                            <button onClick={handleJoinWorld}>
                                Join This World
                            </button>
                        )}

                        {userIsMember && !worldData.isGM && (
                            <>
                                <button onClick={() => { /* Handle enter availability logic */ }}>
                                    Enter Availability
                                </button>
                                <button onClick={handleLeaveWorld}>
                                    Leave This World
                                </button>
                            </>
                        )}
                         {worldData.isGM && (<button onClick={() => navigate(`/worlddetailsgmedit/${worldData.id}`)}>Edit World</button>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorldDetailsPlayer;