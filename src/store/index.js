import qs from 'qs'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

import { API_URL, API_VERSION, TIME_URL } from '../config'

Vue.use(Vuex)

export const $store = new Vuex.Store({
    state: {
        error: null,
        summit: null,
        schedule: null,
    },
    getters: {
        error(state) {
            return state.error
        },
        schedule(state) {
            return state.schedule
        },
        room(state) {
            return locationId => state.summit.locations.filter(
                location => location.id === locationId
            ).shift()
        },
        floor(state) {
            return locationId => state.summit.locations[0].floors.filter(
                floor => floor.rooms && floor.rooms.indexOf(locationId) >= 0
            ).shift()
        }
    },
    actions: {
        loadDate() {
            return axios.get(TIME_URL).then(payload => {
                return Math.ceil(payload.data.timestamp)
            })
        },
        loadSummit(context) {
            if (context.state.summit) {
                return new Promise(
                    resolve => resolve(context.state.summit)
                )
            }

            const query = qs.stringify({
                relationships: 'none',
                expand: 'none'
            }, { indices: false })

            return axios.get(getEndpoint(`summits?${query}`)).then(response => {
                return context.state.summit = response.data.data.pop()
            })
        },
        loadEvents(context, location) {
            var summit_id = context.state.summit ? context.state.summit.id : 'current'

            const query = qs.stringify({
                // 'filter[]': [
                //     'start_date>' + moment.utc().startOf('day').unix(),
                //     'start_date<' + moment.utc().endOf('day').unix()
                // ],
                page: 1,
                per_page: 100,
                expand: 'track'
            }, { indices: false })

            return axios.get(getEndpoint(
                `summits/${summit_id}/locations/${location}/events/published?${query}`
            ))
        },
        loadBanners(context, location) {
            var summit_id = context.state.summit ? context.state.summit.id : 'current'

            const query = qs.stringify({
                // 'filter[]': [
                //     'class_name' + '==' + 'ScheduledSummitLocationBanner'
                // ],
                page: 1,
                per_page: 100,
                order: "+start_date"
            }, { indices: false })

            return axios.get(getEndpoint(
                `summits/${summit_id}/locations/${location}/banners?${query}`
            ))
        },
        reload(context, location) {
            const schedule = context.state.schedule

            if ( ! handleFirebaseEvent(schedule, location)) {
                return
            }

            window.location.reload()
        },
        updateTime(context, { location, timestamp }) {
            const schedule = context.state.schedule

            if ( ! handleFirebaseEvent(schedule, location)) {
                return
            }

            if (timestamp) {
                return schedule.setOffset(
                    timestamp - moment.utc().unix()
                )
            }

            schedule.syncTime()
        }
    },
    mutations: {
        setError(state, error) {
            state.error = error
        },
        setSummit(state, summit) {
            state.summit = summit
        },
        setSchedule(state, schedule) {
            state.schedule = schedule
        }
    }
})

function getEndpoint(resource) {
    return `${API_URL}/api/public/${API_VERSION}/${resource}`
}

function handleFirebaseEvent(schedule, location) {
    if ( ! schedule) {
        return false
    }

    if (location !== 0 && location !== schedule.location) {
        return false
    }

    return true
}
