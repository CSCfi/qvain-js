<!-- ADD_LICENSE_HEADER -->
<template>
	<div>
		<transition name="slideinout" appear>
		<b-alert :show="$root.dismissCountDown" style="z-index: 1000; position: fixed; top: 1rem; left: 0; right: 0; width: 90%; margin: 0 auto; opacity: 0.90;" dismissible :variant="$root.alertVariant" @dismissed="$root.dismissAlert" @dismiss-count-down="$root.countDownChanged">
			<p>{{ $root.alertText }}</p>
		</b-alert>
		</transition>

		<b-navbar id="app-topbar" toggleable="sm" type="dark" variant="primary">

			<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

			<b-navbar-brand to="/">
				<img src="/static/imgs/Qvain_neg_300px.png" class="d-inline-block align-top" alt="Fairdata: Qvain">
			</b-navbar-brand>

			<b-collapse is-nav id="nav_collapse">

				<b-navbar-nav>
					<b-nav-item title="CSC customer support
servicedesk (at) csc.fi
+358 9 457 2821
Weekdays from 8:30 AM to 4 PM" href="mailto:servicedesk@csc.fi?subject=Fairdata%2FQvain%3A%20support%20request">Contact Us</b-nav-item>
					<b-nav-item target="_blank" rel="noopener noreferrer" href="https://www.fairdata.fi/en/qvain/qvain-user-guide/">Docs</b-nav-item>
				</b-navbar-nav>


				<!-- right-aligned items -->
				<b-navbar-nav class="ml-auto right-nav-items">

					<!-- language dropdown -->
					<!--
					<b-nav-item-dropdown text="lang" right>
						<b-dropdown-item to="#" @click="$root.language = 'en'">EN</b-dropdown-item>
						<b-dropdown-item to="#" @click="$root.language = 'fi'" disabled>FI</b-dropdown-item>
						<b-dropdown-item to="#" @click="$root.language = 'se'" disabled>SE</b-dropdown-item>
					</b-nav-item-dropdown>
					-->

					<!-- login dropdown -->

					<transition name="fade">
						<b-nav-text class="user-nav load-placeholder" key="user-loading" v-if="$auth.loading.state">
							<font-awesome-icon icon="circle-notch" spin />
						</b-nav-text>

						<b-nav-item-dropdown class="user-nav user-dropdown" key="user-dropdown" v-else-if="$auth.loggedIn">
							<template slot="text">
								<span style="font-weight: bold;"><font-awesome-icon icon="user" class="text-primary mr-2" fixed-width /> {{ $auth.user.name }}</span>
							</template>

							<b-dropdown-header>
								<font-awesome-icon icon="user" class="text-primary mr-2" fixed-width /> <a>{{ $auth.user.name }}</a>
							</b-dropdown-header>
							<b-dropdown-divider></b-dropdown-divider>
							<b-dropdown-item to="/userinfo">About me</b-dropdown-item>
							<b-dropdown-item @click="logout()">Sign out</b-dropdown-item>
						</b-nav-item-dropdown>

						<b-nav-item class="user-nav" key="user-login" v-else :href="$auth.loginUrl">Login</b-nav-item>
					</transition>

				</b-navbar-nav>
			</b-collapse>
		</b-navbar>

		<b-navbar :toggleable="false" type="dark" id="app-subbar" v-if="$auth.loggedIn">
			<b-nav-toggle target="app-subbar-collapse"></b-nav-toggle>
			<b-collapse is-nav id="app-subbar-collapse">
				<transition name="fade" tag="b-navbar-nav">
					<b-nav-text v-if="$auth.loading.state" key="loading" class="load-placeholder"></b-nav-text>
					<b-navbar-nav v-else-if="$auth.loggedIn" key="links">
						<b-nav-item key="datasets" to="/datasets">Datasets</b-nav-item>
						<b-nav-item key="editor" to="/dataset/new">New</b-nav-item>
						<b-nav-item key="editor_edit" v-if="isEditActive" :to="editUrl">Edit '{{ editTitle }}'</b-nav-item>
					</b-navbar-nav>
				</transition>
			</b-collapse>
		</b-navbar>
	</div>
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
	padding-top: 0em;
	padding-bottom: 0em;

	background-color: #0092c7;
    border-top: 1px solid #00a4e0;
    border-bottom: 1px solid #007fad;
	padding-top: 0em;
	padding-bottom: 0em;
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
		isEditActive() {
			return this.$store.state.metadata.id !== undefined
		},
		editUrl() {
			return "/dataset/" + this.$store.state.metadata.id
		},
		editTitle() {
			if (this.$store.getters.getTitle) {
				return this.$store.getters.getTitle
			} else {
				return null
			}
		},
		editorUrl() {
			if (this.isEditActive) {
				return "/dataset/" + this.$store.state.metadata.id
			} else if (this.$store.state.record) {
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
	},
}
</script>
