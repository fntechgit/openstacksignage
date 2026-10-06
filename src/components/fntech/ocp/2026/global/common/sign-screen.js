import moment from 'moment'

/**
 * What every 2026 OCP sign does regardless of which template it is: read the
 * track, decide whether there is anything to show, and let the debug table move
 * the clock.
 *
 * What a template keeps for itself is what differs between them: the virtual
 * session URL and when the day counts as over.
 */
export default {
    computed: {
        // The track bar takes its colours from the track, and drops a step when
        // the name is long enough to otherwise run past the bar.
        trackStyle() {
            const track = this.schedule.state.track || {}
            const name = track.name || ''

            return {
                backgroundColor: track.color || '#ffffff',
                color: track.text_color || '#191A4F',
                fontSize: name.length > 32 ? '40px' : '48px'
            }
        },
        // A room that has filled sends its overflow audience elsewhere, and the
        // sign says so instead of showing the session as normal.
        isOverflowEvent() {
            const current = this.schedule.state.events.curr

            return !!(current && current.overflow_url)
        },
        hasEvents() {
            const next = this.schedule.state.events.next

            return !!this.schedule.state.events.curr
                || !!(next && this.schedule.isToday(next.start_date))
        },
        // The bottom strip holds one banner. A scheduled banner, while it is
        // live, takes the place of the static one rather than scrolling over it.
        bottomBanner() {
            return this.schedule.state.scheduled_banners.curr
                || this.schedule.state.static_banner
        }
    },
    methods: {
        // Track names arrive prefixed for the engineering workshop track.
        formatTrackName(name) {
            return name.replace('EW: ', '')
        },
        // Debug table: jump to just before a session starts, or just before it
        // ends, so both transitions can be watched without waiting for them.
        syncStart(item) {
            this.schedule.setOffset(
                item.start_date - moment.utc().unix() - 65
            )
        },
        syncEnd(item) {
            this.schedule.setOffset(
                item.end_date - moment.utc().unix() - 5
            )
        }
    }
}
