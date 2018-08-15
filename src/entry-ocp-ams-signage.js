import Vue from 'vue'
import App from './components/app.vue'

import Schedule from './model/schedule'
import { $store } from './store'
import { $router } from './router/router-ocp-ams-signage'

require('./firebase')

$router.beforeEach((to, from, next) => {
    const schedule = new Schedule()

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
