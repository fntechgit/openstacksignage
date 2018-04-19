import Vue from 'vue'
import App from './components/app.vue'
import Screen from './components/banner/screen.vue'

import Banner from './model/banner'
import { $store } from './store'

require('./firebase')

Vue.component('screen', Screen)

new Vue({
    el: '#app',
    store: $store,
    render: h => h(App)
})

const banner = new Banner()

if ($store.getters.banner) {
    $store.commit('setBanner', null)
}

if ($store.getters.error) {
    $store.commit('setError', null)
}

banner.setup().then(() => {
    $store.commit('setBanner', banner);
}).catch(error => {
    $store.commit('setError', error);
})