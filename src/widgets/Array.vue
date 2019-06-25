<!-- ADD_LICENSE_HEADER -->
<template>
	<record-field class="min-height" :required="required" :wrapped="wrapped" :header="!inArray" :error="!isValid">
		<title-component slot="title" :title="uiLabel" />
		<div slot="header-right" class="header__right">
			<p :key="error" v-for="error in errors" class="error-message">{{ error }}</p>
			<ValidationStatus v-if="!isValid" :status="'invalid'" />
			<InfoIcon :description="uiDescription"/>
		</div>
		<div slot="input">
			<!--
				There is not easy way to force v-for to not use inplace update strategy. In this case it is mandatory to make deleting item show correctly.
				This could be code smell but at the moment the best solution is just to patch this. See https://github.com/xianshenglu/blog/issues/47 for reference.
			-->
			<b-tabs v-if="forceArrayUpdateHack && tabFormat" :value="tabIndex" class="tab-array-margin" pills>
				<b-tab
					v-for="(child, index) in value"
					style="{margin-top: 5px}"
					:key="index"
					title-link-class="tab-field-link">
					<template slot="title">
						{{ tabTitle(index) }}
						<delete-button @click="deleteElement(index)" />
					</template>

					<TabSelector
						:schema="schemaForChild(index)"
						:path="newPath(index)"
						:value="value[index]"
						:parent="parent[property]"
						:property="index"
						:tab="myTab"
						:activeTab="activeTab"
						:depth="depth"
						@delete="deleteElement"
						:key="'array-' + index" />
				</b-tab>

				<div slot="tabs" class="input__controls">
					<b-btn class="input__control" type="button" variant="primary" :disabled="value.length >= this.maximum" @click="doPlus()"><font-awesome-icon icon="plus" fixed-width /></b-btn>
				</div>

			</b-tabs>

			<b-list-group class="item-list" v-else-if="forceArrayUpdateHack && !tabFormat" flush>

				<b-list-group-item class="list-item" v-for="(child, index) in value" :key="index">
					<TabSelector
						:schema="schemaForChild(index)"
						:path="newPath(index)"
						:value="value[index]"
						:parent="parent[property]"
						:property="index"
						:tab="myTab"
						:activeTab="activeTab"
						:depth="depth"
						@delete="deleteElement"
						:key="'array-' + index" />
				</b-list-group-item>
				<div class="input__controls">
					<b-btn class="input__control" type="button" variant="primary" :disabled="value.length >= this.maximum" @click="doPlus()"><font-awesome-icon icon="plus" fixed-width /></b-btn>
				</div>
			</b-list-group>
		</div>
	</record-field>
</template>
<style lang="scss" scoped>
.error-message {
	display: inline-block;
}

.input__controls {
	margin-left: auto;
	margin-top: 10px;

	.input__control {
		height: 40px;
	}
}

.list-item {
	margin-top: 10px;
	margin-bottom: 0px;
	border-bottom: 0;
	border-top: 0;
	padding: 0;
}
.min-height {
	min-height: 108px;
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
import InfoIcon from '@/partials/InfoIcon.vue'
import ValidationStatus from '@/partials/ValidationStatus.vue'
import DeleteButton from '@/partials/DeleteButton.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-array',
	description: "generic array, nested",
	schematype: 'array',
	components: {
		RecordField,
		TitleComponent,
		InfoIcon,
		ValidationStatus,
		DeleteButton,
	},
	props: {
		tabFormat: { type: Boolean, default: true },
		wrapped: { type: Boolean, default: true },
	},
	data() {
		return {
			error: null,
			minimum: 0,
			maximum: 0,
			tabIndex: 0,
			forceArrayUpdateHack: true,
		}
	},
	methods: {
		tabTitle(index) {
			const objectAtIndexExists = typeof this.parent[this.property][index] !== 'undefined'
			if (!objectAtIndexExists) {
				return `#${index +1}`
			}

			const tabObject = this.parent[this.property][index]
			const tabObjectType = tabObject['@type']

			if (tabObjectType === 'Person' && tabObject.name) {
				return tabObject.name
			}

			if (tabObjectType === 'Person') {
				return `#${index +1} (Person)`
			}

			if (tabObjectType === 'Organization' && (tabObject.name['fi'] || tabObject.name['en'])) {
				return tabObject.name['fi'] || tabObject.name['en']
			}

			if (tabObjectType === 'Organization') {
				return `#${index +1} (Organization)`
			}

			return `#${index +1}`
		},
		doMinus() {
			// it's safe to pop() a zero-length array
			if (this.value.length > this.minimum) {
				this.$store.commit('popValue', { p: this.parent, prop: this.property, val: this.value })
				return true
			}
			return false
		},
		doPlus() {
			if (this.maximum === undefined || this.value.length < this.maximum) {
				this.$store.commit('pushValue', { p: this.parent, prop: this.property, val: undefined })
				this.$nextTick(function() { // make sure that the tab is there before causing the new tab to be selected
					this.tabIndex = this.value.length - 1
				})
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
				this.forceArrayUpdateHack = !this.forceArrayUpdateHack
				this.$nextTick(() => {
					this.forceArrayUpdateHack = !this.forceArrayUpdateHack
				})
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
}
</script>
