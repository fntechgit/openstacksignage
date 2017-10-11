import axios from 'axios'
import { $store } from '../store'
import { API_URL, API_VERSION } from '../config'

export default class Request {

    config = null

    constructor(endpoint, config) {
        this.config = { ...config,
            url: `${API_URL}/api/${API_VERSION}/${endpoint}`
        }
    }

    send() {
        return new Promise((resolve, reject) => {
            return $store.dispatch('auth/login').then(oauth => {
                return axios({ ...this.config, headers: {
                    Authorization: 'Bearer ' + oauth.access_token
                }}).then(resolve)
            }).catch(reject)
        })
    }
}
