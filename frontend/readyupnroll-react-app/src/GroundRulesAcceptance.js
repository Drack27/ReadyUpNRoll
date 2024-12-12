import React, { useState, useRef, useEffect } from 'react';
import TopBar from './TopBar';
import './GroundRulesAcceptance.css';

function GroundRulesAcceptance(props) {
  const { worldName, groundRulesText, passphraseWords, onJoin, onCancel } = props;
  const [passphraseInputs, setPassphraseInputs] = useState(['', '', '']);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const groundRulesRef = useRef(null);

  const handlePassphraseChange = (index, value) => {
    setPassphraseInputs(prevInputs => {
      const newInputs = [...prevInputs];
      newInputs[index] = value;
      return newInputs;
    });
  };

  const handleScroll = () => {
    if (groundRulesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = groundRulesRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight);
    }
  };

  useEffect(() => {
    // Check if all passphrase words are correct
    const arePassphrasesCorrect = passphraseWords && passphraseWords.every((word, index) => passphraseInputs[index] === word);
    setIsFormValid(arePassphrasesCorrect && isAtBottom);
  }, [passphraseInputs, isAtBottom, passphraseWords]);

  return (
    <div className="ground-rules-acceptance">
      <TopBar />

      <h1>Ground Rules & Expectations</h1>
      <h3>Before you join {worldName}, the GM requires you to read and accept the following rules, disclaimers, & expectations.</h3>

      <div className="ground-rules-text" ref={groundRulesRef} onScroll={handleScroll}>
        {groundRulesText} 
      </div>

      {/* Passphrase input fields */}
      {passphraseWords && passphraseWords.length > 0 ? (
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
        <button className="cancel-button" onClick={onCancel}>
          Nevermind, take me back to the world menu
        </button>
        <button className="join-button" onClick={onJoin} disabled={!isFormValid}>
          I've read it and agree. Lemme join!
        </button>
      </div>
    </div>
  );
}

export default GroundRulesAcceptance;