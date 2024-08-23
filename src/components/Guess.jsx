import { useState } from "react";

const Guess = ({ name, artist }) => {
    const [answer, setAnswer] = useState("");
    const [resultMessage, setResultMessage] = useState("");
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);

    const handleChange = (event) => {
        setAnswer(event.target.value);
    };

    const handleClick = () => {
        if (answer.toLowerCase().includes(artist.toLowerCase())) {
            setResultMessage(`Correct! The song is ${name} by ${artist}.`);
            setAnswer("");
            setCorrect(prevCorrect => prevCorrect + 1);
        } else {
            setResultMessage(`Incorrect. The song is ${name} by ${artist}.`);
            setAnswer("");
            setIncorrect(prevIncorrect => prevIncorrect + 1);
        }
    };

    return (
        <div>
            <p>Who sings this song?</p>
            <input 
                type="text" 
                value={answer} 
                onChange={handleChange} 
            />
            <button onClick={handleClick}>Guess</button>
            <p>{resultMessage}</p>
            <p>Correct: {correct}</p>
            <p>Incorrect: {incorrect}</p>
        </div>
    );
}

export default Guess;