import Vue from 'vue'
import App from './components/app.vue'
import Screen from './components/schedule/screen.vue'

import Schedule from './model/schedule'
import { $store } from './store'

require('./firebase')

Vue.component('screen', Screen)

new Vue({
    el: '#app',
    store: $store,
    render: h => h(App)
})

const schedule = new Schedule()

if ($store.getters.schedule) {
    $store.commit('setSchedule', null)
}

if ($store.getters.error) {
    $store.commit('setError', null)
}

schedule.setup().then(() => {
    $store.commit('setSchedule', schedule);
}).catch(error => {
    $store.commit('setError', error);
})