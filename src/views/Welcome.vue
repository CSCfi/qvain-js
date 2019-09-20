<!-- ADD_LICENSE_HEADER -->
<template>
	<b-jumbotron fluid>
		<template slot="header">
			Qvain
		</template>

		<template slot="lead">
			Research Dataset Metadata Tool
		</template>

		<hr class="my-4">

		<b-alert
			:show="loginError == 'missingcsc'"
			variant="danger"
		>
			Login unsuccessful. Please make sure that you have a valid CSC account.
			If you tried to log in with an external account (for example Haka) you might get this error if your account is not associated with a CSC account.
			Please register a CSC account in <a href="https://sui.csc.fi">https://sui.csc.fi</a>. You can register with or without a Haka account.
		</b-alert>

		<b-alert
			:show="loginError == 'missingorg'"
			variant="danger"
		>
			Login unsuccessful. You currently do not have a home organization set. Please contact CSC Helpdesk to get your home organization sorted out and then come back to log in again.
		</b-alert>

		<b-alert
			:show="loginError == 'sessionerror'"
			variant="danger"
		>
			There was an error processing your login. Please try again later.
		</b-alert>

		<b-alert
			:show="missingSession"
			variant="danger"
		>
			You are currently not logged in. Please login to access Qvain.
		</b-alert>

		<div
			v-if="loginError"
			class="invalid-logout"
		>
			<p>
				<button
					:href="$auth.loginUrl"
					class="btn btn-info btn-lg"
					role="button"
					@click="logout()"
				>
					Sign out
				</button>
			</p>
		</div>

		<div v-else-if="!$auth.loggedIn">
			<p>
				By using Qvain the user agrees:
				<b-form-group>
					<b-form-checkbox
						class="mt-2"
						:checked="userConditions.consent"
						@change="updateUserCondition('consent', $event)"
					>
						That he or she has asked consent from all persons whose personal information the user will add to the
						descriptive data and informed them of how they can get their personal data removed.
					</b-form-checkbox>
					<b-form-checkbox
						class="mt-2"
						:checked="userConditions.terms"
						@change="updateUserCondition('terms', $event)"
					>
						That he or she accepts the <a href="https://www.fairdata.fi/hyodyntaminen/kayttopolitiikat-ja-ehdot/">Terms of Usage</a>.
					</b-form-checkbox>
				</b-form-group>
			</p>

			<p>
				<span
					class="login"
					@click="loginClick"
				>
					<a
						:href="$auth.loginUrl"
						class="btn btn-info btn-lg"
						role="button"
						:class="{disabled: !conditionsAccepted}"
						:aria-disabled="!conditionsAccepted"
					>
						<font-awesome-icon icon="sign-in-alt" />
						&nbsp;
						Login
					</a>
					<b-alert
						:show="showTermsPrompt && !conditionsAccepted"
						variant="warning"
					>
						You need to agree to the terms of service before logging in.
					</b-alert>
				</span>
			</p>
		</div>

		<div v-else>
			<router-link
				class="btn btn-success btn-lg"
				to="/dataset/new"
				role="button"
			>
				New dataset
			</router-link>
			<router-link
				class="btn btn-link btn-lg"
				to="/datasets"
				role="button"
			>
				List datasets
			</router-link>
		</div>
	</b-jumbotron>
</template>

<style lang="scss" scoped>
.jumbotron-fluid {
	color: rgb(70,70,70);
	background-color: rgb(231,233,237);
	margin-top: 1em;
}

.btn-link {
	text-decoration: none;
}
.btn-link:hover {
	text-decoration: underline;
}

.login {
	display: flex;

	> a {
		margin-right: 4px;
	}

	> .alert {
		margin-bottom: 0;
	}
}
</style>

<script>

export default {
	props: {
		missingSession: Boolean,
	},
	data() {
		return {
			showTermsPrompt: false,
		}
	},
	computed: {
		loginError() {
			return this.$auth.getLoginError()
		},
		userConditions() {
			return this.$store.state.userConditions
		},
		conditionsAccepted() {
			return this.$store.getters.conditionsAccepted
		},
	},
	methods: {
		loginClick() {
			if (!this.conditionsAccepted) {
				this.showTermsPrompt = true
			}
		},
		updateUserCondition(key, value) {
			this.$store.commit('setUserCondition', { key: key, val: value })
		},
		async logout() {
			if (!await this.$auth.logout()) {
				this.$root.showAlert("Failed to sign out. Please try again later.", "danger")
			}
		},
	},
}
</script>
