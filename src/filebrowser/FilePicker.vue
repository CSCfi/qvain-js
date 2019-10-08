<!-- ADD_LICENSE_HEADER -->
<template>
	<div>
		<b-alert :show="!readOnly && isOld">
			You are editing an old version of the dataset and cannot add or remove files.
		</b-alert>

		<b-alert :show="isPas">
			You are editing a PAS dataset and cannot add or remove files, but can still modify the PAS metadata of your files.
		</b-alert>

		<b-alert :show="hasDeletedItems">
			Some of the files in your dataset have been deleted.
			<template v-if="!readOnly && !editOnlyMetadata">
				You need to remove the deleted files from the dataset before it can be published.
			</template>
			<template v-else>
				The dataset cannot be published with deleted files.
			</template>
		</b-alert>

		<record-field
			v-if="!isPas && !isOld"
			:wrapped="true"
			:header="true"
		>
			<title-component
				slot="title"
				title="Cumulative dataset"
			>
				Cumulative dataset
			</title-component>
			<template v-if="!isPublished">
				<small
					slot="help"
					class="text-muted"
				>
					Note! After the dataset has been published, changing the value from "No" to "Yes" will cause a new version of the dataset to be created.
					Change from "Yes" to "No" will not create a new version.
				</small>
				<b-row
					slot="input"
				>
					<b-col>
						<b-form-group>
							<b-form-radio-group
								:checked="$store.state.metadata.cumulativeState"
								label="Header:"
								stacked
								@change="$emit('set-cumulative', $event)"
							>
								<b-form-radio
									:value="0"
								>
									No. (Adding files or folders will automatically create a new version of the dataset.)
								</b-form-radio>
								<b-form-radio
									:value="1"
								>
									Yes. (New files or folders can be added without a version change.)
								</b-form-radio>
							</b-form-radio-group>
						</b-form-group>
					</b-col>
				</b-row>
			</template>
			<template v-else>
				<small
					v-if="isCumulative"
					slot="help"
					class="text-muted"
				>
					This is a cumulative dataset. New files and folders can be added to it without creating a new version.
				</small>

				<small
					v-else
					slot="help"
					class="text-muted"
				>
					This is a non-cumulative dataset. Adding or removing files will create a new version of the dataset.
				</small>

				<small
					slot="help"
					class="text-muted"
				>
					You need to have published your current changes before you can change this option.
				</small>


				<b-row
					v-if="isCumulative"
					slot="input"
				>
					<b-button
						class="col-4"
						variant="primary"
						:disabled="!canToggleCumulative"
						@click="$emit('set-cumulative', 2)"
					>
						Make non-cumulative
					</b-button>
					<span class="col">
						After turning non-cumulative, no new files or folders can be added to the current version.
					</span>
				</b-row>

				<b-row
					v-else
					slot="input"
				>
					<b-button
						class="col-4"
						variant="primary"
						:disabled="!canToggleCumulative"
						@click="$emit('set-cumulative', 1)"
					>
						Make cumulative
					</b-button>
					<span class="col">
						New files and folders can be added to a cumulative datasets without creating a new version. Enabling this will create a new version of the dataset.
					</span>
				</b-row>
			</template>
		</record-field>

		<b-dropdown
			v-if="!readOnly && !editOnlyMetadata"
			text="Change project"
			class="my-3"
		>
			<b-dropdown-item
				v-for="proj in projects"
				:key="proj"
				@click="updateProject(proj)"
			>
				Project {{ proj }}
			</b-dropdown-item>
		</b-dropdown>

		<b-alert
			:show="hasFilesFromOtherProject"
			variant="danger"
		>
			You may only select files from one project. You may browse other project but adding files is disabled. Remove selected files to change project.
		</b-alert>

		<div v-if="selectedProject">
			<b-row no-gutters>
				<b-col class="bg-primary py-3 px-4 d-flex justify-content-between">
					<h1 class="text-white">
						Project {{ selectedProject }}
					</h1>
				</b-col>
			</b-row>

			<Browser
				:selected="selectedByIdentifiers"
				:project="selectedProject"
				:disabled="hasFilesFromOtherProject"
				:edit-only-metadata="editOnlyMetadata"
				:is-added-map="fileAndDirectoryChanges.isAdded"
				:only-remove-added="isCumulative && isPublished"
				@select="addFileOrDirectory"
				@remove="removeFileOrDirectory"
			/>
		</div>

		<template v-if="Object.keys(fileAndDirectoryChanges.items).length > 0">
			<div
				v-for="(categoryItems, change) in fileAndDirectoryChanges.items"
				:key="change"
				class="my-2"
			>
				<div class="px-2 py-2 d-flex justify-content-between">
					<h4>{{ changeLabels[change] }}</h4>
				</div>
				<b-card
					no-body
				>
					<div
						v-for="(items, category) in categoryItems"
						:key="category"
					>
						<FileItem
							v-for="item in items"
							:key="item.identifier"
							:single="item"
							:type="category"
							:secondary="item.identifier"
							:icon="icons[category]"
							:read-only="readOnly || isOld"
							:no-remove="isCumulative && isPublished && change !== 'added'"
							:revertable="change === 'removed'"
							:edited="fileAndDirectoryChanges.isEdited[category][item.identifier]"
							:deleted="$store.state.deletedItems[category][item.identifier] === true"
							@delete="removeFileOrDirectory"
							@revert="addFileOrDirectory"
						/>
					</div>
				</b-card>
			</div>
		</template>
		<b-card
			v-else
			class="text-center bg-light"
		>
			No files added
		</b-card>
	</div>
</template>

<script>

import Browser from './Browser'
import FileItem from './FileItem.vue'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'

import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions'

const metaxFileAPI = axios.create({
	adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter)),
	baseURL: process.env.VUE_APP_METAX_FILEAPI_URL || '/api/proxy',
	timeout: 5000,
	responseType: 'json',
})

export default {
	name: 'Filepicker',
	components: {
		Browser,
		FileItem,
		RecordField,
		TitleComponent,
	},
	props: {
		'readOnly': {
			type: Boolean,
		},
	},
	data() {
		return {
			error: null,
			icons: {
				files: faFile,
				directories: faFolder,
			},
			state: {
				directories: [],
				files: [],
			},
			initializing: true,
			changeLabels: {
				added: "Added items",
				removed: "Removed items",
				existing: "Published items",
			},
		}
	},
	computed: {
		fileAndDirectoryChanges() {
			return this.$store.getters.getFileAndDirectoryChanges(this.state)
		},
		canToggleCumulative() {
			return this.isPublished && !this.$store.state.metadata.isPublishedAndUpdateAvailable
		},
		isPublished() {
			return this.$store.state.metadata.isPublished
		},
		isCumulative() {
			return this.$store.state.metadata.cumulativeState === 1
		},
		project: {
			get() {
				return this.$store.state.metadata.project
			},
			set(project) {
				this.$store.commit('setMetadata', { project })
			},
		},
		isOld() {
			return this.$store.state.metadata.isOldVersion
		},
		isPas() {
			return this.$store.state.metadata.isPas
		},
		editOnlyMetadata() {
			return this.isPas || this.isOld
		},
		hasDeletedItems() {
			for (const category in this.state) {
				for (const idx in this.state[category]) {
					const identifier = this.state[category][idx].identifier
					if (this.$store.state.deletedItems[category][identifier] === true) {
						return true
					}
				}
			}
			return false
		},
		projects() {
			return (this.$auth.user && this.$auth.user.projects) || []
			// return ['project_x', '2001036'] // this is only for development purpose
		},
		selectedProject() {
			if (this.readOnly) {
				return this.project || null
			}

			const { project: projectIDInRoute } = this.$route.params
			const usersFirstProject = this.projects[0]

			// add current store project before userFirstProject
			return projectIDInRoute || this.project || usersFirstProject || null
		},
		selectedByIdentifiers() {
			const { directories, files } = this.state
			return [ ...directories, ...files ].map(item => item.identifier)
		},
		hasFilesFromOtherProject() {
			return this.project && this.project !== this.selectedProject
		},
	},
	watch: {
		state: {
			deep: true,
			handler(newVal, oldVal) {
				// this guard prevents store update when switching tabs
				if (this.initializing) {
					return
				}
				this.$store.commit('updateValue', {
					p: this.$store.state.record,
					prop: 'files',
					val: this.state.files,
				})
				this.$store.commit('updateValue', {
					p: this.$store.state.record,
					prop: 'directories',
					val: this.state.directories,
				})
			},
		},
	},
	async created() {
		this.loadFilesAndFoldersFromStore()

		let projectAsync
		if (!this.project) {
			projectAsync = this.fetchFileAndProjectInfo()
		}
		await this.$store.dispatch('fetchMetaxRecord')
		await projectAsync

		await this.$nextTick()
		this.initializing = false
	},
	methods: {
		addFileOrDirectory({ type, fields }) {
			fields.use_category = {
				"in_scheme": undefined,
				"identifier": "http://uri.suomi.fi/codelist/fairdata/use_category/code/outcome",
				"pref_label": {
					"fi": "Tulosaineisto",
					"en": "Outcome material",
					"und": "Tulosaineisto",
				},
			}

			if (type === 'files') {
				fields.description = fields.description ? fields.description : 'File'
				if (this.state.files.filter(v => v.identifier === fields.identifier).length > 0) {
					return // prevent adding same file twice
				}
				this.state.files.push(fields)
			} else {
				fields.description = fields.description ? fields.description : 'Folder'
				if (this.state.directories.filter(v => v.identifier === fields.identifier).length > 0) {
					return // prevent adding same directory twice
				}
				this.state.directories.push(fields)
			}
			this.project = this.selectedProject
		},
		removeFileOrDirectory({ type, fields }) {
			if (this.isCumulative && !this.fileAndDirectoryChanges.isAdded[type][fields.identifier]) {
				return // cannot remove published files or directories from cumulative datasets
			}

			if (type === 'files') {
				this.$set(this.state, 'files', this.state.files.filter(f => f.identifier !== fields.identifier))
			} else {
				this.$set(this.state, 'directories', this.state.directories.filter(d => d.identifier !== fields.identifier))
			}

			if (this.selectedByIdentifiers.length === 0) {
				this.project = null
			}
		},

		updateProject(project) {
			this.$router.push({ name: 'files', params: { project }})
		},

		loadFilesAndFoldersFromStore() {
			this.state.files = this.$store.state.record.files || []
			this.state.directories = this.$store.state.record.directories || []
		},

		async fetchFileAndProjectInfo() {
			// Iterates over files and directories in the dataset to find out the project
			// used in the dataset and determine if some of them have been deleted.
			let project = null

			// get files
			for (let i=0; i<this.state.files.length; i++) {
				const identifier = this.state.files[i].identifier
				try {
					const { data } = await metaxFileAPI.get(`/files/${identifier}?removed`) // returns the file even if it was deleted
					if (!project) {
						project = data.project_identifier
					}
					if (data.removed) {
						this.$store.commit('setDeletedItem', { category: 'files', identifier, val: true })
					}
				} catch(e) {
					if (e.response && e.response.status == 404) {
						this.$store.commit('setDeletedItem', { category: 'files', identifier, val: true })
					} else if (e.response && e.response.status == 401) {
						// there was a permission error
						// we should redirect the user to login
						await this.$auth.logoutDueSessionTimeout()
						this.$router.push({ name: "home", params: { missingSession: true }})
					}
				}
			}

			// get directories
			for (let i=0; i<this.state.directories.length; i++) {
				const identifier = this.state.directories[i].identifier
				try {
					const { data } = await metaxFileAPI.get(`/directories/${identifier}/files`)
					if (!project) {
						project = (data.directories && data.directories[0] && data.directories[0].project_identifier) ||
							(data.files && data.files[0] && data.files[0].project_identifier) || null
					}
				} catch(e) {
					if (e.response && e.response.status == 404) {
						this.$store.commit('setDeletedItem', { category: 'directories', identifier, val: true })
					} else if (e.response && e.response.status == 401) {
						// there was a permission error
						// we should redirect the user to login
						await this.$auth.logoutDueSessionTimeout()
						this.$router.push({ name: "home", params: { missingSession: true }})
					}
				}
			}

			this.project = project
		},
	},
}
</script>
