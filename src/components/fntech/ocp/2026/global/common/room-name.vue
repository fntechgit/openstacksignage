<template>
    <div class="text-uppercase" ref="name" :style="style">{{ text }}</div>
</template>

<script>

    import { largestSizeWithinLines } from 'utils/fit_text_utils'

    // Design trims the line box to cap height: 119px at 160px, 118px at 116px.
    const ONE_LINE = { size: 160, lineHeight: 120 }
    const TWO_LINE = { size: 116, lineHeight: 118 }

    // Wrapped it may go smaller, since two lines carry more than one.
    const TWO_LINE_FLOOR = 40

    // Sizes the room name to the width its box allows: one line while that stays
    // readable, two otherwise. The caller styles the box and states its width in
    // CSS; this reads that width back.
    //
    // Fitting belongs to the element rather than to the screen around it, so it
    // runs whenever the name is rendered. The header is built behind a v-if, and
    // a sign that powers on before the day's first session builds it long after
    // the screen itself mounted.
    export default {
        props: {
            name: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                fontSize: ONE_LINE.size,
                lineHeight: ONE_LINE.lineHeight,
                wraps: false
            }
        },
        computed: {
            // Room names run from "210DH" to "Marriott Grand Ballroom". A
            // numbered room reads as one token, and the hotel is a given.
            text() {
                if (this.name.match(/^\d/)) {
                    return this.name.replace(/\s/g, '')
                }

                if (this.name.startsWith('Marriott')) {
                    return this.name.replace('Marriott ', '')
                }

                return this.name
            },
            style() {
                return {
                    'font-size': `${this.fontSize}px`,
                    'line-height': `${this.lineHeight}px`,
                    'letter-spacing': '-0.02em',
                    'white-space': this.wraps ? 'normal' : 'nowrap'
                }
            }
        },
        watch: {
            text: 'fit'
        },
        mounted() {
            // Measuring before the webfont lands reads the fallback metrics, so
            // the name would be sized against the wrong font.
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(this.fit)
            } else {
                this.fit()
            }
        },
        methods: {
            fit() {
                this.fontSize = ONE_LINE.size
                this.lineHeight = ONE_LINE.lineHeight
                this.wraps = false

                this.$nextTick(() => {
                    const el = this.$refs.name
                    if (!el) return

                    // The box is capped in CSS, so its own width never reports
                    // the overflow. A range over the text does. The cap differs
                    // between the normal and the overflow header, so read it
                    // rather than restate it here.
                    const available = el.clientWidth
                    const range = document.createRange()

                    range.selectNodeContents(el)

                    const width = range.getBoundingClientRect().width
                    if (width <= available) return

                    const scaled = Math.floor(ONE_LINE.size * available / width)

                    // One line only while it beats what two would give. Below
                    // that the same name sets larger over two lines, so a name
                    // with somewhere to break takes them.
                    if (scaled >= TWO_LINE.size || this.text.indexOf(' ') === -1) {
                        this.fontSize = scaled
                        this.lineHeight = Math.round(
                            scaled * ONE_LINE.lineHeight / ONE_LINE.size
                        )
                        return
                    }

                    // Wrapped, but never past two lines: a third pushes the
                    // sessions down the screen.
                    const style = window.getComputedStyle(el)

                    this.fontSize = largestSizeWithinLines({
                        text: this.text,
                        width: available,
                        lines: 2,
                        maxSize: TWO_LINE.size,
                        minSize: TWO_LINE_FLOOR,
                        lineHeightRatio: TWO_LINE.lineHeight / TWO_LINE.size,
                        font: {
                            family: style.fontFamily,
                            weight: style.fontWeight,
                            // em, not the computed px: the real rule scales
                            // tracking with the size.
                            letterSpacing: '-0.02em',
                            textTransform: style.textTransform
                        }
                    })
                    this.lineHeight = Math.round(
                        this.fontSize * TWO_LINE.lineHeight / TWO_LINE.size
                    )
                    this.wraps = true
                })
            }
        }
    }

</script>
