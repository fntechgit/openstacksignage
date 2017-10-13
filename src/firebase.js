import firebase from 'firebase'
import { $store } from './store'

let firstRun = true

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
    if (firstRun) {
        return firstRun = false
    }

    const [ location, timestamp ] = snapshot.val().split('&')

    $store.dispatch('updateTime', {
        location: parseInt(location),
        timestamp: parseInt(timestamp),
    })
})
