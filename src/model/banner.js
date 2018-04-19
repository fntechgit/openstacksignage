import moment from 'moment'
import { $store } from '../store'

export default class Banner {

    banners = []
    location = null

    offset = 0
    timezone = 0

    state = {
        now: null,
        static_banner: null
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
                this.debug = params.get('debug') ? true : false

                this.loadSummit().then(summit => {

                    this.room = $store.getters.room(this.location)
                    this.floor = $store.getters.floor(this.location)

                    return this.loadBanners().then(() => {

                        return this.syncTime().then(() => {

                            this.state.static_banner = this.static_banner
                            resolve()
                        })
                    })

                }).catch(reject)

                this.setupClock()

            }).catch(reject)
        })
    }

    setupClock() {
        setTimeout(() => { // Start at .0000
            setInterval(() => this.tick(), 1000)
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

    isToday(timestamp) {
        return this.getDate(timestamp).isSame(this.now(), 'd')
    }

    setOffset(offset) {
        this.offset = offset; this.update()
    }
}
