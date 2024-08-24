import { useState } from "react";
import '../App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Guess = ({ artist, handleShowAnswer, handleShowHint, token }) => {
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
        <div className="guess">
            <div className="d-flex pt-1 flex-container-end">
                    <p className="m-0">Correct: {correct}</p>
                    <p>Incorrect: {incorrect}</p>
            </div>
            <div style={{ minHeight: '40px' }}>
                <p className={messageType}><strong>{resultMessage}</strong></p>
            </div>
            <p>Who's singing this song?</p>          
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
                    <button onClick={handleShowHint} className="btn btn-light me-2" style={{ width: '210px' }}>
                        <i className="bi bi-magic"></i> Hint 
                    </button>
                    <button onClick={handleShowAnswer} className="btn btn-light ms-2" style={{ width: '210px' }}>
                        <i className="bi bi-eye"></i> Show the right answer
                    </button>
                </div>    
            </div>
        </div>
    );
};

export default Guess;