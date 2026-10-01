<template>
    <div class="text-fit"
         :class="{ 'text-fit--lines': shrinkAtLine, 'text-fit--nowrap': nowrap }"
         ref="parent"
         :style="{ fontSize: fontSize + 'px' }">
        <div class="text-fit__content" ref="child" :style="{ opacity: ready ? 1 : 0 }">
            <slot></slot>
        </div>
    </div>
</template>

<script>

    // Binary-searches the largest font size at which the text still fits, and
    // never cuts it. Ported from the badge print app's TextFit, which solves the
    // same problem for a printed badge.
    //
    // Two contracts:
    //   shrinkAtLine   fit within that many lines, whatever the box height is
    //   (omitted)      fit within the height the parent has been given
    //
    // A heading held to one or two lines wants the first. A title dropped into
    // whatever space a flex row has left wants the second, because the number of
    // lines that fit is not known until layout has run.
    export default {
        props: {
            // Design size. Text that fits is left at this size.
            max: {
                type: Number,
                required: true
            },
            // Floor. The search clamps here rather than going smaller, so text
            // that cannot fit at all overflows rather than becoming unreadable.
            min: {
                type: Number,
                default: 24
            },
            // Number of lines to fit within. Omit to fit the parent's height.
            shrinkAtLine: {
                type: Number,
                default: null
            },
            // Hold the text on one line, so width alone decides the size.
            nowrap: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                fontSize: this.max,
                ready: false
            }
        },
        watch: {
            max: 'process',
            min: 'process',
            shrinkAtLine: 'process',
            nowrap: 'process'
        },
        created() {
            // Identifies the in-flight search, so a content change part way
            // through cannot apply a size measured against the previous text.
            this.pid = 0
        },
        mounted() {
            // Measuring before the webfont lands reads the fallback metrics, so
            // the text would be sized against the wrong font.
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(this.process)
            } else {
                this.process()
            }

            // The sign swaps sessions on its own clock and on pushed updates, so
            // the text changes under us without any prop changing.
            if (typeof MutationObserver !== 'undefined') {
                this.observer = new MutationObserver(this.process)
                this.observer.observe(this.$refs.child, {
                    childList: true,
                    subtree: true,
                    characterData: true
                })
            }
        },
        beforeDestroy() {
            if (this.observer) {
                this.observer.disconnect()
            }
            this.cancel()
        },
        methods: {
            cancel() {
                this.pid += 1
            },
            // Line height is read one pixel above the current size, as the print
            // app does it: a unitless line height scales with the font, and
            // reading it a step up leaves the comparison a little tolerance
            // rather than sitting exactly on the boundary.
            availableHeight() {
                const parent = this.$refs.parent

                if (!this.shrinkAtLine) {
                    // clientHeight is rounded to a whole pixel while the content
                    // measures fractionally, so a line that fits exactly loses by
                    // a fraction that is not really there. Measure the box the
                    // same way the content is measured.
                    const box = parent.getBoundingClientRect().height
                    const style = window.getComputedStyle(parent)

                    return box
                        - parseFloat(style.paddingTop)
                        - parseFloat(style.paddingBottom)
                        - parseFloat(style.borderTopWidth)
                        - parseFloat(style.borderBottomWidth)
                }

                const original = parseFloat(window.getComputedStyle(parent).fontSize)

                parent.style.fontSize = `${original + 1}px`
                const lineHeight = parseFloat(
                    window.getComputedStyle(this.$refs.child).lineHeight
                )
                parent.style.fontSize = ''

                return lineHeight * this.shrinkAtLine
            },
            fitsWithinWrapper() {
                const child = this.$refs.child
                const available = this.availableHeight()
                const width = this.$refs.parent.clientWidth

                // scrollWidth, not the bounding rect: the content is a block, so
                // its rect is always exactly the parent's width and would never
                // report the overflow. That only shows up on the scroll size.
                // Half a pixel of slack: both sides are fractional and a line
                // that fits exactly should not lose to floating point.
                return child.getBoundingClientRect().height <= available + 0.5
                    && child.scrollWidth <= width + 0.5
            },
            async apply(size) {
                this.fontSize = size
                await this.$nextTick()
            },
            async process() {
                if (!this.$refs.parent || !this.$refs.child) return

                const pid = ++this.pid

                this.ready = false

                await this.apply(this.max)
                if (pid !== this.pid) return

                // Common case: it fits as designed, nothing to search for.
                if (this.fitsWithinWrapper()) {
                    return this.settle(this.max, pid)
                }

                let low = this.min
                let high = this.max
                let size = this.min

                while (low <= high) {
                    const mid = Math.floor((low + high) / 2)

                    await this.apply(mid)
                    if (pid !== this.pid) return

                    if (this.fitsWithinWrapper()) {
                        size = mid
                        low = mid + 1
                    } else {
                        high = mid - 1
                    }
                }

                await this.apply(size)
                if (pid !== this.pid) return

                this.settle(size, pid)
            },
            settle(size, pid) {
                if (pid !== this.pid) return

                this.ready = true
                // Lets a caller apply its own rule about what is too small.
                this.$emit('fit', size)
            }
        }
    }

</script>

<style>

    .text-fit {
        height: 100%;
    }

    .text-fit__content {
        /* Kept in the document while it settles: hiding it outright would make
           it unmeasurable. */
        transition: opacity 0.2s ease;
        overflow-wrap: break-word;
    }

    /* Fitting to a line count means the box must not bound the search, so the
       content sets the height instead. */
    .text-fit--lines {
        height: auto;
    }

    .text-fit--nowrap .text-fit__content {
        white-space: nowrap;
    }

</style>
