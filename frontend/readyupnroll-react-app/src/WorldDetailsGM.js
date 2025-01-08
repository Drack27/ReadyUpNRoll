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
    gameSystem: '', 
    gameSystemDescription: '',
    modules: [],
  });
  const handleAddModule = () => {
    setWorldData({
      ...worldData,
      modules: [
        ...worldData.modules,
        { name: '', description: '' } // Add a new module with empty fields
      ]
    });
  };
  const [userId, setUserId] = useState(null); // Add state to store userId

// Fetch user ID (replace with your actual logic to get the user ID)
useEffect(() => {
  const fetchUserId = async () => {
    // ... your logic to fetch the logged-in user's ID ...
    // Example (if using local storage):
    const storedUserId = localStorage.getItem('userId'); 
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10)); 
    }
  };
  fetchUserId();
}, []);

  // Fetch existing world data if editing
  useEffect(() => {
    const fetchWorldData = async () => {
      if (worldId) {
        try {
          const response = await fetch(`/api/worldsgm/${worldId}`); // Updated route
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach(file => {
      const reader = new FileReader();

      reader.onload = (e) => {
        newImages.push(e.target.result); // Add the data URL to the array

        // Update the state only after all images are processed
        if (newImages.length === files.length) {
          setWorldData({
            ...worldData,
            thumbnailImages: [...worldData.thumbnailImages, ...newImages]
          });
        }
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    });
  };

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
      gameSystem: [...worldData.gameSystem, newSystem],
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
      // Prepare data for the request
      const requestData = { 
        ...worldData,
        gm_id: userId, // Include the user ID
        players_needed: parseInt(worldData.playersNeeded, 10), // Convert to number
        require_all_players_for_session_zero: worldData.requireAllPlayersForSessionZero ? 1 : 0, // Convert to 1 or 0
      };
      requestData.modules = JSON.stringify(worldData.modules); 


      let response;
      if (worldId) { // Editing an existing world
        requestData.id = parseInt(worldId, 10); // Include the world ID for updates
        response = await fetch('/api/worldsgm', { // Updated route
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
      } else { // Creating a new world
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsgm`, { // Updated route
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
      }

      if (response.ok) {
        // Handle success (e.g., show a success message, redirect)
        const data = await response.json();
        if (!worldId) {
          // If creating a new world, update the worldId in state 
          // to allow editing immediately after creation
          setWorldData({ ...worldData, id: data.worldId }); 
        }
        console.log(data.message); // Log success message from server
        navigate('/'); 
      } else {
        // Handle error (e.g., show an error message)
        console.error('Error saving world data:', response.status);
      }
    } catch (error) {
      console.error('Error saving world data:', error);
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
    onChange={handleImageChange}
      // Handle image uploads and update worldData.thumbnailImages
      // (Implementation will depend on your image handling logic)
      // Example:
      // Array.from(e.target.files).forEach(file => {
      //   const reader = new FileReader();
      //   reader.onload = () => handleImageAdd(reader.result);
      //   reader.readAsDataURL(file);
      // });
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
  <h2>Game System for this World</h2>
  <div className="input-group">
        <label htmlFor="gameSystem">Game System:</label>
        <input
          type="text"
          id="gameSystem"
          name="gameSystem"
          placeholder="D&D 5e, Pathfinder, etc."
          value={worldData.gameSystem}
          onChange={handleInputChange}
        />
      </div>
      <div className="input-group">
        <label htmlFor="gameSystemDescription">Game System Description:</label>
        <textarea
          id="gameSystemDescription"
          name="gameSystemDescription"
          placeholder="Brief description of the game system and any house rules."
          value={worldData.gameSystemDescription}
          onChange={handleInputChange}
        />
      </div>
</div>
{/* Modules */}
<div className="input-group">
        <h2>Module(s) Players May Encounter</h2>
        <button onClick={handleAddModule}> {/* Use the new function */}
          Add Module
        </button>
        <ul>
          {worldData.modules.map((module, index) => (
            <li key={index}>
              {/* Input fields for module name and description */}
              <label htmlFor={`modules[${index}].name`}>Name:</label> {/* Label for name */}
              <input
                type="text"
                name={`modules[${index}].name`} // Use array syntax for names
                placeholder="Curse of Strahd, the Tortle Package, etc."
                value={module.name}
                onChange={(e) => {
                  const updatedModules = [...worldData.modules];
                  updatedModules[index].name = e.target.value;
                  setWorldData({ ...worldData, modules: updatedModules });
                }}
              />
              <label htmlFor={`modules[${index}].description`}>Description:</label> {/* Label for description */}
              <textarea
                name={`modules[${index}].description`} // Use array syntax for names
                
                value={module.description}
                onChange={(e) => {
                  const updatedModules = [...worldData.modules];
                  updatedModules[index].description = e.target.value;
                  setWorldData({ ...worldData, modules: updatedModules });
                }}
              />
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