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
			v-bind:value="timezoneString"
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
			internal_value: null,
			initial_value: null,
			isInitializing: true,
			inputRegexp: /^[-+\d:]+$/,
			timezoneRegexp: /^[+-]?(2[0-3]|[0-1]?\d)(:[0-5]?\d|:)?$/
		}
	},
	computed: {
		timezoneString: {
			get() {
				return this.internal_value
			},
			set(new_value) {
				if (this.isInitializing) { return }
				if (this.timezoneRegexp.test(new_value)) {
					this.internal_value = new_value
				}
			}
		},
	},
	methods: {
		updateOffset() {
			// this.date is in day.month.year format
			// javascript Date expects it to month.day.year format
			const [day, month, year] = this.timezonedate.split(".")
			const monthIndex = month - 1
			const local_offset = new Date(year, monthIndex, day).getTimezoneOffset()
			if (isNaN(local_offset)) {
				this.initial_value = null
				this.internal_value = this.initial_value
				this.$emit('input', this.initial_value)
				return
			}
			// local_offset is -180 for Helsinki
			// lets convert it to hh:mm format
			const is_ahead_of_utc = local_offset < 0
			const is_utc = local_offset === 0
			const hours = String(Math.abs(local_offset/60)).padStart(2,"0")
			const minutes = String(Math.abs(local_offset%60)).padStart(2,"0")
			let symbol = ""
			if (is_ahead_of_utc) {
				symbol = "+"
			} else if (is_utc) {
				symbol = "+"
			} else {
				symbol = "-"
			}
			this.initial_value = symbol + hours + ":" + minutes
			this.internal_value = this.initial_value
			this.$emit('input', this.initial_value)
		},
		submitChange(event) {
			if (this.isInitializing) { return }
			let new_value = event.target.value
			if (!new_value || new_value === '') {
				this.internal_value = new_value
				this.initial_value = new_value
				this.$emit('input', new_value)
			} else if (this.timezoneRegexp.test(new_value)) {
				let symbol = "+"
				if (new_value[0]==="+" || new_value[0]==="-") {
					symbol = new_value[0]
					new_value = new_value.substring(1)
				}
				let hours = new_value.split(":")
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

				new_value = symbol + hours.join(":")

				this.internal_value = new_value
				this.initial_value = new_value
				this.$emit('input', new_value)
			} else {
				this.internal_value = this.initial_value
				this.$emit('input', this.internal_value)
			}
		},
		validate(event) {
			if (this.isInitializing) { return }
			const new_value = event.target.value
			if (this.timezoneRegexp.test(new_value)) {
				this.internal_value = new_value
				this.initial_value = this.internal_value
			} else if (!this.inputRegexp.test(new_value) && new_value !== '') {
				this.internal_value = this.initial_value
				this.$forceUpdate();
			}
		},
	},
	created() {
		this.isInitializing = true
		this.initial_value = this.value
		this.internal_value = this.initial_value
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
