<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<b-modal
		id="dataset-versions-modal"
		ref="dataset-versions-modal"
		size="lg"
		centered
		title="published versions"
		ok-only
		ok-title="close"
		@shown="fetch(dataset)"
		@hide="reset"
	>
		<b-alert
			variant="danger"
			:show="!!error"
		>
			API error: {{ error }}
		</b-alert>
		<h5
			slot="modal-title"
			class="modal-title"
		>
			<font-awesome-icon
				icon="history"
				fixed-width
			/> Published versions
		</h5>

		<b-list-group v-if="versions.length">
			<b-list-group-item
				v-for="(item, index) in versions"
				:key="index"
				class="flex-column align-items-left"
				:disabled="index + 1 < versions.length"
			>
				<header class="d-flex align-items-start w-100 justify-content-between">
					<h5 class="font-weight-bold">
						<b-badge
							v-if="false"
							variant="secondary"
							class="p-1 mr-1 font-weight-light"
						>
							<font-awesome-icon
								icon="database"
								fixed-width
							/> metax
						</b-badge>
						{{ item.identifier }}
					</h5>
					<b-badge :variant="index + 1 < versions.length ? 'secondary' : 'primary'">
						v{{ index + 1 }}
					</b-badge>
				</header>
				<p class="mb-4 mt-0">
					<small class="font-weight-light"><font-awesome-icon
						icon="clock"
						fixed-width
						class="text-dark"
					/> {{ readableIso(item.date_created) }} ({{ friendlyDate(item.date_created) }} ago)</small>
				</p>

				<b-badge
					variant="secondary"
					class="p-1 mr-1 font-weight-light"
				>
					<font-awesome-icon
						icon="database"
						fixed-width
					/> metax
				</b-badge>
				<b-badge
					v-if="item.removed"
					variant="secondary"
					class="p-1 mr-1 font-weight-light"
				>
					<font-awesome-icon
						icon="trash"
						fixed-width
						class="text-danger"
					/> removed
				</b-badge>
				<b-badge
					v-if="index + 1 < versions.length"
					variant="secondary"
					class="p-1 mr-1 font-weight-light"
				>
					<font-awesome-icon
						icon="pen"
						fixed-width
						class="text-danger"
					/> read-only
				</b-badge>
			</b-list-group-item>
		</b-list-group>
		<b-alert
			v-else
			variant="light"
			show
			class="font-italic"
		>
			no versions found
		</b-alert>
	</b-modal>
</template>

<script>
import apiClient from '@/api/client.js'
import { formatDistanceToNow, format as formatDate, parseISO } from 'date-fns'

export default {
	name: 'DatasetVersionsModal',
	props: ['dataset'],
	data: function() {
		return {
			state: "loading",
			versions: [],
			error: null,
		}
	},
	methods: {
		show: function(item, index, button) {
		},
		reset: function() {
			this.versions = []
			this.error = null
		},
		save: function() {
		},
		fetch: async function(dataset) {
			if (!dataset) {
				return
			}

			this.versions = []
			this.error = null

			try {
				const response = await apiClient.get(`/datasets/${dataset}/versions`)
				if (!Array.isArray(response.data)) {
					throw "invalid response from API: expected array"
				}
				this.versions = response.data.reverse()
			} catch (error) {
				if (error.response && error.response.status == 401) {
					// there was a permission error
					// we should redirect the user to login
					await this.$auth.logoutDueSessionTimeout()
					this.$router.push({ name: "home", params: { missingSession: true }})
				}
				this.error = error.response && error.response.data && error.response.data.msg ? error.response.data.msg : (error.message || error || "").toLowerCase()
			} finally {
				// left empty
			}
		},
		friendlyDate: function(iso) {
			return formatDistanceToNow(parseISO(iso))
		},
		readableIso: function(iso) {
			return formatDate(parseISO(iso), "yyyy-MM-dd HH:mm:ss")
		},
	},
}
</script>
