<!-- ADD_LICENSE_HEADER -->
<template>
	<b-container class="datetimepicker">
		<b-row>
			<b-col>
				<b-form>
					<b-form-group
						:label="title"
						:description="description">
						<datepicker
							v-if="format === 'date-time' || format === 'date'"
							:format="format"
							v-model="date">
						</datepicker>
						<timepicker
							v-if="format === 'date-time' || format === 'time'"
							:format="format"
							v-model="time">
						</timepicker>
						<timezonepicker
							v-if="format === 'date-time' || format === 'time'"
							:format="format"
							:timezonedate="date"
							v-model="timezone">
						</timezonepicker>
					</b-form-group>
				</b-form>
			</b-col>
		</b-row>
	</b-container>
</template>

<style lang="scss">
.datetimepicker.container * .input-group {
	margin-top: 0.5em;
}
.datetimepicker.container * .input-group:last-child {
	margin-top: 0.25em;
	padding-left: 1em;
}
</style>

<script>
import DatePicker from "@/components/DatePicker.vue"
import TimePicker from "@/components/TimePicker.vue"
import TimeZonePicker from "@/components/TimeZonePicker.vue"

export default {
	name: 'datetime-picker',
	components: {
		"datepicker": DatePicker,
		"timepicker": TimePicker,
		"timezonepicker": TimeZonePicker,
	},
	props: {
		format: String,
		value: String,
		title: String,
		description: String,
	},
	data() {
		return {
			internal_value: null,
			initial_value: null,
			date: null,
			time: null,
			timezone: null,
			isInitializing: true,
		}
	},

	methods: {
		updateValue() {
			if (this.isInitializing) { return }
			let time_value = this.time
			if (!time_value) {
				time_value = "00:00:00"
			}
			let date_value = this.date
			if (!date_value) {
				date_value = "0000-00-00"
			}
			let time_zone_value = this.timezone
			if (!this.timezone) {
				time_zone_value = "00:00"
			}
			if (time_zone_value[0] !== "-" && time_zone_value[0] !== "+") {
				time_zone_value = "-" + time_zone_value
			}
			this.internal_value = date_value + "T" + time_value + time_zone_value
			this.$emit('input', this.internal_value)
		}
	},
	created() {
		this.isInitializing = true
		this.internal_value = this.value
		this.initial_value = this.value
		if (this.internal_value) {
			const time_value = this.internal_value.split("T")
			const time_value_with_timezone = time_value[1]
			let timezone_prefix = "-"
			if (time_value_with_timezone.indexOf("+") > 0) {
				timezone_prefix = "+"
			}
			const time_and_timezone = time_value_with_timezone.split(timezone_prefix)
			this.date = time_value[0]
			this.time = time_and_timezone[0]
			this.timezone = timezone_prefix + time_and_timezone[1]
		}
		this.isInitializing = false
	},
	watch: {
		time() {
			if (this.isInitializing) { return }
			this.updateValue()
		},
		date() {
			if (this.isInitializing) { return }
			this.updateValue()
		},
		timezone() {
			if (this.isInitializing) { return }
			this.updateValue()
		},
	},
}
</script>
