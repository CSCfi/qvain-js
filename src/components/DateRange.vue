<!-- ADD_LICENSE_HEADER -->
<template>
	<div class="container datepicker-container">
		<div class="row">
			<datepicker
				:inline="true"
				class="col-md-3"
				bootstrapStyling
				placeholder="From"
				:disabledDates="disableBefore"
				v-model="start">
			</datepicker>
			<div class="col-sm-1">
				-
			</div>
			<datepicker
				:inline="true"
				class="col-md-3"
				bootstrapStyling
				placeholder="To"
				:disabledDates="disableAfter"
				v-model="end">
			</datepicker>
		</div>
		<div class="row">
			<div class="col">
				<span v-if="start && end" class="ml-2">From {{ start.toLocaleDateString() }} to {{ end.toLocaleDateString() }} is {{ timeBetweenString }}.</span>
				<delete-button v-if="inArray" @click="$emit('delete', property)"/>
			</div>
		</div>

	</div>

</template>

<script>
import datepicker from 'vuejs-datepicker'
import SchemaBase from '@/widgets/base.vue'
import { distanceInWords } from 'date-fns'
import DeleteButton from '@/partials/DeleteButton.vue'

export default {
	name: 'date-range',
	extends: SchemaBase,
	components: {
		datepicker,
		DeleteButton,
	},
	data() {
		return {
			start: null,
			end: null,
		}
	},
	computed: {
		timeBetweenString() {
			return distanceInWords(this.end, this.start)
		},
		disableBefore() {
			return {
				from: this.end,
			}
		},
		disableAfter() {
			return {
				to: this.start,
			}
		},
		title() {
			return this.schema.title
		},
		startDateISO() {
			return this.start ? this.start.toISOString() : null
		},
		endDateISO() {
			return this.end ? this.end.toISOString() : null
		},
	},
	methods: {
		updateValue() {
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: {
				start_date: this.startDateISO, end_date: this.endDateISO,
			}})
		},
	},
	created() {
		this.start = this.value.start_date ? new Date(this.value.start_date) : null
		this.end = this.value.end_date ? new Date(this.value.end_date) : null
	},
	watch: {
		start() {
			this.updateValue()
		},
		end() {
			this.updateValue()
		},
	},
}
</script>

<style lang="scss" scoped>
	.datepicker-container .row:last-child {
		margin-top: 1em;
	}
</style>
