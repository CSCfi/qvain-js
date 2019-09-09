<!-- ADD_LICENSE_HEADER -->
<template>
	<b-card
		class="rounded-0"
		no-body
	>
		<b-card-body class="d-flex py-1 align-items-center">
			<font-awesome-icon
				:icon="icon"
				size="2x"
				class="mr-4 text-muted"
			/>
			<div class="py-2">
				<div class="d-flex">
					<h6 class="mb-0">
						{{ single.title }}
						<span
							v-if="secondary"
							class="text-muted m-0 font-italic"
						>({{ secondary }})</span>
						<b-badge
							v-if="deleted"
							variant="danger"
							class="deleted"
						>
							Deleted
						</b-badge>
					</h6>
				</div>
				<p class="my-2">
					<font-awesome-icon
						v-b-tooltip.hover
						title="Title"
						:icon="icons.faPencilAlt"
						:class="single.title ? 'text-primary' : 'text-secondary'"
						class="mr-2"
					/>
					<font-awesome-icon
						v-b-tooltip.hover
						class="mr-2"
						:icon="icons.faTag"
						title="Use Category"
						:class="single.use_category ? 'text-primary' : 'text-secondary'"
					/>
				</p>
			</div>
			<b-btn-group class="ml-auto">
				<b-btn
					v-b-toggle="single.identifier"
					:disabled="readonly || deleted"
					variant="primary"
					class="px-3 py-2"
				>
					<font-awesome-icon :icon="icons.faPen" />
				</b-btn>
				<b-btn
					:disabled="readonly"
					variant="danger"
					class="px-3 py-2"
					@click="$emit('delete', { type, fields: single })"
				>
					<font-awesome-icon :icon="icons.faTrash" />
				</b-btn>
			</b-btn-group>
		</b-card-body>
		<b-collapse
			:id="single.identifier"
			accordion="file-accordion"
			class="mt-2"
			:style="{'padding': '20px', 'padding-top': '0px'}"
		>
			<b-form-group
				key="title"
				class="item-field my-1"
				label="Title"
				label-cols="3"
				lable-for="title"
			>
				<b-form-input
					v-model="single.title"
					class="qvain-input"
					placeholder="Title"
				/>
			</b-form-group>

			<b-form-group
				key="description"
				class="item-field my-1"
				label="Description"
				label-cols="3"
				lable-for="description"
			>
				<b-form-input
					v-model="single.description"
					class="qvain-input"
					placeholder="Description"
				/>
			</b-form-group>

			<RefList
				es-doctype="use_category"
				placeholder="use category"
				help="help text"
				ui-label="Use category"
				:value="single.use_category"
				:set-value="v => {
					$set(single, 'use_category', {
						in_scheme: v.in_scheme,
						identifier: v.identifier,
						pref_label: v.pref_label,
					})
				}"
				type="multiselect"
				:custom-label="(item) => item['pref_label'] ?
					item['pref_label']['en'] ||
					item['pref_label']['fi'] ||
					item['pref_label']['und'] ||
					'(no label)' : item['identifier']"
				is-required
			/>

			<RefList
				v-if="type === 'files'"
				es-doctype="file_type"
				placeholder="file type"
				type="multiselect"
				help="help text"
				ui-label="File Type"
				:value="single.file_type"
				:set-value="v => {
					$set(single, 'file_type', {
						in_scheme: v.in_scheme,
						identifier: v.identifier,
						pref_label: v.pref_label,
					})
				}"
				:custom-label="(item) => item['pref_label'] ?
					item['pref_label']['en'] ||
					item['pref_label']['fi'] ||
					item['pref_label']['und'] ||
					'(no label)' : item['identifier']"
			/>
		</b-collapse>
	</b-card>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import RefList from '@/widgets/refdata/list-ui'

import {
	faTrash,
	faPen,
	faPencilAlt,
	faTag,
} from "@fortawesome/free-solid-svg-icons"

export default {
	name: "SingleObject",
	components: {
		FontAwesomeIcon,
		RefList,
	},
	props: [
		"icon",
		"secondary",
		"single",
		"removeItem",
		"type",
		"readonly",
		"deleted",
	],
	data() {
		return {
			icons: {
				faPen,
				faTrash,
				faPencilAlt,
				faTag,
			},
		}
	},
}
</script>

<style>
.form-group {
	margin-bottom: 0;
}
.qvain-input {
	border-top: 0px;
	border-left: 0px;
	border-right: 0px;
	border-radius: 0px;
}

fieldset.item-field div.form-row legend:after {
	content: '*';
	color: red;
}

.deleted {
	margin-left: 0.5rem;
}
</style>
