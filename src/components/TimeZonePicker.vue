<!-- ADD_LICENSE_HEADER -->
<template>
	<div class="input-group">
		<div class="input-group-prepend">
			<b-button
				@click="updateOffset"> 
				UTC ±
			</b-button>
		</div>
		<input
			:value="timezoneString"
			@input="validate"
			@change="submitChange"
			placeholder="[+-]hh:mm"
			class="form-control" />
	</div>
</template>

<script>
export default {
	name: 'timezonepicker',
	model: {
		prop: 'value',
		event: 'input'
	},
	props: {
		format: String,
		value: String,
		timezonedate: String
	},
	data() {
		return {
			internalValue: null,
			initialValue: null,
			isInitializing: true,
			inputRegexp: /^[-+\d:]+$/,
			timezoneRegexp: /^[+-]?(2[0-3]|[0-1]?\d)(:[0-5]?\d|:)?$/
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
			}
		},
	},
	methods: {
		updateOffset() {
			const [day, month, year] = this.fromExternalFormat(this.timezonedate).split(".")
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
				this.internalValue = newValue
				this.initialValue = newValue
				this.$emit('input', newValue)
			} else if (this.timezoneRegexp.test(newValue)) {
				let symbol = "+"
				if (newValue[0]==="+" || newValue[0]==="-") {
					symbol = newValue[0]
					newValue = newValue.substring(1)
				}
				let hours = newValue.split(":")
				const parts = hours.length

				for(var i=0; i<hours.length; i++) {
					hours[i] = hours[i].padStart(2, '0')
				}
				for (var i=0; i<2-parts; i++) {
					hours.push("00")
				}

				if (hours[0] == "00") {
					symbol = ""
				}
				newValue = symbol + hours.join(":")
				this.internalValue = newValue
				this.initialValue = newValue
				this.$emit('input', newValue)
			} else {
				this.internalValue = this.initialValue
				this.$emit('input', this.internalValue)
			}
		},
		toExternalFormat(internalFormat) {
			if (!internalFormat) { return internalFormat }
			const [day, month, year] = internalFormat.split(".")
			return year + "-" + month + "-" + day
		},
		fromExternalFormat(externalFormat) {
			if (!externalFormat) { return externalFormat }
			const [year, month, day] = externalFormat.split("-")
			return day + "." + month + "." + year
		},
		validate(event) {
			if (this.isInitializing) { return }
			const newValue = event.target.value
			if (this.timezoneRegexp.test(newValue)) {
				this.internalValue = newValue
				this.initialValue = this.internalValue
			} else if (!this.inputRegexp.test(newValue) && newValue !== '') {
				this.internalValue = this.initialValue
				this.$forceUpdate();
			}
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
	watch: {
		timezonedate(value) {
			this.updateOffset()
		},
	}
}
</script>