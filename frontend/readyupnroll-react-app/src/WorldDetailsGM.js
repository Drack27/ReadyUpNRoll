import React, { useState, useEffect } from 'react';
import './WorldDetailsGM.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TopBar from './TopBar';

function WorldDetailsGM() {
  const navigate = useNavigate();
  const { worldId } = useParams();
  const [worldData, setWorldData] = useState({
    name: '',
    tagline: '',
    description: '',
    visibility: 'public',
    // thumbnailImages: [],
    disclaimers: '',
    playersNeeded: 5,
    requireAllPlayersForSessionZero: false,
    game_system: '',
    game_system_description: '',
    modules: [],
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNewWorld, setIsNewWorld] = useState(false); 

    const handleAddModule = () => {
        const newModuleId = Date.now(); // Simple unique ID
        setWorldData({
            ...worldData,
            modules: [
                ...worldData.modules,
                { id: newModuleId, name: '', description: '' }
            ]
        });
    };

    const handleRemoveModule = (moduleId) => {
        setWorldData({
            ...worldData,
            modules: worldData.modules.filter(m => m.id !== moduleId)
        });
    };

    // Fetch user ID
    useEffect(() => {
        const fetchUserId = async () => {
            const token = localStorage.getItem('token');
            console.log("token:", token);
            if (token) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    console.log("Response status:", response.status);

                    if (response.ok) {
                        const data = await response.json();
                        setUserId(data.id);
                        console.log("userId set to", data.id);
                    } else {
                        const errorData = await response.text();
                        console.error("Failed to fetch user data:", errorData);
                        if (response.status === 401) {
                            navigate('/login');
                        } else {
                            alert("Failed to fetch user data. Please try again later.");
                        }
                    }
                } catch (error) {
                    console.error("Caught error fetching user ID:", error);
                }
            } else {
                console.error("Token not found in localStorage.");
                navigate('/login');
            }
        };

        fetchUserId();
    }, []);

    // Determine if it's a new world or an existing one
    useEffect(() => {
        setIsNewWorld(worldId === 'new');
    }, [worldId]);

     // Fetch existing world data based on worldId
  useEffect(() => {
    const fetchWorldData = async () => {
        if (worldId && worldId !== 'new') {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsgm/${worldId}`);
                if (response.ok) {
                    const data = await response.json();
                    data.players_needed = parseInt(data.players_needed, 10);
                    data.require_all_players_for_session_zero = data.require_all_players_for_session_zero === 1;
                    data.modules = typeof data.modules === 'string' ? JSON.parse(data.modules) : data.modules;

                    setWorldData(data);
                } else {
                    console.error('Error fetching world data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching world data:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    fetchWorldData();
}, [worldId]);

    /*
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = (e) => {
                newImages.push(e.target.result);
                if (newImages.length === files.length) {
                    setWorldData({
                        ...worldData,
                        thumbnailImages: [...worldData.thumbnailImages, ...newImages]
                    });
                }
            };

            reader.readAsDataURL(file);
        });
    };
    */
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setWorldData({
            ...worldData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
   
    /*
    const handleRemoveImage = (index) => {
        setWorldData({
            ...worldData,
            thumbnailImages: worldData.thumbnailImages.filter((_, i) => i !== index)
        });
    };
    */

    const handleCancel = () => {
        navigate('/home');
    };

    const handlePreview = () => {
        navigate('/WorldDetailsPlayer')    
    };

    const handleFinish = async () => {
        // Basic validation:
        if (!worldData.name.trim()) {
            alert("Your world needs a name my doggie");
            return;
        }

        if (!worldData.tagline.trim()) {
            alert("Don't forget a tagline!");
            return;
        }

        if (!worldData.disclaimers.trim()) {
            alert("You should really add some ground rules. Communication is key.");
            return;
        }

        // ... more validation ...

        if (userId) {
            setLoading(true);
            try {
                const requestData = {
                    ...worldData,
                    gm_id: userId,
                    players_needed: parseInt(worldData.playersNeeded, 10),
                    require_all_players_for_session_zero: worldData.requireAllPlayersForSessionZero ? 1 : 0,
                    modules: JSON.stringify(worldData.modules.map(({ id, ...rest }) => rest)), // Remove IDs from modules before sending
                };

                let response;
                if (isNewWorld) {
                    // Create new world
                    response = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsgm`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestData),
                    });
                } else {
                    // Update existing world
                    response = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsgm/${worldId}`, {
                        method: 'PUT', // Use PUT for updates
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestData),
                    });
                }

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.message);
                    navigate('/home'); // Redirect to home screen after saving
                } else {
                    console.error('Error saving world data:', response.status);
                }
            } catch (error) {
                console.error('Error saving world data:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.error("Cannot save world data. User ID not available.");
        }
    };
  
  return (
    <div className="world-details-page">
        <TopBar></TopBar>
        <div className="world-details-content">
        {/* Update the title based on isNewWorld */}
        <h1>{isNewWorld ? 'Create New World' : 'World Details'}</h1>

            {/* Name */}
            <div className="input-group">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    maxLength="30"
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
                    maxLength="45"
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
                <div>
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
                    <br />
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

{/*
            // Thumbnail Images 
            <div className="input-group">
                <label htmlFor="thumbnailImages">Add Thumbnail Images:</label>
                <input
                    type="file"
                    id="thumbnailImages"
                    name="thumbnailImages"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <div className="thumbnail-gallery">
                    <ul>
                        {worldData.thumbnailImages.map((image, index) => (
                            <li key={index}>
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                                <button onClick={() => handleRemoveImage(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
           */}

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
                <span>{worldData.playersNeeded}</span>
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
                    Require all players for first meeting?
                </label>
            </div>

            {/* Playable Game Systems */}
            <div className="input-group">
                <h2>Game System for this World</h2>
                <div className="input-group">
                    <label htmlFor="game_system">Game System:</label>
                    <input
                        type="text"
                        id="game_system"
                        name="game_system"
                        placeholder="D&D 5e, Minecraft, Pure 'yes, and', etc."
                        value={worldData.game_system}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="game_system_description">Game System Description:</label>
                    <textarea
                        id="game_system_description"
                        name="game_system_description"
                        placeholder="Brief description of the game system and any house rules."
                        value={worldData.game_system_description}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Modules */}
            <div className="input-group">
                <h2>Modules players may encounter in this World</h2>
                <p>(Modules = adventures, mods, content packs, scenarios, plot threads, etc.)</p>
                <button onClick={handleAddModule}>
                    Add Module
                </button>
                <ul>
                    {worldData.modules.map((module) => (
                        <li key={module.id}>
                            <label htmlFor={`module-${module.id}-name`}>Name:</label>
                            <input
                                type="text"
                                id={`module-${module.id}-name`}
                                name={`module-${module.id}-name`}
                                placeholder="Curse of Strahd, the Tortle Package, etc."
                                value={module.name}
                                onChange={(e) => {
                                    const updatedModules = worldData.modules.map(m =>
                                        m.id === module.id ? { ...m, name: e.target.value } : m
                                    );
                                    setWorldData({ ...worldData, modules: updatedModules });
                                }}
                            />
                            <label htmlFor={`module-${module.id}-description`}>Description:</label>
                            <textarea
                                id={`module-${module.id}-description`}
                                name={`module-${module.id}-description`}
                                value={module.description}
                                onChange={(e) => {
                                    const updatedModules = worldData.modules.map(m =>
                                        m.id === module.id ? { ...m, description: e.target.value } : m
                                    );
                                    setWorldData({ ...worldData, modules: updatedModules });
                                }}
                            />
                            <button onClick={() => handleRemoveModule(module.id)}>
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
                <button onClick={handleFinish} disabled={!userId || loading}>
                    {loading ? "Saving..." : "Finish"}
                </button>
            </div>
        </div>
    </div>
);
}

export default WorldDetailsGM;