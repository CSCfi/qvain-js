/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
import Auth from './auth.js'

// addGlobalGuard adds a hook to Vue router that checks for a boolean `auth` on each route and, if necessary, sends the user to a login page if they are not logged in.
function addGlobalGuard(router, auth, loginPage) {
	if (!loginPage) {
		loginPage = "/"
	}

	router.beforeEach(async (to, from, next) => {
		// wait until session is loaded
		await auth.waitForResumeSession()

		// if the route needs authentication...
		if (to.matched.some(record => record.meta.auth)) {
			// this route requires auth, check if logged in, else send to login page
			if (!auth.loggedIn) {
				next({
					path: loginPage,
					query: { redirect: to.fullPath },
				})
			} else {
				next() // success, next
			}
		} else {
			next() // no auth needed, next
		}
	})
}

// plugin for Vue
// options:
//   router: vue router object
//   loginUrl: url to login api
//   logoutUrl: url to logout api
//   sessionUrl: url to sessions api
function plugin(Vue, options) {
	if (plugin.installed) {
		return
	}
	plugin.installed = true

	if (!options) {
		options = {}
	}

	if (Vue.util && Vue.util.defineReactive) {
		Auth.prototype.defineProperty = Vue.util.defineReactive
	} else {
		console.warn("auth plugin: Vue.util.defineReactive not found on Vue instance")
	}

	const auth = new Auth(options.loginUrl, options.logoutUrl, options.sessionsUrl)
	auth.resumeSession(true)

	if (options['router']) {
		addGlobalGuard(options.router, auth)
	}

	Object.defineProperty(Vue.prototype, '$auth', {
		get () { return auth },
	})
}

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(plugin)
}

export default plugin
