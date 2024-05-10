import React, { useState, useEffect } from 'react';

const App = () => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (!quizStarted) {
            fetchQuiz();
        }
    }, [quizStarted]);

    const fetchQuiz = () => {
        fetch('https://opentdb.com/api.php?amount=5&type=multiple')
            .then(response => response.json())
            .then(data => {
                if (data.results) {
                    const formattedQuestions = data.results.map(question => {
                        const answers = [question.correct_answer, ...question.incorrect_answers];
                        return {
                            ...question,
                            answers: answers.sort(() => Math.random() - 0.5),
                            correct_answer: question.correct_answer
                        };
                    });
                    setQuestions(formattedQuestions);
                    setSelectedAnswers({});
                    setResults(null);
                } else {
                    console.error('No results found:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    };

    const startQuiz = () => {
        setQuizStarted(true);
        fetchQuiz();
    };

    const selectAnswer = (questionIndex, answer) => {
        if (!results) {
            setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answer }));
        }
    };

    const checkAnswers = () => {
        const score = questions.reduce((total, question, index) => {
            return total + (selectedAnswers[index] === question.correct_answer ? 1 : 0);
        }, 0);
        setResults({ score, total: questions.length });
    };

    return (
        <div className={quizStarted ? "quiz-screen" : "start-screen"}>
            {!quizStarted ? (
                <>
                    <h1>Quizzical</h1>
                    <p>Test your knowledge!</p>
                    <button onClick={startQuiz}>Start quiz</button>
                </>
            ) : (
                <>
                    {questions.map((question, index) => (
                        <div key={index} className="question-container">
                            <h2 dangerouslySetInnerHTML={{ __html: question.question }}></h2>
                            <div className="answers">
                                {question.answers.map((answer, idx) => (
                                    <button
                                        key={idx}
                                        dangerouslySetInnerHTML={{ __html: answer }}
                                        onClick={() => selectAnswer(index, answer)}
                                        style={{
                                            backgroundColor: results ? (answer === question.correct_answer ? '#94D7A2' : (selectedAnswers[index] === answer ? '#F8BCBC' : '#F5F7FB')) : (selectedAnswers[index] === answer ? '#D6DBF5' : '#F5F7FB'),
                                            opacity: results ? (answer === question.correct_answer || selectedAnswers[index] === answer ? '1' : '0.5') : '1'
                                        }}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {results ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                            <div style={{ fontSize: '18px', marginRight: '20px' }}>
                                You scored {results.score}/{results.total} correct answers
                            </div>
                            <button onClick={startQuiz}>Play again</button>
                        </div>
                    ) : (
                        <button onClick={checkAnswers}>Check answers</button>
                    )}
                </>
            )}
        </div>
    );
};

export default App;
