import { $store } from '../store'
import AbstractEventsModel from "./abstract-events-model";
//import { SUMMIT, EVENTS } from '../data'

export default class Sessions extends AbstractEventsModel {

    constructor() {
        super();
        this.includeLocations = null;
        this.excludeLocations = null;

        this.state = {
            now: null,
            events: {
                curr: null,
                next: null,
                prev: null,
                upcoming: null
            },
        };
    }

    setup() {

        super.setup();

        return new Promise((resolve, reject) => {

            this.getLocation().then(() => {

                let params = new URLSearchParams(window.location.href.split('?')[1])

                let includeLocations = params.get('include')
                if (includeLocations) {
                    this.includeLocations = includeLocations.split(',').map(Number)
                }

                let excludeLocations = params.get('exclude')
                if (excludeLocations) {
                    this.excludeLocations = excludeLocations.split(',').map(Number)
                }

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

    loadAllEvents() {
        return $store.dispatch('loadAllEvents', this.location).then(payload => {
            let data = payload.data.data
            let includes = this.includeLocations
            let excludes = this.excludeLocations
            if (includes != null) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if (!includes.includes(data[i].location.id)) {
                        data.splice(i, 1)
                    }
                }
            }
            if (excludes != null) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if (excludes.includes(data[i].location.id)) {
                        data.splice(i, 1)
                    }
                }
            }
            this.events = data; return this
        })
    }

    update(newState= {}) {

        this.tick()

        console.log('Sessions::update current state', this.events)

        super.update(newState);

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

}
