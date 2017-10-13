import moment from 'moment'
import { $store } from '../store'
import { SUMMIT, EVENTS } from '../data'

export default class Schedule {

    events = []
    location = null

    offset = 0
    timezone = 0

    timeout = null

    state = {
        now: null,
        curr: null,
        next: null,
        prev: null,
    }

    setup(route) {
        return new Promise((resolve, reject) => {
            if ( ! route.query.location) {
                return reject('Missing location')
            }

            this.location = parseInt(route.query.location)

            // // Uncomment for offline debugging.
            // this.offset = 10*60
            // this.timezone = -3*60*60
            // this.events = EVENTS
            // $store.commit('setSummit', SUMMIT)
            // this.setupClock()
            // this.update()
            // return resolve()

            this.loadSummit().then(() => {
                return this.loadEvents().then(() => {
                    return this.syncTime().then(() => {
                        this.update(); resolve()
                    })
                })
            }).catch(reject)

            this.setupClock()
        })
    }

    setupClock() {
        setTimeout(() => { // Start at .0000
            setInterval(() => this.tick(), 1000); this.update()
        }, 1000 - new Date().getTime() % 1000)
    }

    loadSummit() {
        return $store.dispatch('loadSummit').then(summit => {
            this.timezone = summit.time_zone.offset; return this
        })
    }

    loadEvents() {
        return $store.dispatch('loadEvents', this.location).then(payload => {
            this.events = payload.data.data; return this
        })
    }

    syncTime() {
        return $store.dispatch('loadDate').then(timestamp => {
            this.offset = moment.unix(timestamp).diff(
                moment.utc(), 'seconds'
            ); return this
        })
    }

    tick() {
        this.state.now = moment.utc().unix() + parseInt(this.offset)
    }

    update() {
        this.tick()

        let curr = null, next = [], prev = []

        this.events.forEach(event => {
            if (this.state.now >= event.end_date) {
                prev.push(event)
            } else (
                next.push(event)
            )
        })

        if (next.length && next[0].start_date <= this.state.now) {
            curr = next.shift()
        }

        this.state = { ...this.state, curr,
            prev: prev.length ? prev[prev.length-1] : null,
            next: next.length ? next[0] : null,
        }

        this.setupTimer()
    }

    setupTimer() {
        if (this.state.curr) { // Wait for current event to finish.
            return this.setTimeout(
                (this.state.curr.end_date - this.state.now) * 1000
            )
        }

        if (this.state.next) { // Wait for next event to start.
            return this.setTimeout(
                (this.state.next.start_date - this.state.now) * 1000
            )
        }
    }

    setTimeout(interval) {
        this.timeout && clearTimeout(this.timeout)

        const msOffset = new Date().getTime() % 1000

        this.timeout = setTimeout(() => this.update(),
            Math.min(interval, (5 * 60 * 1000)) - msOffset
        )
    }

    getDate(ts, raw) {
        return moment.unix(
            ts + ( ! raw ? parseInt(this.timezone) : 0)
        ).utc()
    }

    format(ts, raw) {
        return this.getDate(ts, raw).format(
            raw ? 'Y-MM-DD h:mm:ss A' : 'Y-MM-DD <b>h:mm:ss A</b>'
        )
    }

    setOffset(offset) {
        this.offset = offset; this.update()
    }
}
