import firebase from 'firebase'

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

db.ref('reload').on('value', () => {
    if (firstRun) {
        return firstRun = false
    }
    location.reload()
})
