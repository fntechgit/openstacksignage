import moment from 'moment'
import { $store } from '../store'
//import { SUMMIT, EVENTS } from '../data'

export default class Schedule {

    events = []
    banners = []
    location = null

    offset = 0
    timezone = 0

    timeout = null

    state = {
        now: null,
        track: null,
        events: {
            curr: null,
            next: null,
            prev: null,
            all: null,
            upcoming: null
        },
        scheduled_banners: {
            curr: null,
            next: null,
            prev: null
        },
        static_banner: null
    }

    get scheduled_banners() {
        return this.banners.filter(function (banner) {
            return banner.class_name === 'ScheduledSummitLocationBanner'
        })
    }

    get static_banner() {
        let banner = this.banners.filter(function (banner) {
            return banner.class_name !== 'ScheduledSummitLocationBanner'
        })[0]
        return typeof banner === 'undefined' ? null : banner;
    }

    setup() {

        return new Promise((resolve, reject) => {

            this.getLocation().then(() => {

                let params = new URLSearchParams(window.location.href.split('?')[1])
                this.debug = !!params.get('debug')

                // // Uncomment for offline debugging.
                // this.offset = 10*60
                // this.timezone = -3*60*60
                // this.events = EVENTS
                // $store.commit('setSummit', SUMMIT)
                // this.room = $store.getters.room(this.location)
                // this.setupClock()
                // this.update()
                // return resolve()

                this.loadSummit().then(summit => {

                    this.room = $store.getters.room(this.location)
                    this.floor = $store.getters.floor(this.location)

                    return Promise.all([this.loadEvents(), this.loadBanners()]).then(() => {
                        return this.syncTime().then(() => {
                            this.state.static_banner = this.static_banner
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

    loadEvents() {
        return $store.dispatch('loadEvents', this.location).then(payload => {
            this.events = payload.data.data; return this
        })
    }

    loadBanners() {
        return $store.dispatch('loadBanners', this.location).then(payload => {
            this.banners = payload.data.data; return this
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

        let events = { curr: null, next: [], prev: [], upcoming: [], all: [] }
        let banners = { curr: null, next: [], prev: [] }
        let track = null
        
        this.events.forEach(event => {
            
            if (this.state.now >= event.end_date) {
                
                events.prev.push(event)
                
            } else {
                
                events.next.push(event)
                
                if (this.isToday(event.end_date)) {
                    
                    events.upcoming.push(event)
                    events.all.push(event)
                    
                    if (track == null && event.track) {
                        
                        track = event.track
                    }
                }
            }
        })
        
        this.state.track = track
        
        this.scheduled_banners.forEach(banner => {
            if (this.state.now >= banner.end_date) {
                banners.prev.push(banner)
            } else (
                banners.next.push(banner)
            )
        })

        if (events.next.length && events.next[0].start_date - 60 <= this.state.now) {
            let next = events.next.shift()
            
            if (events.next.length && events.next[0].start_date - 60 <= this.state.now) {
                
                events.curr = events.next.shift()
                
            } else {
                
                events.curr = next
            }
            
            events.upcoming.shift()
        }

        if (banners.next.length && banners.next[0].start_date <= this.state.now) {
            banners.curr = banners.next.shift()
        }

        this.state.events = { ...this.state.events,
            curr: events.curr,
            prev: events.prev.length ? events.prev[events.prev.length-1] : null,
            next: events.next.length ? events.next[0] : null,
            all: events.all.length ? events.all : null,
            upcoming: events.upcoming.length ? events.upcoming : null,
        }

        this.state.scheduled_banners = { ...this.state.scheduled_banners,
            curr: banners.curr,
            prev: banners.prev.length ? banners.prev[banners.prev.length-1] : null,
            next: banners.next.length ? banners.next[0] : null,
        }

        this.setupTimer()
    }

    setupTimer() {
        if (this.state.events.curr && this.state.scheduled_banners.curr) { // Wait for current event or banner to finish.
            let end_date = Math.min(this.state.events.curr.end_date, this.state.scheduled_banners.curr.end_date)
            return this.setTimeout(
                (end_date - this.state.now) * 1000
            )
        } else if (this.state.events.curr) {
            if (!(this.state.events.next && this.state.events.curr.end_date > this.state.events.next.start_date)) {
                return this.setTimeout(
                    (this.state.events.curr.end_date - this.state.now) * 1000
                )
            }
        } else if (this.state.scheduled_banners.curr) {
            if (!(this.state.scheduled_banners.next && this.state.scheduled_banners.curr.end_date > this.state.scheduled_banners.next.start_date)) {
                return this.setTimeout(
                    (this.state.scheduled_banners.curr.end_date - this.state.now) * 1000
                )
            }
        }

        if (this.state.events.next && this.state.scheduled_banners.next) { // Wait for next event or banner to start.
            let start_date = Math.min(this.state.events.next.start_date, this.state.scheduled_banners.next.start_date)
            return this.setTimeout(
                (start_date - this.state.now) * 1000
            )
        } else if (this.state.events.next) {
            return this.setTimeout(
                (this.state.events.next.start_date - 60 * 1 - this.state.now) * 1000
            )
        } else if (this.state.scheduled_banners.next) {
            return this.setTimeout(
                (this.state.scheduled_banners.next.start_date - this.state.now) * 1000
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

    isWithin45Minutes(timestamp) {
        return this.getDate(timestamp).diff(this.now() - (15 * 60 * 1000), 'h');   
    }

    setOffset(offset) {
        this.offset = offset; this.update()
    }
}
