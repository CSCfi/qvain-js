<!-- ADD_LICENSE_HEADER -->
<template>
	<record-field v-if="isVisible" :required="isRequired" :wrapped="wrapped">
		<title-component slot="title" :title="uiLabel" />
		<small slot="help" class="text-muted">
			{{ uiDescription }}
		</small>

		<div slot="input" class="container">
			<div class="row">
				<datepicker
					v-bind:format="schema.format"
					v-model="date">
				</datepicker>
			</div>
		</div>
	</record-field>
</template>

<script>
import Datepicker from '@/components/DateTimePicker.vue'
import SchemaBase from '@/widgets/base.vue'
import DeleteButton from '@/partials/DeleteButton.vue'
import InfoIcon from '@/partials/InfoIcon.vue'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'

export default {
	name: 'date',
	extends: SchemaBase,
	components: {
		Datepicker,
		DeleteButton,
		InfoIcon,
		RecordField,
		TitleComponent,
	},
	props: {
		wrapped: { type: Boolean, default: false },
	},
	data() {
		return {
			date: null,
		}
	},
	methods: {
		clear() {
			this.date = null
		},
	},
	computed: {

	},
	created() {
		this.date = this.value ? this.value : null
	},
	watch: {
		date() {
			console.log("date changed")
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.date })
		},
	},
}
</script>