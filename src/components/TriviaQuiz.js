import React, { useState, useEffect } from 'react';

const TriviaQuiz = () => {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);

    // Decode HTML entities
    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    // Shuffle array
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const fetchQuestion = async (retryCount = 0) => {
        try {
            setLoading(true);
            setSelectedAnswer(null);
            setShowResult(false);

            const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');

            // Handle rate limiting (429 error)
            if (response.status === 429) {
                const waitTime = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff, max 10s

                if (retryCount < 3) {
                    setError(`Rate limit reached. Retrying in ${waitTime / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    return fetchQuestion(retryCount + 1);
                } else {
                    throw new Error('RATE_LIMIT');
                }
            }

            if (!response.ok) {
                throw new Error('Failed to fetch trivia question');
            }

            const data = await response.json();

            // Check if API returned valid data
            if (!data.results || data.results.length === 0) {
                throw new Error('No questions available');
            }

            const questionData = data.results[0];

            // Combine correct and incorrect answers and shuffle them
            const allAnswers = [
                questionData.correct_answer,
                ...questionData.incorrect_answers
            ];

            setQuestion({
                question: decodeHTML(questionData.question),
                correctAnswer: decodeHTML(questionData.correct_answer),
                category: decodeHTML(questionData.category),
                difficulty: questionData.difficulty
            });

            setShuffledAnswers(shuffleArray(allAnswers.map(decodeHTML)));
            setError(null);
        } catch (err) {
            if (err.message === 'RATE_LIMIT') {
                setError('⏱️ Too many requests! The trivia API has rate-limited us. Please wait a minute before trying again.');
            } else {
                setError('Failed to load trivia question. Please try again later.');
            }
            console.error('Error fetching trivia:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    const handleAnswerClick = (answer) => {
        if (showResult) return; // Prevent changing answer after submission
        setSelectedAnswer(answer);
    };

    const handleSubmit = () => {
        if (!selectedAnswer) return;

        setShowResult(true);
        setQuestionsAnswered(prev => prev + 1);

        if (selectedAnswer === question.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        fetchQuestion();
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 'text-green-600';
            case 'medium':
                return 'text-yellow-600';
            case 'hard':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[500px] p-5 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl m-5 shadow-2xl">
            <div className="bg-white p-10 rounded-xl max-w-3xl w-full text-center shadow-xl relative">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    Trivia Quiz Challenge
                </h2>

                {/* Score Display */}
                <div className="mb-6 flex justify-center gap-6 text-sm">
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full">
                        <span className="font-semibold text-emerald-700">Score: </span>
                        <span className="text-emerald-900 font-bold">{score}/{questionsAnswered}</span>
                    </div>
                    {questionsAnswered > 0 && (
                        <div className="bg-gradient-to-r from-cyan-100 to-blue-100 px-4 py-2 rounded-full">
                            <span className="font-semibold text-cyan-700">Accuracy: </span>
                            <span className="text-cyan-900 font-bold">
                                {Math.round((score / questionsAnswered) * 100)}%
                            </span>
                        </div>
                    )}
                </div>

                <div className="min-h-[300px] flex flex-col justify-center items-center mb-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mb-4"></div>
                            <p className="text-gray-500 animate-pulse text-lg">Loading question...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <p className="text-red-500 text-lg text-center">{error}</p>
                            <button
                                onClick={() => fetchQuestion()}
                                className="bg-gradient-to-r from-red-500 to-orange-600 text-white border-none py-2 px-6 text-sm font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-400/50 active:transform-none"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="w-full space-y-6">
                            {/* Category and Difficulty */}
                            <div className="flex justify-center gap-3 flex-wrap mb-4">
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                                    📚 {question.category}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(question.difficulty)} bg-opacity-10`}>
                                    {question.difficulty.toUpperCase()}
                                </span>
                            </div>

                            {/* Question */}
                            <p className="text-2xl text-gray-800 font-semibold leading-relaxed mb-8">
                                {question.question}
                            </p>

                            {/* Answer Options */}
                            <div className="grid grid-cols-1 gap-3">
                                {shuffledAnswers.map((answer, index) => {
                                    const isSelected = selectedAnswer === answer;
                                    const isCorrect = answer === question.correctAnswer;

                                    let buttonClass = "w-full p-4 rounded-lg text-left font-medium transition-all duration-300 border-2 ";

                                    if (showResult) {
                                        if (isCorrect) {
                                            buttonClass += "bg-green-100 border-green-500 text-green-800";
                                        } else if (isSelected && !isCorrect) {
                                            buttonClass += "bg-red-100 border-red-500 text-red-800";
                                        } else {
                                            buttonClass += "bg-gray-50 border-gray-200 text-gray-500";
                                        }
                                    } else {
                                        if (isSelected) {
                                            buttonClass += "bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-500 text-emerald-900 transform scale-105 shadow-lg";
                                        } else {
                                            buttonClass += "bg-white border-gray-300 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50 hover:transform hover:scale-102 cursor-pointer";
                                        }
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerClick(answer)}
                                            disabled={showResult}
                                            className={buttonClass}
                                        >
                                            <span className="flex items-center justify-between">
                                                <span>{answer}</span>
                                                {showResult && isCorrect && <span className="text-2xl">✓</span>}
                                                {showResult && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Result Message */}
                            {showResult && (
                                <div className={`mt-6 p-4 rounded-lg transition-all duration-500 transform ${selectedAnswer === question.correctAnswer
                                    ? 'bg-green-100 border-2 border-green-500'
                                    : 'bg-red-100 border-2 border-red-500'
                                    }`}>
                                    <p className={`text-lg font-bold ${selectedAnswer === question.correctAnswer
                                        ? 'text-green-800'
                                        : 'text-red-800'
                                        }`}>
                                        {selectedAnswer === question.correctAnswer
                                            ? '🎉 Correct! Well done!'
                                            : `❌ Incorrect! The correct answer was: ${question.correctAnswer}`}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    {!showResult ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedAnswer || loading}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-400/50 active:transform-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-400/50 active:transform-none"
                        >
                            Next Question
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TriviaQuiz;
