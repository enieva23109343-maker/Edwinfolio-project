// pages/GamePage.js
import React, { useState, useEffect, useCallback } from 'react';

function GamePage() {
  const [words] = useState(["PROGRAM", "SOFTWARE", "DEVELOPER", "PYTHON", "JAVASCRIPT", "MOBILE", "PUZZLE", "GAMING"]);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Try to unscramble the word!");
  const [gameActive, setGameActive] = useState(true);

  const shuffleWord = (word) => {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  };

  const newPuzzle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const newWord = words[randomIndex];
    setCurrentWord(newWord);
    setScrambledWord(shuffleWord(newWord));
    setUserGuess("");
    setStatus("Try to unscramble the word!");
    setGameActive(true);
  }, [words]);

  const checkPuzzle = () => {
    if (!gameActive) return;
    
    const guess = userGuess.toUpperCase().trim();
    if (guess === currentWord) {
      setScore(prevScore => prevScore + 1);
      setStatus("✅ Correct! Great job!");
      setGameActive(false);
      setScrambledWord(currentWord);
    } else {
      setStatus("❌ Wrong! Try again!");
    }
  };

  const handleInputChange = (e) => {
    setUserGuess(e.target.value);
  };

  useEffect(() => {
    newPuzzle();
  }, [newPuzzle]);

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1 className="contact-title">Word Shuffle Puzzle</h1>
        <p style={{color: 'var(--muted)', textAlign: 'center', marginBottom: '30px'}}>
          Unscramble the letters to form the correct word. Challenge your brain!
        </p>

        <div style={{
          fontSize: '2.5rem',
          letterSpacing: '12px',
          color: '#00f0ff',
          textShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
          marginBottom: '30px',
          textAlign: 'center',
          wordBreak: 'break-all'
        }}>
          {scrambledWord}
        </div>

        <input 
          type="text" 
          placeholder="Type your answer..." 
          maxLength="20"
          value={userGuess}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && checkPuzzle()}
          disabled={!gameActive}
          className="form-input"
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '1.1rem',
            textAlign: 'center',
            marginBottom: '20px'
          }}
        />
        
        <div style={{display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px'}}>
          <button 
            className="btn-primary auth-btn" 
            onClick={checkPuzzle}
            disabled={!gameActive}
            style={{padding: '12px 30px'}}
          >
            Submit
          </button>
          <button 
            className="btn-primary auth-btn" 
            onClick={newPuzzle}
            style={{padding: '12px 30px'}}
          >
            New Word
          </button>
        </div>

        <p style={{color: '#00f0ff', textAlign: 'center', marginBottom: '15px', fontSize: '1rem'}}>
          {status}
        </p>
        <p style={{textAlign: 'center', fontSize: '1.1rem', color: 'var(--text)'}}>
          Score: <b style={{color: '#00f0ff', fontSize: '1.3rem'}}>{score}</b>
        </p>
      </div>
    </div>
  );
}

export default GamePage;