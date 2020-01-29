<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Kauhia <Kauhia@users.noreply.github.com>
	Aaron Hakala <aaron.hakala@metropolia.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<div
		:id="property + '_tab-selector'"
		class="q-tab-selector"
	>
		<keep-alive>
			<component
				:is="widget"
				v-if="activeTab === myTab"
				:id="'tab_' + property + '_' + dataType"
				v-bind="widgetProps"
				:required="required"
				:schema="schema"
				:path="path"
				:value="parent[property]"
				:valtype="dataType"
				:parent="parent"
				:property="property"
				:has-type-error="hasTypeError"
				:tab="myTab"
				:active-tab="activeTab"
				:depth="newdepth"
				:read-only="readOnly"
				v-on="$listeners"
			>
				<p>{{ dataType }}</p>
			</component>
			<skip
				v-else
				:required="(schema.required || []).includes(property)"
				:schema="schema"
				:path="path"
				:value="parent[property]"
				:valtype="dataType"
				:parent="parent"
				:property="property"
				:has-type-error="hasTypeError"
				:tab="myTab"
				:active-tab="activeTab"
				:depth="depth"
				:read-only="readOnly"
				v-on="$listeners"
			/>
		</keep-alive>
	</div>
</template>

<style lang="scss">
.q-tab-selector section > .list-group > .list-group-item {
	padding: 0 !important;
	margin-bottom: 1em;
}
</style>

<script>
import SchemaNumber from './Number.vue'
import SchemaString from './String.vue'
import SchemaObject from './Object.vue'
import SchemaArray from './Array.vue'
import SchemaInlineArray from './InlineArray.vue'
import SchemaAnyOf from './anyOf.vue'
import SchemaAllOf from './allOf.vue'
import SchemaOneOf from './oneOf.vue'
import SchemaEnum from './Enum.vue'
import SchemaChoice from './Choice.vue'
import i18nString from '@/components/i18nStrings.vue'
import i18nTextarea from '@/components/i18nTextarea.vue'
import AutoComplete from './refdata/autocomplete.vue'
import FilePicker from '../filebrowser/FilePicker.vue'
import Skip from './skip.js'
import Organization from '../components/Organization.vue'
import FlatObject from './FlatObject.vue'
import ReferenceData from '../components/ReferenceData.vue'
import DateRange from '../components/DateRange.vue'
import Date from '../components/Date.vue'

const COMBINERS = [ 'anyOf', 'allOf', 'oneOf', 'not' ]

export default {
	name: 'TabSelector',
	description: "internal dispatch wrapper",
	widgettype: 'any',
	components: {
		'schema-number': SchemaNumber,
		'schema-string': SchemaString,
		'schema-object': SchemaObject,
		'schema-array': SchemaArray,
		'schema-inline-array': SchemaInlineArray,
		'schema-anyof': SchemaAnyOf,
		'schema-allof': SchemaAllOf,
		'schema-oneof': SchemaOneOf,
		'schema-enum': SchemaEnum,
		'schema-choice': SchemaChoice,
		'reference-data': ReferenceData,
		'i18n-string': i18nString,
		'i18n-textarea': i18nTextarea,
		'autocomplete': AutoComplete,
		'filepicker': FilePicker,
		'skip': Skip,
		Organization,
		FlatObject,
		'date-range': DateRange,
		'date': Date,
	},
	props: [ 'schema', 'value', 'path', 'parent', 'property', 'tab', 'activeTab', 'depth', 'required', 'defaultValue', 'readOnly' ],
	data: function() {
		return {
			dataType: null,
			hasTypeError: false,
			verbose: false,
			showWidgets: false,
			customWidget: null,
			cachedPath: null,
		}
	},
	computed: {
		showTypeSelector: function() {
			return typeof this.schema['type'] !== 'string'
		},
		possibleTypes: function() {
			if (this.schema['type'] === 'object') {
				return this.schema['type']
			}
			return [ "string", "number", "integer", "object", "array", "boolean", "null" ]
		},
		widget: function() {
			return this.selectedWidget || this.uiForSchema.widget || this.uiForDef.widget || this.defaultWidget(this.dataType)
		},
		widgetProps: function() {
			return this.uiForSchema.props || this.uiForDef.props || undefined
		},
		ui: function() {
			// if there was a $ref, use that ref's ui as default and load this path's on top of it
			if (this.schema['$deref']) {
				return Object.assign({}, this.$store.state.hints[this.schema['$deref']], this.$store.getters.uiForPath(this.path))
			}
			return this.$store.getters.uiForPath(this.path)
		},
		uiForSchema: function() {
			//return this.$store.state.hints[this.path] || this.uiDefHint || {}
			return this.$store.getters.uiForPath(this.path)
		},
		uiForDef: function() {
			return ('$deref' in this.schema && this.$store.state.hints[this.schema['$deref']]) || {}
		},
		uiTab() {
			return (this.$store.state.hints[this.path] && this.$store.state.hints[this.path]['tab']) || this.uiForSchema['tab']
		},
		myTab: function() {
			return typeof this.uiTab === 'string' ? this.uiTab : this.tab
		},
		newdepth: function() {
			return 'tab' in this.uiForSchema ? 1 : this.depth + 1
		},
	},
	watch: {
		schema: function() {
			if (this.path !== this.cachedPath) {
				console.warn("selector (" + this.path + "): VNode was recycled!")
			}
			if (this.value === undefined) {
				this.setDataType(this.schema['type'])
				this.vivicate()
			}
		},
	},
	created() {
		// fail-safe for inadvertent VNode recycling
		this.cachedPath = this.path
		this.setDataType(this.schema['type'])

		// This should try to catch invalid data in case the schema (outside of the application) has changed
		// and we have stale, deprecated or otherwise invalid data left.
		// TODO: think how to handle this: simply delete invalid value, or set a flag to warn user
		if (this.value !== undefined && this.dataType === 'array' && typeof this.value !== 'object') {
			console.error("[selector/created] array expected for path", this.path, "got:", typeof this.value)
			this.hasTypeError = true
			this.vivicate(true)
		}
		if (this.value !== undefined && this.dataType === 'object' && typeof this.value !== 'object') {
			console.error("[selector/created] object expected for path", this.path, "got:", typeof this.value)
			this.hasTypeError = true
			this.vivicate(true)
		}
		if (this.value === undefined) {
			this.vivicate()
		}
	},
	methods: {
		setDataType: function(schemaType) {
			if (typeof schemaType === 'object' && schemaType instanceof Array) {
				this.dataType = schemaType[0]
			} else {
				this.dataType = schemaType
			}
		},
		emptyValue: function() {
			switch (this.dataType) {
			case 'object':
				return {}
			case 'array':
				return []
			case 'null':
				return null
			}
			return undefined
		},
		handleCombiners: function() {
			for (let i in COMBINERS) {
				if (!(COMBINERS[i] in this.schema)) continue

				let combiner = COMBINERS[i]

				if (typeof this.schema[combiner] === 'object' && this.schema[combiner] instanceof Array) {
					return 'schema-' + combiner.toLowerCase()
				}

				return undefined
			}
			return undefined
		},
		defaultWidget: function(schemaType) {
			// enum is special because it should handle any type included in its values
			if (this.schema.enum) {
				return 'schema-enum'
			}

			if (this.schema.oneOf) {
				return "schema-oneof"
			}

			switch(schemaType) {
			case 'string':
				return 'schema-string'
			case 'number':
				return 'schema-number'
			case 'integer':
				return 'schema-number'
			case 'object':
				return 'schema-object'
			case 'array': {
				// check if the array has values (strings, numbers, null) or nested objects (array, object)
				// TODO: this only checks "list" validation, not "tuple" validation
				let typeOfItems = this.schema.items && this.schema.items.type && this.schema.items.type || ""
				return 'schema-array'
			}
			case 'boolean':
				return ""
			case 'null':
				return ""
			case undefined:
				return this.handleCombiners() || ""
			default:
				return ""
			}
		},
		vivicate: function(force) {
			if (this.value !== undefined && !force) {
				return
			}

			// create new object based on defaultValue, no need for deep copy.
			const getDefaultValue = () => {
				const defaultValue = this.uiForSchema.props && this.uiForSchema.props.defaultValue
				if (!defaultValue) {
					return
				} else if (Array.isArray(defaultValue)) {
					return [...defaultValue]
				} else if (typeof defaultValue === 'object') {
					return Object.assign({}, defaultValue)
				} else {
					return defaultValue
				}
			}

			const val = getDefaultValue() || this.emptyValue()

			if (val === undefined && this.property in this.parent) {
				return // property already exists, avoid redundant commit
			}
			this.$store.commit('initValue', { p: this.parent, prop: this.property, val })
		},
	},
}
</script>
