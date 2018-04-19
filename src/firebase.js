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

db.ref('static-template-array-base64').on('value', snapshot => {
    let decoded = atob(snapshot.val())
    let array = JSON.parse(decoded)

    // array containing locations ids that should use static banner template
    let locations = array.map(Number)

    $store.dispatch('getLocation').then(location => {
        let pathName = window.location.pathname
        let shouldUseBannerTemplate = locations.includes(location)

        if ((shouldUseBannerTemplate && pathName == '/banner.html') || (!shouldUseBannerTemplate && pathName == '/') ) {
            return
        }
        let template = shouldUseBannerTemplate ? '/banner.html' : '/'
        let params = new URLSearchParams(window.location.href.split('?')[1])
        let url = template + '?' + params
        window.location.replace(url)
    })
})