import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function QuizPage() {
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [scores, setScores] = useState({})
    const [loading, setLoading] = useState(true)
    const [animKey, setAnimKey] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/data/quiz.json')
            .then(res => res.json())
            .then(data => {
                setQuestions(data.questions)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const handleChoice = (choice) => {
        const newScores = { ...scores }
        Object.entries(choice.score).forEach(([type, value]) => {
            newScores[type] = (newScores[type] || 0) + value
        })
        setScores(newScores)

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prev => prev + 1)
            setAnimKey(prev => prev + 1)
        } else {
            navigate('/result', { state: { scores: newScores } })
        }
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="loading__spinner" />
                <p className="loading__text">読み込み中...</p>
            </div>
        )
    }

    if (!questions.length) {
        return (
            <div className="loading">
                <p className="loading__text">データの読み込みに失敗しました</p>
            </div>
        )
    }

    const question = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

    return (
        <div className="quiz-page">
            <div className="quiz-header">
                <div className="quiz-progress-info">
                    <span className="quiz-progress-label">質問</span>
                    <span className="quiz-progress-count">{currentIndex + 1} / {questions.length}</span>
                </div>
                <div className="quiz-progress-bar">
                    <div
                        className="quiz-progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="quiz-question" key={animKey}>
                <span className="quiz-question__number">Q{question.id}</span>
                <h2 className="quiz-question__text">{question.text}</h2>
                <div className="quiz-choices">
                    {question.choices.map((choice, idx) => (
                        <button
                            key={idx}
                            className="quiz-choice"
                            onClick={() => handleChoice(choice)}
                            id={`choice-${idx}`}
                        >
                            {choice.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuizPage
