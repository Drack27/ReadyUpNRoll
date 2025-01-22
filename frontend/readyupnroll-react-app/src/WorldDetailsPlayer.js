import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./WorldDetailsPlayer.css";
import TopBar from "./TopBar";
 

function WorldDetailsPlayer() {
  const { worldId } = useParams(); // Get the worldId from the URL
    const navigate = useNavigate();
    const [worldData, setWorldData] = useState(null);
    //const [isPreview, setIsPreview] = useState(false); // New state for preview mode
    const [userIsMember, setUserIsMember] = useState(false); // New state for membership
    //const queryParams = new URLSearchParams(window.location.search);

    /*const handleExitPreview = () => {
      // Construct the URL with the worldId
      const worldDetailsGMUrl = `/worldsgm/${worldId}`; 
    
      // Navigate back to WorldDetailsGM
      navigate(worldDetailsGMUrl);
    };*/

 {/*
          // Fetch world details based on worldId
        const response = await fetch(`/api/worlds/${worldId}`);
        const data = await response.json();
        setWorldData(data);
        */}

        useEffect(() => {
         /* 
         console.log("Is preview? Before setting:", isPreview); // Add this line
        const queryParams = new URLSearchParams(window.location.search);
        setIsPreview(queryParams.get("preview") === "true");
        console.log("Is preview? After setting:", isPreview); // Add this line
        */
          const fetchWorldData = async () => {
            try {
              // This is where you'll eventually fetch data from your API
              // For now, we're using placeholder data:
        
              const placeholderWorld = {
                id: 1,
                name: "The Forgotten Realms",
                tagline: "Adventure awaits in Faerûn!",
                gmUsername: "DungeonMasterDan",
                thumbnailImages: [
                  "https://via.placeholder.com/300x200?text=Forgotten+Realms+1",
                  "https://via.placeholder.com/300x200?text=Forgotten+Realms+2",
                  "https://via.placeholder.com/300x200?text=Forgotten+Realms+3",
                ],
                description:
                  "Welcome to the Forgotten Realms, a world of magic, mystery, and adventure! " +
                  "Explore the vast continent of Faerûn, where ancient empires rise and fall, " +
                  "dragons soar through the skies, and heroes are forged in the fires of conflict. " +
                  "Join our campaign and create your own legend!",
                gameSystems: [
                  {
                    title: "Dungeons & Dragons 5th Edition",
                    description: "The latest edition of the world's most popular role-playing game."
                  }
                ],
                modules: [
                  {
                    title: "Lost Mine of Phandelver",
                    description: "A classic introductory adventure for new players."
                  },
                  {
                    title: "Curse of Strahd",
                    description: "A gothic horror adventure in the domain of the vampire Strahd von Zarovich."
                  }
                ],
                players: [
                  { username: "AellaTheArcher" },
                  { username: "BardicInspiration" },
                  { username: "GrognakTheBarbarian" },
                ],
              };
        
              setWorldData(placeholderWorld); // Set the world data in state
        
              // Check if the user is a member of this world (replace with your actual logic)
              const isMember = await checkUserMembership(worldId);
              setUserIsMember(isMember);
        
            } catch (error) {
              console.error("Error fetching world data:", error);
              // Handle error (e.g., show an error message)
            }
          };
        
          fetchWorldData();
        }, []); // Run the effect whenever worldId changes

  // Placeholder for checking user membership
  const checkUserMembership = async (worldId) => {
    // Replace with your actual logic to check if the current user
    // is a member of the world with the given worldId.
    // This might involve an API call to your backend.
    // For now, let's simulate it with a random value:
    return Math.random() < 0.5; // 50% chance of being a member
  };

  if (!worldData) {
    return <div>Loading...</div>; // Or a more informative loading state
  }

  return (
    <div className="world-details-page">
        {/* Header */}
        <header className="world-details-header">
            {/* ... (same as before) ... */}
        </header>

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
                <ul>
                    {worldData.gameSystems.map((system, index) => (
                        <li key={index}>{system.title}</li>
                    ))}
                </ul>

                {/* Modules */}
                <h3>Module(s):</h3>
                <ul>
                    {worldData.modules.map((module, index) => (
                        <li key={index}>{module.title}</li>
                    ))}
                </ul>

                {/* GM and Player Info */}
                <p>GM: {worldData.gmUsername}</p>
                <p>Current Players: {worldData.players.length}</p>
                <h3>Players:</h3>
                <ul>
                    {worldData.players.map((player, index) => (
                        <li key={index}>{player.username}</li> // Assuming you have a player object with a username property
                    ))}
                </ul>
            </div>

            {/* Calendar */}
            <div className="world-calendar">
                {/* Implement or replace with your calendar component */}
                <p>Calendar Placeholder</p>
            </div>

            {/* Buttons */}
            <div className="world-buttons">

                {/* Back to World Menu button
                 {!isPreview && ( 
                    <button onClick={() => navigate("/join-world")}>
                        Back to World Menu
                    </button>

                    

                })}
                 {isPreview && ( 
                    <button disabled>
                        Back to World Menu
                    </button>
                 })} */}

                {/* Join This World button */}
                {/* {!isPreview && */} {userIsMember === false && (
                    <button onClick={() => {/* Handle join world logic */}}>
                        Join This World
                    </button>
                )}
                {/*
                {isPreview && (
                    <button disabled>
                        Join This World
                    </button>
                )}
                    */}

                {/* Enter Availability / Leave This World buttons */}
                {userIsMember && (
                    <>
                        <button onClick={() => {/* Handle enter availability logic */}}>
                            Enter Availability
                        </button>
                        <button onClick={() => {/* Handle leave world logic */}}>
                            Leave This World
                        </button>
                    </>
                )}

                {/* Exit Preview button 
                {isPreview && (
                    <button onClick={handleExitPreview}>
                        Exit Preview
                    </button>
                )}
                    */}
            </div>
        </div>
    </div>
);
}

export default WorldDetailsPlayer;