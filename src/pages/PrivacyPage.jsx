import { Link } from 'react-router-dom'

function PrivacyPage() {
    return (
        <div className="static-page">
            <Link to="/" className="static-page__back">← トップへ戻る</Link>
            <h1 className="static-page__title">プライバシーポリシー</h1>

            <div className="static-page__section">
                <h3>個人情報の取り扱いについて</h3>
                <p>
                    本サイト「あなたの脳の使い方タイプ診断」（以下「本サイト」）は、
                    ユーザーの個人情報を適切に取り扱うことを重要視しています。
                </p>
            </div>

            <div className="static-page__section">
                <h3>収集する情報</h3>
                <p>
                    本サイトでは、診断の回答データをブラウザ上でのみ処理しており、
                    サーバーへの送信・保存は行っておりません。
                </p>
            </div>

            <div className="static-page__section">
                <h3>Cookieの使用</h3>
                <p>
                    本サイトではサービス向上のためにCookieを使用する場合があります。
                    ブラウザの設定によりCookieを無効にすることが可能です。
                </p>
            </div>

            <div className="static-page__section">
                <h3>広告について</h3>
                <p>
                    本サイトでは第三者配信の広告サービスを利用する場合があります。
                    広告配信事業者は、ユーザーの興味に応じた広告を表示するために
                    Cookieを使用することがあります。
                </p>
            </div>

            <div className="static-page__section">
                <h3>お問い合わせ</h3>
                <p>プライバシーポリシーに関するお問い合わせは、サイト運営者までご連絡ください。</p>
            </div>
        </div>
    )
}

export default PrivacyPage
