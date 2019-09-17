<!-- ADD_LICENSE_HEADER -->
<template>
	<div class="input-group">
		<div class="input-group-prepend">
			<b-button
				:disabled="disabled"
				@click="updateOffset"
			>
				UTC ±
			</b-button>
		</div>
		<input
			:value="timezoneString"
			placeholder="[+-]hh:mm"
			class="form-control"
			:disabled="disabled"
			@input="validate"
			@change="submitChange"
			@keyup.enter="submitChange"
		>
	</div>
</template>

<script>
export default {
	name: 'Timezonepicker',
	model: {
		prop: 'value',
		event: 'input',
	},
	props: {
		format: String,
		value: String,
		timezonedate: String,
		disabled: Boolean,
	},
	data() {
		return {
			internalValue: null,
			initialValue: null,
			isInitializing: true,
			invalidInputRegexp: /[^-+\d:.]/g,
		}
	},
	computed: {
		timezoneString: {
			get() {
				return this.internalValue
			},
			set(newValue) {
				if (this.isInitializing) { return }
				if (this.timezoneRegexp.test(newValue)) {
					this.internalValue = newValue
				}
			},
		},
	},
	watch: {
		timezonedate() {
			this.updateOffset()
		},
	},
	created() {
		this.isInitializing = true
		this.initialValue = this.value
		this.internalValue = this.initialValue
		if (this.timezonedate && !this.value) {
			this.updateOffset()
		}
		this.isInitializing = false
	},
	methods: {
		normalizeTimezone(str) {
			// Parse timezone string, convert it into ±HH:mm format.
			const formats = [
				/^([+-]?)(2[0-3]|[0-1]?\d)[:.]?$/,          // ±23    (leading 0 optional, trailing ./: allowed)
				/^([+-]?)(2[0-3]|[0-1]?\d)[:.]([0-5]?\d)$/, // ±23:59 (leading 0 optional)
			]
			for (let i=0; i<formats.length; i++) {
				const match = formats[i].exec(str)
				if (!match) {
					continue
				}
				let [ , sign, hours, minutes ] = match
				sign = sign || '+'
				hours = hours.padStart(2, "0")
				minutes = (minutes || "").padStart(2, "0")
				return sign + hours + ":" + minutes
			}
			return null
		},
		updateOffset() {
			if (!this.timezonedate) {
				return
			}
			const [ day, month, year ] = this.fromExternalFormat(this.timezonedate).split(".")
			const monthIndex = month - 1
			const localOffset = new Date(year, monthIndex, day).getTimezoneOffset()
			if (isNaN(localOffset)) {
				this.initialValue = null
				this.internalValue = this.initialValue
				this.$emit('input', this.initialValue)
				return
			}
			// localOffset is -180 for Helsinki
			// lets convert it to hh:mm format
			const isAheadOfUtc = localOffset < 0
			const isUtc = localOffset === 0
			const hours = String(Math.abs(localOffset/60)).padStart(2,"0")
			const minutes = String(Math.abs(localOffset%60)).padStart(2,"0")
			let symbol = ""
			if (isAheadOfUtc) {
				symbol = "+"
			} else if (isUtc) {
				symbol = "+"
			} else {
				symbol = "-"
			}
			this.initialValue = symbol + hours + ":" + minutes
			this.internalValue = this.initialValue
			this.$emit('input', this.initialValue)
		},
		submitChange(event) {
			if (this.isInitializing) { return }
			let newValue = event.target.value
			if (!newValue || newValue === '') {
				this.initialValue = newValue
			} else {
				newValue = this.normalizeTimezone(newValue)
				if (newValue) {
					this.initialValue = newValue
				}
			}
			this.internalValue = this.initialValue
			this.$emit('input', this.internalValue)
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
