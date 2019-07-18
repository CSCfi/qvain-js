<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Shreyas Deshpande <shreyas.deshpande@csc.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<b-jumbotron fluid>
		<template slot="header">
			Qvain
		</template>

		<template slot="lead">
			Research Dataset Metadata Tool
		</template>

		<hr class="my-4">

		<b-alert :show="loginError == 'missingcsc'" variant="danger">
			Login unsuccessful. Please make sure that you have a valid CSC account.
			If you tried to log in with an external account (for example Haka) you might get this error if your account is not associated with a CSC account.
			Please register a CSC account in <a href="https://sui.csc.fi">https://sui.csc.fi</a>. You can register with or without a Haka account.
		</b-alert>
		
		<b-alert :show="loginError == 'missingorg'" variant="danger">
			Login unsuccessful. You currently do not have a home organization set. Please contact CSC Helpdesk to get your home organization sorted out and then come back to log in again.
		</b-alert>
		
		<b-alert :show="missingToken" variant="danger">You are currently not logged in. Please login to access Qvain.</b-alert>

		<div v-if="loginError" class="invalid-logout">
			<p><button :href="$auth.loginUrl" class="btn btn-info btn-lg" role="button" @click="logout()">Sign out</button></p>
		</div>

		<div v-else-if="!$auth.loggedIn">
			<p>
				By using Qvain the user agrees:
				<ul>
				<li>That he or she has asked consent from all persons whose personal information the user will add to the 
				descriptive data and informed them of how they can get their personal data removed.</li>
				<li>the 
				<a href="https://www.fairdata.fi/hyodyntaminen/kayttopolitiikat-ja-ehdot/">Terms of Usage</a></li>
				</ul>
			</p>

			<p>
				<a :href="$auth.loginUrl" class="btn btn-info btn-lg" role="button">
					<font-awesome-icon icon="sign-in-alt" />
					&nbsp;
					Login
				</a>
			</p>
		</div>

		<div v-else>
			<router-link class="btn btn-success btn-lg" to="/dataset/new" role="button">New dataset</router-link>
			<router-link class="btn btn-link btn-lg" to="/datasets" role="button">List datasets</router-link>
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
</style>

<script>
export default {
	props: {
		missingToken: Boolean,
	},
	computed: {
		loginError() {
			return this.$auth.getLoginError()
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
