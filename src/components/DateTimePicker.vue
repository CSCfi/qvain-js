<!-- ADD_LICENSE_HEADER -->
<template>
	<b-container class="datetimepicker">
		<b-row>
			<b-col>
				<b-form @submit.stop.prevent>
					<b-form-group
						:label="title"
						:description="description">
						<datepicker
							v-if="format === 'date-time' || format === 'date'"
							:format="format"
							v-model="date"
							:disabled="disabled"
						/>
						<timepicker
							v-if="format === 'date-time' || format === 'time'"
							:format="format"
							v-model="time"
							:disabled="disabled"
						/>
						<timezonepicker
							v-if="format === 'date-time' || format === 'time'"
							:format="format"
							:timezonedate="date"
							v-model="timezone"
							:disabled="disabled"
						/>
					</b-form-group>
				</b-form>
			</b-col>
		</b-row>
	</b-container>
</template>

<style lang="scss">
.datetimepicker.container {
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
		disabled: Boolean,
	},
	data() {
		return {
			internalValue: null,
			initialValue: null,
			date: null,
			time: null,
			timezone: null,
			isInitializing: true,
		}
	},

	methods: {
		toExternalDateFormat(internalFormat) {
			if (!internalFormat) { return internalFormat }
			const [date, time] = internalFormat.split("T")
			return date
		},
		toExternalTimeFormat(internalFormat) {
			if (!internalFormat) { return internalFormat }
			const [date, time] = internalFormat.split("T")
			return time
		},
		fromExternalDateFormat(externalFormat) {
			if (!externalFormat) { return externalFormat }
			const [year, month, day] = externalFormat.split("-")
			return day + "." + month + "." + year
		},
		updateValue() {
			if (this.isInitializing) { return }
			let timeValue = this.time
			if (!timeValue) {
				timeValue = "00:00:00"
			}
			let dateValue = this.date
			if (!dateValue) {
				dateValue = "0000-00-00"
			}
			let timeZoneValue = this.timezone
			if (!this.timezone) {
				timeZoneValue = "00:00"
			}
			if (timeZoneValue[0] !== "-" && timeZoneValue[0] !== "+") {
				timeZoneValue = "-" + timeZoneValue
			}
			this.internalValue = dateValue + "T" + timeValue + timeZoneValue
			const isEmpty = (this.format === 'date' && !this.date) ||
				(this.format === "time" && !this.time)
			if (isEmpty) {
				this.$emit('input', undefined)
			} else if (this.format === "date-time") {
				this.$emit('input', this.internalValue)
			} else if (this.format === "date") {
				this.$emit('input', this.toExternalDateFormat(this.internalValue))
			} else if (this.format === "time") {
				this.$emit('input', this.toExternalTimeFormat(this.internalValue))
			} else {
				console.log("Unhandled data format (" + this.format + ") for DateTimePicker")
			}
		}
	},
	created() {
		this.isInitializing = true
		this.internalValue = this.value
		this.initialValue = this.value
		if (this.internalValue) {
			const timeValue = this.internalValue.split("T")
			const timeValueWithTimezone = timeValue[1]
			let timezonePrefix = "-"
			if (timeValueWithTimezone) {
				if (timeValueWithTimezone.indexOf("+") > 0) {
					timezonePrefix = "+"
				}
				const timeAndTimezone = timeValueWithTimezone.split(timezonePrefix)
				this.timezone = timezonePrefix + timeAndTimezone[1]
				this.time = timeAndTimezone[0]
			}
			this.date = timeValue[0]
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
