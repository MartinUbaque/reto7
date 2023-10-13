import React from 'react';

const FinalScore = ({ score, restartQuiz }) => {
    const fanMessage = () => {
        if (score <= 2) return "You're just starting your journey!";
        if (score <= 5) return "You're becoming a casual fan!";
        if (score <= 8) return "You're on your way to being a dedicated fan!";
        if (score <= 11) return "You're a true fan!";
        if (score <= 14) return "You're a devoted aficionado!";
        return "You're a superfan!";
      };

  return (
    <div className="text-center">
      <h2>Final Score: {score}/15</h2>
      <p>{fanMessage()}</p>
      <button className="btn btn-success" onClick={restartQuiz}>Restart Quiz</button>
    </div>
  );
};

export default FinalScore;
