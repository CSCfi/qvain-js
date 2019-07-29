<!-- ADD_LICENSE_HEADER -->
<template>
	<div />
</template>

<script>
export default {
	name: "Login",
	async created() {
		// User should have a CSC username
		if (this.$route.query.missingcsc) {
			this.handleLoginError("missingcsc")
			return
		}

		// User should have home organization
		if (this.$route.query.missingorg) {
			this.handleLoginError("missingorg")
			return
		}

		// User should now have an active session, and we can fetch session data from the backend
		if (this.$auth.loggedIn || await this.$auth.login()) {
			this.$router.push({ name: 'datasets' })
		} else {
			this.handleLoginError("sessionerror")
		}
	},
	methods: {
		handleLoginError(error) {
			this.$auth.setLoginError(error)
			this.$auth.setUser(null)
			this.$router.replace({ name: 'home' })
		},
	},
}
</script>
