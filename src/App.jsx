import { Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import PrivacyPage from './pages/PrivacyPage'
import AboutPage from './pages/AboutPage'
import TermsPage from './pages/TermsPage'

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
            </Routes>
        </div>
    )
}

export default App
