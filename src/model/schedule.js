import moment from 'moment'
import { EVENTS } from '../data'
import { $store } from '../store'

export default class Schedule {

    date = null
    offset = 0
    timeout = null

    state = {
        now: null,
        curr: null,
        next: null,
        prev: null,
        events: null,
    }

    setup(route) {
        return new Promise((resolve, reject) => {
            // if ( ! route.query.location) {
            //     return reject('Missing location')
            // }

            // $store.dispatch('loadDate').then(payload => {
            //     this.date = moment.unix(payload.data.timestamp)
            // }).catch(() => {
            //     this.date = moment()
            // })

            // $store.dispatch('loadEvents', route.query.location).then(payload => {
            //     console.log(this.prepareEvents(payload.data.data))
            //     resolve(this.state = this.locateEvents(payload.data.data))
            // }).catch(reject)


            setTimeout(() => {
                this.state.events = EVENTS

                this.update()
                setInterval(() => this.update(), 1000)

                resolve()
            }, 1000)
        })
    }

    now() {
        return moment.utc().unix() + parseInt(this.offset)
    }

    update() {
        this.state.now = this.now()

        let curr = null, next = [], prev = []

        this.state.events.forEach(event => {
            event._ds = event.start_date - this.state.now
            event._de = this.state.now - event.end_date

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

        // this.sleep()
    }

    sleep() {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }

        if (this.state.curr) {
            return this.timeout = setTimeout(() => this.update(),
                this.state.curr.end_date - this.state.now
            )
        }

        if (this.state.next) {
            return this.timeout = setTimeout(() => this.update(),
                this.state.now - this.state.next.start_date
            )
        }
    }
}
