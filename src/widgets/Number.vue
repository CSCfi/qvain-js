<!-- ADD_LICENSE_HEADER -->
<template>
	<record-field :required="required">
		<title-component
			slot="title"
			:title="makeLabel"
		/>
		<small
			slot="help"
			class="text-muted"
		>
			{{ uiDescription }}
			{{ makeLabel }}
		</small>

		<div slot="input">
			<b-form-group
				:label-cols="inArray ? 3 : ((makeLabel !== uiLabel) ? 3 : 0)"
				:label-for="inArray ? 'input-' + property.toString() : property"
			>
				<b-input-group>
					<b-form-input
						:id="inArray ? 'input-' + property.toString() : property"
						type="number"
						:placeholder="uiPlaceholder"
						:value="parent[property]"
						:step="schema['multipleOf']"
						:state="isValid ? null : false"
						@input.native="updateValue"
					/>
				</b-input-group>
			</b-form-group>
		</div>
	</record-field>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMinus } from '@fortawesome/free-solid-svg-icons'
import vSchemaBase from './base.vue'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'

function toNumber(val) {
	const n = parseFloat(val, 10)
	return n || n === 0 ? n : val
}

export default {
	name: 'SchemaNumber',
	components: {
		FontAwesomeIcon,
		RecordField,
		TitleComponent,
	},
	extends: vSchemaBase,
	description: 'generic number',
	schematype: 'number',
	data: function() {
		return {
			label: '',
			feedback: '',
			state: null,
			icon: {
				faMinus,
			},
		}
	},
	computed: {
		makeLabel: function() {
			return typeof this.property === 'number'
				? '#' + (this.property + 1)
				: this.uiTitle
		},
		uiLabel: function() {
			return typeof this.property === 'number'
				? '#' + (this.property + 1)
				: this.uiTitle
		},
	},
	methods: {
		deleteMe: function(event) {
			this.$parent.$emit('delete', this.property)
		},
		updateValue: function(e) {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: e.target.value !== '' ? toNumber(e.target.value) : undefined,
			})
		},
	},
}
</script>
