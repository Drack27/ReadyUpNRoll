import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './JoinWorld.css'; 
import logo from './logo.svg';

function JoinWorld() {
  const navigate = useNavigate();
  const [privateWorldCode, setPrivateWorldCode] = useState('');
  const [publicWorlds, setPublicWorlds] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 

  {/* 
    useEffect(() => {
    const fetchPublicWorlds = async () => {
      try {
        const response = await fetch('/api/worlds/public'); 
        const data = await response.json();
        setPublicWorlds(data);
      } catch (error) {
        console.error('Error fetching public worlds:', error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchPublicWorlds();
  }, []);
  */}

  const handleCodeChange = (event) => {
    setPrivateWorldCode(event.target.value);
  };

  const handleJoinPrivateWorld = async () => {
    try {
      const response = await fetch('/api/worlds/joinPrivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: privateWorldCode }),
      });

      if (response.ok) {
        // Handle successful join (e.g., redirect to the world page)
        const data = await response.json();
        navigate(`/world/${data.worldId}`); // Redirect to the joined world
      } else {
        // Handle error (e.g., display an error message)
      }
    } catch (error) {
      console.error('Error joining private world:', error);
      // Handle error
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredWorlds = publicWorlds.filter((world) => {
    const search = searchTerm.toLowerCase();
    return (
      world.name.toLowerCase().includes(search) ||
      world.gmUsername.toLowerCase().includes(search) ||
      world.tagline.toLowerCase().includes(search) // Assuming you have a tagline
    );
  });

  // Placeholder world data (remove this when you have real data)
  const placeholderWorlds = [
    {
      id: 1,
      name: "The Forgotten Realms",
      tagline: "Adventure awaits in Faerûn!",
      gmUsername: "DungeonMasterDan",
      thumbnailImages: [
        "https://via.placeholder.com/300x200?text=Forgotten+Realms+1",
        "https://via.placeholder.com/300x200?text=Forgotten+Realms+2",
        "https://via.placeholder.com/300x200?text=Forgotten+Realms+3",
      ],
    },
    {
      id: 2,
      name: "Cyberpunk City",
      tagline: "High-tech low-life in Neo-Tokyo",
      gmUsername: "CyberpunkGM",
      thumbnailImages: [
        "https://via.placeholder.com/300x200?text=Cyberpunk+City+1",
        "https://via.placeholder.com/300x200?text=Cyberpunk+City+2",
      ],
    },
  ];

  // Combine real and placeholder data (remove placeholderWorlds later)
  const worldsToDisplay = publicWorlds.length > 0 ? publicWorlds : placeholderWorlds;

  return (
    <div className="join-world-page">
      {/* Header */}
      <header className="join-world-header">
        <div className="header-left">
          <img src={logo} alt="ReadyUp & Roll Logo" className="logo" />
          <div className="header-buttons">
            <Link to="/settings">
              <button>Settings</button>
            </Link>
            <button>Log Out</button>
            <button onClick={() => navigate('/')}>Return to Home Screen</button>
          </div>
        </div>
        <div className="header-right">
          <img src="avatar.png" alt="User Avatar" className="avatar" />
        </div>
      </header>

      {/* Join World Content */}
      <div className="join-world-content">
        <h1>Join a World</h1>

        {/* Private World Code */}
        <div className="private-world-section">
          <label htmlFor="privateWorldCode">
            Enter a single-use code for a Private World:
          </label>
          <input
            type="text"
            id="privateWorldCode"
            value={privateWorldCode}
            onChange={handleCodeChange}
          />
          <button onClick={handleJoinPrivateWorld}>Join Private World</button>
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
        {placeholderWorlds.map((world) => (
            <div key={world.id} className="world-card">
            <div className="thumbnail-container">
                {/* Implement animated thumbnail here (example with simple fade-in/out) */}
                {world.thumbnailImages.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`${world.name} thumbnail ${index + 1}`}
                    style={{ 
                    animation: `fade 4s infinite ${index * 2}s`, /* Stagger animations */
                    position: 'absolute',  // Required for overlapping images
                    }}
                />
                ))}
            </div>
            <h3>{world.name}</h3>
            <p className="gm-subtitle">GM: {world.gmUsername}</p>
            <Link to={`/world/${world.id}/join`}>
                <button>View Details/Membership</button>
            </Link>
            </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default JoinWorld;