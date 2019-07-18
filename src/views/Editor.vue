<!-- ADD_LICENSE_HEADER -->
<template>
	<b-container id="editor-view">
		<b-navbar sticky toggleable="sm" variant="light">
			<b-container>
				<b-row no-gutters>
					<h4 class="component-title" v-if="!!selectedSchema">
						<span v-if="title">
							{{ title }}
						</span>
						<span v-else>
							(no title)
						</span>
						<span class="secondary-text text-muted">
							<span >
								{{ selectedSchema.title }}
							</span>
						</span>
						<span class="secondary-text text-muted" v-if="qvainData">
							<span v-if="qvainData && qvainData.published && !isPublishedAndUpdateAvailable">
								<font-awesome-icon icon="circle" class="fa-sm text-primary" />
								&nbsp;
								<span>Published</span>
							</span>
							<span v-else-if="isPublishedAndUpdateAvailable">
								<font-awesome-layers class="fa-sm">
									<font-awesome-icon icon="circle" class="text-warning" />
								</font-awesome-layers>
								&nbsp;
								<span>Unpublished Changes</span>
							</span>
							<span v-else>
								<font-awesome-icon icon="circle" class="fa-sm text-success" />
								&nbsp;
								<span>Draft</span>
							</span>
						</span>
						<span class="secondary-text text-muted" v-else>
							<span v-if="loading">
								<font-awesome-icon icon="spinner" spin />
							</span>
							<span v-else>
								<font-awesome-icon icon="circle" class="fa-sm text-danger" />
								&nbsp;<span>Unsaved draft</span>
							</span>
						</span>

					</h4>
				</b-row>
				<b-navbar-toggle target="nav-collapse" class="navbar-toggler ml-auto"></b-navbar-toggle>
			</b-container>

			<b-collapse id="nav-collapse" is-nav>
				<b-container>
					<b-row>
						<b-col md="3">
							<b-button
								v-if="qvainData"
								id="editor_refresh_dataset"
								:variant="reloadDatasetCounter > 0 ? 'danger' : 'secondary'"
								block
								@click="reloadDataset">
								<font-awesome-icon :icon="loading ? 'spinner' : 'undo'" :spin="loading" />
								&nbsp;
								<span v-if="!loading">
									{{ reloadDatasetTitle }}
								</span>
							</b-button>
						</b-col>
						<b-col>
							<b-button
								v-if="!loading && selectedSchema" 
								id="editor_button_save_top" 
								:variant="isSaveDisabled ? 'outline-secondary' : 'success'"
								@click="save"
								:disabled="isSaveDisabled"
								block
								ref="dataset-save-button">
								<font-awesome-icon :icon="saving ? 'spinner' : 'save'" :spin="saving" />
								&nbsp;
								Save
							</b-button>
						</b-col>
						<b-col>
							<b-button
								v-if="!loading && selectedSchema"
								id="editor_button_publish_top"
								:variant="isPublishDisabled ? 'outline-secondary' : 'primary'"
								v-b-modal.publishModal
								block
								:disabled="isPublishDisabled"
								ref="dataset-publish-button">
								<font-awesome-icon :icon="publishing ? 'spinner' : 'upload'" :spin="publishing" />
								&nbsp;
								Publish
							</b-button>
						</b-col>
						<b-col v-if="!loading && isPublished">
							<b-button
								id="editor_button_etsin_top"
								variant="info"
								block
								@click="viewInEtsin()"
								ref="dataset-etsin-button">
								<font-awesome-icon icon="external-link-alt" />
								&nbsp;
								Etsin
							</b-button>
						</b-col>
					</b-row>
				</b-container>
			</b-collapse>
		</b-navbar>

		<b-alert variant="danger" :show="!!error" dismissible @dismissed="error=null"><i class="fas fa-ban"></i> API error: {{ error }}</b-alert>
		<b-alert variant="warning"><font-awesome-icon icon="info"></font-awesome-icon> Publishing: I understand that publishing this dataset:</b-alert>

		<!-- Modals -->
		<dataset-json-modal id="dataset-json-modal"></dataset-json-modal>
		<dataset-overview-modal id="dataset-overview-modal"></dataset-overview-modal>
		<b-modal ref="publishModal" id="publishModal" title="Publish dataset?"
			ok-title="Publish" cancel-variant="primary" ok-variant="success" @ok="publish">
			<div class="d-block text-left">
				<p>I understand that publishing this dataset:</p>
				<ul>
					<li>will make it available publicly</li>
					<li>marks it as ready and enables editing restrictions</li>
				</ul>
			</div>
		</b-modal>
		<publish-modal ref="publishErrorModal" id="publishErrorModal" :error="publishError" @hidden="publishError = null"></publish-modal>

		<b-container>
			<b-row no-gutters>
				<b-col md="3" v-if="!!selectedSchema">
					<b-nav class="sticky-top editor-index-navigation" vertical>
						<b-nav-item v-for="(tab, index) in tabs" :key="tab.uri" :to="`/dataset/${id}/${tab.uri}`">
							<b-row>
								<b-badge
									:variant="$route.params.tab === tab.uri ? 'info' : 'secondary'">
									{{ index+1 }}
								</b-badge>
								<b-col>
									{{ tab.label }}
								</b-col>
							</b-row>
						</b-nav-item>
					</b-nav>
				</b-col>

				<b-col v-if="selectedSchema">
					<router-view></router-view>
				</b-col>

				<b-col v-else-if="loading">
					<b-container>
						<b-row>
							<b-col>
								<font-awesome-icon icon="spinner" spin />
							</b-col>
						</b-row>
					</b-container>
				</b-col>

				<b-col v-else-if="!loading" class="schema-help-text">
					<b-container>
						<b-row>
							<b-col>
								<h2 class="component-title">Where are your files related to this dataset?</h2>
							</b-col>
						</b-row>
						<b-row class="mb-3">
							<b-col>
								<b-badge variant="warning">
									<b>NOTE!</b>
									You can <u>not</u> change the selected option after this step.
								</b-badge>
							</b-col>
						</b-row>
						<b-row class="mb-3">
							<b-col>
								<b-card-group deck v-model="selectedSchema" :key="index"
										:title="bundle"
										v-for="(bundle, index) in bundles">
										<b-card
											:id="id"
											:title="val.title"
											v-for="(val, id) in getSchemas(bundle)"
											:key="id">
											<b-card-text>
												{{ val.description }}
											</b-card-text>
											<b-button
												slot="footer"
												@click="selectedSchema = val; selectSchema()"
												variant="primary">
												{{ val.name }}
											</b-button>
										</b-card>
								</b-card-group>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<b-card-group>
									<b-card>
										<b-card-text>
											<b-badge variant="info">
												<b>Hint</b>
											</b-badge>
											You can also make descriptions without any files. In that case, please select either one. The selection cannot be re-done, so if you are not sure whether you'll add files later, select the one you think you'll need in the future.
										</b-card-text>
									</b-card>
								</b-card-group>
							</b-col>
						</b-row>
					</b-container>
				</b-col>
			</b-row>
		</b-container>

	</b-container>
</template>

<script>
import Bundle from '@/schemas/bundle.js'
import apiClient from '@/api/client.js'
import DatasetJsonModal from '@/components/DatasetJsonModal.vue'
import DatasetOverviewModal from '@/components/DatasetOverviewModal.vue'
import PublishModal from '@/components/PublishModal.vue'
import Validator from '../../vendor/validator/src/validate.js'
import cloneWithPrune from '@/lib/cloneWithPrune.js'

export default {
	name: "editor",
	components: {
		'dataset-json-modal': DatasetJsonModal,
		'dataset-overview-modal': DatasetOverviewModal,
		'publish-modal': PublishModal,
	},
	props: {
		id: {
			type: String,
			default: 'new',
		},
		isClone: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			selectedSchema: null,
			doLive: true,
			unsubscribeFunc: null,
			validator: null,
			error: null,
			publishError: null,
			loading: false,
			rateLimited: false,
			showPublishConfirmation: false,
			inDev: true,
			saving: false,
			publishing: false,
			isDataChanged: false,
			qvainData: null,
			reloadDatasetCounter: 0,
			reloadDatasetTimer: null,
		}
	},
	methods: {
		getSchemas(bundle) {
			return Bundle[bundle]
		},
		getSchemaForId(schemaId) {
			for (const bundle in Bundle) {
				const schema = Object.values(Bundle[bundle]).find(schema=>schema.id==schemaId)
				if (schema) {
					return schema
				}
			}
			return null
		},
		confirmUnsavedChanges(dialogTitle, noButtonTitle, callback) {
			this.$bvModal.msgBoxConfirm('If you will select <yes> then all the unsaved changes will be lost. Are you sure?', {
				title: dialogTitle,
				size: 'md',
				buttonSize: 'md',
				okVariant: 'danger',
				okTitle: 'Yes',
				cancelTitle: noButtonTitle,
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			})
			.then(callback)
			.catch(err => {
				console.log(err)
			})
		},
		viewInEtsin() {
			window.open(`${process.env.VUE_APP_ETSIN_API_URL}/${this.qvainData.identifier}`, '_blank')
		},
		publish: async function publishCallback() {
			if (this.saving || this.publishing) {
				return
			}
			this.publishing = true
			try {
				this.showPublishConfirmation = false
				const isExisting = !!this.$store.state.metadata.id
				if (isExisting) {
					const currentId = this.$store.state.metadata.id
					const response = await apiClient.post("/datasets/" + currentId + "/publish", {})
					const { data } = await apiClient.get(`/datasets/${currentId}`)
					this.qvainData = data
				} else {
					this.$root.showAlert("Please save your dataset first", "danger")
				}
			} catch (e) {
				// check if we got an api error for the modal, else show a generic error message
				console.log("publish error:", e, Object.keys(e))
				if (e.response && e.response.status == 401) {
					// there was a permission error
					// we should redirect the user to login
					await this.$auth.logoutDueSessionTimeout()
					this.$router.push({name: "home", params: {missingToken: true}})
				}
				if (e.response && e.response.data) {
					this.publishError = e.response.data
					this.$root.$emit('bv::show::modal', 'publishErrorModal', this.$refs['dataset-publish-button'])
				} else {
					this.$root.showAlert("Publish failed!", "danger")
				}
			} finally {
				this.publishing = false
			}
		},
		save: async function saveCallback() {
			if (this.saving) {
				return
			}
			this.saving = true
			try {
				const currentId = this.$store.state.metadata.id
				const dataset = this.$store.getters.prunedDataset
				const payload = { dataset, type: 2, schema: this.selectedSchema.id }

				const isExisting = (currentId && currentId !== 'new')
				if (isExisting) {
					payload.id = currentId
					await apiClient.put("/datasets/" + currentId, payload)
					const { data } = await apiClient.get(`/datasets/${currentId}`)
					this.qvainData = data
				} else {
					const { data: { id }} = await apiClient.post("/datasets/", payload)
					const { data } = await apiClient.get(`/datasets/${id}`)
					this.qvainData = data

					this.$store.commit('setMetadata', { id })
					this.$router.replace({ name: 'tab', params: { id: id, tab: this.$route.params.tab }})
				}
				this.isDataChanged = false
			} catch(error) {
				this.$root.showAlert("Save failed!", "danger")
				if (error.response && error.response.status == 401) {
					// there was a permission error
					// we should redirect the user to login
					await this.$auth.logoutDueSessionTimeout()
					this.$router.push({name: "home", params: {missingToken: true}})
				}
			} finally {
				this.saving = false
			}
		},
		createNewRecord() {
			this.loading = true
			this.$nextTick(() => {
				this.clearRecord()
				this.initDataset()
				this.loading = false
				this.$router.replace({ name: 'editor', params: { id: "new" }})
			})
		},
		initDataset() {
			if (this.selectedSchema !== null) {
				this.$store.commit('loadSchema', this.selectedSchema.schema)
				this.$store.commit('loadHints', this.selectedSchema.ui)
			}
		},
		clearRecord() {
			this.isDataChanged = false
			this.qvainData = null
			this.selectedSchema = null
			this.$store.commit('loadSchema', {})
			this.$store.commit('loadHints', {})
			this.$store.commit('loadData', undefined)
			this.$store.commit('resetMetadata')
		},
		cancelReloadDataset: function() {
			this.reloadDatasetTimer = null
			this.reloadDatasetCounter = 0
		},
		reloadDataset: function() {
			if (this.isDataChanged) {
				this.confirmUnsavedChanges("Do you want to reload the dataset?", "No, I do not want to.", value => {
					if (value) {
						this.clearRecord()
						this.openRecord(this.id)
						this.reloadDatasetCounter = 0
					}
				})
				return
			}
			if (this.reloadDatasetCounter == 0) {
				this.reloadDatasetCounter += 1
				this.reloadDatasetTimer = setTimeout(this.cancelReloadDataset, 2000)
			} else {
				this.clearRecord()
				this.openRecord(this.id)
				this.reloadDatasetCounter = 0
			}
		},
		async openRecord(id) {
			if (this.loading) { return }
			this.loading = true
			try {
				const { data } = await apiClient.get(`/datasets/${id}`)
				this.$store.commit('resetMetadata')
				this.selectedSchema = this.getSchemaForId(data.schema)
				this.$store.commit('loadSchema', this.selectedSchema.schema)
				this.$store.commit('loadHints', this.selectedSchema.ui)
				this.$store.commit('loadData', Object(data.dataset))
				this.$store.commit('setMetadata', { id, schemaId: this.selectedSchema.id })
				this.qvainData = data
			} catch (error) {
				if (error.response && error.response.status == 401) {
					// there was a permission error
					// we should redirect the user to login
					await this.$auth.logoutDueSessionTimeout()
					this.$router.push({name: "home", params: {missingToken: true}})
				}
				console.log(error)
			} finally {
				this.loading = false
			}
		},
		selectSchema() {
			if (this.selectedSchema !== null) {
				this.$store.commit('loadSchema', this.selectedSchema.schema)
				this.$store.commit('loadHints', this.selectedSchema.ui)
				this.$store.commit('setMetadata', { schemaId: this.selectedSchema.id })

				this.startValidator()
				this.checkTab()
			} else {
				this.$store.commit('loadSchema', {})
			}
		},
		checkTab() {
			// if tab is unset or invalid (not in tabs list), try to read tab from store or use the first tab
			const tabUris = this.tabs.map(tab=>tab.uri)
			if (!this.$route.params.tab || !tabUris.includes(this.$route.params.tab)) {
				let newTab = tabUris.includes(this.$store.state.metadata.tab) ? this.$store.state.metadata.tab : null
				if (!newTab && this.tabs.length > 0) {
					newTab = this.tabs[0].uri
				}
				if (newTab) {
					this.$router.replace({ name: 'tab', params: { id: this.$route.params.id, tab: newTab  }})
				} else {
					this.$router.replace({ name: 'editor', params: { id: this.$route.params.id }})
				}
			}
		},
		startValidator() {
			this.unsubscribeFunc && this.unsubscribeFunc();
			this.validator = new Validator(
				this.$store.state.schema,
				this.$store.state.record,
				{ 'allowUndefined': true },
			)
			this.validator.v = this.$store.state.vState
			this.unsubscribeFunc = this.$store.subscribe((mutation) => {
				if (mutation.type !== 'initValue') {
					const data = cloneWithPrune(this.$store.state.record, ["#key"], [])					
					this.validator.validateData(data)
				}					
				// the data has been changed after the initial load by the user
				if (mutation.type === 'updateValue' || mutation.type === 'deleteArrayValue' || mutation.type === 'replace') {
					this.isDataChanged = true
				}
			})
		},
	},
	computed: {
		reloadDatasetTitle() {
			return this.reloadDatasetCounter == 0 ? "Undo All Changes" : "Are you sure?"
		},
		isPublishDisabled() {
			return this.loading || this.rateLimited || this.$store.state.metadata.id == null || (this.qvainData && this.qvainData.published && this.qvainData.synced >= this.qvainData.modified) || this.isDataChanged || this.saving || this.publishing
		},
		isPublished() {
			return this.qvainData && this.qvainData.published
		},
		isPublishedAndUpdateAvailable() {
			return this.isPublished && (this.qvainData.modified > this.qvainData.synced)
		},
		isSaveDisabled() {
			return this.loading || this.rateLimited || this.isDataChanged == false || this.saving || this.publishing
		},
		tabs() {
			return (this.$store.state.hints.tabs || []).filter(tab => tab.uri)
		},
		bundles() {
			return Object.keys(Bundle)
		},
		title() {
			// get English title or first defined
			// TODO: make generic?
			return this.$store.getters.getTitle

			// alternatively, get app language title or first defined
			//return this.$store.getters.getTitleWithLanguage(this.$root.language || 'en')
		},
	},
	watch: {
		'$route.params.tab': async function(newTab, oldTab) {
			if (!newTab) {
				// this happens when the user navigates to "New dataset" via navigation
				// when user is in Editor view
				this.clearRecord()
			} else {
				this.$store.commit('setMetadata', { tab: newTab })
				this.checkTab()
			}
		},
		'$route.params.id': async function(newId, oldId) {
			if (this.id === 'new') {
				this.clearRecord()
			} else if (this.id !== 'edit' && this.$store.state.metadata.id !== this.id) {
				this.clearRecord()
				await this.openRecord(this.id)
			}
		},
	},
	beforeRouteLeave(to, from, next) {
		if (!this.isDataChanged) {
			next();
			return
		}
		this.confirmUnsavedChanges("Leave the editor?", "No, I want to stay.", (value) => {
			if (!value || value === null) {
				next(false)
			} else {
				next()
			}
		})
	},
	destroyed: function() {
		if (this.reloadDatasetTimer) {
			clearTimeout(this.reloadDatasetTimer)
		}
		this.reloadDatasetTimer = null
	},
	async mounted() {
		if (this.id === 'new') {
			this.clearRecord()
		} else if (this.id !== 'edit') {
			await this.openRecord(this.id)
		}

		// if schema is not set, try to read schema from store
		if (!this.selectedSchema && this.$store.state.metadata.schemaId) {
			this.selectedSchema = this.getSchemaForId(this.$store.state.metadata.schemaId)
		}

		if (this.selectedSchema) {
			this.startValidator()
		}

		this.checkTab()
	},
}
</script>

<style>
.nav-tabs .nav-link.active,
.nav-tabs .nav-link.router-link-active,
.nav-tabs .nav-item.show .nav-link {
	color: #495057;
	background-color: #fff;
	border-color: #dee2e6 #dee2e6 #fff;
}

.tab-field-link {
	display: flex;
	height: 2.5em;
	align-items: center;
	justify-content: space-between;
	padding: 4px 2px 4px 10px;
}

.tab-field-link .delete-button {
	margin: 0px 2px 0px 2px;
}

.no-padding {
	padding-left: 0;
	padding-right: 0;
}
</style>

<style lang="scss" scoped>

#editor-view .navbar {
	flex-flow: wrap;
	padding: 0;

	.navbar-item {
		flex-direction: row;
		flex-wrap: wrap;
	}

	.btn-toolbar {
		width: 100%;
		.btn-group {
			margin: 0;
		}
	}
}

#editor-view .bg-light {
	background-color: #fff !important;
}

#editor-view {
	margin: 0;
	padding: 0;

}


h2.component-title {
	font-weight: 300;
	margin-bottom: 1em;
}

h1.component-title {
	margin-bottom: 0;
	.secondary-text {
		font-size: 0.5em;
		
		display:inline-block;
		//word-wrap: normal;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.router-link-active {
	font-weight: 400;
}

.editor-index-navigation {
	margin-top: 2em;
	top: 8em;
	z-index: 1000;
	font-weight: 300;
}


</style>
