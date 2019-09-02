<!--
This file is part of Qvain -project.

Author(s):
	Jori Niemi <3295718+tahme@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<div />
</template>

<script>


// After logging in, the backend will redirect the browser to the Login component,
// which will perform checks on the response, fetch session data and redirect the
// user to the appropriate page.
export default {
	name: "Login",
	async created() {
		if (this.$route.query.missingcsc) { // User should have a CSC username
			this.handleLoginError("missingcsc")
		} else if (this.$route.query.missingorg) { // User should have a home organization
			this.handleLoginError("missingorg")
		} else if (this.$auth.loggedIn) { // If we already have a session, just redirect the user
			this.handleLoggedIn()
		} else if (await this.$auth.loadSession()) { // Fetch session data from the backend
			this.handleLoggedIn()
		} else {
			this.handleLoginError("sessionerror")
		}
	},
	methods: {
		handleLoggedIn() {
			this.$router.push({ name: 'datasets' })
		},
		handleLoginError(error) {
			this.$auth.setLoginError(error)
			this.$auth.setUser(null)
			this.$router.replace({ name: 'home' })
		},
	},
}
</script>
