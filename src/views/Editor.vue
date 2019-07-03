<!-- ADD_LICENSE_HEADER -->
<template>
	<div class="container-fluid limited-width">
		<h1 class="component-title">Dataset <small class="secondary-text text-muted" v-if="title">{{ title }}</small></h1>

		<div>
			<b-button-toolbar class="tool-bar" aria-label="Dataset toolbar">
				<b-input-group size="sm" prepend="Where are my files">
					<b-form-select id="editor_select_schema" value="fairdata" v-model="selectedSchema" :disabled="!!selectedSchema" @change="selectSchema">
						<optgroup :label="bundle" v-for="(bundle, index) in bundles" :key="index">
							<option :value="val" v-for="(val, id) in getSchemas(bundle)" :key="id">{{ val.name }}</option>
						</optgroup>
						<option v-if="selectedSchema === null" :value="null" hidden>Select one</option>
					</b-form-select>
				</b-input-group>

				<b-input-group size="sm" prepend="Owner">
					<b-form-select id="editor_select_owner" :value="$auth.user ? $auth.user.name : 'you'" :options="[ $auth.user ? $auth.user.name : 'you' ]"></b-form-select>
				</b-input-group>

				<b-button-group size="sm" class="save-pub-btns">
					<b-button
						id="editor_button_save_top" 
						variant="success"
						@click="save"
						:disabled="rateLimited || isDataChanged == false || saving || publishing"
						ref="dataset-save-button">
						<font-awesome-icon icon="save" />
						Save
					</b-button>
					<b-button
						id="editor_button_publish_top"
						variant="primary"
						@click="confirmPublish"
						:disabled="rateLimited || $store.state.metadata.id == null || (qvainData != null && qvainData.published && qvainData.synced >= qvainData.modified) || isDataChanged || saving || publishing"
						ref="dataset-publish-button">
						<font-awesome-icon icon="upload" />
						Publish
					</b-button>
				</b-button-group>

				<b-button-group size="sm" v-if="!inDev">
					<b-btn variant="outline-light" v-b-tooltip.hover title="View dataset JSON" v-b-modal="'dataset-json-modal'">json</b-btn>
					<b-btn variant="outline-light" v-b-tooltip.hover title="Overview" v-b-modal="'dataset-overview-modal'">overview</b-btn>
					<b-btn variant="outline-light" v-b-tooltip.hover title="Publish" v-b-modal="'publish-modal'">publish</b-btn>
				</b-button-group>

			</b-button-toolbar>
		</div>


		<b-alert variant="danger" :show="!!error" dismissible @dismissed="error=null"><i class="fas fa-ban"></i> API error: {{ error }}</b-alert>
		<b-alert variant="warning"><font-awesome-icon icon="info"></font-awesome-icon> Publishing: I understand that publishing this dataset:</b-alert>

		<b-card id="publish-verification-card" variant="dark" bg-variant="dark" text-variant="white" v-if="showPublishConfirmation">
			<h3 slot="title">
				<font-awesome-icon icon="info" fixed-width />
				Publishing
			</h3>
			<p class="card-text">I understand that publishing this dataset...</p>
				<ul class="list-unstyled">
					<li class="font-italic">... will make it available publicly</li>
					<li class="font-italic">... marks it as ready and enables editing restrictions</li>
				</ul>
			<p></p>
			<div class="float-right">
				<b-button id="publish-verification-card-button-cancel" variant="outline-light" class="ml-3" @click="showPublishConfirmation = false"><font-awesome-icon icon="times" fixed-width /> cancel</b-button>
				<b-button id="publish-verification-card-button-help" variant="danger" class="ml-3" @click="showPublishConfirmation = false" v-if="false"><font-awesome-icon icon="info" fixed-width /> help</b-button>
				<b-button id="publish-verification-card-button-publish" variant="success" :disabled="saving" class="ml-3" @click="publish()"><font-awesome-icon icon="cloud-upload-alt" fixed-width /> publish</b-button>
			</div>
		</b-card>


		<!-- Modals -->
		<dataset-json-modal id="dataset-json-modal"></dataset-json-modal>
		<dataset-overview-modal id="dataset-overview-modal"></dataset-overview-modal>
		<publish-modal id="publish-modal" :error="publishError" @hidden="publishError = null"></publish-modal>

		<div v-if="!loading">
			<!--
				This could be replaced with title from title part?
				<h2>Fairdata dataset</h2>
			-->
			<ul class="nav nav-tabs">
				<!-- TODO: errors could be shown in tabs also -->
				<li v-for="tab in tabs" :key="tab.uri" class="nav-item">
					<router-link :id="'nav-link_' + tab.uri" class="nav-link" :to="`/dataset/${id}/${tab.uri}`">{{tab.label}}</router-link>
				</li>
			</ul>

			<div class="container-fluid no-padding my-3">
				<router-view></router-view>
			</div>

			<b-container v-if="selectedSchema">
				<b-row>
					<b-button-group class="col">
						<b-button
							id="editor_button_save_bottom"
							variant="success"
							@click="save"
							:disabled="rateLimited || isDataChanged == false || saving || publishing"
							ref="dataset-save-button">
							<font-awesome-icon icon="save" />
							Save
						</b-button>
						<b-button
							variant="primary"
							@click="confirmPublish"
							:disabled="rateLimited || $store.state.metadata.id == null || (qvainData != null && qvainData.published && qvainData.synced >= qvainData.modified) || isDataChanged || saving || publishing"
							ref="dataset-publish-button">
							<font-awesome-icon icon="upload" />
							Publish
						</b-button>
					</b-button-group>
				</b-row>
			</b-container>

			<div v-else class="schema-help-text">
				<p>Please select one option from "Where are my files" menu. Note that the selected option cannot be changed without creating a new dataset.</p>

				<p>Where are your files related to this dataset?
				<ul>
				<li>In Fairdata IDA (you want to select files from IDA): "Select IDA files"</li>
				<li>Somewhere else (you want to link files from remote location): "Link Remote Resources"</li>
				</ul></p>
			</div>
		</div>
		<div v-else>
			<font-awesome-icon icon="circle-notch" spin />
		</div>

		<b-card id="publish-verification-card-bottom" variant="dark" bg-variant="dark" text-variant="white" v-if="showPublishConfirmation">
			<h3 slot="title">
				<font-awesome-icon icon="info" fixed-width />
				Publishing
			</h3>
			<p class="card-text">I understand that publishing this dataset...</p>
				<ul class="list-unstyled">
					<li class="font-italic">... will make it available publicly</li>
					<li class="font-italic">... marks it as ready and enables editing restrictions</li>
				</ul>
			<p></p>
			<div class="float-right">
				<b-button id="publish-verification-card-bottom_button-cancel" variant="outline-light" class="ml-3" @click="showPublishConfirmation = false"><font-awesome-icon icon="times" fixed-width /> cancel</b-button>
				<b-button id="publish-verification-card-bottom_button-help" variant="danger" class="ml-3" @click="showPublishConfirmation = false" v-if="false"><font-awesome-icon icon="info" fixed-width /> help</b-button>
				<b-button id="publish-verification-card-bottom_button-publish" variant="success" :disabled="saving" class="ml-3" @click="publish()"><font-awesome-icon icon="cloud-upload-alt" fixed-width /> publish</b-button>
			</div>
		</b-card>

	</div>
</template>

<script>
import Bundle from '@/schemas/bundle.js'
import apiClient from '@/api/client.js'
import DatasetJsonModal from '@/components/DatasetJsonModal.vue'
import DatasetOverviewModal from '@/components/DatasetOverviewModal.vue'
import PublishModal from '@/components/PublishModal.vue'
import Validator from '../../vendor/validator/src/validate.js'

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
			qvainData: null
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
		confirmPublish() {
			const isExisting = !!this.$store.state.metadata.id
			if (!isExisting) {
				this.$root.showAlert("Please save your dataset first", "danger")
				return
			}
			this.showPublishConfirmation = true
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
					const response = await apiClient.post("/datasets/" + this.$store.state.metadata.id + "/publish", {})
					this.$root.showAlert("Dataset successfully published", "primary")
					this.clearRecord() // clear editor dataset
					this.$router.replace({ name: "datasets"}) // redirect to datasets page
				} else {
					this.$root.showAlert("Please save your dataset first", "danger")
				}
			} catch(e) {
				// check if we got an api error for the modal, else show a generic error message
				console.log("publish error:", e, Object.keys(e))
				if (e.response && e.response.data) {
					this.publishError = e.response.data
					this.$root.$emit('bv::show::modal', 'publish-modal', this.$refs['dataset-publish-button'])
				} else {
					this.$root.showAlert("Publish failed!", "danger")
				}
				// TODO: consider updating Publish modal error boiler plate with this error message
				//const errorMessage = `Publish failed, please check you have inserted all mandatory fields. Mandatory fields are: creator, description, access_rights and title. The error was: ${e}`
				//this.$root.showAlert(errorMessage, "danger")
				this.$root.showAlert("Publish failed!", "danger")
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
					const response = await apiClient.put("/datasets/" + currentId, payload)

					this.$root.showAlert("Dataset successfully saved", "primary")
				} else {
					const { data: { id }} = await apiClient.post("/datasets/", payload)
					this.$store.commit('setMetadata', { id })
					this.$router.replace({ name: 'tab', params: { id: id, tab: this.$route.params.tab }})

					this.$root.showAlert("Success! Created as " + id, "success")
				}
				this.isDataChanged = false
			} catch(error) {
				this.$root.showAlert("Save failed!", "danger")
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
		/* not used atm due to not working
		createCloneRecord() {
			this.loading = true
			this.$nextTick(() => {
				this.cloneCurrentRecord()
				this.initDataset()
				this.loading = false
			})
		},
		*/
		initDataset() {
			if (this.selectedSchema !== null) {
				this.$store.commit('loadSchema', this.selectedSchema.schema)
				this.$store.commit('loadHints', this.selectedSchema.ui)
			}
		},

		clearRecord() {
			this.selectedSchema = null
			this.$store.commit('loadSchema', {})
			this.$store.commit('loadHints', {})
			this.$store.commit('loadData', undefined)
			this.$store.commit('resetMetadata')
		},
		/* cloneCurrentRecord() {
			// Not implemented
		}, */
		async openRecord(id) {
			if (this.loading) { return }
			try {
				this.loading = true

				const { data } = await apiClient.get(`/datasets/${id}`)
				this.$store.commit('resetMetadata')
				this.selectedSchema = this.getSchemaForId(data.schema)
				this.$store.commit('loadSchema', this.selectedSchema.schema)
				this.$store.commit('loadHints', this.selectedSchema.ui)
				this.$store.commit('loadData', Object(data.dataset))
				this.$store.commit('setMetadata', { id, schemaId: this.selectedSchema.id })
				this.qvainData = data
			} catch (error) {
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
				{'allowUndefined': true},
			)
			this.validator.v = this.$store.state.vState
			this.unsubscribeFunc = this.$store.subscribe((mutation) => {
				if (mutation.type !== 'initValue') {
					this.validator.validateData(this.$store.state.record)
				}
				// the data has been changed after the initial load by the user
				if (mutation.type == 'updateValue') {
					this.isDataChanged = true
				}
			})
		},
	},
	computed: {
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
				await this.openRecord(this.id)
			}
		},
	},
	async mounted() {
		if (this.id === 'new') {
			this.clearRecord()
		} else if (this.id !== 'edit' && this.$store.state.metadata.id !== this.id) {
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
.tool-bar {
	padding-bottom: 10px;
	margin: -2px -4px;

	> * {
		margin: 2px 4px;
		flex: 1 1 auto;
	}

	select {
		padding-right: 1.5rem;
	}

	.save-pub-btns {
		max-width: 20em;
		margin-left: auto;
		padding-left: 4px;
	}
}

.limited-width {
	max-width: 1100px;
}

.schema-help-text {
	padding: 20px;
}
</style>
