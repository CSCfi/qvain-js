<template>
	<b-navbar :toggleable="false" type="dark" id="app-subbar" v-if="$auth.loggedIn">
		<b-nav-toggle target="app-subbar-collapse"></b-nav-toggle>
		<b-collapse id="app-subbar-collapse" is-nav>
			<b-navbar-nav>
				<b-button-group class="editor-actions">
					<b-button v-if="isActiveRoute('datasets') && isDraftActive && !isEditActive" key="continue_draft" variant="primary" size="sm" to="/dataset/edit">
						<font-awesome-icon icon="backward" />
						&nbsp;
						Unsaved dataset
					</b-button>
					<b-button v-if="isActiveRoute('datasets') && isEditActive" key="continue_edit" variant="primary" size="sm" :to="continueEditUrl">
						<font-awesome-icon icon="backward" />
						&nbsp;
						{{ editTitle || '(no title)' }}
					</b-button>
				</b-button-group>
			</b-navbar-nav>
			<b-navbar-nav key="links">
				<b-button v-if="!isActiveRoute('datasets')" size="sm" variant="primary" key="datasets" to="/datasets">
					<span v-if="isActiveRoute('home')">
						<font-awesome-icon icon="table" />
						&nbsp;
						Datasets
					</span>
					<span v-else-if="isEditActive || isDraftActive">
						<font-awesome-icon icon="table" />
						&nbsp;
						Datasets
					</span>
					<span v-else>
						<font-awesome-icon icon="table" />
						Datasets
					</span>
				</b-button>
			</b-navbar-nav>
			<b-navbar-nav class="ml-auto">
				<b-button-group class="page-actions">
					<b-button
					id="button-new-dataset"

					key="new"
					:variant="isActiveRoute('editor') || isActiveRoute('tab') ? 'primary' : 'success'"
					size="sm"
					to="/dataset/new">
					<font-awesome-icon icon="plus" />
					&nbsp;
					New dataset
					</b-button>
				</b-button-group>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<script>
export default {
	name: 'navigation-sub',
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
			return this.$route.name == routeName;
		},
	},
}
</script>
