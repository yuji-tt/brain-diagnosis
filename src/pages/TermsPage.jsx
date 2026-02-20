import { Link } from 'react-router-dom'

function TermsPage() {
    return (
        <div className="static-page">
            <Link to="/" className="static-page__back">← トップへ戻る</Link>
            <h1 className="static-page__title">利用規約</h1>

            <div className="static-page__section">
                <h3>第1条（適用）</h3>
                <p>
                    本規約は、本サイト「あなたの脳の使い方タイプ診断」（以下「本サービス」）の
                    利用に関する条件を定めるものです。
                </p>
            </div>

            <div className="static-page__section">
                <h3>第2条（利用条件）</h3>
                <p>
                    本サービスは無料でご利用いただけます。
                    利用にあたり、会員登録等は不要です。
                </p>
            </div>

            <div className="static-page__section">
                <h3>第3条（免責事項）</h3>
                <p>
                    本サービスの診断結果はエンターテインメント目的であり、
                    医学的・心理学的根拠に基づくものではありません。
                    診断結果の利用により生じた損害について、
                    運営者は一切の責任を負いません。
                </p>
            </div>

            <div className="static-page__section">
                <h3>第4条（著作権）</h3>
                <p>
                    本サービスに掲載されているコンテンツの著作権は、
                    運営者に帰属します。無断転載・複製を禁じます。
                </p>
            </div>

            <div className="static-page__section">
                <h3>第5条（変更）</h3>
                <p>
                    本規約は予告なく変更される場合があります。
                    変更後の規約は、本サイトに掲載された時点で効力を生じるものとします。
                </p>
            </div>
        </div>
    )
}

export default TermsPage
