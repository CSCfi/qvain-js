<!-- ADD_LICENSE_HEADER -->
<template>
	<record-field
		:id="property + '_array'"
		class="min-height"
		:required="required"
		:wrapped="wrapped"
		:header="!inArray"
		:error="!isValid"
	>
		<title-component
			slot="title"
			:title="uiLabel"
		/>
		<small
			slot="help"
			class="text-muted"
		>
			{{ uiDescription }}
		</small>
		<div slot="header-right">
			<ValidationStatus
				v-if="!isValid"
				:status="'invalid'"
			/>
		</div>
		<div slot="errors">
			<b-badge
				v-for="error in errors"
				:key="error"
				variant="danger"
			>
				{{ error }}
			</b-badge>
		</div>
		<div slot="input">
			<b-container v-if="tabFormat">
				<b-btn
					:id="property + '_array_button_add'"
					class="add-button col"
					variant="light"
					type="button"
					aria-label="Add item"
					:disabled="value.length >= maximum || readOnly"
					@click="doPlus()"
				>
					<font-awesome-icon
						icon="plus"
						fixed-width
					/>
				</b-btn>
				<b-tabs
					:value="tabIndex"
					class="tab-array-margin"
					pills
					no-fade
					@input="tabShown"
					@changed="tabsChanged"
				>
					<b-tab
						v-for="(child, index) in value"
						:key="getKey(index)"
						style="{margin-top: 5px}"
						title-link-class="tab-field-link"
						@click="setTab(index)"
					>
						<template slot="title">
							{{ tabTitle(index) }}
							<delete-button
								:disabled="readOnly"
								@click="deleteElement(index)"
							/>
						</template>

						<TabSelector
							:id="property + '_array_' + index + '_tab-selector'"
							:schema="schemaForChild(index)"
							:path="newPath(index)"
							:value="value[index]"
							:parent="parent[property]"
							:property="index"
							:tab="myTab"
							:active-tab="activeTab"
							:depth="depth"
							:read-only="readOnly"
							@delete="deleteElement"
						/>
					</b-tab>
				</b-tabs>
			</b-container>

			<b-list-group
				v-else-if="!tabFormat"
				class="item-list"
				flush
			>
				<b-list-group-item
					v-for="(child, index) in value"
					:key="getKey(index)"
					class="list-item"
				>
					<TabSelector
						:id="property + '_array_' + index + '_tab-selector'"
						style="flex-grow: 1"
						:schema="schemaForChild(index)"
						:path="newPath(index)"
						:value="value[index]"
						:parent="parent[property]"
						:property="index"
						:tab="myTab"
						:active-tab="activeTab"
						:depth="depth"
						:read-only="readOnly"
						@delete="deleteElement"
					/>
					<delete-button
						v-if="showDelete"
						:disabled="readOnly"
						class="array-delete-button"
						@click="deleteElement(index)"
					/>
				</b-list-group-item>
				<b-list-group-item>
					<b-btn
						:id="property + '_array_button_add'"
						class="col"
						variant="light"
						type="button"
						aria-label="Add item"
						:disabled="value.length >= maximum || readOnly"
						@click="doPlus()"
					>
						<font-awesome-icon
							icon="plus"
							fixed-width
						/>
					</b-btn>
				</b-list-group-item>
			</b-list-group>
		</div>
	</record-field>
</template>
<style lang="scss" scoped>

.list-item {
	display: inline-flex !important;
}

.add-button {
	height: 2.5em;
	margin-bottom: 1em;
}
.min-height {
	min-height: 108px;
}

.nav-pills li:not(:first-child) {
	margin-left: 1em !important;
}

</style>

<style>

.tab-array-margin.tabs .tab-content {
	margin-top: 15px;
}

</style>


<script>
import vSchemaBase from './base.vue'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'
import ValidationStatus from '@/partials/ValidationStatus.vue'
import DeleteButton from '@/partials/DeleteButton.vue'

export default {
	name: 'SchemaArray',
	components: {
		RecordField,
		TitleComponent,
		ValidationStatus,
		DeleteButton,
	},
	extends: vSchemaBase,
	description: "generic array, nested",
	schematype: 'array',
	props: {
		tabFormat: { type: Boolean, default: true },
		wrapped: { type: Boolean, default: true },
		showDelete: { type: Boolean, default: false },
	},
	data() {
		return {
			error: null,
			minimum: 0,
			maximum: 0,
			tabIndex: 0,
			targetTabIndex: null,
			keys: [],
		}
	},
	computed: {
		isTuple: function() {
			// list or tuple validation?
			return this.schema['items'] instanceof Array
		},
		allowAdditional: function() {
			// additionalItems: true if missing, true if true, true when object; false if false
			return this.schema['additionalItems'] !== false
		},
	},
	created() {
		return this.init()
	},
	methods: {
		tabTitle(index) {
			const objectAtIndexExists = typeof this.parent[this.property][index] !== 'undefined'
			if (!objectAtIndexExists) {
				return `#${ index+1 }`
			}

			const tabObject = this.parent[this.property][index]
			return this.nestedTitle(tabObject, `#${ index+1 } `)
		},
		doPlus() {
			if (this.maximum === undefined || this.value.length < this.maximum) {
				this.$store.commit('pushValue', { p: this.parent, prop: this.property, val: undefined })
				this.setTab(this.value.length - 1)
				return true
			}
			return false
		},
		deleteElement(index) {
			if (index >= 0 && index < this.value.length) {
				this.$store.commit('deleteArrayValue', {
					parent: this.parent,
					property: this.property,
					index,
				})
				this.keys.splice(index, 1)
			}
		},
		schemaForChild: function(index) {
			if (this.isTuple) {
				let additionalSchema = typeof this.schema['additionalItems'] === 'object' ? this.schema['additionalItems'] : {}

				return index < this.schema['items'].length ? this.schema['items'][index] : additionalSchema
			} else {
				return this.schema['items']
			}
		},
		init: function() {
			this.minimum = typeof this.schema['minItems'] === 'number' && this.schema['minItems'] > 0 ? this.schema.minItems : 0
			this.maximum = typeof this.schema['maxItems'] === 'number' && this.schema['maxItems'] > 0 ? this.schema.maxItems : undefined
			if (this.isTuple && !this.allowAdditional) this.maximum = this.schema['items'].length
		},
		setTab(index) {
			this.tabIndex = index
			this.targetTabIndex = index
		},
		tabShown(index) {
			if (index === this.targetTabIndex) {
				this.targetTabIndex = null
			}
		},
		async tabsChanged() {
			if (this.targetTabIndex !== null) {
				this.tabIndex = 0 // trigger tabIndex change in b-tabs
				await this.$nextTick()
				this.tabIndex = this.targetTabIndex
			}
		},
		getKey(idx) {
			if (this.keys[idx] === undefined) {
				// assuming array order doesn't change, the last item will have the largest key
				this.keys[idx] = (this.keys[this.keys.length-1] || 0) + 1
			}
			return "arr-" + this.keys[idx]
		},
	},
}
</script>
