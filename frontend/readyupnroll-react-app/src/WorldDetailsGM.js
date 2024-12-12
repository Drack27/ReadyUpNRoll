import React, { useState, useEffect } from 'react';
import './WorldDetailsGM.css';
import logo from './logo.svg';
import { Link, useNavigate, useParams } from 'react-router-dom';
function WorldDetailsGM() {
  const navigate = useNavigate();
  const { worldId } = useParams(); // Get worldId from URL if editing
  const [worldData, setWorldData] = useState({
    name: '',
    tagline: '',
    description: '',
    visibility: 'public', 
    thumbnailImages: [],
    disclaimers: '',
    playersNeeded: 5,
    requireAllPlayersForSessionZero: false,
    gameSystems: [],
    modules: [],
  });
  // Fetch existing world data if editing
  useEffect(() => {
    const fetchWorldData = async () => {
      if (worldId) {
        try {
          const response = await fetch(`/api/worlds/${worldId}`);
          const data = await response.json();
          setWorldData(data);
        } catch (error) {
          console.error('Error fetching world data:', error);
          // Handle error (e.g., show an error message)
        }
      }
    };
    fetchWorldData();
  }, [worldId]);
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setWorldData({
      ...worldData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  const handleImageAdd = (newImage) => {
    setWorldData({
      ...worldData,
      thumbnailImages: [...worldData.thumbnailImages, newImage],
    });
  };
  const handleGameSystemAdd = (newSystem) => {
    setWorldData({
      ...worldData,
      gameSystems: [...worldData.gameSystems, newSystem],
    });
  };
  const handleModuleAdd = (newModule) => {
    setWorldData({
      ...worldData,
      modules: [...worldData.modules, newModule],
    });
  };
  const handleRemoveItem = (list, index) => {
    setWorldData({
      ...worldData,
      [list]: worldData[list].filter((_, i) => i !== index),
    });
  };
  const handleCancel = () => {
    navigate('/'); // Go back to home screen
  };
  const handlePreview = () => {
    // Implement preview functionality (e.g., open a modal or new tab)
  };
  const handleFinish = async () => {
    try {
      const response = await fetch('/api/worlds', { 
        method: worldId ? 'PUT' : 'POST', // PUT for edit, POST for create
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(worldData),
      });
      if (response.ok) {
        navigate('/'); // Go back to home screen after successful save
      } else {
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error saving world data:', error);
      // Handle error
    }
  };
  return (
    <div className="world-details-page">
      {/* Header */}
      <header className="world-details-header">
        <div className="header-left">
          <img src={logo} alt="ReadyUp & Roll Logo" className="logo" />
          <div className="header-buttons">
            <Link to="/settings">
              <button>Settings</button>
            </Link>
            <button>Log Out</button>
            <button onClick={handleCancel}>Return to Home Screen</button>
          </div>
        </div>
        <div className="header-right">
          <img src="avatar.png" alt="User Avatar" className="avatar" />
        </div>
      </header>
      {/* World Details Content */}
      <div className="world-details-content">
        <h1>World Details</h1>
{/* ... inside world-details-content ... */}
{/* Name */}
<div className="input-group">
  <label htmlFor="name">Name:</label>
  <input
    type="text"
    id="name"
    name="name"
    maxLength="15"
    placeholder="My Cool RPG Setting"
    value={worldData.name}
    onChange={handleInputChange}
  />
</div>
{/* Tagline */}
<div className="input-group">
  <label htmlFor="tagline">Descriptive Tagline:</label>
  <input
    type="text"
    id="tagline"
    name="tagline"
    maxLength="30"
    placeholder="The realm where cool people go"
    value={worldData.tagline}
    onChange={handleInputChange}
  />
</div>
{/* Description */}
<div className="input-group">
  <label htmlFor="description">Description:</label>
  <textarea
    id="description"
    name="description"
    value={worldData.description}
    onChange={handleInputChange}
  />
</div>
{/* Visibility */}
<div className="input-group">
  <label htmlFor="visibility">Visibility:</label>
  <div> {/* Use a div to wrap the radio buttons */}
    <label>
      <input
        type="radio"
        id="visibility-public"
        name="visibility"
        value="public"
        checked={worldData.visibility === 'public'}
        onChange={handleInputChange}
      />
      Public (anyone can find and join your World)
    </label>
    <br /> {/* Add a line break for better readability */}
    <label>
      <input
        type="radio"
        id="visibility-private"
        name="visibility"
        value="private"
        checked={worldData.visibility === 'private'}
        onChange={handleInputChange}
      />
      Private (you have to invite players to join)
    </label>
  </div>
</div>
{/* Thumbnail Images */}
<div className="input-group">
  <label htmlFor="thumbnailImages">Add Thumbnail Images:</label>
  <input
    type="file"
    id="thumbnailImages"
    name="thumbnailImages"
    multiple // Allow multiple file selection
    accept="image/*" // Accept only image files
    onChange={(e) => {
      // Handle image uploads and update worldData.thumbnailImages
      // (Implementation will depend on your image handling logic)
      // Example:
      // Array.from(e.target.files).forEach(file => {
      //   const reader = new FileReader();
      //   reader.onload = () => handleImageAdd(reader.result);
      //   reader.readAsDataURL(file);
      // });
    }}
  />
  <div className="thumbnail-gallery">
    <ul>
      {worldData.thumbnailImages.map((image, index) => (
        <li key={index}>
          <img src={image} alt={`Thumbnail ${index + 1}`} />
        </li>
      ))}
    </ul>
  </div>
</div>
{/* Disclaimers */}
<div className="input-group">
  <label htmlFor="disclaimers">
    Disclaimers, Expectations, Ground Rules, Lines & Veils, etc.:
  </label>
  <textarea
    id="disclaimers"
    name="disclaimers"
    value={worldData.disclaimers}
    onChange={handleInputChange}
  />
</div>
{/* Number of Players Needed */}
<div className="input-group">
  <label htmlFor="playersNeeded">
    Number of players needed to book a session:
  </label>
  <input
    type="range"
    id="playersNeeded"
    name="playersNeeded"
    min="1"
    max="10"
    value={worldData.playersNeeded}
    onChange={handleInputChange}
  />
  <span>{worldData.playersNeeded}</span> {/* Display the selected value */}
</div>
{/* Require All Players for Session Zero */}
<div className="input-group">
  <label>
    <input
      type="checkbox"
      name="requireAllPlayersForSessionZero"
      checked={worldData.requireAllPlayersForSessionZero}
      onChange={handleInputChange}
    />
    Require all players for session zero?
  </label>
</div>
{/* Playable Game Systems */}
<div className="input-group">
  <h2>Playable Game System(s) In this World</h2>
  <button onClick={() => {/* Open "Add Game System" dialog */}}>
    Add Game System
  </button>
  <ul>
    {worldData.gameSystems.map((system, index) => (
      <li key={index}>
        <h3>{system.title}</h3>
        <p>{system.description}</p>
        <button onClick={() => handleRemoveItem('gameSystems', index)}>
          Remove
        </button>
      </li>
    ))}
  </ul>
</div>
{/* Modules */}
<div className="input-group">
  <h2>Module(s) in this World</h2>
  <button onClick={() => {/* Open "Add Module" dialog */}}>
    Add Module
  </button>
  <ul>
    {worldData.modules.map((module, index) => (
      <li key={index}>
        <h3>{module.title}</h3>
        <p>{module.description}</p>
        <button onClick={() => handleRemoveItem('modules', index)}>
          Remove
        </button>
      </li>
    ))}
  </ul>
</div>
{/* Buttons */}
<div className="button-group">
  <button onClick={handleCancel}>Cancel</button>
  <button onClick={handlePreview}>Preview Players' View</button>
  <button onClick={handleFinish}>Finish</button>
</div>
      </div>
    </div>
  );
}
export default WorldDetailsGM;