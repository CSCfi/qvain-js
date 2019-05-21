import axios from 'axios'
import {parseJwt, getRandomString} from './jwt.js'

const TokenName = "jwt"

function User() {
	this.id = ""
	this.name = ""
	this.email = ""
	this._jwt = null
}
User.prototype.constructor = User

User.prototype.getId = function() {
	this._id.length > 0 ? this._id : null
}

function UserFromToken(token) {
	let jwt = parseJwt(token)

	if (jwt && jwt['sub']) {
		let user = new User()

		// Join given_name and family_name if available
		const nameParts = []
		if (jwt['given_name']) {
			nameParts.push(jwt['given_name']);
		}
		if (jwt['family_name']) {
			nameParts.push(jwt['family_name']);
		}
		user.name = nameParts.join(" ") || jwt['name'] || ""
		user.id = jwt['CSCUserName'] || jwt['sub']
		user.email = jwt['email'] || ""
		user.expires = jwt['exp'] ? parseUnixTime(jwt.exp) : null

		// Get IDA projects
		if (jwt['group_names']) {
			user.projects =
				filterGroups("fairdata:IDA01:", jwt['group_names']) // old prefix
				.concat(filterGroups("IDA01:", jwt['group_names'])) // new prefix
		} else {
			user.projects = []
		}

		// SAML/HAKA
		user.eppn = jwt['eppn'] || null
		user.organisation = jwt['schacHomeOrganization'] || null
		user.organisation_type = jwt['schacHomeOrganizationType'] || null

		// cache for debugging purposes
		user._jwt = jwt
		return user
	}
	return null
}

// CSC/IDA specific: Get the project number of those projects that are IDA projects
// fairdata:IDA01:2001036 --> 2001036
function filterGroups(prefix, groups) {
	// strip first dot
	//return groups.filter(grp => grp.startsWith(prefix).map(grp => grp.substring(grp.indexOf(":")+1))

	// strip until last dot
	//return groups.filter(grp => grp.startsWith(prefix).map(grp => grp.substring(grp.indexOf(":")+1))

	// remove prefix and accept numbers only
	return groups.filter(grp => grp.startsWith(prefix)).map(grp => grp.substring(prefix.length)).filter(grp => !isNaN(grp))
}

function Auth(loginUrl, logoutUrl, sessionsUrl) {
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
				return loginUrl + '?' + getRandomString(8)
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

Auth.prototype.login = function(token) {
	this.setUser(UserFromToken(token))

	if (this.loggedIn) {
		localStorage.setItem(TokenName, token)
		return true
	}
	localStorage.removeItem(TokenName)
	return false
}

Auth.prototype.logout = async function() {
	try {
		// delete backend session
		await axios.post(
			this.logoutUrl, {
				timeout: 5000,
				responseType: 'json',
				headers: {
					'Accept': 'application/json',
				},
			})
	} catch (error) {
		// a non-401 error here means the backend session probably wasn't deleted
		if (error.response.status != 401) {
			return false
		}
	}

	// clear user and stored token
	this.setUser(null)
	localStorage.removeItem(TokenName)
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

Auth.prototype.resumeSession = async function() {
	// If there is an ID token in localStorage, check if we have an 
	// existing session and can login with the token. If not, remove token.
	let success = false
	const token = localStorage.getItem(TokenName)
	if (token) {
		const session = await this.getSession()
		if (session) {
			success = this.login(token)
		}
	}
	if (!success) {
		localStorage.removeItem(TokenName)
	}
	return false
}

Auth.prototype.defineProperty = Object.defineProperty

// parseUnixTime converts seconds to epoch to a Javascript date object, or null in case of error.
function parseUnixTime(secs) {
	const date = new Date(0)
	date.setUTCSeconds(secs)
	if (isNaN(date)) {
		return null
	}
	return date
}

export default Auth
