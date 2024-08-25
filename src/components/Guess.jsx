import { useState } from "react";
import '../App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Guess = ({ artist, handleShowAnswer, handleShowHint, token, setShowAnswer }) => {
    const [answer, setAnswer] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [resultMessage, setResultMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);

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
                setResultMessage("Oops! Try again.");
                setMessageType("incorrect");
                setIncorrect(prevIncorrect => prevIncorrect + 1);
            }
            setAnswer("");
            setSuggestions([]);
        }, 10);
    };

    return (
        <div className="guess-container">
            <div style={{ minHeight: '40px' }}>
                <p className={messageType}><strong>{resultMessage}</strong></p>
            </div>
            <div className="guess-inner-container">
                <table className="score">
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
                            />
                            <button className="btn btn-outline-light" type="button" onClick={handleClick}>Guess</button>
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
                                <button onClick={handleShowHint} className="btn btn-light me-2" style={{ width: '186px' }}>
                                    <i className="bi bi-magic"></i> Hint 
                                </button>
                                <button onClick={handleShowAnswer} className="btn btn-light ms-2" style={{ width: '186px' }}>
                                    <i className="bi bi-eye"></i> Show the answer
                                </button>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guess;