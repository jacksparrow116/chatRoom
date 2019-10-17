import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import './assets/public.css'

import store from './store'


import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3000',
    // vuex: {
    //     store,
    //     options: {
    //         actionPrefix: "SOCKET_",
    //         mutationPrefix: "SOCKET_",
    //         useConnectionNamespace: true
    //     }
    // }
}))

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store, // 使用store
    render: h => h(App)
})
