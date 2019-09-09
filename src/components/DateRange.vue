<!-- ADD_LICENSE_HEADER -->
<template>
	<div
		:id="property"
		class="container daterange-container"
	>
		<div class="row">
			<div class="col-sm-2">
				<p>
					{{ title }}
					<delete-button
						v-if="inArray"
						:disabled="readOnly"
						@click="$emit('delete', property)"
					/>
				</p>
				<b-badge v-if="timeBetweenString">
					{{ timeBetweenString }}
				</b-badge>
				<div
					v-if="toIsEarlierThanFrom"
					class="error-badges"
				>
					<b-badge
						variant="danger"
					>
						<span>To &lt; From</span>
					</b-badge>
				</div>
			</div>
			<div class="col">
				<datetimepicker
					v-model="start"
					:title="'From'"
					:format="schema.properties.start_date.format"
					:disabled="readOnly"
				/>
			</div>
			<div class="col">
				<datetimepicker
					v-model="end"
					:title="'To'"
					:format="schema.properties.end_date.format"
					:disabled="readOnly"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.daterange-title.container {
	margin: 0em;
	padding: 0em;
	.row {
		margin: 0em;
		padding: 0em;
		padding-left: 0.5em;
		.col, .col-sm-2 {
			margin: 0em;
			padding: 0em;
		}
	}
}
.daterange-title.container * .input-group {
	margin-top: 0.5em;
}
.daterange-title.container * .input-group:last-child {
	margin-top: 0.25em;
	padding-left: 1em;
}
.error-badges {
	padding-top: 0.5em;
}
</style>

<script>
import DateTimePicker from '@/components/DateTimePicker.vue'
import SchemaBase from '@/widgets/base.vue'
import { distanceInWords } from 'date-fns'
import DeleteButton from '@/partials/DeleteButton.vue'

export default {
	name: 'DateRange',
	components: {
		"datetimepicker": DateTimePicker,
		DeleteButton,
	},
	extends: SchemaBase,
	data() {
		return {
			start: null,
			end: null,
			isInitializing: true,
		}
	},
	computed: {
		timeBetweenString() {
			if (!this.end || !this.start) { return null }
			return distanceInWords(this.end, this.start)
		},
		title() {
			return typeof(this.property)=="number" ? '#' + (this.property + 1) : this.schema.title
		},
		toIsEarlierThanFrom() {
			if (!this.end || !this.start) { return false }
			const endDate = new Date(this.end)
			const startDate = new Date(this.start)
			if (endDate < startDate) {
				return true
			}
		},
	},
	watch: {
		start() {
			if (this.isInitializing) { return }
			this.updateValue()
		},
		end() {
			if (this.isInitializing) { return }
			this.updateValue()
		},
	},
	async created() {
		this.isInitializing = true
		this.start = this.value.start_date
		this.end = this.value.end_date
		await this.$nextTick()
		this.isInitializing = false
	},
	methods: {
		updateValue() {
			if (this.isInitializing) { return }
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: {
				start_date: this.start, end_date: this.end,
			}})
		},
	},
}
</script>
