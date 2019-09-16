<!-- ADD_LICENSE_HEADER -->
<template>
	<b-container fluid>
		<h1 class="component-title">
			Datasets
		</h1>

		<!-- controls -->
		<b-button-toolbar class="mb-4 tool-bar">
			<b-button-group
				class="filter-buttons"
				size="sm"
			>
				<b-btn
					class="dataset-filter__button"
					:pressed="datasetsView.showState === 'all'"
					:variant="datasetsView.showState === 'all' ? 'secondary' : 'outline-secondary'"
					@click="setShowState('all')"
				>
					All
				</b-btn>
				<b-btn
					class="dataset-filter__button"
					:pressed="datasetsView.showState === 'draft'"
					:variant="datasetsView.showState === 'all' || datasetsView.showState === 'draft' ? 'success' : 'outline-secondary'"
					@click="setShowState('draft')"
				>
					Draft
				</b-btn>
				<b-btn
					class="dataset-filter__button"
					:pressed="datasetsView.showState === 'published'"
					:variant="datasetsView.showState === 'all' || datasetsView.showState === 'published' ? 'primary' : 'outline-secondary'"
					@click="setShowState('published')"
				>
					Published
				</b-btn>
				<b-btn
					class="dataset-filter__button"
					:pressed="datasetsView.showState === 'unpublishedchanges'"
					:variant="datasetsView.showState === 'all' || datasetsView.showState === 'unpublishedchanges' ? 'warning' : 'outline-secondary'"
					@click="setShowState('unpublishedchanges')"
				>
					Unpublished Changes
				</b-btn>
			</b-button-group>

			<b-input-group
				class="search"
				size="sm"
				prepend="Search"
			>
				<b-form-input
					:value="datasetsView.filterString"
					placeholder="type here to search"
					@update="setFilterString"
				/>
			</b-input-group>
		</b-button-toolbar>


		<!-- alerts -->
		<b-alert
			variant="danger"
			:show="!!error"
			dismissible
			@dismissed="error = null"
		>
			{{ error }}
		</b-alert>


		<div class="pagination-controls">
			<b-pagination
				size="sm"
				align="center"
				hide-goto-end-buttons
				hide-ellipsis
				:value="datasetsView.currentPage"
				:per-page="datasetsView.perPage || datasetsView.filteredCount"
				:total-rows="datasetsView.filteredCount"
				aria-controls="dataset-list"
				first-text="First"
				prev-text="Prev"
				next-text="Next"
				last-text="Last"
				label-page="Page"
				@input="setPage"
			/>

			<b-button-group size="sm">
				<b-btn
					:pressed="datasetsView.perPage === 0"
					@click="setPerPage(0)"
				>
					show all
				</b-btn>
				<b-btn
					v-for="option in perPageOptionsFiltered"
					:key="option"
					:pressed="datasetsView.perPage === option"
					class="btn"
					@click="setPerPage(option)"
				>
					{{ option }}
				</b-btn>
			</b-button-group>
		</div>

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
			<template
				slot="cell(tree_actions)"
				slot-scope="row"
			>
				<b-button-toolbar
					key-nav
					class="row-main-actions"
				>
					<b-button-group class="mr-1">
						<b-button
							variant="secondary"
							@click.stop="row.toggleDetails()"
						>
							{{ 1 + row.index + (datasetsView.currentPage-1)*datasetsView.perPage }}
							<font-awesome-icon
								:icon="row.detailsShowing ? 'chevron-down' : 'chevron-right'"
								fixed-width
							/>
						</b-button>
					</b-button-group>
				</b-button-toolbar>
			</template>
			<template
				slot="cell(actions)"
				slot-scope="row"
			>
				<b-button-group
					size="sm"
					class="mr-1"
				>
					<b-button
						:variant="row.item.identifier == null ? 'outline-secondary' : 'info'"
						:disabled="row.item.identifier == null"
						@click.stop="view(row.item.identifier)"
					>
						<font-awesome-icon
							icon="external-link-alt"
							fixed-width
						/>
						Etsin
					</b-button>
				</b-button-group>
			</template>
			<template
				slot="cell(owner)"
				slot-scope="data"
			>
				<span
					v-b-tooltip.hover.auto
					:title="data.item.uid"
				>{{ data.item.owner }}</span>
			</template>
			<template
				slot="cell(preservation_state)"
				slot-scope="data"
			>
				<preservation-state :state="data.item.preservation_state" />
			</template>
			<template
				slot="cell(created)"
				slot-scope="row"
			>
				<p
					class="text-muted pointer"
					@click.stop="editDataset(row.item)"
				>
					{{ friendlyDate(row.item.created) }} ago<br>
					<small>{{ readableIso(row.item.created) }}</small>
				</p>
			</template>
			<template
				slot="cell(title)"
				slot-scope="row"
			>
				<h5
					class="mb-1 pointer"
					@click.stop="editDataset(row.item)"
				>
					<span
						class="dataset-row-publish-status"
						@click.stop="editDataset(row.item)"
					>
						<font-awesome-icon
							v-if="row.item.published && !isItemPublishedAndHasUpdates(row.item)"
							icon="circle"
							class="text-primary"
						/>
						<font-awesome-icon
							v-else-if="row.item.published && isItemPublishedAndHasUpdates(row.item)"
							icon="circle"
							class="text-warning"
						/>
						<font-awesome-icon
							v-else
							icon="circle"
							class="text-success"
						/>
					</span>
					{{ preferredLanguage(row.item.title) }}
					<b-badge
						v-if="row.item.next !== null"
						variant="warning"
					>
						Old version
					</b-badge>
					<b-badge
						v-if="row.item.deprecated"
						variant="danger"
					>
						Deprecated
					</b-badge>
					<b-badge
						v-if="row.item.preservation_state > 0 || row.item.data_catalog=='urn:nbn:fi:att:data-catalog-pas'"
						variant="info"
					>
						PAS
					</b-badge>
				</h5>
				<p
					v-if="row.item.description"
					class="text-muted pointer"
					@click.stop="editDataset(row.item)"
				>
					<small>{{ preferredLanguage(row.item.description) }}</small>
				</p>
			</template>
			<template
				slot="row-details"
				slot-scope="row"
			>
				<b-button-toolbar key-nav>
					<b-button-group
						size="sm"
						class="mr-1"
					>
						<b-button
							:variant="isItemPublishedAndHasUpdates(row.item) ? 'warning' : 'success'"
							@click.stop="editDataset(row.item)"
						>
							<font-awesome-icon
								icon="pen"
								fixed-width
							/>
							Edit
						</b-button>
					</b-button-group>
					<b-button-group
						size="sm"
						class="mr-1"
					>
						<b-button
							v-b-modal.publishModal
							:disabled="row.item.published && !isItemPublishedAndHasUpdates(row.item)"
							:variant="row.item.published && !isItemPublishedAndHasUpdates(row.item) ? 'outline-secondary' : 'primary'"
							@click="itemToBePublished = row.item"
						>
							<font-awesome-icon
								:icon="publishing ? 'spinner' : 'upload'"
								:spin="publishing"
							/>
							Publish
						</b-button>
					</b-button-group>
					<b-button-group
						size="sm"
						class="mr-1"
					>
						<b-button
							:variant="row.item.identifier == null ? 'outline-secondary' : 'info'"
							:disabled="row.item.identifier == null"
							@click.stop="view(row.item.identifier)"
						>
							<font-awesome-icon
								icon="external-link-alt"
								fixed-width
							/>
							View in Etsin
						</b-button>
					</b-button-group>
					<b-button-group
						size="sm"
						class="mr-1"
					>
						<b-button
							v-b-modal="'dataset-versions-modal'"
							:variant="row.item.versions < 1 ? 'outline-secondary' : 'secondary'"
							:disabled="row.item.versions < 1"
							@click="activeInModal = row.item.id"
						>
							<font-awesome-icon
								icon="history"
								fixed-width
							/>
							Versions
						</b-button>
					</b-button-group>
					<b-button-group
						size="sm"
						class="mr-1"
					>
						<b-button
							v-b-modal.deleteModal
							variant="danger"
							@click="itemToBeDeleted = row.item"
						>
							<font-awesome-icon
								icon="trash"
								fixed-width
							/>
							Delete
						</b-button>
					</b-button-group>
				</b-button-toolbar>
			</template>
			<div
				slot="table-busy"
				class="text-center text-primary my-2"
			>
				<b-spinner class="align-middle" />
			</div>
		</b-table>

		<div class="pagination-controls">
			<b-pagination
				size="sm"
				align="center"
				hide-goto-end-buttons
				hide-ellipsis
				:value="datasetsView.currentPage"
				:per-page="datasetsView.perPage || datasetsView.filteredCount"
				:total-rows="datasetsView.filteredCount"
				aria-controls="dataset-list"
				first-text="First"
				prev-text="Prev"
				next-text="Next"
				last-text="Last"
				label-page="Page"
				@input="setPage"
			/>

			<b-button-group size="sm">
				<b-btn
					:pressed="datasetsView.perPage === 0"
					@click="setPerPage(0)"
				>
					show all
				</b-btn>
				<b-btn
					v-for="option in perPageOptionsFiltered"
					:key="option"
					:pressed="datasetsView.perPage === option"
					class="btn"
					@click="setPerPage(option)"
				>
					{{ option }}
				</b-btn>
			</b-button-group>
		</div>
		<!-- modals -->
		<b-modal
			v-if="itemToBeDeleted !== null"
			id="deleteModal"
			ref="deleteModal"
			title="Delete dataset?"
			ok-title="Delete"
			cancel-variant="primary"
			ok-variant="danger"
			@ok="del"
		>
			<p>
				You are about to delete {{ itemToBeDeleted.published ? "published" : "draft" }} dataset "{{ preferredLanguage(itemToBeDeleted.title) }}".
				This action cannot be reversed. Are you sure you want to delete the dataset?
			</p>

			<p v-if="itemToBeDeleted.published">
				The deleted dataset will still have a landing page (direct access via URN/DOI) but it cannot be found through Etsin's search nor is it visible in Qvain anymore.
			</p>
		</b-modal>
		<b-modal
			id="publishModal"
			ref="publishModal"
			title="Publish dataset?"
			ok-title="Publish"
			cancel-variant="primary"
			ok-variant="success"
			@ok="publish"
		>
			<div class="d-block text-left">
				<p>I understand that publishing this dataset:</p>
				<ul>
					<li>will make it available publicly</li>
					<li>marks it as ready and enables editing restrictions</li>
				</ul>
			</div>
		</b-modal>
		<publish-modal
			id="publishErrorModal"
			ref="publishErrorModal"
			:error="publishError"
			@hidden="publishError = null"
		/>
		<dataset-versions-modal :dataset="activeInModal" />
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

	.pagination-controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		margin-left: -0.5rem;
		margin-right: -0.5rem;
		margin-bottom: 0.5rem;
		& > * {
			margin-left: 0.5rem;
			margin-right: 0.5rem;
			margin-bottom: 4px;
		}
	}

</style>

<style>

	.created-column {
		width: 200px !important;
	}

	.details-column {
		width: 120px !important;
	}
	.actions-column {
		width: 100px !important;
	}
	.pas-column {
		width: 100px !important;
	}
</style>


<script>
import apiClient from '@/api/client.js'
import PreservationState from '@/components/PreservationState.vue'
import DatasetVersionsModal from '@/components/VersionsModal.vue'
import PublishModal from '@/components/PublishModal.vue'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import formatDate from 'date-fns/format'
import getApiError from '@/lib/getApiError.js'

// id owner created modified published identifier title{} description{} preservation_state
const fields = [
	{
		label: "Details",
		key: "tree_actions",
		sortable: false,
		class: 'details-column',
	},
	{
		label: "Dataset",
		key: "title",
		sortable: true,
		formatter: 'preferredLanguage',
		class: 'dataset-column',
	},
	{
		label: "Created",
		key: "created",
		sortable: true,
		class: 'created-column',
	},
	{
		label: "PAS",
		key: "preservation_state",
		sortable: true,
		class: 'pas-column',
	},
	{
		label: "",
		key: "actions",
		sortable: false,
		class: 'actions-column',
	},
]


export default {
	name: "DatasetList",
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
	computed: {
		datasetsView() {
			return this.$store.state.datasetsView
		},
		filterRegExp() {
			return new RegExp('.*' + this.datasetsView.filterString + '.*', 'ig')
		},
		perPageOptionsFiltered() {
			return this.perPageOptions.filter(pageSize => pageSize < this.datasetsView.filteredCount)
		},
	},
	async created() {
		await this.fetchDataset()
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
					this.$router.push({ name: "home", params: { missingSession: true }})
				}
				this.error = getApiError(e, "While fetching datasets", "")
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
					this.$root.$emit('bv::show::modal', 'publishErrorModal')
				} else {
					this.error = getApiError(e, "While publishing dataset", this.itemToBePublished.id)
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
				await this.fetchDataset()
				this.$refs.datasetTable.refresh()
			} catch (e) {
				if (e.response && e.response.status == 401) {
					// there was a permission error
					// we should redirect the user to login
					await this.$auth.logoutDueSessionTimeout()
					this.$router.push({ name: "home", params: { missingSession: true }})
				}
				this.error = getApiError(e, "While deleting dataset", this.itemToBeDeleted.id)
			} finally {
				this.isBusy = false
				this.deleting = false
			}
		},
		view(extid) {
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
			return this.$store.getters.getStringFromMultiLanguage(langObj) || ""
		},
		filter(item) {
			return this.filterState(item) && this.filterTitles(item)
		},
		filterState(item) {
			return this.datasetsView.showState === 'all' ||
				(this.datasetsView.showState === 'published' && item.published && !this.isItemPublishedAndHasUpdates(item)) ||
				(this.datasetsView.showState === 'draft' && !item.published) ||
				(this.datasetsView.showState === 'unpublishedchanges' && this.isItemPublishedAndHasUpdates(item))
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
}
</script>
