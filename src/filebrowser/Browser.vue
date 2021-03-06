<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Shreyas Deshpande <31839853+ShreyasDeshpande@users.noreply.github.com>
	Kauhia <Kauhia@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<div>
		<b-alert
			:show="!!error"
			variant="danger"
		>
			{{ error }}
			<div
				:style="{'margin-top': '15px'}"
				align="center"
			>
				<b-btn @click="openDirectory">
					Retry
				</b-btn>
			</div>
		</b-alert>

		<!-- BREADCRUMBS AND TOOLBAR -->
		<b-button-toolbar
			key-nav
			aria-label="File browser toolbar"
			class="d-flex align-items-center"
		>
			<Breadcrumbs
				:breadcrumbs="breadcrumbs"
				:click="goTo"
				class="mr-auto"
				home-path="/"
			/>
		</b-button-toolbar>

		<!-- TABLE -->
		<b-table
			:fields="fields"
			:items="filesAndDirectoriesForCWD"
			show-empty
			striped
			hover
			class="mb-0"
		>
			<template v-slot:empty="scope">
				<div
					v-if="loading"
					class="text-center my-2"
				>
					<font-awesome-icon
						icon="spinner"
						spin
					/>
				</div>
				<div
					v-else
					class="text-center my-2"
				>
					No files in this directory
				</div>
			</template>
			<template
				slot="cell(selection)"
				slot-scope="data"
			>
				<b-form-checkbox
					v-if="!disabled"
					class="m-0"
					:checked="selected.includes(data.item.identifier)"
					:disabled="!canToggle(data.item)"
					aria-label="In dataset"
					@change="togglePick($event, data)"
				/>
			</template>

			<template
				slot="cell(type)"
				slot-scope="data"
			>
				<b-btn
					v-if="data.item.type !== 'files'"
					size="sm"
					variant="link"
					class="m-0 p-0 float-right"
					aria-label="Open folder"
					@click.stop="goTo(data.item.path)"
				>
					<font-awesome-icon
						:icon="icon.faFolder"
						size="2x"
					/>
				</b-btn>
				<div v-else />
			</template>

			<template
				slot="cell(name)"
				slot-scope="data"
			>
				<b-btn
					v-if="data.item.type !== 'files'"
					variant="link"
					class="m-0 p-0"
					@click.stop="goTo(data.item.path)"
				>
					{{ data.item.name }}
				</b-btn>
				<span v-else>{{ data.item.name }}</span>
			</template>

			<template
				slot="cell(identifier)"
				slot-scope="data"
			>
				{{ data.item.type !== 'files' ? '' : data.item.identifier }}
			</template>

			<template
				slot="cell(file_count)"
				slot-scope="data"
			>
				{{ data.item.type === 'files' ? '' : data.item.directory.file_count }}
			</template>

			<template
				slot="cell(actions)"
				slot-scope="data"
			>
				<b-btn
					v-if="data.item.type === 'files'"
					variant="primary"
					size="sm"
					class="mr-2"
					@click.stop="data.toggleDetails"
				>
					{{ data.detailsShowing ? 'Hide' : 'Show' }} PAS metadata
				</b-btn>
			</template>

			<template
				slot="row-details"
				slot-scope="data"
			>
				<PASMetadata
					v-if="data.item.type === 'files'"
					:identifier="data.item.identifier"
					:file="data.item.file"
					@saved="updatePasMetadata"
				/>
				<!--<PASMetadata v-else :identifier="data.item.identifier" :folder="data.item" />-->
			</template>
		</b-table>
	</div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

import Breadcrumbs from './breadcrumbs.vue'
import PASMetadata from './PasMetadata.vue'
import { format as formatDate, parseISO } from 'date-fns'

import fileAPI from './client.js'

const formatBytes = (bytes, decimals) => {
	if (bytes == 0) return '0 Bytes'
	const k = 1024,
		dm = decimals || 2,
		sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ],
		i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default {
	name: 'Browser',
	components: {
		Breadcrumbs,
		FontAwesomeIcon,
		PASMetadata,
	},
	props: [ 'project', 'selected', 'disabled', 'editOnlyMetadata', 'onlyRemoveAdded', 'isAddedMap' ],
	data() {
		return {
			fields: [
				{
					key: 'selection',
					label: '',
					class: '',
					tdClass: 'align-middle',
					thStyle: { width: '50px' },
				},
				{
					key: 'type',
					label: '',
					tdClass: 'align-middle',
					class: 'px-2 mx-0',
					thStyle: { width: '3.5em' },
				},
				{
					key: 'name',
					sortable: true,
					tdClass: 'align-middle',
				},
				{
					key: 'identifier',
					sortable: true,
					tdClass: 'align-middle word-break-all',
				},
				{
					key: 'file_count',
					sortable: true,
					tdClass: 'align-middle word-break-all',
				},
				{
					key: 'date_modified',
					sortable: true,
					formatter: value => {
						return formatDate(parseISO(value), 'yyyy-MM-dd')
					},
					tdClass: 'align-middle',
				},
				{
					key: 'byte_size',
					label: 'Size',
					sortable: true,
					tdClass: 'align-middle',
					formatter: value => {
						return formatBytes(value)
					},
				},
				{
					key: 'actions',
					label: '',
				},
			],
			icon: {
				faFolder,
			},
			error: null,
			directory: {
				directories: [],
				files: [],
			},
			loading: true,
		}
	},
	computed: {
		path() {
			const { relpath } = this.$route.params
			if (!relpath) {
				return '/'
			}
			if (relpath.charAt(0) === '/') {
				return relpath
			}
			return '/' + relpath
		},
		breadcrumbs() {
			return this.path.split('/').reduce((acc, path, index) => {
				acc[index] = {}
				acc[index].label = path
				acc[index].to = index === 0 ? [path] : [ ...acc[index -1].to, path ]
				return acc
			}, [])
				.map(value => ({ label: value.label, to: value.to.join('/') }))
		},
		filesAndDirectoriesForCWD() {
			const mapToInternalValues = type => item => {
				// _showDetails is custom class for bootstrap table details
				const base = { type, parentPath: this.path, _showDetails: false }
				const shared = {
					identifier: item.identifier,
					project: item.project_identifier,
					byte_size: item.byte_size,
				}

				const directory = {
					name: item.directory_name,
					path: item.directory_path,
					date_modified: item.directory_modified,
					directory: {
						file_count: item.file_count,
					},
					file: undefined,
				}

				const file = {
					name: item.file_name,
					path: item.file_path,
					date_modified: item.file_modified,
					file: {
						file_format: item.file_format,
						open_access: item.open_access,
						file_characteristics: item.file_characteristics || {},
						checksum: { value: item.checksum_value },
					},
					directory: undefined,
				}

				return Object.assign(base, shared, type === 'files' ? file : directory)
			}

			return [
				...(this.directory.directories || []).map(mapToInternalValues('directories')),
				...(this.directory.files || []).map(mapToInternalValues('files')),
			]
		},
	},
	watch: {
		path() {
			this.openDirectory()
		},
		project: {
			immediate: true,
			async handler() {
				this.clearDirectory()
				if (this.project) {
					await this.openDirectory()
				}
				this.loading = false
			},
		},
	},
	methods: {
		canToggle(item) {
			if (this.editOnlyMetadata) {
				return false
			}
			if (!this.selected.includes(item.identifier)) {
				return true
			}
			// when onlyRemoveAdded is enabled, only allow removing files that were added after last save
			return !this.onlyRemoveAdded || (this.isAddedMap[item.type] && this.isAddedMap[item.type][item.identifier])
		},
		updatePasMetadata(savedData) {
			// Expects only files since it has no way of knowing the type, and atm only file metadata can be edited
			const editedFile = this.directory.files.find(file => file.identifier === savedData.identifier)
			if (editedFile) {
				// purposefully merge to editedFile so that reactivity works
				Object.assign(editedFile, savedData)
			}
		},
		goTo(path) {
			this.$router.push({
				name: 'files',
				params: {
					project: this.project,
					relpath: path,
				},
			})
		},
		async openDirectory() {
			try {
				this.error = null
				const { data } = await fileAPI.get('/directories/files', {
					params: { project: this.project, path: this.path },
				})
				this.directory = data
			} catch (error) {
				if (error.response && error.response.status == 401) {
					// there was a permission error
					// we should redirect the user to login
					await this.$auth.logoutDueSessionTimeout()
					this.$router.push({ name: "home", params: { missingSession: true }})
				}
				this.error = 'Qvain was not able to open the requested directory. Please retry or navigate to another directory. Refreshing the page will forfeit your data.'
			}
		},
		clearDirectory() {
			this.directory = {
				directories: [],
				files: [],
			}
		},
		togglePick(state, data) {
			const description = data.item.file_characteristics ?
				data.item.file_characteristics.description : ''

			const title = data.item.file_characteristics ?
				data.item.file_characteristics.title :
				data.item.name

			const fields = {
				identifier: data.item.identifier,
				use_category: data.item.use_category,
				title,
				description,
			}
			if (state) {
				this.$emit('select', { type: data.item.type, fields })
			} else {
				this.$emit('remove', { type: data.item.type, fields })
			}
		},
	},
}
</script>
