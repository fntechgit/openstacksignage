import Vue from 'vue'
import App from '../components/app.vue'

import PowerwallSchedule from '../model/powerwall-schedule'
import { $store } from '../store'
import { $router } from '../router/router-ocp-powerwall'

// Note: ably.js not included - powerwall is not location-specific
// and should not be redirected based on sign configuration
require('../realtime-updates');

$router.beforeEach((to, from, next) => {
    const schedule = new PowerwallSchedule()

    if ($store.getters.schedule) {
        $store.commit('setSchedule', null)
    }

    if ($store.getters.error) {
        $store.commit('setError', null)
    }

    schedule.setup().then(() => {
        $store.commit('setSchedule', schedule); next()
    }).catch(error => {
        $store.commit('setError', error); next()
    })
})

new Vue({
    el: '#app',
    store: $store,
    router: $router,
    render: h => h(App)
})
