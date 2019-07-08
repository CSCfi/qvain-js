<!-- ADD_LICENSE_HEADER -->
<template>
	<div>
		<h1 class="component-title">About me</h1>

		<b-form v-if="$auth.user" id="form-userinfo">
			<b-form-group
				id="organisation"
				label-cols-sm="4"
				label-cols-lg="3"
				label="Organisation"
				label-for="input-organisation">
				<b-form-input
					id="input-organisation"
					v-model="$auth.user.organisation"
					disabled
					>
				</b-form-input>				
			</b-form-group>

			<b-form-group
				id="username"
				label-cols-sm="4"
				label-cols-lg="3"
				label="User"
				label-for="input-username">
				<b-form-input
					id="input-username"
					v-model="$auth.user.name"
					disabled
					>
				</b-form-input>				
			</b-form-group>
			<b-form-group
				id="email"
				label-cols-sm="4"
				label-cols-lg="3"
				label="Email"
				label-for="input-email">
				<b-form-input
					id="input-email"
					v-model="$auth.user.email"
					disabled
					>
				</b-form-input>				
			</b-form-group>
			<b-form-group
				id="projects"
				label="IDA Projects"
				label-for="input-projects"
				label-cols-sm="4"
				label-cols-lg="3">

				<b-form-checkbox-group
					id="input-projects"
					name="input-projects"
					v-if="$auth.user.projects > 0"
					>
					<b-form-checkbox
						v-for="project in $auth.user.projects"
						:key="project"
						:value="project">{{ project }}</b-form-checkbox>
				</b-form-checkbox-group>
				<b-form-text v-else>(no projects)</b-form-text>
			</b-form-group>	
		</b-form>
		<div v-else>
			<b-alert variant="secondary" show><p class="font-italic">You are not logged in.</p></b-alert>
		</div>

	</div>
</template>
<style scoped>
	#form-userinfo > .form-group {
		margin-top: 1em
	}
</style>
<script>
export default {
	name: "user-info",
	data: function() {
		return {}
	},
	methods: {
		/*
		getGroups: function() {
			this.myGroupsOptions = []
			myGroups.forEach(
				grp => {
					this.myGroupsOptions.push({
						text: grp.name,
						value: grp.id,
					})
				})
		},
		*/
	},
	computed: {
		/*
		filterRegExp: function() {
			return new RegExp('.*' + this.filterString + '.*', 'ig')
		},
		*/
		stringifiedToken() {
			return (this.$auth && this.$auth.user._jwt) ? JSON.stringify(this.$auth.user._jwt, null, 2) : null
		},
	},
	created() {
		//this.$auth.user.projects = ["2001036", "20010xx", "2001666"]
	},
}
</script>
