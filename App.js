import React, { useState } from 'react';

const App = () => {
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return (
      <div className="start-screen">
        <h1>Quizzical</h1>
        <p>Test your knowledge with a variety of fun and challenging trivia questions!</p>
        <button onClick={startQuiz}>Start quiz</button>
      </div>
    );
  }

  return <div>Quiz Component Goes Here</div>;
};

export default App;
