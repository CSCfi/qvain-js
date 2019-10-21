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
				<b-nav-item
					link-classes="btn btn-primary"
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.fairdata.fi/en/qvain/qvain-user-guide/"
				>
					<font-awesome-icon
						icon="info"
						class="mr-2"
					/>User Guide
				</b-nav-item>
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

				<template v-else>
					<b-nav-item
						v-if="$auth.loggedIn"
						id="usermenu_userinfo"
						link-classes="btn btn-primary"
						to="/userinfo"
					>
						<font-awesome-icon
							icon="user"
							class="mr-2"
						/><span id="usermenu_fullname">{{ $auth.user.name }}</span>
					</b-nav-item>

					<b-nav-item
						v-if="$auth.loggedIn || $auth.getLoginError()"
						id="usermenu_signout"
						link-classes="btn btn-primary"
						@click="logout()"
					>
						<font-awesome-icon
							icon="sign-out-alt"
							class="mr-2"
						/>Sign out
					</b-nav-item>
					<b-nav-item
						v-else
						id="usermenu_login"
						key="user-login"
						link-classes="user-nav btn btn-primary"
						:href="$auth.loginUrl"
					>
						<font-awesome-icon
							icon="sign-in-alt"
							class="mr-2"
						/>Login
					</b-nav-item>
				</template>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>
<script>
export default {
	name: 'Navigation',
	methods: {
		async logout() {
			if (!await this.$auth.logout()) {
				this.$root.showAlert("Failed to sign out. Please try again later.", "danger")
			}
		},
	},
}
</script>
