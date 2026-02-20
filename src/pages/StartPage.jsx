import { Link } from 'react-router-dom'

function StartPage() {
    return (
        <>
            <div className="start-page">
                <div className="animate-fade-in-up">
                    <span className="start-page__brain" role="img" aria-label="brain">🧠</span>
                    <h1 className="start-page__title">あなたの脳の<br />使い方タイプ診断</h1>
                    <p className="start-page__subtitle">
                        16の質問に答えるだけで、<br />
                        あなたの思考スタイルが分かる！
                    </p>
                    <div className="start-page__meta">
                        <span className="start-page__badge">⏱ 約2分</span>
                        <span className="start-page__badge">📝 16問</span>
                        <span className="start-page__badge">🎯 8タイプ</span>
                    </div>
                    <Link to="/quiz" className="start-btn" id="start-btn">
                        診断スタート ▶
                    </Link>
                </div>
            </div>
            <footer className="footer">
                <div className="footer__links">
                    <Link to="/about" className="footer__link">このサイトについて</Link>
                    <Link to="/privacy" className="footer__link">プライバシーポリシー</Link>
                    <Link to="/terms" className="footer__link">利用規約</Link>
                </div>
                <p className="footer__copy">© 2026 脳の使い方タイプ診断</p>
            </footer>
        </>
    )
}

export default StartPage
