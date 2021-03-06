/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Aaron Hakala <aaron.hakala@metropolia.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
import Vue from 'vue'
import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'

import './assets/css/qvain.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
import * as fas from '@fortawesome/free-solid-svg-icons'

import router from './router.js'
import store from './store.js'
import FilesStore from './vuex/files.js'
import AuthPlugin from './auth/plugin.js'

if (process.env.NODE_ENV === "development") {
	Vue.config.performance = true    // enable User Timing API for better profiling
	Vue.config.productionTip = false // disable console warning that developer mode is being used
}
Vue.use(BootstrapVue)

Vue.use(AuthPlugin, {
	router: router,
	loginUrl: "/api/auth/login",
	logoutUrl: "/api/sessions/logout",
	sessionsUrl: "/api/sessions/",
})

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)
library.add(fas.faUser, fas.faInfo, fas.faMinus, fas.faPlus, fas.faTimes,
	fas.faAngleRight, fas.faQuoteLeft, fas.faExclamationTriangle, fas.faSync, fas.faQuestionCircle,
	fas.faDatabase, fas.faPen, fas.faTrash, fas.faHistory, fas.faClock, fas.faCloudUploadAlt,
	fas.faCircleNotch, fas.faList, fas.faListAlt, fas.faUndo, fas.faExternalLinkAlt, fas.faEllipsisV,
	fas.faSave, fas.faCircle, fas.faSpinner, fas.faSignInAlt, fas.faSignOutAlt, fas.faTable, fas.faUpload,
	fas.faExclamation, fas.faEdit, fas.faChevronLeft, fas.faChevronRight, fas.faChevronDown,
	fas.faBackward, fas.faUniversalAccess)

store.registerModule('files', FilesStore)

// create and mount the root instance
// eslint-disable-next-line no-unused-vars
const app = new Vue({
	router,
	store,
	data: {
		user: null,
		language: null,
		dismissSecs: 5,
		dismissCountDown: 0,
		alertText: "hello there!",
		alertVariant: "dark",
	},
	computed: {
		authenticated() {
			return this.user !== null
		},
	},
	watch: {
		language(val) {
			this.showAlert("language set to: " + val)
		},
	},
	methods: {
		countDownChanged (dismissCountDown) {
			this.dismissCountDown = dismissCountDown
		},
		showAlert (text, variant, persist) {
			if (!persist) {
				this.dismissCountDown = this.dismissSecs
			} else {
				this.dismissCountDown = true // show until manually dismissed
			}
			this.alertText = text
			this.alertVariant = variant || "dark"
		},
		dismissAlert () {
			this.dismissCountDown = 0
			this.alertText = null
			this.alertVariant = "dark"
		},
	},
	render: h => h(App),
}).$mount('#app')
