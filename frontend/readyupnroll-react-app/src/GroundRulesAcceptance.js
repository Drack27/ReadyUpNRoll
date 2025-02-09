import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import './GroundRulesAcceptance.css';

function GroundRulesAcceptance() {
    const { worldId } = useParams();
    const navigate = useNavigate();
    const [groundRulesText, setGroundRulesText] = useState('');
    const [passphraseWords, setPassphraseWords] = useState([]);
    const [passphraseInputs, setPassphraseInputs] = useState(['', '', '']);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const groundRulesRef = useRef(null);
    const [worldName, setWorldName] = useState('');

    useEffect(() => {
        const fetchWorldData = async () => {
            // ... (same as before) ...
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsplayer/${worldId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("World not found");
                    } else if (response.status === 401) {
                        navigate('/login');
                        return;
                    } else if (response.status === 403){
                        throw new Error("You are not authorized to do this.")
                    }
                     else {
                        throw new Error(`Failed to fetch world data: ${response.status}`);
                    }
                }

                const data = await response.json();
                setWorldName(data.name); // Set the world name
                setGroundRulesText(data.ground_rules || ''); // Handle potentially missing ground rules
                setPassphraseWords(data.passphrase ? data.passphrase.split(' ') : []);
                setPassphraseInputs(Array(data.passphrase ? data.passphrase.split(' ').length : 0).fill('')); // Initialize input array
            } catch (error) {
                setError(error.message);
                console.error("Error fetching world data:", error);
            } finally {
                setLoading(false);
            }

        };

        fetchWorldData();
    }, [worldId, navigate]);

    const handlePassphraseChange = (index, value) => {
        // ... (same as before) ...
        setPassphraseInputs(prevInputs => {
            const newInputs = [...prevInputs];
            newInputs[index] = value;
            return newInputs;
        });
    };

    // No more handleScroll!

    const handleJoin = async () => {
        // ... (same as before) ...
        if (!isFormValid) return; // Prevent joining if form is invalid

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/worldsplayer/${worldId}/join`, { // Correct endpoint
                method: 'POST', // Use POST for joining
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                // You *don't* need to send the passphrase in the request body.  The server already knows it.
            });

            if (!response.ok) {
                const errorData = await response.json(); // Get error details
                throw new Error(`Failed to join world: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }
            // Success! Navigate to a confirmation page or back to the home screen.
            alert("You've successfully joined the world!"); //Consider removing or changing the message.
            navigate('/home'); // Or any other appropriate route

        } catch (error) {
            setError(error.message);
            console.error("Error joining world:", error);
        }
    };

    const handleCancel = () => {
        // ... (same as before) ...
        navigate('/join-world'); // Go back to the world selection screen

    };

    useEffect(() => {
        const arePassphrasesCorrect = passphraseWords.every((word, index) =>
            passphraseInputs[index].toLowerCase() === word.toLowerCase()
        );

        // Check if content is scrollable, and update isAtBottom accordingly
        let atBottom = false;
        if (groundRulesRef.current) {
            const { scrollHeight, clientHeight } = groundRulesRef.current;
            atBottom = scrollHeight <= clientHeight; // If not scrollable, we're at the bottom
             if(!atBottom){
               const { scrollTop } = groundRulesRef.current;
                atBottom = scrollTop + clientHeight >= scrollHeight - 5;
             }
        }

        setIsFormValid(arePassphrasesCorrect && atBottom);
    }, [passphraseInputs, passphraseWords, groundRulesText, isAtBottom]); // Include isAtBottom


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="ground-rules-acceptance">
            <TopBar />

            <h1>Ground Rules & Expectations</h1>
            <h3>Before you join {worldName}, the GM requires you to read and accept the following rules, disclaimers, & expectations.</h3>

            <div className="ground-rules-text" ref={groundRulesRef}  style={{ overflowY: 'scroll', height: '300px', border: '1px solid #ccc', padding: '10px' }}>
                {groundRulesText || <p>No ground rules have been set for this world.</p>}
            </div>

            {/* Passphrase input fields */}
            {passphraseWords.length > 0 ? (
                passphraseWords.map((word, index) => (
                    <div key={index}>
                        <label htmlFor={`passphrase-${index + 1}`}>Passphrase word {index + 1}:</label>
                        <input
                            type="text"
                            id={`passphrase-${index + 1}`}
                            value={passphraseInputs[index]}
                            onChange={e => handlePassphraseChange(index, e.target.value)}
                        />
                    </div>
                ))
            ) : (
                <p className="no-passphrase-message">No passphrase words required for this world.</p>
            )}

            <div className="buttons">
                <button className="cancel-button" onClick={handleCancel}>
                    Nevermind, take me back to the world menu
                </button>
                <button className="join-button" onClick={handleJoin} disabled={!isFormValid}>
                    I've read it and agree. Lemme join!
                </button>
            </div>
        </div>
    );
}

export default GroundRulesAcceptance;