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
        ready: false,
        summit: null,
        banner: null,
        schedule: null,
        background: null,
        template: null,
        summit_id: null,
    },
    getters: {
        error(state) {
            return state.error
        },
        ready(state) {
            return state.ready
        },
        banner(state) {
            return state.banner
        },
        schedule(state) {
            return state.schedule
        },
        summit(state){
          return state.summit
        },
        background(state) {
            return state.background
        },
        template(state) {
            return state.template
        },
        room(state) {
            return locationId => state?.summit?.locations.filter(
                location => {
                    console.log(`Store::getRoom room locationId ${locationId} location.id ${location.id} location.name ${location.name}`)
                    return location.id == locationId
                }
            ).shift();
        },
        floor(state) {
            const location = state?.summit?.locations.filter(
                location => location.id === state.location
            ).shift()
            const venue = state?.summit?.locations.filter(
                venue => venue.id === location.venue_id
            ).shift()

            if (venue?.floors == null) {
                return locationId => null
            }
            return locationId => venue?.floors.filter(
                floor => {
                    return floor?.rooms && floor.rooms.some( r => r?.id == locationId)
                }
            ).shift()
        }
    },
    actions: {
        getLocation(context) {
            if (context.state.location) {
                return new Promise(
                    resolve => resolve(context.state.location)
                )
            }
            return new Promise((resolve, reject) => {
                let params = new URLSearchParams(window.location.href.split('?')[1])
                let location = parseInt(params.get('location'))
                if (isNaN(location)) {
                    reject('Missing location')
                } else {
                    resolve(context.state.location = location)
                }
            })
        },
        getSummitId(context) {
            if (context.state.summit_id) {
                return new Promise(
                    resolve => resolve(context.state.summit_id)
                )
            }
            return new Promise((resolve, reject) => {
                let params = new URLSearchParams(window.location.href.split('?')[1])
                let summit_id = parseInt(params.get('summit'))
                if (isNaN(summit_id)) {
                    reject('Missing Summit')
                } else {
                    resolve(context.state.summit_id = summit_id)
                }
            })
        },
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

            const params = new URLSearchParams(window.location.href.split('?')[1])
            const summit_id = parseInt(params.get('summit'))
            const query = qs.stringify({
                relationships: 'locations',
                expand: 'locations,locations.floors,locations.floors.rooms'
            }, { indices: false })

            return axios.get(getEndpoint(`summits/all/${summit_id}?${query}`)).then(response => {
                const {data} = response;
                return context.state.summit = data;
            })
        },

        loadEvents(context, location) {
            var params = new URLSearchParams(window.location.href.split('?')[1])
            var summit_id =  parseInt(params.get('summit'))

            const query = qs.stringify({
                 //'filter[]': [
                 //    'start_date>' + moment.utc().startOf('day').unix(),
                 //    'end_date<' + moment.utc().endOf('day').unix()
                 //],
                page: 1,
                per_page: 100,
                expand: 'track,track.track_groups,speakers,location'
            }, { indices: false })

            return axios.get(getEndpoint(
                `summits/${summit_id}/locations/${location}/events/published?${query}`
            ))
        },
        loadAllEvents(context, location) {
            var params = new URLSearchParams(window.location.href.split('?')[1])
            var summit_id =  parseInt(params.get('summit'))

            const query = qs.stringify({
                 //'filter[]': [
                 //    'start_date>' + moment.utc().startOf('day').unix(),
                 //    'end_date<' + moment.utc().endOf('day').unix()
                 //],
                page: 1,
                per_page: 100,
                expand: 'track,speakers,location'
            }, { indices: false })

            return axios.get(getEndpoint(
                `summits/${summit_id}/published-events?${query}`
            ))
        },
        loadBanners(context, location) {
            var params = new URLSearchParams(window.location.href.split('?')[1])
            var summit_id =  parseInt(params.get('summit'))

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
        loadTemplate(context, location) {
            var params = new URLSearchParams(window.location.href.split('?')[1])
            var summit_id =  parseInt(params.get('summit'));
            var location_id =  parseInt(params.get('location'));

            const query = qs.stringify({
                'filter[]': [
                    'location_id' + '==' + location_id
                ],
                page: 1,
                per_page: 100,
            }, { indices: false })

            return axios.get(getEndpoint(
                `summits/${summit_id}/signs?${query}`
            )).then(response => {
                const {data} = response;
                return data;
            })
        },
        reload(context, location) {
            const model = context.state.schedule || context.state.banner

            if ( ! handleFirebaseEvent(model, location)) {
                console.log("no valid")
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
        },
        updateEvents(context, {summit, eventsData, allIDXEvents}){
            const schedule = context.state.schedule
            schedule.update({eventsData, allIDXEvents, summit});
        },
    },
    mutations: {
        setError(state, error) {
            state.error = error
        },
        setSummit(state, summit) {
            state.summit = summit
        },
        setBanner(state, banner) {
            state.banner = banner
            state.ready = banner != null
        },
        setSchedule(state, schedule) {
            state.schedule = schedule
            state.ready = schedule != null
        },
        setBackground(state, background) {
            state.background = background
        },
        setTemplate(state, template) {
            let path = '/'
            if (window.location.pathname === path) {
                return
            }
            let params = new URLSearchParams(window.location.href.split('?')[1]);
            let url = path + template + '#/?' + params;
            window.location = url
            state.template = template
        },
    }
})

function getEndpoint(resource) {
    return `${API_URL}/api/public/${API_VERSION}/${resource}`
}

function handleFirebaseEvent(model, location) {
    if ( ! model) {
        return false
    }

    if (location !== 0 && location !== model.location) {
        return false
    }

    return true
}
