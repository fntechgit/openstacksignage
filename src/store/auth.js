import qs from 'qs'
import axios from 'axios'
import moment from 'moment'

import {
    OAUTH_URL,
    OAUTH_SCOPE,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET
} from '../config'

export default {
    state: {
        token: null,
        expiration: null,
    },
    actions: {
        login(context) {
            if ( ! context.state.token) {
                return context.dispatch('aquire')
            }

            if (context.state.expiration.diff(moment(), 'seconds') <= 0) {
                return context.dispatch('aquire')
            }

            return new Promise(resolve => resolve(context.state.token))
        },
        aquire(context) {
            return axios({
                url: OAUTH_URL + '/oauth2/token?' + qs.stringify({
                    scope: OAUTH_SCOPE,
                    grant_type: 'client_credentials',
                    access_type: 'offline',
                }),
                headers: {
                    Authorization: 'Basic ' + btoa(
                        OAUTH_CLIENT_ID + ':' + OAUTH_CLIENT_SECRET
                    )
                },
                method: 'post',

            }).then(response => {
                context.commit('save', response.data); return response.data
            })
        },
        endpoint(context) {
            return new Promise((resolve, reject) => {
                context.dispatch('load').then(token => {
                })
            })
        }
    },
    mutations: {
        save(state, token) {
            state.token = token

            state.expiration = moment().add(
                token.expires_in, 'seconds'
            )
        }
    }
}