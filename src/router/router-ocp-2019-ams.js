import Vue from 'vue'
import VueRouter from 'vue-router'

import Screen from '../components/ocp-2019-ams/screen.vue'

Vue.use(VueRouter)

export const $router = new VueRouter({ routes: [
    { path: '*', name: 'home', component: Screen }
]})
