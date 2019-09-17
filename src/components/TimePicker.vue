<!-- ADD_LICENSE_HEADER -->
<template>
	<div class="input-group">
		<div class="input-group-prepend">
			<span class="input-group-text">
				Time
			</span>
		</div>
		<input
			:value="timeString"
			placeholder="hh:mm:ss"
			class="form-control"
			:disabled="disabled"
			@input="validate"
			@change="submitChange"
			@keyup.enter="submitChange"
		>
	</div>
</template>

<script>

import { parse as parseDate, format as formatDate } from 'date-fns'

export default {
	name: 'Timepicker',
	model: {
		prop: 'value',
		event: 'input',
	},
	props: {
		format: String,
		value: String,
		disabled: Boolean,
	},
	data() {
		return {
			internalValue: null,
			initialValue: null,
			isInitializing: true,
			invalidInputRegexp: /[^\d:.]/g,
		}
	},
	computed: {
		timeString: {
			get() {
				return this.internalValue
			},
			set(newValue) {
				if (this.isInitializing) { return }
				if (this.timeRegexp.test(newValue)) {
					this.internalValue = newValue
				}
			},
		},
	},
	created() {
		this.internalValue = this.value
		this.initialValue = this.value
		this.isInitializing = false
	},
	methods: {
		normalizeTime(str) {
			// Parse time string, convert it into HH:mm:ss format.
			// Missing minutes and seconds are set to 0.
			const now = new Date() // required for filling missing day/month/year even though we don't need them here
			str = str.replace(/\./g, ':') // allow '.' as separator in the input, replace with ':'
			const formats = [ 'H', 'H:', 'H:m', 'H:m:', 'H:m:s' ]
			for (let i=0; i<formats.length; i++) {
				const date = parseDate(str, formats[i],  now)
				if (date != 'Invalid Date') {
					return formatDate(date, 'HH:mm:ss')
				}
			}
			return null
		},
		submitChange(event) {
			if (this.isInitializing) { return }
			let newValue = event.target.value
			if (!newValue || newValue === '') {
				this.initialValue = newValue
			} else {
				newValue = this.normalizeTime(newValue)
				if (newValue) {
					this.initialValue = newValue
				}
			}
			this.internalValue = this.initialValue
			this.$emit('input', this.internalValue)
			this.$forceUpdate()
		},
		validate(event) {
			if (this.isInitializing) { return }
			const newValue = event.target.value
			if (newValue.match(this.invalidInputRegexp)) {
				this.internalValue = newValue.replace(this.invalidInputRegexp, "")
				this.$forceUpdate()
			}
		},
	},
}
</script>
