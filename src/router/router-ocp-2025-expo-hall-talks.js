import Vue from 'vue'
import VueRouter from 'vue-router'
import QRCodeStyled from '../components/common/qr-code-styled.vue'

import Screen from '../components/fntech/ocp/2025/global/expo-hall-talks/screen.vue'

Vue.use(VueRouter)
Vue.component('qr-code', QRCodeStyled)

export const $router = new VueRouter({ routes: [
    { path: '*', name: 'home', component: Screen }
]})
