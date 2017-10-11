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
        }
    },
    actions: {
        loadDate() {
            return axios.get(TIME_URL).then(payload => {
                payload.data.timestamp = Math.ceil(
                    payload.data.timestamp
                ); return payload
            })
        },
        loadSummit(context) {
            if (context.state.summit) {
                return new Promise(
                    resolve => resolve(context.state.summit)
                )
            }
            return axios.get(getEndpoint('summits')).then(response => {
                return context.state.summit = response.data.data.pop()
            })
        },
        loadEvents(context, location) {
            const query = qs.stringify({
                // 'filter[]': [
                //     'start_date>' + moment.utc().startOf('day').unix(),
                //     'start_date<' + moment.utc().endOf('day').unix()
                // ],
                page: 1,
                per_page: 100
            }, { indices: false })

            return axios.get(getEndpoint(
                `summits/current/locations/${location}/events/published?${query}`
            ))
        }
    },
    mutations: {
        setError(state, error) {
            state.error = error
        },
        setSchedule(state, schedule) {
            state.schedule = schedule
        }
    }
})

function getEndpoint(resource) {
    return `${API_URL}/api/public/${API_VERSION}/${resource}`
}
