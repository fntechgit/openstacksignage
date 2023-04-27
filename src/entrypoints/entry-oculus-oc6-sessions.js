import Vue from 'vue'
import App from '../components/app.vue'

import Sessions from '../model/sessions'
import { $store } from '../store'
import { $router } from '../router/router-oculus-oc6-sessions'

require('../ably')
require('../realtime-updates');

$router.beforeEach((to, from, next) => {
    const schedule = new Sessions()

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
