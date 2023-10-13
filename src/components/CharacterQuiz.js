import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FinalScore from './FinalScore'; // Import the new component


const CharacterQuiz = () => {
  // State for character, options, user answer, score, progress, etc.
  const [characterData,setCharacterData] = useState([])
  const [episodeData,setEpisodeData] = useState([])
  const [QuestionCharacter, setQuestionCharacter] = useState(null);
  const [QuestionOptions, setQuestionOptions] = useState([]);
  const [userAnswer, setUserAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score,setScore] = useState(0)
  const [currentQuestion,setCurrentQuestion] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false);
  // ... Add other state variables



  const resetState = () => {
    setUserAnswer(null);
    setSelectedOption(null);
  };


  // Function to handle user's answer selection
  const handleAnswerSelect = (option) => {
    if (userAnswer === null) {
      setUserAnswer(option);
      setSelectedOption(option); // Set the selected option
      // Calculate score if needed
      // Disable other options if needed
    }
  };

  // Function to move to the next question
  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    if (correctAnswer === userAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion === 14) {
      setQuizComplete(true);
    } else {
      resetState();
      fetchRandomCharacter();
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
    resetState();
    fetchRandomCharacter();
  };

  const fetchRandomCharacter = () => {
    if (characterData.length > 0) {
      const randomIndex = Math.floor(Math.random() * characterData.length);
      const randomCharacter = characterData[randomIndex];
      setQuestionCharacter(randomCharacter);
      setQuestionOptions(generateOptions(randomCharacter));
    } else {
      console.error('No character data available yet');
    }
  };
  
  const generateOptions = (randomCharacter) => {
    const options = [];

    var episode = episodeData[1];

    for (const episodio of episodeData) {
      if (episodio.url===randomCharacter.episode[0]){
        episode = episodio;
      };
      
    }



    //Add the correct answer (first episode in randomCharacter.episodes)
    console.log(episode.episode);
    options.push(`${episode.episode} - ${episode.name}`);
    setCorrectAnswer(`${episode.episode} - ${episode.name}`)
    
    // Get three random episodes from episodeData
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * episodeData.length);
      options.push(`${episodeData[randomIndex].episode} - ${episodeData[randomIndex].name}`);
    }
  
    // Shuffle the options
    return options.sort(() => Math.random() - 0.5);
  };

  // useEffect to fetch data, set initial state, etc.
  useEffect(() => {
    const fetchData = async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    };
  
    const fetchAllData = async () => {
      let characters = [];
      let episodes = [];
  
      for (let i = 0; i < 4; i++) {
        const [ episodesData] = await Promise.all([
          
          fetchData(`https://rickandmortyapi.com/api/episode/?page=${i}`)
        ]);
        
        episodes = episodes.concat(episodesData.results);
      }

      for (let i = 0; i < 42; i++) {
        const [charactersData] = await Promise.all([
          fetchData(`https://rickandmortyapi.com/api/character/?page=${i}`)
          
        ]);
        characters = characters.concat(charactersData.results);
        
      }

      // Remove duplicates from characters
    const uniqueCharacters = Array.from(new Set(characters.map(c => c.id))).map(id => {
        return characters.find(c => c.id === id);
      });
  
      // Remove duplicates from episodes
      const uniqueEpisodes = Array.from(new Set(episodes.map(e => e.id))).map(id => {
        return episodes.find(e => e.id === id);
      });
  
      setCharacterData(uniqueCharacters);
      setEpisodeData(uniqueEpisodes);

      
    };
  
    fetchAllData();
  }, []);
  

  return (
    <div className="container mt-5 ">
      
      <h1 className="text-center mb-4">How much do you know about Rick and Morty?</h1>
      <div className="text-center">
      {quizComplete ? (
          <FinalScore score={score} restartQuiz={restartQuiz} />
        ) : (
        <div>
        {QuestionCharacter  ?  (
          <div>
            <div className="card mx-auto" style={{ width: '18rem' }}>
              <img src={QuestionCharacter.image} className="card-img-top img-fluid" alt={QuestionCharacter.name} />
              <div className="card-body">
                <h2 className="card-title">{QuestionCharacter.name}</h2>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Status: {QuestionCharacter.status}</li>
                  <li className="list-group-item">Species: {QuestionCharacter.species}</li>
                  <li className="list-group-item">Type: {QuestionCharacter.type}</li>
                  <li className="list-group-item">Gender: {QuestionCharacter.gender}</li>
                  <li className="list-group-item">Origin: {QuestionCharacter.origin.name}</li>
                  <li className="list-group-item">Location: {QuestionCharacter.location.name}</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-weight-bold">In which episode did this character first appear?</p>
            </div>
            <div className="options mt-3">
  {QuestionOptions.map((option, index) => (
    <div key={index} className="mb-2">
      <button
        className={`btn btn-outline-primary ${
          userAnswer !== null ? 'disabled' : ''
        } ${
          selectedOption === option ? 'clicked' : ''
        }`}
        onClick={() => handleAnswerSelect(option)}
      >
        {option}
      </button>
    </div>
  ))}
</div>

{userAnswer !== null && (
  <div className="mt-3 text-center">
    <strong>Your answer:</strong> {userAnswer}
  </div>
)}

<button
  onClick={nextQuestion}
  className={`btn btn-primary mt-4 ${userAnswer === null ? 'disabled' : ''}`}
>
  Next Question
</button>
<div className="progress mt-4">
  <div
    className="progress-bar"
    role="progressbar"
    style={{ width: `${(currentQuestion / 15) * 100}%` }}
    aria-valuenow={currentQuestion}
    aria-valuemin="0"
    aria-valuemax="15"
  >
    {currentQuestion} / 15
  </div>
</div>
          </div>
        ) : (
          <button onClick={fetchRandomCharacter} className="btn btn-success">Start!</button>
        )}
        </div>)}
      </div>
      {/* Progress bar, score display, etc. */}
    </div>
  );
};

export default CharacterQuiz;