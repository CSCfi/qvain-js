<!-- ADD_LICENSE_HEADER -->
<template>
	<div class="input-group">
		<div class="input-group-prepend">
			<span class="input-group-text">Date</span>
		</div>
		<input
			:value="dateString"
			placeholder="dd.MM.yyyy"
			class="form-control"
			:disabled="disabled"
			@input="validate"
			@change="submitChange"
			@keyup.enter="submitChange"
		>
	</div>
</template>

<style lang="scss">
.datepicker-container {
	margin: 0em;
	padding: 0em;
	.row {
		margin: 0em;
		padding: 0em;
		.col, .col-sm-2 {
			margin: 0em;
			padding: 0em;
		}
	}
}
</style>

<script>

import { parse as parseDate, format as formatDate } from 'date-fns'

export default {
	name: 'Datepicker',
	model: {
		prop: 'value',
		event: 'input',
	},
	props: {
		format: String(""),
		value: String(""),
		disabled: Boolean,
	},
	data() {
		return {
			internalValue: null,
			initialValue: null,
			isInitializing: true,
			invalidInputRegexp: /[^\d.]/g,
		}
	},
	computed: {
		dateString: {
			get() {
				return this.internalValue
			},
		},
	},
	created() {
		this.internalValue = this.fromExternalFormat(this.value)
		this.initialValue = this.fromExternalFormat(this.value)
		this.isInitializing = false
	},
	methods: {
		normalizeDate(str) {
			// Parse date string, convert it into dd.MM.yyyy format.
			// The current date is used for month and year if they are missing.
			const now = new Date()
			const formats = [ 'd', 'd.', 'd.M', 'd.M.', 'd.M.yy', 'd.M.yyyy' ]
			for (let i=0; i<formats.length; i++) {
				const date = parseDate(str, formats[i],  now)
				if (date != 'Invalid Date') {
					return formatDate(date, 'dd.MM.yyyy')
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
				newValue = this.normalizeDate(newValue)
				if (newValue) {
					this.initialValue = newValue
				}
			}
			this.internalValue = this.initialValue
			this.$emit('input', this.toExternalFormat(this.internalValue))
			this.$forceUpdate()
		},
		toExternalFormat(internalFormat) {
			if (!internalFormat) { return internalFormat }
			const [ day, month, year ] = internalFormat.split(".")
			return year + "-" + month + "-" + day
		},
		fromExternalFormat(externalFormat) {
			if (!externalFormat) { return externalFormat }
			const [ year, month, day ] = externalFormat.split("-")
			return day + "." + month + "." + year
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
