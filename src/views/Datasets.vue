<!-- ADD_LICENSE_HEADER -->
<template>
	<b-container fluid>
		<h1 class="component-title">Datasets</h1>

		<!-- controls -->
		<b-button-toolbar class="mb-4 tool-bar">
			<b-button-group class="filter-buttons" size="sm">
				<b-btn class="dataset-filter__button" :pressed="'datasetsView.showState' === 'all'" @click="()=>setShowState('all')" variant="secondary">All</b-btn>
				<b-btn class="dataset-filter__button" :pressed="'datasetsView.showState' === 'draft'" @click="()=>setShowState('draft')" variant="success">Draft</b-btn>
				<b-btn class="dataset-filter__button" :pressed="'datasetsView.showState' === 'published'" @click="()=>setShowState('published')" variant="primary">Published</b-btn>
				<b-btn class="dataset-filter__button" :pressed="'datasetsView.showState' === 'unpublishedchanges'" @click="()=>setShowState('unpublishedchanges')" variant="warning">Unpublished Changes</b-btn>
			</b-button-group>

			<b-input-group class="search" size="sm" prepend="Search">
				<b-form-input
					:value="datasetsView.filterString"
					placeholder="type here to search"
					@update="setFilterString"
				/>
			</b-input-group>

			<div class="pagination-wrapper">
				<b-pagination
					:value="datasetsView.currentPage"
					:per-page="datasetsView.perPage"
					:total-rows="datasetsView.filteredCount"
					aria-controls="dataset-list"
					@input="setPage"
				/>

				<div class="per-page">
					<span class="per-page-label">Items per page</span>
					<b-button-group class="per-page-btns">
						<b-btn
							v-for="option in perPageOptions"
							:key="option"
							:pressed="datasetsView.perPage == option"
							class="btn"
							@click="() => setPerPage(option)"
						>{{ option }}
						</b-btn>
					</b-button-group>
				</div>
			</div>
		</b-button-toolbar>

		<!-- alerts -->
		<b-alert variant="danger" :show="!!error" dismissible @dismissed="error = null">{{ error }}</b-alert>

		<!-- table -->
		<b-table
			id="dataset-list"
			ref="datasetTable"
			:items="datasetsView.datasetList"
			:fields="fields"
			striped
			hover
			:tbody-tr-class="rowClass"
			filter="truthy value"
			:filter-function="filter"
			:busy.sync="isBusy"
			primary-key="id"
			:sort-by.sync="datasetsView.sortBy"
			:sort-desc.sync="datasetsView.sortDesc"
			:current-page="datasetsView.currentPage"
			:per-page="datasetsView.perPage"
			@sort-changed="setSort"
			@filtered="updateFiltered"
		>
			<template slot="tree_actions" slot-scope="row">
				<b-button-toolbar key-nav class="row-main-actions">
					<b-button-group class="mr-1">
						<b-button
							variant="secondary"
							@click.stop="row.toggleDetails()">
							<font-awesome-icon
								:icon="row.detailsShowing ? 'chevron-down' : 'chevron-right'"
								fixed-width />
						</b-button>
					</b-button-group>
				</b-button-toolbar>
			</template>
			<template slot="actions" slot-scope="row">
				<b-button-group size="sm" class="mr-1">
					<b-button
						:variant="row.item.identifier == null ? 'outline-secondary' : 'info'"
						@click.stop="view(row.item.identifier)"
						:disabled="row.item.identifier == null">
						<font-awesome-icon icon="external-link-alt" fixed-width />
						Etsin
					</b-button>
				</b-button-group>
			</template>
			<template slot="owner" slot-scope="data">
				<span v-b-tooltip.hover.auto :title="data.item.uid">{{ data.item.owner }}</span>
			</template>
			<template slot="preservation_state" slot-scope="data">
				<preservation-state :state="data.item.preservation_state" />
			</template>
			<template slot="created" slot-scope="row">
				<p class="text-muted pointer" @click.stop="editDataset(row.item)">
					{{ friendlyDate(row.item.created) }} ago<br />
					<small>{{ readableIso(row.item.created) }}</small>
				</p>
			</template>
			<template slot="title" slot-scope="row">
				<h5 class="mb-1 pointer" @click.stop="editDataset(row.item)">
					<span class="dataset-row-publish-status" @click.stop="editDataset(row.item)">
						<font-awesome-icon icon="circle" class="text-primary" v-if="row.item.published && !isItemPublishedAndHasUpdates(row.item)" />
						<font-awesome-icon icon="circle" class="text-warning" v-else-if="row.item.published && isItemPublishedAndHasUpdates(row.item)" />
						<font-awesome-icon icon="circle" class="text-success" v-else />
					</span>
					{{ preferredLanguage(row.item.title) }}
					<b-badge v-if="row.item.next !== null" variant="warning" class="old-version">Old version</b-badge>
				</h5>
				<p v-if="row.item.description" class="text-muted pointer" @click.stop="editDataset(row.item)">
					<small>{{ preferredLanguage(row.item.description) }}</small>
				</p>
			</template>
			<template slot="row-details" slot-scope="row">
				<b-button-toolbar key-nav>
					<b-button-group size="sm" class="mr-1">
						<b-button
							:variant="isItemPublishedAndHasUpdates(row.item) ? 'warning' : 'success'"
							@click.stop="editDataset(row.item)">
							<font-awesome-icon icon="pen" fixed-width />
							Edit
						</b-button>
					</b-button-group>
					<b-button-group size="sm" class="mr-1">
						<b-button
							:disabled="row.item.published && !isItemPublishedAndHasUpdates(row.item)"
							:variant="row.item.published && !isItemPublishedAndHasUpdates(row.item) ? 'outline-secondary' : 'primary'"
							@click="itemToBePublished = row.item"
							v-b-modal.publishModal>
							<font-awesome-icon :icon="publishing ? 'spinner' : 'upload'" :spin="publishing" />
							Publish
						</b-button>
					</b-button-group>
					<b-button-group size="sm" class="mr-1">
						<b-button
							:variant="row.item.identifier == null ? 'outline-secondary' : 'info'"
							@click.stop="view(row.item.identifier)"
							:disabled="row.item.identifier == null">
							<font-awesome-icon icon="external-link-alt" fixed-width />
							View in Etsin
						</b-button>
					</b-button-group>
					<b-button-group size="sm" class="mr-1">
						<b-button
							:variant="row.item.versions < 1 ? 'outline-secondary' : 'secondary'"
							v-b-modal="'dataset-versions-modal'"
							@click="activeInModal = row.item.id"
							:disabled="row.item.versions < 1">
							<font-awesome-icon icon="history" fixed-width />
							Versions
						</b-button>
					</b-button-group>
					<b-button-group size="sm" class="mr-1">
						<b-button
							variant="danger"
							@click="itemToBeDeleted = row.item"
							v-b-modal.deleteModal>
							<font-awesome-icon icon="trash" fixed-width />
							Delete
						</b-button>
					</b-button-group>
				</b-button-toolbar>
			</template>
			<div slot="table-busy" class="text-center text-primary my-2">
				<b-spinner class="align-middle"></b-spinner>
			</div>
		</b-table>

		<!-- modals -->
		<b-modal
			v-if="itemToBeDeleted !== null"
			id="deleteModal"
			ref="deleteModal"
			title="Delete dataset?"
			ok-title="Delete"
			cancel-variant="primary"
			ok-variant="danger"
			@ok="del">
			<p>
				You are about to delete {{ itemToBeDeleted.published ? "published" : "draft" }} dataset "{{ preferredLanguage(itemToBeDeleted.title) }}".
				This action cannot be reversed. Are you sure you want to delete the dataset?
			</p>

			<p v-if="itemToBeDeleted.published">
				The deleted dataset will still have a landing page (direct access via URN/DOI) but it cannot be found through Etsin's search nor is it visible in Qvain anymore.
			</p>
		</b-modal>
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
		<dataset-versions-modal :dataset="activeInModal"></dataset-versions-modal>
	</b-container>
</template>

<style lang="scss" scoped>
	.tool-bar {
		margin: -2px -4px;

		> * {
			margin: 2px 4px;
			flex-grow: 1;
		}

		.search {
			flex-grow: 10000;
		}
	}

	.b-table-details > .container > .row {
		display: flex;
		align-items: center;
		justify-content: center;

		.col:first-child {
			align-self: flex-start;
		}

		.col:last-child {
			align-self: flex-end;
		}
	}

	.table td {
		.text-muted {
			margin-bottom: 0;
		}
	}

	.table td:nth-child(2), .table td:nth-child(2) p {
		text-align: left !important ;
		vertical-align: middle !important;
	}

	.table td:nth-child(2) h5 {
		margin-bottom: 0 !important;
		font-weight: 300 !important;
	}

	.table td:nth-child(2) p {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 24rem;
	}

	.table td:nth-child(1) {
		div {
			text-align: left !important ;
			vertical-align: middle !important;
			p {
				margin-bottom: 0;
			}
		}
	}

	.row-main-actions {
		.btn-group {
			margin-top: 0.1em;
		}
	}

	.pagination-wrapper {
		display: flex;
		flex-wrap: wrap;
		font-size: 14px;
		margin: 0;
		> * {
			margin: 2px 4px;
			flex-shrink: 1;
			flex-grow: 1;
		}
	}

	.per-page {
		display: flex;
		flex-wrap: nowrap;
		flex-shrink: 1;
		flex-grow: 1;

		.per-page-label {
			border-radius: 4px 0 0 4px;
			padding: 0.1rem 0.75rem;
			min-height: 31px;

			color: #495057;
			background-color: #e9ecef;
			border: 1px solid #ced4da;
			border-color: rgb(206, 212, 218);
			border-right: none;

			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 0;

			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;

			flex-grow: 0.25;
		}

		.per-page-btns {
			flex-grow: 1;
			display: flex;

			.btn:first-child {
				padding: 0.1rem 0.5rem;
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}

			.btn {
				flex-grow: 1;
				padding: 0.1rem 0.5rem;
				min-height: 31px;
				font-size: inherit;

				z-index: 1;
				color: #007fad;
				background-color: #fff;
				border: 1px solid #dee2e6;
				border-color: rgb(206, 212, 218);

				&.active {
					color: #fff;
					background-color: #007fad;
					border-color: #007fad;
				}
			}
		}
	}

</style>

<script>
import apiClient from '@/api/client.js'
import PreservationState from '@/components/PreservationState.vue'
import DatasetVersionsModal from '@/components/VersionsModal.vue'
import PublishModal from '@/components/PublishModal.vue'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import formatDate from 'date-fns/format'

// id owner created modified published identifier title{} description{} preservation_state
const fields = [
	{
		label: "Details",
		key: "tree_actions",
		sortable: false,
	},
	{
		label: "Dataset",
		key: "title",
		sortable: true,
		formatter: 'preferredLanguage',
	},
	{
		label: "Created",
		key: "created",
		sortable: true,
	},
	{
		label: "PAS",
		key: "preservation_state",
		sortable: true,
	},
	{
		label: "",
		key: "actions",
		sortable: false,
	},
]

function getApiError(error) {
	let apiError = "API Error"
	if (error.response) {
		apiError += " [" + error.response.status + "]"
		if (error.response.data && error.response.data.msg) {
			apiError += ": " + error.response.data.msg
		}
	} else if (error.message) {
		apiError += ": " + error.message.toLowerCase()
	}
	return apiError
}

export default {
	name: "dataset-list",
	components: {
		PreservationState,
		DatasetVersionsModal,
		'publish-modal': PublishModal,
	},
	data() {
		return {
			activeInModal: null,
			fields: fields,
			isBusy: false,
			publishError: null,
			error: null,
			devWarning: process.env.VUE_APP_ENVIRONMENT === 'development',
			itemToBeDeleted: null,
			itemToBePublished: null,
			publishing: false,
			sortBy: null,
			sortDesc: false,
			perPageOptions: [ 10, 20, 50 ],
		}
	},
	methods: {
		async fetchDataset() {
			this.isBusy = this.datasetsView.datasetList === null
			try {
				this.error = null
				const { data } = await apiClient.get("/datasets/")
				data.sort((a,b) => {
					const cmp = this.preferredLanguage(a.title).localeCompare(this.preferredLanguage(b.title))
					if (cmp == 0) {
						return new Date(a.created) - new Date(b.created)
					}
					return cmp
				})
				this.setDatasetList(data)
			} catch (e) {
				if (e.response && e.response.status == 401) {
					// there was a permission error
					// we should redirect the user to login
					await this.$auth.logoutDueSessionTimeout()
					this.$router.push({name: "home", params: {missingToken: true}})
				}
				this.error = getApiError(e)
				this.setDatasetList([])
			} finally {
				this.isBusy = false
			}
		},
		editDataset(item) {
			this.$router.push({ name: 'editor', params: { id: item.id }})
		},
		clickedRow(item) {
			item._showDetails = !item._showDetails
		},

		async publish() {
			if (this.publishing) { return }
			this.publishing = true
			this.error = null
			this.publishError = null
			try {
				await apiClient.post("/datasets/" + this.itemToBePublished.id + "/publish", {})
				await this.fetchDataset()
				this.$refs.datasetTable.refresh()
			} catch (e) {
				if (e.response && e.response.data) {
					this.publishError = e.response.data
					console.log("Show modal error")
					this.$root.$emit('bv::show::modal', 'publishErrorModal')
				} else {
					this.error = getApiError(e)
				}
			} finally {
				this.publishing = false
			}
		},

		async del() {
			if (this.deleting) { return }
			this.isBusy = true
			this.deleting = true
			this.error = null
			try {
				await apiClient.delete("/datasets/" + this.itemToBeDeleted.id)
				this.$root.showAlert("Successfully deleted dataset", "success")

				await this.fetchDataset()
				this.$refs.datasetTable.refresh()
			} catch (e) {
				if (e.response && e.response.status == 401) {
					// there was a permission error
					// we should redirect the user to login
					await this.$auth.logoutDueSessionTimeout()
					this.$router.push({name: "home", params: {missingToken: true}})
				}
				this.error = getApiError(e)
			} finally {
				this.isBusy = false
				this.deleting = false
			}
		},
		view(extid) {
			console.log("opening:", `{process.env.VUE_APP_ETSIN_API_URL}/{extid}`)
			window.open(`${process.env.VUE_APP_ETSIN_API_URL}/${extid}`, '_blank')
		},
		friendlyDate: distanceInWordsToNow,
		readableIso(iso) {
			return formatDate(iso, "YYYY-MM-DD HH:mm:ss")
		},
		preferredLanguage(langObj) {
			if (typeof langObj === "string") {
				return langObj
			} else if (typeof langObj !== "object" || langObj === null) {
				return "–"
			}
			return langObj[this.$root.language] || langObj['en'] || langObj['fi'] || langObj['se'] || langObj[Object.keys(langObj)[0]] || ""
		},
		filter(item) {
			return this.filterState(item) && this.filterTitles(item)
		},
		filterState(item) {
			return this.datasetsView.showState === 'all' ||
				(this.datasetsView.showState === 'published' && item.published && !this.isItemPublishedAndHasUpdates(item)) ||
				(this.datasetsView.showState === 'draft' && !item.published) ||
				(this.datasetsView.showState === 'unpublishedchanges' && this.isItemPublishedAndHasUpdates(item) )
		},
		filterTitles(item) {
			if (!this.datasetsView.filterString) return true // don't filter null.toString()

			// use reactivity to cache regex
			//let regex = new RegExp('.*' + this.filterString + '.*', 'ig')
			let regex = this.filterRegExp

			// search only in the user's preferred language, which is slower, but less likely to confuse
			//const test = regex.test(item.title)
			const test = regex.test(this.preferredLanguage(item.title))
			regex.lastIndex = 0
			return test
		},
		isItemPublishedAndHasUpdates: function(item) {
			return item && item.published && (item.modified > item.synced)
		},
		refresh() {
			this.$refs.datasetTable.refresh()
		},
		rowClass(item, type) {
			if (!item) return
			if ('#' + item.id === this.$route.hash) {
				return 'table-warning alert-warning'
			}
		},
		createNewRecord() {
			this.$store.commit('loadData', undefined)
			this.$store.commit('resetMetadata')

			this.$store.commit('loadSchema', {})
			this.$store.commit('loadHints', {})

			this.$router.replace({ name: 'editor', params: { id: 'new' }})
		},
		setDatasetList(list) {
			this.$store.commit('updateDatasetsView', { datasetList: list })
		},
		setPage(page) {
			this.$store.commit('updateDatasetsView', { currentPage: page })
		},
		setPerPage(perPage) {
			if (this.datasetsView.perPage == perPage) {
				return
			}
			this.$store.commit('updateDatasetsView', { currentPage: 1, perPage: perPage })
		},
		setSort(ctx) {
			this.$store.commit('updateDatasetsView', { sortBy: ctx.sortBy, sortDesc: ctx.sortDesc })
		},
		updateFiltered(filtered) {
			this.setFilteredCount(filtered.length)
		},
		setFilteredCount(count) {
			if (count == this.datasetsView.filteredCount) {
				return
			}
			this.$store.commit('updateDatasetsView', { filteredCount: count })
		},
		setShowState(state) {
			this.$store.commit('updateDatasetsView', { showState: state })
		},
		setFilterString(state) {
			this.$store.commit('updateDatasetsView', { filterString: state })
		},
	},
	computed: {
		datasetsView() {
			return this.$store.state.datasetsView
		},
		filterRegExp() {
			return new RegExp('.*' + this.datasetsView.filterString + '.*', 'ig')
		},
	},
	async created() {
		await this.fetchDataset()
	},
}
</script>
