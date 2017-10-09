import qs from 'qs'
import Vue from 'vue'
import Vuex from 'vuex'
import Auth from './auth'
import axios from 'axios'
import moment from 'moment'
import Request from '../model/request'

Vue.use(Vuex)

export const $store = new Vuex.Store({
    state: {
        error: null,
        schedule: null,
    },
    modules: {
        auth: { ...Auth, namespaced: true }
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
            return axios.get('http://www.convert-unix-time.com/api?timestamp=now')
        },
        // loadEvents(context, location) {
        //     return new Promise((resolve, reject) => {
        //         new Request(`summits/current/locations`).send().then(reject)
        //     })
        // }
        loadEvents(context, location) {
            const query = qs.stringify({
                'filter[]': [
                    'start_date>' + moment.utc().startOf('day').unix(),
                    'start_date<' + moment.utc().endOf('day').unix()
                ],
                page: 1,
                per_page: 100
            }, { indices: false })

            return new Request(
                `summits/current/locations/${location}/events/published?${query}`
            ).send()
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
