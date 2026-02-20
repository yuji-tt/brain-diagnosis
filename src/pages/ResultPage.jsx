import { useState, useEffect, useRef } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import AdsPlaceholder from '../components/AdsPlaceholder'
import StickyShareBar from '../components/StickyShareBar'
import { TypeVisual } from '../components/TypeVisual'

const COMPATIBILITY = {
    RM: 'SD', SD: 'HC', LS: 'DQ', DQ: 'LS',
    HC: 'IM', MM: 'SI', IM: 'HC', SI: 'MM',
}

function ResultPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [resultsData, setResultsData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [imageSaved, setImageSaved] = useState(false)
    const [imageSaving, setImageSaving] = useState(false)
    const [textCopied, setTextCopied] = useState(false)
    const cardRef = useRef(null)

    const scores = location.state?.scores

    useEffect(() => {
        if (!scores) {
            navigate('/')
            return
        }
        fetch('/data/results.json')
            .then(res => res.json())
            .then(data => {
                setResultsData(data.results)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [scores, navigate])

    if (!scores) return null

    if (loading || !resultsData) {
        return (
            <div className="loading">
                <div className="loading__spinner" />
                <p className="loading__text">結果を計算中...</p>
            </div>
        )
    }

    // Calculate percentages
    const totalScore = Object.values(scores).reduce((sum, v) => sum + v, 0)
    const sortedTypes = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)

    const top1Key = sortedTypes[0]?.[0]
    const top2Key = sortedTypes[1]?.[0]
    const top1Score = sortedTypes[0]?.[1] || 0
    const top2Score = sortedTypes[1]?.[1] || 0
    const top1Percent = totalScore > 0 ? Math.round((top1Score / totalScore) * 100) : 0
    const top2Percent = totalScore > 0 ? Math.round((top2Score / totalScore) * 100) : 0

    const mainResult = resultsData[top1Key]
    const subResult = resultsData[top2Key]
    const compatKey = COMPATIBILITY[top1Key]
    const compatResult = resultsData[compatKey]
    const sec = mainResult?.sections

    if (!mainResult) return null

    const shareText = `🧠 私の脳の使い方は「${mainResult.typeName}」(${top1Percent}%) × 「${subResult?.typeName || ''}」(${top2Percent}%) でした！\n\n#脳タイプ診断 #あなたの脳の使い方`

    const handleSaveImage = async () => {
        if (!cardRef.current || imageSaving) return
        setImageSaving(true)
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                logging: false,
                width: 540,
                height: 675,
                windowWidth: 540,
                windowHeight: 675,
            })
            const fileName = `brain-type-${top1Key}.png`
            // Try blob download (works best on iOS/Android)
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.download = fileName
                    link.href = url
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                } else {
                    // Fallback to dataURL
                    const link = document.createElement('a')
                    link.download = fileName
                    link.href = canvas.toDataURL('image/png')
                    link.click()
                }
                setImageSaved(true)
                setImageSaving(false)
                setTimeout(() => setImageSaved(false), 3000)
            }, 'image/png')
        } catch (err) {
            console.error('画像保存に失敗:', err)
            setImageSaving(false)
            alert('画像の保存に失敗しました。\nもう一度お試しください。')
        }
    }

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(shareText)
            setTextCopied(true)
            setTimeout(() => setTextCopied(false), 3000)
        } catch {
            const ta = document.createElement('textarea')
            ta.value = shareText
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
            setTextCopied(true)
            setTimeout(() => setTextCopied(false), 3000)
        }
    }

    return (
        <>
            <div className="result-page">
                {/* 1. Hero */}
                <div className="result-hero" id="result-hero">
                    <TypeVisual
                        image={mainResult.image}
                        icon={mainResult.icon || '/type-icons/default.svg'}
                        alt={mainResult.typeName}
                        className="result-hero__icon"
                    />
                    <p className="result-hero__label">あなたの脳タイプ</p>
                    <h1 className="result-hero__type-name" id="type-name">{mainResult.typeName}</h1>
                    <p className="result-hero__catch">{mainResult.catch}</p>
                </div>

                {/* 2. Score Bars */}
                <div className="score-bars" id="score-bars">
                    <p className="score-bars__title">📊 上位2タイプ</p>
                    <div className="score-bar">
                        <div className="score-bar__header">
                            <span className="score-bar__name">{mainResult.typeName}</span>
                            <span className="score-bar__rank score-bar__rank--1">1st</span>
                        </div>
                        <div className="score-bar__header">
                            <div className="score-bar__track">
                                <div className="score-bar__fill score-bar__fill--1" style={{ width: `${top1Percent}%` }} />
                            </div>
                            <span className="score-bar__percent">{top1Percent}%</span>
                        </div>
                    </div>
                    {subResult && (
                        <div className="score-bar">
                            <div className="score-bar__header">
                                <span className="score-bar__name">{subResult.typeName}</span>
                                <span className="score-bar__rank score-bar__rank--2">2nd</span>
                            </div>
                            <div className="score-bar__header">
                                <div className="score-bar__track">
                                    <div className="score-bar__fill score-bar__fill--2" style={{ width: `${top2Percent}%` }} />
                                </div>
                                <span className="score-bar__percent">{top2Percent}%</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3 & 4. Action Buttons */}
                <div className="btn-row">
                    <button
                        className={`btn ${imageSaved ? 'btn--success' : 'btn--primary'}`}
                        onClick={handleSaveImage}
                        disabled={imageSaving}
                        id="save-image-btn"
                    >
                        {imageSaving ? '⏳ 生成中...' : imageSaved ? '✅ 保存完了' : '📸 画像保存'}
                    </button>
                    <button
                        className={`btn ${textCopied ? 'btn--success' : 'btn--secondary'}`}
                        onClick={handleCopyText}
                        id="copy-text-btn"
                    >
                        {textCopied ? '✅ コピー済み' : '📋 シェア文コピー'}
                    </button>
                </div>

                <AdsPlaceholder />

                {/* 5. Core Features */}
                <div className="result-card" style={{ animationDelay: '0.3s' }}>
                    <h3 className="result-card__title">💡 3つの特徴</h3>
                    <ul className="result-card__list">
                        {mainResult.core.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* 6. Strength / Weakness / Growth */}
                <div className="result-card" style={{ animationDelay: '0.4s' }}>
                    <h3 className="result-card__title">💪 強み</h3>
                    <div className="result-card__tags">
                        {mainResult.strength.map((s, i) => (
                            <span key={i} className="result-card__tag">✨ {s}</span>
                        ))}
                    </div>
                </div>

                <div className="result-card" style={{ animationDelay: '0.5s' }}>
                    <h3 className="result-card__title">⚡ つまずきポイント</h3>
                    <div className="result-card__tags">
                        {mainResult.weakness.map((w, i) => (
                            <span key={i} className="result-card__tag">⚠️ {w}</span>
                        ))}
                    </div>
                </div>

                <div className="result-card" style={{ animationDelay: '0.6s' }}>
                    <h3 className="result-card__title">🌱 伸ばし方</h3>
                    <ul className="result-card__list">
                        {mainResult.growth.map((g, i) => (
                            <li key={i}>{g}</li>
                        ))}
                    </ul>
                </div>

                {/* 7. Today's Action */}
                <div className="action-card" style={{ animationDelay: '0.7s' }}>
                    <span className="action-card__emoji">🚀</span>
                    <p className="action-card__label">今日の1アクション</p>
                    <p className="action-card__text">{mainResult.action}</p>
                </div>

                {/* 8. Compatibility */}
                {compatResult && (
                    <div className="compat-card" style={{ animationDelay: '0.8s' }}>
                        <h3 className="compat-card__title">🤝 相性の良いタイプ</h3>
                        <div className="compat-card__type">
                            <span className="compat-card__emoji">🧠</span>
                            <div className="compat-card__info">
                                <h4>{compatResult.typeName}</h4>
                                <p>{compatResult.catch}</p>
                            </div>
                        </div>
                    </div>
                )}

                <AdsPlaceholder />

                {/* ===== Deep Dive Sections ===== */}
                {sec && (
                    <div className="deep-dive">
                        <div className="deep-dive__header">
                            <h2 className="deep-dive__title">🔍 診断結果を深掘り</h2>
                            <p className="deep-dive__subtitle">あなたの思考スタイルをもっと詳しく</p>
                        </div>

                        {/* 1) hook */}
                        {sec.hook && (
                            <div className="dd-card dd-card--hook animate-fade-in-up">
                                <p className="dd-card__hook-text">{sec.hook}</p>
                            </div>
                        )}

                        {/* 2) thinking */}
                        {sec.thinking && (
                            <div className="dd-card animate-fade-in-up">
                                <h3 className="dd-card__heading">🧩 思考のクセ</h3>
                                <p className="dd-card__body">{sec.thinking}</p>
                            </div>
                        )}

                        {/* 3) strength */}
                        {sec.strength?.length > 0 && (
                            <div className="dd-card animate-fade-in-up">
                                <h3 className="dd-card__heading">💪 強み</h3>
                                <ul className="dd-card__list">
                                    {sec.strength.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* 4) weakness */}
                        {sec.weakness && (
                            <div className="dd-card animate-fade-in-up">
                                <h3 className="dd-card__heading">⚡ 弱みの傾向</h3>
                                <p className="dd-card__body">{sec.weakness}</p>
                            </div>
                        )}

                        {/* 5) othersView */}
                        {sec.othersView && (
                            <div className="dd-card animate-fade-in-up">
                                <h3 className="dd-card__heading">👀 他人からの見え方</h3>
                                <p className="dd-card__body">{sec.othersView}</p>
                            </div>
                        )}

                        {/* 6) triggers */}
                        {sec.triggers?.length > 0 && (
                            <div className="dd-card animate-fade-in-up">
                                <h3 className="dd-card__heading">🔥 やる気スイッチ</h3>
                                <div className="dd-card__chips">
                                    {sec.triggers.map((t, i) => (
                                        <span key={i} className="dd-chip dd-chip--trigger">🎯 {t}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 7) pitfalls */}
                        {sec.pitfalls?.length > 0 && (
                            <div className="dd-card animate-fade-in-up">
                                <h3 className="dd-card__heading">⚠️ ハマりがちな落とし穴</h3>
                                <div className="dd-card__chips">
                                    {sec.pitfalls.map((p, i) => (
                                        <span key={i} className="dd-chip dd-chip--pitfall">💡 {p}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <AdsPlaceholder />

                        {/* 8) bestEnvironment */}
                        {sec.bestEnvironment?.length > 0 && (
                            <div className="dd-card animate-fade-in-up">
                                <h3 className="dd-card__heading">🏢 向いている環境</h3>
                                <ul className="dd-card__list">
                                    {sec.bestEnvironment.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* 9) goodAt */}
                        {sec.goodAt?.length > 0 && (
                            <div className="dd-card animate-fade-in-up">
                                <h3 className="dd-card__heading">🎯 得意な役割</h3>
                                <ul className="dd-card__list">
                                    {sec.goodAt.map((g, i) => <li key={i}>{g}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* 10) growthTips */}
                        {sec.growthTips?.length > 0 && (
                            <div className="dd-card animate-fade-in-up">
                                <h3 className="dd-card__heading">🌱 伸ばし方のコツ</h3>
                                <ul className="dd-card__list dd-card__list--numbered">
                                    {sec.growthTips.map((g, i) => <li key={i}>{g}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* 11) relationship */}
                        {sec.relationship && (
                            <div className="dd-card animate-fade-in-up">
                                <h3 className="dd-card__heading">💞 相性マップ</h3>
                                <div className="dd-relationship">
                                    {sec.relationship.goodMatch && (
                                        <div className="dd-rel-card dd-rel-card--good">
                                            <span className="dd-rel-card__badge">💚 ベストパートナー</span>
                                            <h4 className="dd-rel-card__type">{resultsData[sec.relationship.goodMatch.typeKey]?.typeName || sec.relationship.goodMatch.typeKey}</h4>
                                            <p className="dd-rel-card__reason">{sec.relationship.goodMatch.reason}</p>
                                        </div>
                                    )}
                                    {sec.relationship.conflict && (
                                        <div className="dd-rel-card dd-rel-card--conflict">
                                            <span className="dd-rel-card__badge">🔶 成長を促す相手</span>
                                            <h4 className="dd-rel-card__type">{resultsData[sec.relationship.conflict.typeKey]?.typeName || sec.relationship.conflict.typeKey}</h4>
                                            <p className="dd-rel-card__reason">{sec.relationship.conflict.reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 12) todayAction */}
                        {sec.todayAction && (
                            <div className="dd-action-card animate-fade-in-up">
                                <span className="dd-action-card__emoji">✨</span>
                                <p className="dd-action-card__label">今日から始める1アクション</p>
                                <p className="dd-action-card__text">{sec.todayAction}</p>
                            </div>
                        )}
                    </div>
                )}

                <AdsPlaceholder />

                {/* Retry */}
                <Link to="/" className="retry-btn" id="retry-btn">
                    🔄 もう一度診断する
                </Link>

                {/* Footer */}
                <footer className="footer">
                    <div className="footer__links">
                        <Link to="/about" className="footer__link">このサイトについて</Link>
                        <Link to="/privacy" className="footer__link">プライバシーポリシー</Link>
                        <Link to="/terms" className="footer__link">利用規約</Link>
                    </div>
                    <p className="footer__copy">© 2026 脳の使い方タイプ診断</p>
                </footer>

                {/* ===== Share Card for PNG capture (off-screen) ===== */}
                <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}>
                    <div ref={cardRef} id="share-card" className="sc">
                        {/* Decorative top bar */}
                        <div className="sc__topbar" />

                        {/* Header */}
                        <div className="sc__header">
                            <TypeVisual
                                image={mainResult.image}
                                icon={mainResult.icon || '/type-icons/default.svg'}
                                alt={mainResult.typeName}
                                className="sc__icon"
                            />
                            <p className="sc__label">あなたの脳タイプ</p>
                        </div>

                        {/* Type Name */}
                        <h2 className="sc__type">{mainResult.typeName}</h2>
                        <p className="sc__catch">{mainResult.catch}</p>

                        {/* Score Bars */}
                        <div className="sc__scores">
                            <div className="sc__score-row">
                                <span className="sc__score-name">{mainResult.typeName}</span>
                                <div className="sc__score-track">
                                    <div className="sc__score-fill sc__score-fill--1" style={{ width: `${top1Percent}%` }} />
                                </div>
                                <span className="sc__score-pct">{top1Percent}%</span>
                            </div>
                            {subResult && (
                                <div className="sc__score-row">
                                    <span className="sc__score-name">{subResult.typeName}</span>
                                    <div className="sc__score-track">
                                        <div className="sc__score-fill sc__score-fill--2" style={{ width: `${top2Percent}%` }} />
                                    </div>
                                    <span className="sc__score-pct">{top2Percent}%</span>
                                </div>
                            )}
                        </div>

                        {/* Strengths (top 3) */}
                        <div className="sc__section">
                            <p className="sc__section-title">💪 強み</p>
                            <ul className="sc__list">
                                {(sec?.strength || mainResult.core).slice(0, 3).map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Today's Action */}
                        <div className="sc__action">
                            <p className="sc__action-label">🚀 今日の1アクション</p>
                            <p className="sc__action-text">{sec?.todayAction || mainResult.action}</p>
                        </div>

                        {/* Footer */}
                        <div className="sc__footer">
                            <p>🧠 脳の使い方タイプ診断</p>
                        </div>
                    </div>
                </div>
            </div >

            {/* 9. Sticky Share Bar */}
            < StickyShareBar shareText={shareText} />
        </>
    )
}

export default ResultPage
