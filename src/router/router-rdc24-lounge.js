import Vue from 'vue'
import VueRouter from 'vue-router'
import VueQRCodeComponent from 'vue-qrcode-component'

import Screen from '../components/fntech/rdc/2024/lounge/screen.vue'

Vue.use(VueRouter)
Vue.component('qr-code', VueQRCodeComponent)

export const $router = new VueRouter({ routes: [
    { path: '*', name: 'home', component: Screen }
]})
