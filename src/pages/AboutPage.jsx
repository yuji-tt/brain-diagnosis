import { Link } from 'react-router-dom'

function AboutPage() {
    return (
        <div className="static-page">
            <Link to="/" className="static-page__back">← トップへ戻る</Link>
            <h1 className="static-page__title">このサイトについて</h1>

            <div className="static-page__section">
                <h3>🧠 あなたの脳の使い方タイプ診断とは</h3>
                <p>
                    このサイトは、16の質問を通じてあなたの思考スタイルや脳の使い方のクセを
                    8つのタイプに分類する診断コンテンツです。
                </p>
            </div>

            <div className="static-page__section">
                <h3>8つのタイプ</h3>
                <ul>
                    <li>ロードマップ型 — 道筋を描き、着実に前へ進む人</li>
                    <li>スタートダッシュ型 — まず動いて道を切り開く人</li>
                    <li>ロジック設計型 — 理解して組み立てる思考派</li>
                    <li>深掘り探究型 — とことん極める研究者タイプ</li>
                    <li>ひらめき創造型 — 新しい発想を生み出す人</li>
                    <li>ムードメーカー型 — 場の空気を動かす人</li>
                    <li>没入マスター型 — 集中すると止まらない職人</li>
                    <li>静かな洞察型 — 観察から本質を見抜く人</li>
                </ul>
            </div>

            <div className="static-page__section">
                <h3>ご注意</h3>
                <p>
                    本診断はエンターテインメントを目的としたものであり、
                    医学的・心理学的な診断ではありません。
                    結果はあくまで参考としてお楽しみください。
                </p>
            </div>
        </div>
    )
}

export default AboutPage
