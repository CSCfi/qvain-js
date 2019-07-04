<!-- ADD_LICENSE_HEADER -->
<template>
	<div
		class="container datepicker-container"
		:id="property">
		<div class="row">
			<div class="col-sm-1">
				#{{ property + 1 }}
			</div>
			<div class="col">
				<datepicker
					:highlighted="highlightedSelected"
					:inline="false"
					bootstrapStyling
					monday-first
					typeable
					placeholder="From"
					format="dd.MM.yyyy"
					:disabledDates="disableBefore"
					v-model="start">
					<b-button
						slot="afterDateInput"
						:id="property + '_date_start_clear-button'"
						@click="start = null"
						variant="outline-secondary"
						class="vdp-datepicker_clear-button">
						<font-awesome-icon icon="times" fixed-width class="icon" />
					</b-button>
				</datepicker>
			</div>
			<div class="col">
				<datepicker
					:highlighted="highlightedSelected"
					:inline="false"
					monday-first
					bootstrapStyling
					typeable
					format="dd.MM.yyyy"
					placeholder="To"
					:disabledDates="disableAfter"
					v-model="end">
					<b-button
						slot="afterDateInput"
						:id="property + '_date_clear-button'"
						@click="end = null"
						variant="outline-secondary"
						class="vdp-datepicker_clear-button">
						<font-awesome-icon icon="times" fixed-width class="icon" />
					</b-button>
				</datepicker>
			</div>
			<div class="col">
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
		highlightedSelected() {
			return {
				from: this.start,
				to: this.end
			}
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
