/* ADD_LICENSE_HEADER */
import Vue from 'vue'
import VueRouter from 'vue-router'

import Welcome from './views/Welcome.vue'
import Datasets from './views/Datasets.vue'
import Editor from './views/Editor.vue'
import UserInfo from './views/UserInfo.vue'
import SingleTab from './views/SingleTab.vue'
import Token from './auth/token.vue'
import Config from './views/Config.vue'

Vue.use(VueRouter)

// routes
const routes = [
	{ path: '/', name: "home", component: Welcome, props: true },
	{ path: '/token', component: Token, props: false },
	{ path: '/datasets', name: "datasets", component: Datasets, props: false, meta: { auth: true } },
	{ path: '/config', component: Config, props: false },
	{ path: '/userinfo', component: UserInfo, props: false, meta: { auth: true } },
	{ path: '/dataset/:id', name: "editor", component: Editor, props: true, meta: { auth: true }, children: [
		{ path: ':tab', name: "tab", component: SingleTab },
		{ path: ':tab/:project?/:relpath*', name: 'files', component: SingleTab }, // what is this for?
	]},
	{ path: '*', redirect: { name: 'home' } },
]

// mode: history or hash
export default new VueRouter({
	mode: 'history',
	fallback: true,
	base: process.env.VUE_APP_PUBLIC_PATH,
	routes,
})
