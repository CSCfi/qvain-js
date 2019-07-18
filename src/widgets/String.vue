<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<record-field :required="required" :wrapped="false" :header="!inArray">
		<title-component slot="title" :title="uiLabel" />
		<small slot="help" class="text-muted">
			{{ uiDescription }}
			<div v-if="uiExample">
				<b-badge variant="info">Example</b-badge>
				<span v-for="(example, index) in uiExample" :key="index">
					{{ example }}
				</span>
			</div>
		</small>

		<div slot="input">
			<b-form-group
				:label-cols="inArray ? 3 : ((makeLabel !== uiLabel) ? 3 : 0)"
				:label-for="inArray ? 'input-' + property.toString() : property">
				<span slot="label" v-if="makeLabel !== uiLabel">
					{{ makeLabel }}
					<delete-button v-if="inArray" slot="label" @click="deleteMe"/>
				</span>

				<b-input-group>
					<b-form-input
						:id="inArray ? 'input-' + property.toString() : property"
						:type="inputType"
						:placeholder="uiPlaceholder"
						:value="value"
						:state="isValid ? null : false"
						@input.native="updateValue">
					</b-form-input>
				</b-input-group>
			</b-form-group>
		</div>
	</record-field>
</template>

<style lang="scss" scoped>
.remove-button {
	margin: 0 10px 0 2px;
	display: flex;
}
</style>


<script>
import vSchemaBase from './base.vue'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'
import DeleteButton from '@/partials/DeleteButton.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-string',
	description: 'generic string',
	schematype: 'string',
	components: {
		RecordField,
		TitleComponent,
		DeleteButton,
	},
	data() {
		return {
			label: '',
			feedback: '',
			state: null,
			editing: null,
			hover: null,
		}
	},
	methods: {
		deleteMe(event) {
			this.$parent.$emit('delete', this.property)
		},
		deleteIfEmpty() {
			if (this.value === undefined || this.value.length < 1) {
				this.$parent.$emit('delete', this.property)
			} else {
				this.editing = false
			}
		},
		updateValue(e) {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: e.target.value,
			})
		},
	},
	computed: {
		makeLabel: function() {
			return typeof this.property === 'number' ? '#' + (this.property + 1) : this.uiTitle
		},
		inputType: function() {
			if (!('format' in this.schema)) return 'text'
			switch (this.schema['format']) {
			case 'uri':
				return 'url'
			case 'time':
				return 'time'
			case 'date':
				return 'date'
			case 'date-time':
				return 'date'
			default:
				return 'text'
			}
		},
		ctxIcon() {
			return this.hover ? "trash" : "pen"
		},
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus()
			},
		},
	},
}
</script>
