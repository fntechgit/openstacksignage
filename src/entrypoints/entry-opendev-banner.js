import Vue from 'vue'
import App from '../components/app.vue'

import Banner from '../model/banner'
import { $store } from '../store'
import { $router } from "../router/router-opendev-banner";

require('../firebase')

$router.beforeEach((to, from, next) => {
    const banner = new Banner()

    if ($store.getters.banner) {
        $store.commit('setBanner', null)
    }

    if ($store.getters.error) {
        $store.commit('setError', null)
    }

    banner.setup().then(() => {
        $store.commit('setBanner', banner); next()
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