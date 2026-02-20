import { useState } from 'react'

function StickyShareBar({ shareText }) {
    const [copied, setCopied] = useState(false)

    const encodedText = encodeURIComponent(shareText)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            const ta = document.createElement('textarea')
            ta.value = shareText
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const xUrl = `https://twitter.com/intent/tweet?text=${encodedText}`
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodedText}`

    return (
        <div className="sticky-share-bar">
            <div className="sticky-share-bar__inner">
                <a
                    href={xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sticky-share-bar__btn sticky-share-bar__btn--x"
                    id="share-x"
                >
                    𝕏 ポスト
                </a>
                <a
                    href={lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sticky-share-bar__btn sticky-share-bar__btn--line"
                    id="share-line"
                >
                    LINE
                </a>
                <button
                    className="sticky-share-bar__btn sticky-share-bar__btn--copy"
                    onClick={handleCopy}
                    id="share-copy"
                >
                    {copied ? '✅' : '📋'} コピー
                </button>
            </div>
        </div>
    )
}

export default StickyShareBar
