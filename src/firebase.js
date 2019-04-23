import firebase from 'firebase'
import { $store } from './store'

let firstRun = {}

import {
    FIREBASE_API_KEY,
    FIREBASE_PROJECT_ID,
    FIREBASE_DATABASE_URL,
} from './config'

const db = firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    projectId: FIREBASE_PROJECT_ID,
    databaseURL: FIREBASE_DATABASE_URL,
}).database()

db.ref('time').on('value', snapshot => {
    if ( ! firstRun['time']) {
        return firstRun['time'] = true
    }

    const [ location, timestamp ] = snapshot.val().split('&')

    $store.dispatch('updateTime', {
        location: parseInt(location),
        timestamp: parseInt(timestamp),
    })
})

db.ref('reload').on('value', snapshot => {
    if ( ! firstRun['reload']) {
        return firstRun['reload'] = true
    }

    $store.dispatch('reload', parseInt(snapshot.val()))
})

db.ref('template-base64-object').on('value', snapshot => {
    let decoded = atob(snapshot.val())
    let obj = JSON.parse(decoded)

    $store.dispatch('getLocation').then(location => {
        var path = '/'
        Object.keys(obj).forEach(function (key) {

            let locations = obj[key].map(Number)
            if (key !== 'schedule' && locations.includes(location)) {
                path += key + '.html'
            }
        });
        
        if (window.location.pathname === path) {
            return
        }
        let params = new URLSearchParams(window.location.href.split('?')[1])
        let url = path + '#/?' + params

        window.location = url
    })
})

db.ref('background-base64-object').on('value', snapshot => {
    let decoded = atob(snapshot.val())
    let obj = JSON.parse(decoded)

    $store.dispatch('getLocation').then(location => {

        Object.keys(obj).forEach(function (key) {

            let locations = obj[key].map(Number)

            if (locations.includes(location)) {

                $store.commit('setBackground', key)
            }
        })
    })
})