<!-- ADD_LICENSE_HEADER -->
<template>
	<div class="input-group">
		<div class="input-group-prepend">
			<span class="input-group-text">Zone</span>
		</div>
		<input
			:value="timezoneString"
			@input="validateTimeZone"
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
	},
	data() {
		return {
			internal_value: null,
			initial_value: null,
			isInitializing: true,
			timezoneRegexp: /^[+-]?((0[0-9]|1\d|2[0-3]|[0-9])|((0[0-9]|1\d|2[0-3]|[0-9]):){1})$/
		}
	},
	computed: {
		timezoneString: {
			get: function() {
				return this.internal_value
			},
			set: function(new_value) {
				if (this.isInitializing) { return }
				if (this.timezoneRegexp.test(new_value)) {
					this.internal_value = new_value
				}
			}
		},
	},
	methods: {
		submitChange: function(event) {
			if (this.isInitializing) { return }
			let new_value = event.target.value
			if (!new_value || new_value === '') {
				this.internal_value = new_value
				this.initial_value = new_value
				this.$emit('input', new_value)
			} else if (this.timezoneRegexp.test(new_value)) {
				let symbol = "-"
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
			}
		},
		validateTimeZone: function(event) {
			if (this.isInitializing) { return }
			const new_value = event.target.value
			if (this.timezoneRegexp.test(new_value)) {
				this.internal_value = new_value
				this.initial_value = new_value
			}
		},
	},
	created() {
		this.isInitializing = true
		if (!this.value) {
			this.value = new Date()
		}
		this.internal_value = this.value
		this.initial_value = this.value
		this.isInitializing = false
	}
}
</script>
