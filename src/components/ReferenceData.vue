<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Kauhia <Kauhia@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<record-field
		v-if="isVisible"
		:id="property + '_referenceData'"
		:required="isRequired"
		:wrapped="wrapped"
		:header="header"
	>
		<title-component slot="title" :title="uiLabel" />
		<small slot="help" class="text-muted">
			{{ uiDescription }}
		</small>

		<div slot="input">
			<div class="input-row__inline">
				<Multiselect v-if="showLang"
					:id="property + '_language-select'"
					v-model="selectedLang"
					:options="languages"
					placeholder="Select language"
					label="language"
					class="lang-select"/>

				<Multiselect v-if="optionsShouldBeGrouped"
					:id="property + '_value-select'"
					class="value-select"
					v-model="selectedOptions"
					track-by="identifier"
					:internalSearch="!async && !disableInternalSearch"
					:loading="isLoading"
					:optionsLimit="count"
					:taggable="tags"
					:searchable="typeahead"
					:multiple="isMultiselect"
					:options="options"
					:showNoResults="false"
					:showNoOptions="false"
					:customLabel="customLabel"
					:placeholder="getPlaceholder"
					group-values="children"
					:group-label="labelNameInSchema"
					:disabled="disabled"
					:allowEmpty="allowEmpty"
					:deselectLabel="allowEmpty ? 'Press enter to remove' : 'Selected'"
					@search-change="search"
				>
					<div slot="noResult">No elements found. Consider changing the search query. You may have to type at least 3 letters.</div>
					<div
						v-if="grouped"
						slot="option"
						slot-scope="{ option }"
						:class="{ option__child: !option.$groupLabel, option__parent: option.$groupLabel }"
					>
						{{ option.$groupLabel || customLabel(option) }}
					</div>
					<div slot="noOptions"></div>
					<div v-if="selectedOptions.length > 0" slot="selection">{{placeholder}}</div>
				</Multiselect>

				<Multiselect v-else
					:id="property + '_value-select'"
					class="value-select"
					v-model="selectedOptions"
					track-by="identifier"
					:internalSearch="!async && !disableInternalSearch"
					:loading="isLoading"
					:optionsLimit="count"
					:taggable="tags"
					:searchable="typeahead"
					:showNoOptions="false"
					:multiple="isMultiselect"
					:clearOnSelect="false"
					:options="options"
					:showNoResults="false"
					:customLabel="customLabel"
					:placeholder="getPlaceholder"
					@select="atSelect"
					:disabled="disabled"
					:allowEmpty="allowEmpty"
					:deselectLabel="allowEmpty ? 'Press enter to remove' : 'Selected'"
					@search-change="search">
					<div slot="noOptions"></div>
					<div slot="noResult">No elements found. Consider changing the search query. You may have to type at least 3 letters.</div>
					<div slot="selection" slot-scope="{ values, search, isOpen }">
						<span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ getPlaceholder }}</span>
					</div>
				</Multiselect>
			</div>
			<div :id="property + '_taglist'" v-if="isMultiselect" class="tag__list">
				<p v-for="(option, index) in Array.from(selectedOptions)" :key="option.identifier" class="tag">
					{{ customLabel(option) }}
					<span class="remove-button">
						<DeleteButton @click="removeValue(index)" />
					</span>
				</p>
			</div>
		</div>
	</record-field>
</template>

<script>
import vSchemaBase from '@/widgets/base.vue'
import { esApiSearchClient } from '@/widgets/refdata/es.js'
import DeleteButton from '@/partials/DeleteButton.vue'
import Multiselect from 'vue-multiselect'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'

export default {
	name: 'reference-data',
	components: {
		Multiselect,
		DeleteButton,
		RecordField,
		TitleComponent,
	},
	extends: vSchemaBase,
	props: {
		esIndex: { type: String, required: true },
		esDoctype: { type: String, required: true },
		esQueryExtra: { type: String, default: "" },
		async: { type: Boolean, required: true },
		count: { type: Number, default: 10000 },
		typeahead: { type: Boolean, default: false },
		tags: { type: Boolean, default: false },
		showLang: { type: Boolean, default: false },
		wrapped: { type: Boolean, default: false },
		labelNameInSchema: { type: String, default: 'pref_label' },
		grouped: { type: Boolean, required: false },
		placeholder: { type: String, required: false, default: null },
		actions: { type: Array, default: ()=>[] },
		disableInternalSearch: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		header: { type: Boolean, default: true },
		preservedFields: { type: Array, default: () => [] },
		allowEmpty: { type: Boolean, default: true },
	},
	data() {
		return {
			responseData: {},
			selectedOptions: [],
			languages: [
				{ id: 'fi', language: 'Finnish' },
				{ id: 'en', language: 'English' },
				{ id: 'sv', language: 'Swedish' },
			],
			selectedLang: null,
			isLoading: false,
			isInitializing: true,
			lastSearch: "",
		}
	},
	computed: {
		getPlaceholder() {
			return this.placeholder || (this.async ?
				'Type to search for available options' :
				'Select option')
		},
		currentLanguage() {
			const selectedLanguage = this.selectedLang ? this.selectedLang.id : null
			return selectedLanguage || this.$store.state.languagePriority[0]
		},
		isMultiselect() {
			return this.schema.type === 'array'
		},
		responseHasResults() {
			return this.responseData.hits && this.responseData.hits.hits
		},
		optionItems() {
			let items = this.responseHasResults ? this.responseData.hits.hits : []
			items = items
				.filter(this.acceptableOption)
				.map(es => es._source)
				.map(this.mapToInternalKeys)

			items.unshift(...this.actions)
			return items
		},
		parentItems() {
			return this.optionItems.filter(item => item.hasChildren)
		},
		childrenItems() {
			return this.optionItems.filter(item => !item.hasChildren)
		},
		optionsShouldBeGrouped() {
			return this.grouped && this.parentItems.length > 0
		},
		options() {
			// case with children
			if (this.responseHasResults && this.optionsShouldBeGrouped) {
				return this.parentItems.map(parent => {
					const children = this.childrenItems.filter(child => parent.children.includes(child.id))
					return { ...parent, children }
				})
			}

			// normal case
			return this.optionItems
		},
		isEmptyObject() {
			return this.value &&
				typeof this.value === 'object' && Object.keys(this.value).length === 0
		},
		isArray() {
			return this.value && this.value.length > 0
		},
	},
	methods: {
		customLabel(option) {
			if (option === null) {
				return option
			}

			if (!option.label) {
				return null
			}
			const label = option.label[this.currentLanguage]
			if (!label) {
				return this.$store.getters.getStringFromMultiLanguage(option.label)
			}
			return label || option.label['und'] || null
		},
		acceptableOption(es) {
			if (this.disableInternalSearch) {
				let found = false
				const searchLower = this.lastSearch.toLowerCase()
				for (const lang in es._source.label) {
					if (es._source.label[lang].toLowerCase().includes(searchLower)) {
						found = true
						break
					}
				}
				if (!found) {
					return false
				}
			}
			const FILTER_FIELD = 'internal_code'
			const hasURI = (es._source && es._source.uri)
			return hasURI || es._source[FILTER_FIELD]
		},
		mapToInternalKeys(es) {
			return {
				id: es.id,
				identifier: es.uri,
				[this.labelNameInSchema]: es.label[this.currentLanguage],
				label: es.label,
				children: es.child_ids,
				hasChildren: es.has_children,
			}
		},
		async getAllReferenceData() {
			this.isLoading = true
			const res = await esApiSearchClient(this.esIndex, this.esDoctype, "*" + this.esQueryExtra, this.count)
			this.responseData = res.data
			this.isLoading = false
		},
		async searchReferenceData(searchQuery) {
			this.isLoading = true
			const res = await esApiSearchClient(this.esIndex, this.esDoctype, searchQuery + this.esQueryExtra, this.count)
			this.responseData = res.data
			this.isLoading = false
		},
		async search(searchQuery) {
			this.lastSearch = searchQuery
			this.isLoading = true
			if (!searchQuery) {
				if (this.async) {
					this.responseData = {}
				}
				this.isLoading = false
				return // prevent empty search after removing characters from input
			}

			if (this.async) {
				// remove special characters, see for list: http://lucene.apache.org/core/3_4_0/queryparsersyntax.html
				searchQuery = searchQuery.replace(/(\+|-|&&|\|\||!|\(|\)|{|}|\[|\]|\^|"|~|\*|\?|:|\\)/g,"")
				const q = this.selectedLang ?
					`label.${this.selectedLang.id}:${searchQuery}*`:
					`${searchQuery}*`
				this.searchReferenceData(q)
			}
			this.isLoading = false
		},
		removeValue(index) {
			if (index === -1) {
				this.selectedOptions = null
			} else {
				this.selectedOptions.splice(index, 1)
			}
		},
		atSelect(item) {
			if (this.actions.includes(item)) {
				this.$emit('action', { action: item.action, lastSearch: this.lastSearch })
			}
			if (this.async) {
				this.responseData = {}
			}
		},
	},
	created: function() {
		if (this.isMultiselect && this.isArray) {
			this.selectedOptions = this.value.map(v => ({
				identifier: v.identifier, label: v[this.labelNameInSchema]
			}))
		}

		if (!this.isMultiselect && !this.isEmptyObject) {
			if (!(this.value && this.value.identifier)) {
				this.selectedOptions = null
			} else {
				const { identifier } = this.value
				const label = this.value[this.labelNameInSchema]
				this.selectedOptions = { identifier, label }
			}
		}

		if (!this.async) {
			this.getAllReferenceData()
		}
	},
	beforeUpdate: function() {
		this.isInitializing = true
	},
	updated: function() {
		this.isInitializing = false
	},
	watch: {
		selectedOptions() {
			// prevent actions from being stored as selected options
			if (this.isMultiselect && this.selectedOptions) {
				const filteredOptions = this.selectedOptions.filter(option => !this.actions.includes(option))
				if (filteredOptions.length !== this.selectedOptions.length) {
					this.selectedOptions = filteredOptions
				}
			}
			if (!this.isMultiselect && this.actions.includes(this.selectedOptions)) {
				this.selectedOptions = null
			}

			const selectedValueIsSet = this.selectedOptions !== null && typeof this.selectedOptions !== 'undefined'
			const mapToStore = option => {
				if (typeof option === 'undefined') {
					return option
				}

				const { identifier, label: { sv, en, fi, und } } = option
				return { identifier, [this.labelNameInSchema]: { sv, en, fi, und } }
			}

			let storableOptions = '' // this default allows item to be removed at updateValue
			if (this.isMultiselect && selectedValueIsSet) {
				storableOptions = this.selectedOptions.map(mapToStore)
			}

			if (!this.isMultiselect && selectedValueIsSet) {
				storableOptions = mapToStore(this.selectedOptions)
			}

			if (!this.isInitializing) {
				if (!this.isMultiselect && this.storableOptions !== '') {
					// keep existing preservedFields on update
					this.preservedFields.forEach(field => {
						storableOptions[field] = this.parent[this.property][field]
					})
				}
				this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: storableOptions })
				this.$emit("changed")
			}
		},
	},
}
</script>
<style lang="scss" scoped>
.input-row__inline {
	width: 100%;
	display: inline-flex;
	flex-wrap: wrap;

	.lang-select {
		width: 140px;
		padding-right: 5px;
		flex-grow: 1;
	}
	.value-select {
		flex-grow: 10;
		width: 200px;
	}
}

.tag {
	color: $fd-primary-white;
	background: $fd-primary;
	border-radius: 5px;

	padding: 4px 4px 4px 10px;
	margin: 2px;
	flex-grow: 1;

	display: flex;
	justify-content: space-between;
	align-items: center;
}

.tag__list {
	margin: -2px;
	margin-top: 2px;
	display: inline-flex;
	flex-wrap: wrap;

	/* avoid stretching tags in last row */
	&::after {
		content: '';
		flex-grow: 10000;
	}
}

.remove-button {
	margin-left: 4px;
}

.option__child {
	padding-left: 20px;
}
.option__parent {
	font-weight: bold;
    color: black !important;
}
</style>

<style lang="scss">
.multiselect__option--highlight,
.multiselect__option--highlight:after,
.multiselect__tag {
	background: $fd-primary;
}

.multiselect__spinner:before,
.multiselect__spinner:after {
	border-color: $fd-primary transparent transparent;
}

.multiselect__tag-icon:after {
	color: $fd-primary-black;
}

.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
	background: $fd-primary-dark;
}

.multiselect__option--selected.multiselect__option--highlight {
	background: $danger;
}

.multiselect__option--selected.multiselect__option--highlight:after {
	background: $danger;
}

.multiselect__single,
.multiselect__placeholder,
.multiselect__input {
	text-overflow: ellipsis;
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
}
</style>
