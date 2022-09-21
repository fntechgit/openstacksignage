import Vue from 'vue'
import VueRouter from 'vue-router'
import VueQRCodeComponent from 'vue-qrcode-component'

import Screen from '../components/fntech/ocp/2022/global/expo-hall-talks/screen.vue'

Vue.use(VueRouter)
Vue.component('qr-code', VueQRCodeComponent)

export const $router = new VueRouter({ routes: [
    { path: '*', name: 'home', component: Screen }
]})
