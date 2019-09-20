<!-- ADD_LICENSE_HEADER -->
<template>
	<b-navbar
		id="app-topbar"
		toggleable="sm"
		type="dark"
		variant="primary"
	>
		<b-navbar-toggle target="nav_collapse" />

		<b-navbar-brand to="/">
			<img
				src="/static/imgs/Qvain_neg_300px.png"
				class="d-inline-block align-top"
				alt="Fairdata: Qvain"
			>
		</b-navbar-brand>

		<b-collapse
			id="nav_collapse"
			is-nav
		>
			<b-navbar-nav>
				<b-button
					variant="primary"
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.fairdata.fi/en/qvain/qvain-user-guide/"
				>
					<font-awesome-icon icon="info" />&nbsp;
					User Guide
				</b-button>
			</b-navbar-nav>

			<!-- right-aligned items -->
			<b-navbar-nav
				id="usermenu"
				class="ml-auto right-nav-items"
			>
				<b-nav-text
					v-if="$auth.loading.state"
					key="user-loading"
					class="user-nav load-placeholder"
				>
					<font-awesome-icon
						icon="circle-notch"
						spin
					/>
				</b-nav-text>

				<b-button-group v-else>
					<b-button
						v-if="$auth.loggedIn"
						id="usermenu_userinfo"
						variant="primary"
						to="/userinfo"
					>
						<font-awesome-icon
							icon="user"
							class="text-light mr-2"
							fixed-width
						/> <a id="usermenu_fullname">{{ $auth.user.name }}</a>
					</b-button>

					<b-button
						v-if="$auth.loggedIn || $auth.getLoginError()"
						id="usermenu_signout"
						variant="primary"
						@click="logout()"
					>
						<font-awesome-icon icon="sign-out-alt" />
						&nbsp;
						Sign out
					</b-button>
					<b-button
						v-else
						id="usermenu_login"
						key="user-login"
						class="user-nav"
						variant="primary"
						:href="$auth.loginUrl"
						:disabled="!$store.getters.conditionsAccepted"
					>
						<font-awesome-icon icon="sign-in-alt" />
						&nbsp;
						Login
					</b-button>
				</b-button-group>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<script>
export default {
	name: 'Navigation',
	data: function() {
		return {
		}
	},
	computed: {
	},
	methods: {
		async logout() {
			if (!await this.$auth.logout()) {
				this.$root.showAlert("Failed to sign out. Please try again later.", "danger")
			}
		},
	},
}
</script>
