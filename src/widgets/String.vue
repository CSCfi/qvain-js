<!-- ADD_LICENSE_HEADER -->
<template>
	<record-field :required="required" :wrapped="false" :header="!inArray">
		<title-component slot="title" :title="uiLabel" />
		<div slot="header-right" class="header__right">
			<InfoIcon :description="uiDescription"/>
		</div>

		<div slot="input">
			<b-form-group
				:label="inArray ? (property + 1).toString() : property"
				:label-cols="inArray ? 1 : 3"
				:label-for="inArray ? 'input-' + property.toString() : property"
			>
				<b-input-group>
					<b-form-input
						:id="inArray ? 'input-' + property.toString() : property"
						:type="inputType"
						:placeholder="uiPlaceholder"
						:value="value"
						:state="isValid ? null : false"
						@input.native="updateValue">
					</b-form-input>
					<span class="remove-button" slot="append">
						<delete-button v-if="inArray" @click="deleteMe" />
					</span>
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
import { dataPointer } from '../../tmp/datapointer.js'

import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'
import InfoIcon from '@/partials/InfoIcon.vue'
import DeleteButton from '@/partials/DeleteButton.vue'

export default {
	extends: vSchemaBase,
	name: 'schema-string',
	description: 'generic string',
	schematype: 'string',
	components: {
		RecordField,
		TitleComponent,
		InfoIcon,
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
		datapath() {
			return dataPointer(this.path)
		},
		dataValue() {
			return this.$store.getters.getPath(this.datapath)
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
