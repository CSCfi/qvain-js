<!-- ADD_LICENSE_HEADER -->
<template>
	<div
		class="container datepicker-container"
		:id="property">
		<div class="row">
			<div class="col-sm-2">
				{{ title }}
			</div>
			<div class="col">
				<datepicker
					v-bind:format="schema.properties.start_date.format"
					v-model="start">
				</datepicker>
			</div>
			<div class="col">
				<datepicker
					v-bind:format="schema.properties.end_date.format"
					v-model="end">
				</datepicker>
			</div>
			<div class="col-sm-2">
				<delete-button v-if="inArray" @click="$emit('delete', property)"/>
			</div>

		</div>
	</div>

</template>

<script>
import datepicker from '@/components/DateTimePicker.vue'
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
		title() {
			return typeof(this.property)=="number" ? '#' + (this.property + 1) : this.schema.title
		},
	},
	methods: {
		updateValue() {
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: {
				start_date: this.start, end_date: this.end,
			}})
		},
	},
	created() {
		this.start = this.value.start_date
		this.end = this.value.end_date
	},
	watch: {
		start() {
			console.log("updated value start")
			this.updateValue()
		},
		end() {
			console.log("updated value end")
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
