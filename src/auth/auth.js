/* ADD_LICENSE_HEADER */
import axios from 'axios'
import Vue from 'vue'

const HaveSessionName = "have_session"
const LoginErrorName = "login_error"

function User() {
	this.id = ""
	this.name = ""
	this.email = ""
}
User.prototype.constructor = User

function UserFromSession(session) {
	let user = new User()
	user.name = session.user.name
	user.email = session.user.email
	user.projects = session.user.projects
	user.id = session.user.identity
	user.organisation = session.user.organisation
	return user
}

function Auth(loginUrl, logoutUrl, sessionsUrl) {
	// reactive indicator for when session is being loaded from the back-end
	this.loading = Vue.observable({
		state: !!this.getHaveSession(), // true if there is a session in sessionStorage
	})

	// might be Vue's reactive setter
	this.defineProperty(Auth.prototype, "_user", {
		value: null,
		writable: true,
	})

	Object.defineProperty(Auth.prototype, "loggedIn", {
		get: function() {
			// WARNING: Do not compare to null! Vue observed objects will not equal null as they have at least the __ob__ key. Check for a specific property.
			//return this._user !== null
			return this._user && 'id' in this._user
		},
	})

	Object.defineProperty(Auth.prototype, "user", {
		get: function() {
			return this._user
		},
	})

	Object.defineProperty(Auth.prototype, "loginUrl", {
		get: function() {
			if (process.env.NODE_ENV === "development" && process.env.VUE_APP_DEV_TOKEN) {
				return loginUrl + '?token=' + process.env.VUE_APP_DEV_TOKEN
			} else {
				return loginUrl
			}
		},
	})

	Object.defineProperty(Auth.prototype, "logoutUrl", {
		get: function() {
			return logoutUrl
		},
	})

	Object.defineProperty(Auth.prototype, "sessionsUrl", {
		get: function() {
			return sessionsUrl
		},
	})
}
Auth.prototype.constructor = Auth

Auth.prototype.setUser = function(user) {
	this._user = user
}

Auth.prototype.login = async function() {
	this.loading.state = true
	await this.resumeSession(false) // fetch user session data
	if (this.loggedIn) {
		this.clearLoginError()
		return true
	}
	return false
}

Auth.prototype.logoutDueSessionTimeout = async function() {
	await this.logout(true)
}

Auth.prototype.logout = async function(doNotRedirect) {
	try {
		// delete backend session
		const response = await axios.post(
			this.logoutUrl, {
				timeout: 5000,
				responseType: 'json',
				headers: {
					'Accept': 'application/json',
				},
			})
		// redirect to fairdata logout
		if (response.data && response.data.redirect && !doNotRedirect) {
			window.location.href = response.data.redirect
		}
	} catch (error) {
		return false // logout failed
	}

	// clear user and stored session
	this.setUser(null)
	this.clearHaveSession()
	this.clearLoginError()
	return true
}

Auth.prototype.getSession = async function() {
	try {
		const response = await axios.get(
			this.sessionsUrl, {
				timeout: 5000,
				responseType: 'json',
				headers: {
					'Accept': 'application/json',
				},
			})
		return response.data
	} catch (error) {
		return null
	}
}

Auth.prototype.getHaveSession = function() {
	return JSON.parse(sessionStorage.getItem(HaveSessionName))
}

Auth.prototype.setHaveSession = function(haveSession) {
	return sessionStorage.setItem(HaveSessionName, JSON.stringify(haveSession))
}

Auth.prototype.clearHaveSession = function() {
	return sessionStorage.removeItem(HaveSessionName)
}

Auth.prototype.getLoginError = function() {
	return sessionStorage.getItem(LoginErrorName)
}

Auth.prototype.setLoginError = function(error) {
	return sessionStorage.setItem(LoginErrorName, error)
}

Auth.prototype.clearLoginError = function() {
	return sessionStorage.removeItem(LoginErrorName)
}

Auth.prototype.resumeSession = async function(checkStored) {
	// Check the backend if we have session and assign it to the user, if possible.
	//
	// If checkStored is true, abort if we don't have a stored session, which is useful
	// for avoiding a backend request when we already know we shouldn't have a session.
	// The session request will use a session cookie, but we cannot check for its
	// existence in JavaScript for security reasons.
	if (checkStored && !this.getHaveSession()) {
		this.loading.state = false
		return false
	}

	const session = await this.getSession()
	if (session) {
		this.setUser(UserFromSession(session))
		this.setHaveSession(true)
	} else {
		this.clearHaveSession()
		this.loading.state = false
		return false
	}

	this.loading.state = false
	return true
}

// waitForResumeSession resolves when resumeSession finishes (loading.state === false)
Auth.prototype.waitForResumeSession = async function() {
	const loading = this.loading
	if (loading.state === false) {
		return
	}

	return new Promise((resolve) => {
		// watch for changes with a dummy Vue instance https://github.com/vuejs/vue/issues/9509
		const unwatch = new Vue().$watch(() => loading.state, (value) => {
			if (value === false) {
				unwatch() // remove watcher
				resolve()
			}
		})
	})
}

Auth.prototype.defineProperty = Object.defineProperty

export default Auth
