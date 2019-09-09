<!-- ADD_LICENSE_HEADER -->
<template>
	<b-container>
		<h1 class="component-title">
			User Information
		</h1>

		<b-form
			v-if="$auth.user"
			id="form-userinfo"
		>
			<b-form-group
				id="organization"
				label-cols-sm="4"
				label-cols-lg="3"
				label="Organization"
				label-for="input-organization"
			>
				<b-form-input
					id="input-organization"
					v-model="$auth.user.organisation"
					disabled
				/>
			</b-form-group>

			<b-form-group
				id="username"
				label-cols-sm="4"
				label-cols-lg="3"
				label="User"
				label-for="input-username"
			>
				<b-form-input
					id="input-username"
					v-model="$auth.user.name"
					disabled
				/>
			</b-form-group>
			<b-form-group
				id="email"
				label-cols-sm="4"
				label-cols-lg="3"
				label="Email"
				label-for="input-email"
			>
				<b-form-input
					id="input-email"
					v-model="$auth.user.email"
					disabled
				/>
			</b-form-group>
			<b-form-group
				id="projects"
				label="IDA Projects"
				label-for="input-projects"
				label-cols-sm="4"
				label-cols-lg="3"
			>
				<div>
					<b-badge
						v-for="project in $auth.user.projects"
						:key="project"
						:value="project"
					>
						{{ project }}
					</b-badge>

					<b-badge v-if="$auth.user.projects.length === 0">
						(no projects)
					</b-badge>
				</div>
			</b-form-group>
		</b-form>
		<div v-else>
			<b-alert
				variant="secondary"
				show
			>
				<p class="font-italic">
					You are not logged in.
				</p>
			</b-alert>
		</div>
	</b-container>
</template>
<style scoped>
	#form-userinfo > .form-group {
		margin-top: 1em
	}

	#form-userinfo {
		margin: 1em;
	}

	#projects div {
		margin-top: 0.25em;
		margin-bottom: 0.25em;
	}
	#projects .badge {
		font-size: 1em;
		margin-left: 0.5em;
	}
</style>
<script>
export default {
	name: "UserInfo",
	data: function() {
		return {}
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
}
</script>
