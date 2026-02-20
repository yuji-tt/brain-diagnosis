import { useState } from 'react'

/**
 * TypeVisual — タイプ別キャラ画像 (PNG) を表示し、
 * 読込失敗時は SVG アイコンへフォールバックする。
 *
 * @param {{ image?: string, icon: string, alt: string, className?: string }} props
 */
export function TypeVisual({ image, icon, alt, className }) {
    const [failed, setFailed] = useState(false)
    const src = !image || failed ? icon : image

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            loading="lazy"
            onError={() => setFailed(true)}
        />
    )
}
