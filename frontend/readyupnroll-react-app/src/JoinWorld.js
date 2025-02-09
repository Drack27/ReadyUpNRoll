import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './JoinWorld.css';
import TopBar from './TopBar';

function JoinWorld() {
    const navigate = useNavigate();
    const [invitedWorlds, setInvitedWorlds] = useState([]); // State for invited worlds
    const [publicWorlds, setPublicWorlds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null); // State for handling errors

    useEffect(() => {
        const fetchInvitedWorlds = async () => {
            try {

                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsplayer/invitedlist`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // THIS LINE IS CRITICAL
                        'Content-Type': 'application/json', // You likely need this too
                    },
                }); 
                if (!response.ok) {
                    if (response.status === 404) {
                        setInvitedWorlds([]); // No invites found, set to empty array
                        return;
                    }
                    throw new Error(`Failed to fetch invited worlds: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setInvitedWorlds(data);
            } catch (error) {
                console.error('Error fetching invited worlds:', error);
                setError(error); // Set error state to display message
            }
        };

        const fetchPublicWorlds = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsplayer/publiclist`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch public worlds: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setPublicWorlds(data);
            } catch (error) {
                console.error('Error fetching public worlds:', error);
                setError(error); // Set error state to display message
            }
        };

        fetchInvitedWorlds();
        fetchPublicWorlds();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredWorlds = publicWorlds.filter((world) => {
        const search = searchTerm.toLowerCase();
        return (
            world.name?.toLowerCase().includes(search) || // Optional chaining to handle potential null/undefined
            world.gmUsername?.toLowerCase().includes(search) ||
            world.tagline?.toLowerCase().includes(search)
        );
    });

    if (error) {
        return <div className="join-world-page error-message">Error loading worlds. Please try again later.</div>; // Simple error display
    }

    return (
        <div className="join-world-page">
            <TopBar></TopBar>

            {/* Join World Content */}
            <div className="join-world-content">
                <h1>Join a World</h1>

                {/* Invited Worlds List */}
                <div className="invited-worlds-section">
                    <h2>Worlds You've Been Invited To</h2>
                    {invitedWorlds.length > 0 ? (
                        <div className="invited-world-list">
                            {invitedWorlds.map((world) => (
                                <div key={world.id} className="invited-world-card">
                                    <h3>{world.name}</h3>
                                    <p className="tagline">{world.tagline}</p>
                                    <Link to={`/WorldDetailsPlayer/${world.id}`}>
                                        <button>View Details</button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No world invitations yet.</p>
                    )}
                </div>

                <div className="separator">OR</div> {/* Large "OR" separator */}

                {/* Public World Gallery */}
                <h2>Search/Browse for a Public World</h2>

                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search worlds..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="public-world-gallery">
                    {filteredWorlds.map((world) => (
                        <div key={world.id} className="world-card">
                            <div className="thumbnail-container">
                                {/* Animated thumbnail (if you want to keep it) */}
                                {/* {world.thumbnailImages && world.thumbnailImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${world.name} thumbnail ${index + 1}`}
                                        style={{
                                            animation: `fade 4s infinite ${index * 2}s`,
                                            position: 'absolute',
                                        }}
                                    />
                                ))} */}
                                {/* Replace with a single default thumbnail or the first image */}
                                {world.thumbnailImages && world.thumbnailImages.length > 0 ? (
                                    <img
                                        src={world.thumbnailImages[0]} // Use the first thumbnail or a default
                                        alt={`${world.name} thumbnail`}
                                    />
                                ) : (
                                    <div className="no-thumbnail">No Thumbnail</div> // Placeholder if no thumbnail
                                )}
                            </div>
                            <h3>{world.name}</h3>
                            <p className="gm-subtitle">GM: {world.gmUsername}</p>
                            <p className="tagline">{world.tagline}</p> {/* Add tagline here */}
                            <Link to={`/WorldDetailsPlayer/${world.id}`}>
                                <button>View Details</button>
                            </Link>
                        </div>
                    ))}
                    {filteredWorlds.length === 0 && searchTerm && (
                        <div className="no-worlds-message">No public worlds found matching your search.</div>
                    )}
                    {publicWorlds.length === 0 && !searchTerm && (
                         <div className="no-worlds-message">No public worlds available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JoinWorld;