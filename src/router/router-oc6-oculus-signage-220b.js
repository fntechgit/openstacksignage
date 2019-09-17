import Vue from 'vue'
import VueRouter from 'vue-router'

import Screen from '../components/oc6-oculus-220b/signage/screen.vue'

Vue.use(VueRouter)

export const $router = new VueRouter({ routes: [
    { path: '*', name: 'home', component: Screen }
]})
