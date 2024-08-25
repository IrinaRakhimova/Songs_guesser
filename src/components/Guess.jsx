import { useState, useEffect } from "react";
import '../App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Guess = ({ artist, handleShowAnswer, handleShowHint, token, setShowAnswer, newSong, setNewSong }) => {
    const [answer, setAnswer] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [resultMessage, setResultMessage] = useState("Guess the artist");
    const [messageType, setMessageType] = useState("");
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [disabledButton, setDisabledButton] = useState(false);

    useEffect(() => {
        if (newSong) {
            setResultMessage("Guess the artist");
            setMessageType(""); 
            setNewSong(false);
            setDisabledButton(false);  
        }
    }, [newSong, setNewSong]);

    const fetchArtists = async (query) => {
        if (query.length < 1) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist&limit=5`, {
                headers: {
                    'Authorization': `Bearer ${token}`,  
                },
            });
            const data = await response.json();
            setSuggestions(data.artists.items.map(artist => artist.name));
        } catch (error) {
            console.error("Error fetching artist suggestions:", error);
        }
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setAnswer(value);
        fetchArtists(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setAnswer(suggestion);
        setSuggestions([]);
    };

    const handleClick = () => {
        if (!answer.trim()) {
            return;
        }

        setMessageType("");

        setTimeout(() => {
            if (answer.toLowerCase().includes(artist.toLowerCase())) {
                setResultMessage("Correct!");
                setMessageType("correct");
                setCorrect(prevCorrect => prevCorrect + 1);
                setShowAnswer(true);
            } else {
                setResultMessage("Oops!");
                setMessageType("incorrect");
                setIncorrect(prevIncorrect => prevIncorrect + 1);
                setShowAnswer(true);
            }
            setAnswer("");
            setSuggestions([]);
            setDisabledButton(true);
        }, 10);
    };

    const handleShowAnswerClick = () => {
        setDisabledButton(true);
        handleShowAnswer();
        setIncorrect(prevIncorrect => prevIncorrect + 1);
        setResultMessage("");
    };

    return (
        <div className="guess-container">
            <div style={{ minHeight: '40px' }}>
                <p className={messageType}><strong>{resultMessage}</strong></p>
            </div>
            <div className="guess-inner-container">
                <div>
                    <div className="guess">                          
                        <div className="input-group mb-3 position-relative">
                            <input
                                className="form-control"
                                type="text"
                                value={answer}
                                onChange={handleChange}
                                placeholder="Start typing the artist's name..."
                                aria-haspopup="true"
                                aria-expanded={suggestions.length > 0}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleClick();
                                    }
                                }}
                                disabled={disabledButton}
                            />
                            <button className="btn btn-outline-light" type="button" onClick={handleClick} disabled={disabledButton}>Guess</button>
                            {suggestions.length > 0 && (
                                <ul className="dropdown-menu show" style={{ width: '100%', position: 'absolute', top: '100%', zIndex: '1000' }}>
                                    {suggestions.map((suggestion, index) => (
                                        <li key={index}>
                                            <button 
                                                type="button" 
                                                className="dropdown-item" 
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                {suggestion}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>           
                        <div className="flex-container">
                            <div className="flex-container-start">
                                <button onClick={handleShowHint} className="btn btn-outline-light me-2" style={{ width: '166px' }} disabled={disabledButton} >
                                    <i className="bi bi-magic"></i> Hint 
                                </button>
                                <button onClick={handleShowAnswerClick} className="btn btn-outline-light ms-2" style={{ width: '166px' }} disabled={disabledButton}>
                                    <i className="bi bi-eye"></i> Show the answer
                                </button>
                            </div>
                        </div>    
                    </div>
                </div>
                <table className="score p-2">
                    <tr>
                        <th>Score</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>Correct:</td> 
                        <td>{correct}</td>
                    </tr>
                    <tr>
                        <td>Incorrect:</td>
                        <td>{incorrect}</td>
                    </tr>
                </table>
            </div>
        </div>
    );
};

export default Guess;