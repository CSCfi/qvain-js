<!-- ADD_LICENSE_HEADER -->
<template>
	<record-field v-if="isVisible" :required="isRequired" :wrapped="wrapped">
		<title-component slot="title" :title="uiLabel" />
		<small slot="help" class="text-muted">
			{{ uiDescription }}
		</small>

		<b-row slot="input">
			<b-col>
				<datepicker
					v-model="date"
					:format="schema.format"
					:disabled="readOnly"
				/>
			</b-col>
		</b-row>
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
			initializing: true
		}
	},
	methods: {
		clear() {
			this.date = null
		},
	},
	async created() {
		this.initializing = true
		this.date = this.value ? this.value : null
		await this.$nextTick()
		this.initializing = false
	},
	watch: {
		date() {
			if(this.initializing) return;
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.date })
		},
	},
}
</script>
