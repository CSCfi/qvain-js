<!-- ADD_LICENSE_HEADER -->
<template>
	<b-navbar id="app-topbar" toggleable="sm" type="dark" variant="primary">
		<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

		<b-navbar-brand to="/">
			<img src="/static/imgs/Qvain_neg_300px.png" class="d-inline-block align-top" alt="Fairdata: Qvain">
		</b-navbar-brand>

		<b-collapse is-nav id="nav_collapse">

			<b-navbar-nav>
				<b-button variant="primary" target="_blank" rel="noopener noreferrer" href="https://www.fairdata.fi/en/qvain/qvain-user-guide/">
					<font-awesome-icon icon="info" />&nbsp;
					User Guide
				</b-button>
			</b-navbar-nav>

			<!-- right-aligned items -->
			<b-navbar-nav id="usermenu" class="ml-auto right-nav-items" >
				<b-nav-text v-if="$auth.loading.state" class="user-nav load-placeholder" key="user-loading">
					<font-awesome-icon icon="circle-notch" spin />
				</b-nav-text>

				<b-button-group v-else>
					<b-button v-if="$auth.loggedIn" id="usermenu_userinfo" variant="primary" to="/userinfo" >
						<font-awesome-icon icon="user" class="text-light mr-2" fixed-width /> <a id="usermenu_fullname">{{ $auth.user.name }}</a>
					</b-button>

					<b-button v-if="$auth.loggedIn || $auth.getLoginError()" id="usermenu_signout" variant="primary" @click="logout()">
						<font-awesome-icon icon="sign-out-alt" />
						&nbsp;
						Sign out
					</b-button>
					<b-button v-else id="usermenu_login" class="user-nav" key="user-login" variant="primary" :href="$auth.loginUrl">
						<font-awesome-icon icon="sign-in-alt" />
						&nbsp;
						Login
					</b-button>
				</b-button-group>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
	position: absolute;
}
.fade-move {
	transition: transform 0.2s;
}

.page-actions {
	margin-right: 1em
}

.btn-outline-primary {
	color: #eee;
	border-color: transparent;
}
.user-nav {
	float: right;
	text-align: center;
	&.dropdown {
		z-index: 900;
	}
	&.fade-leave-active {
		right: 0;
		top: 0;
	}
}

#app-subbar {
	background-color: #0092c7;
	border-top: 1px solid #00a4e0;
	border-bottom: 1px solid #007fad;
	padding-top: 0.5em;
	padding-bottom: 0.5em;
	padding-left: 0.5em;
	padding-right: 0.5em;
	margin: 0;

	.nav-item:not(:first-child) {
		border-left: 1px solid #007fad;
	}
	.nav-item:first-child {
		margin-left: 0em;
	}
	.nav-item > a {
		padding-left: 0.5em;
		padding-right: 0.5em;
		padding-top: 0em;
		padding-bottom: 0em;
	}
	.nav-item {
		margin: 0.2em;
		margin-left: 0em;
		margin-right: 0em;
	}
}

.load-placeholder {
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.right-nav-items {
	position: relative;
}

</style>


<script>
export default {
	name: 'navigation',
	data: function() {
		return {
		}
	},
	computed: {
		editTitle() {
			if (this.$store.getters.getTitle) {
				return this.$store.getters.getTitle
			} else {
				return null
			}
		},
		isEditActive() {
			return this.$store.state.metadata.id !== undefined
		},
		isDraftActive() {
			return this.$store.state.record
		},
		continueEditUrl() {
			return "/dataset/" + this.$store.state.metadata.id
		},
		editorUrl() {
			if (this.isEditActive) {
				return continueEditUrl()
			} else if (this.isDraftActive) {
				return "/dataset/edit"
			} else {
				return "/dataset/new"
			}
		},
	},
	methods: {
		async logout() {
			if (!await this.$auth.logout()) {
				this.$root.showAlert("Failed to sign out. Please try again later.", "danger")
			}
		},
		isNotActiveRoute(routeName) {
			if (!this.$route.name) { return false }
			if (routeName == "new") {
				return this.$route.name !== "editor"
			} else if (routeName == "edit") {
				return this.$route.name !== "tab"
			} else if (routeName == "datasets") {
				return this.$route.name !== "datasets"
			} else {
				return this.$route.name !== routeName
			}
		},
		isActiveRoute(routeName) {
			if (!this.$route.name) { return false }
			if (routeName == "new") {
				return this.$route.name == "editor"
			} else if (routeName == "edit") {
				return this.$route.name == "tab"
			} else if (routeName == "datasets") {
				return this.$route.name == "datasets"
			} else {
				return this.$route.name == routeName;
			}
		},
	},
}
</script>
