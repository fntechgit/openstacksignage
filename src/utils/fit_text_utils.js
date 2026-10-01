/**
 * Largest font size at which text still fits a given number of lines.
 *
 * Measured on a detached copy rather than the element itself, so the search
 * never paints a size the viewer would see. The copy has to carry the styles
 * that change how the text wraps: family, weight, tracking and case. Tracking
 * is passed in em because the real rule scales it with the font, and a computed
 * px value would measure every candidate size with the wrong spacing.
 *
 * @param {Object}  options
 * @param {string}  options.text            the text to fit
 * @param {number}  options.width           the box it has to fit inside
 * @param {number}  options.lines           how many lines it may take
 * @param {number}  options.maxSize         design size, the search starts here
 * @param {number}  options.minSize         floor, the search stops here
 * @param {number}  options.lineHeightRatio line height as a share of the size
 * @param {Object}  options.font            family, weight, letterSpacing, textTransform
 * @returns {number} the size that fits, or minSize when none does
 */
export function largestSizeWithinLines({
    text,
    width,
    lines,
    maxSize,
    minSize,
    lineHeightRatio,
    font
}) {
    const probe = document.createElement('div')

    probe.textContent = text
    probe.style.cssText = [
        'position:absolute',
        'left:-99999px',
        'top:0',
        'visibility:hidden',
        'white-space:normal',
        `width:${width}px`,
        `font-family:${font.family}`,
        `font-weight:${font.weight}`,
        `letter-spacing:${font.letterSpacing}`,
        `text-transform:${font.textTransform}`
    ].join(';')

    document.body.appendChild(probe)

    let low = minSize
    let high = maxSize
    let best = minSize

    while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        const lineHeight = Math.round(mid * lineHeightRatio)

        probe.style.fontSize = `${mid}px`
        probe.style.lineHeight = `${lineHeight}px`

        if (probe.getBoundingClientRect().height <= lineHeight * lines) {
            best = mid
            low = mid + 1
        } else {
            high = mid - 1
        }
    }

    probe.remove()

    return best
}
