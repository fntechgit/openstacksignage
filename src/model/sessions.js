import moment from 'moment'
import { $store } from '../store'
//import { SUMMIT, EVENTS } from '../data'

export default class Sessions {

    events = []
    location = null

    offset = 0
    timezone = 0

    timeout = null

    state = {
        now: null,
        events: {
            curr: null,
            next: null,
            prev: null,
            upcoming: null
        },
    }

    setup() {

        return new Promise((resolve, reject) => {

            this.getLocation().then(() => {

                let params = new URLSearchParams(window.location.href.split('?')[1])
                this.debug = !!params.get('debug')

                this.loadSummit().then(summit => {

                    return Promise.all([this.loadAllEvents()]).then(() => {
                        return this.syncTime().then(() => {
                            this.update(); resolve()
                        })
                    })
                }).catch(reject)

                this.setupClock()

            }).catch(reject)
        })
    }

    setupClock() {
        setTimeout(() => { // Start at .0000
            setInterval(() => this.tick(), 1000); this.update()
        }, 1000 - new Date().getTime() % 1000)
    }

    getLocation() {
        return $store.dispatch('getLocation').then(location => {
            this.location = location; return this
        })
    }

    loadSummit() {
        return $store.dispatch('loadSummit').then(summit => {
            this.timezone = summit.time_zone.offset; return this
        })
    }

    loadAllEvents() {
        return $store.dispatch('loadAllEvents', this.location).then(payload => {
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

    now() {
        return this.getDate(this.state.now)
    }

    update() {
        this.tick()

        let events = { curr: null, next: [], prev: [], upcoming: [] }
        
        this.events.forEach(event => {
            
            if (event.end_date < this.state.now + 1) {
                
                events.prev.push(event)
                
            } else {
                
                events.next.push(event)
            }
        })

        events.next.sort((a, b) => a.start_date - b.start_date || a.end_date - b.end_date);

        events.upcoming = events.next.filter(event => this.isToday(event.end_date));

        // remove duplicates
        events.next = events.next.filter((event, index, self) =>
            index === self.findIndex((e) => (
                e.start_date === event.start_date && e.end_date === event.end_date
            ))
        )

        events.next.sort((a, b) => a.end_date - b.end_date);

        this.state.events = { ...this.state.events,
            curr: events.curr,
            prev: events.prev.length ? events.prev[events.prev.length-1] : null,
            next: events.next.length ? events.next[0] : null,
            upcoming: events.upcoming.length ? events.upcoming : null,
        }

        this.setupTimer()
    }

    setupTimer() {

        if (this.state.events.next) {
            return this.setTimeout(
                ((this.state.events.next.end_date - this.state.now) * 1000 ) + 1000
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

    todayDate() {
        return this.now().date()
    }

    isToday(timestamp) {
        return this.getDate(timestamp).isSame(this.now(), 'd')
    }

    isWithinHour(timestamp) {
        return this.getDate(timestamp).diff(this.now(), 'h');   
    }

    setOffset(offset) {
        this.offset = offset; this.update()
    }
}
