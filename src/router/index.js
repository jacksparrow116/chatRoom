import Vue from 'vue'
import Router from 'vue-router'
import chatRoom from '@/components/chatRoom'
import login from '@/components/login'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/chatRoom',
            name: 'chatRoom',
            component: chatRoom
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/',
            redirect: '/login'
        }
    ]
})
