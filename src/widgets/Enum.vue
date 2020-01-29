<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<record-field
		:required="required"
		:wrapped="false"
		:header="!inArray"
	>
		<title-component
			slot="title"
			:title="makeLabel"
		/>
		<small
			slot="help"
			class="text-muted"
		>
			{{ uiDescription }}
		</small>
		<div slot="input">
			<b-form-group>
				<span
					v-if="makeLabel !== uiLabel"
					slot="label"
				>
					{{ makeLabel }}
					<delete-button
						v-if="inArray"
						slot="label"
						:disabled="readOnly"
						@click="deleteMe"
					/>
				</span>

				<b-input-group>
					<b-form-select
						:id="inArray ? 'input-' + property.toString() : property"
						:placeholder="uiPlaceholder"
						:value="value"
						:state="isValid ? null : false"
						:options="toOptions"
						@input.native="updateValue"
					/>
				</b-input-group>
			</b-form-group>
		</div>
	</record-field>
</template>

<script>
import vSchemaBase from './base.vue'
import RecordField from '@/composites/RecordField.vue'
import DeleteButton from '@/partials/DeleteButton.vue'
import TitleComponent from '@/partials/Title.vue'

export default {
	name: 'SchemaEnum',
	components: {
		RecordField,
		DeleteButton,
		TitleComponent,
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus()
			},
		},
	},
	extends: vSchemaBase,
	description: 'basic enum widget',
	schematype: 'string',
	data: function() {
		return {
			feedback: '',
			options: [
				"one",
				"two",
				null,
				"four",
				undefined,
				{
					"type": "blahtype",
					"value": "blahvalue",
				},
				13,
				"last option",
			].map(x => { return { value: x, text: typeof x === "object" && x !== null ? JSON.stringify(x) : String(x) } }),
		}
	},
	computed: {
		makeLabel: function() {
			return typeof this.property === 'number' ? '#' + (this.property + 1) : this.uiTitle
		},
		toOptions() {
			return this.schema && this.schema.enum ?
				this.schema.enum.map(x => { return { value: x, text: typeof x === "object" && x !== null ? JSON.stringify(x) : String(x) } }) : []
		},
	},
	created() {
		this.setDefault()
	},
	methods: {
		updateValue: function(e) {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: e.target.value,
			})
		},
		setDefault: function() {
			if (!this.schema) return
			if (this.value !== undefined) return

			if (this.schema.default) {
				this.$store.commit('updateValue', {
					p: this.parent,
					prop: this.property,
					val: this.schema.default,
				})
				return
			}
			if (this.schema.enum.length === 1) {
				this.$store.commit('updateValue', {
					p: this.parent,
					prop: this.property,
					val: this.schema.enum[0],
				})
				return
			}
		},
	},
}
</script>
