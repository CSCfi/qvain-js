<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Aaron Hakala <aaron.hakala@metropolia.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<wrapper :wrapped="wrapped">
		<b-form-group
			class="qwidget"
			:label-cols="2"
			:description="uiDescription"
			:label="uiLabel"
			:state="isValid"
		>
			<b-list-group flush>
				<b-list-group-item
					v-for="(child, index) in value"
					:key="index"
					@remove="remove(index)"
				>
					<TabSelector
						:schema="schemaForChild(index)"
						:path="newPath(index)"
						:value="value[index]"
						:parent="parent[property]"
						:property="index"
						:tab="myTab"
						:active-tab="activeTab"
						:depth="depth"
						@delete="deleteElement"
					/>
				</b-list-group-item>
				<empty-note v-if="value.length < 1">
					no items
				</empty-note>
			</b-list-group>
			<b-alert
				dismissible
				variant="warning"
				:show="dismissCountDown"
				@dismissed="resetWarning()"
			>
				<p>{{ warning }}</p>
			</b-alert>
			<div class="d-flex align-items-stretch float-right">
				<!-- buttons -->
				<b-btn
					type="button"
					variant="secondary"
					class="mr-2"
				>
					<font-awesome-icon
						icon="list"
						fixed-width
						class="mr-2"
					/> <span>{{ minimum || "–" }} / {{ value.length }} / {{ maximum || "–" }}</span>
				</b-btn>
				<b-btn
					type="button"
					variant="light"
					:disabled="value.length >= maximum"
					@click="doPlus()"
				>
					<font-awesome-icon
						icon="plus"
						fixed-width
					/>
				</b-btn>
			</div>
		</b-form-group>
	</wrapper>
</template>

<script>
import Wrapper from '../components/Wrapper.vue'
import vSchemaBase from './base.vue'

export default {
	name: 'InlineArray',
	components: {
		Wrapper,
	},
	extends: vSchemaBase,
	description: 'generic array, inline',
	schematype: 'array',
	props: {
		wrapped: { type: Boolean, default: false },
	},
	data: function() {
		return {
			minimum: 0,
			maximum: 0,
			warning: null,
			dismissSecs: 5,
			dismissCountDown: 0,
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
	watch: {
		schema: function() {
			return this.init()
		},
	},
	created() {
		if (this.value == undefined) {
			console.warn("array: undefined value for path", this.path)
		}
		//console.log("inline-array: typeof", this.path, typeof this.value, 'items' in this.schema)
		return this.init()
	},
	methods: {
		doMinus: function() {
			// it's safe to pop() a zero-length array
			if (this.value.length > this.minimum) {
				this.$store.commit('popValue', { p: this.parent, prop: this.property, val: this.value })
				return true
			}
			return false
		},
		doPlus: function() {
			if (this.maximum === undefined || this.value.length < this.maximum) {
				this.$store.commit('pushValue', {
					p: this.parent,
					prop: this.property,
					val: undefined,
				})
				//console.log('didPlus, length now:', this.value.length)
				return true
			} else {
				this.showWarning("You've added the maximum allowed amount.")
			}
			return false
		},
		deleteElement: function(index) {
			//console.log('schema-array: request to delete element with index', index, 'value:', this.value[index])
			if (index >= 0 && index < this.value.length) {
				this.value.splice(index, 1)
			} else {
				console.warn('deleteElement: attempt to remove non-existing element at index', index)
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
		showWarning(msg) {
			this.warning = msg
			this.dismissCountDown = this.dismissSecs
		},
		resetWarning() {
			this.dismissCountDown = 0
			this.warning = null
		},
		add() {},
	},
}
</script>
