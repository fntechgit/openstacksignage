import Vue from 'vue'
import VueRouter from 'vue-router'

import Screen from '../components/fntech/ocp/2024/global/scaling-innovation/screen.vue'

Vue.use(VueRouter)

export const $router = new VueRouter({ routes: [
    { path: '*', name: 'home', component: Screen }
]})
