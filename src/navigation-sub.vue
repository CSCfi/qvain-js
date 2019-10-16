<template>
	<b-navbar
		v-if="$auth.loggedIn"
		id="app-subbar"
		:toggleable="false"
		type="dark"
		class="thin"
	>
		<b-nav-toggle target="app-subbar-collapse" />
		<b-collapse
			id="app-subbar-collapse"
			is-nav
		>
			<b-navbar-nav>
				<b-nav-item
					v-if="isActiveRoute('datasets') && isDraftActive && !isEditActive"
					key="continue_draft"
					link-classes="btn btn-primary btn-sm"
					to="/dataset/edit"
				>
					<font-awesome-icon
						icon="backward"
						class="mr-2"
					/>Unsaved dataset
				</b-nav-item>

				<b-nav-item
					v-if="isActiveRoute('datasets') && isEditActive"
					key="continue_edit"
					link-classes="btn btn-primary btn-sm"
					:to="continueEditUrl"
				>
					<font-awesome-icon
						icon="backward"
						class="mr-2"
					/>{{ editTitle || '(no title)' }}
				</b-nav-item>
			</b-navbar-nav>

			<b-navbar-nav key="links">
				<b-nav-item
					v-if="!isActiveRoute('datasets')"
					key="datasets"
					link-classes="btn btn-primary btn-sm"
					to="/datasets"
				>
					<font-awesome-icon
						icon="table"
						class="mr-2"
					/>Datasets
				</b-nav-item>
			</b-navbar-nav>
			<b-navbar-nav class="ml-auto">
				<b-nav-item
					id="button-new-dataset"
					key="new"
					:link-classes="'btn btn-sm btn-' + (isActiveRoute('editor') || isActiveRoute('tab') ? 'primary' : 'success')"
					to="/dataset/new"
				>
					<font-awesome-icon
						icon="plus"
						class="mr-2"
					/>New dataset
				</b-nav-item>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<script>
export default {
	name: 'NavigationSub',
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
	},
	methods: {
		isActiveRoute(routeName) {
			if (!this.$route.name) { return false }
			return this.$route.name == routeName
		},
	},
}
</script>
