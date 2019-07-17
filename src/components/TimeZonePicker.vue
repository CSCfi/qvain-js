<!-- ADD_LICENSE_HEADER -->
<template>
	<div class="input-group">
		<div class="input-group-prepend">
			<b-button
				@click="updateOffset"> 
				Offset
			</b-button>
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
		date: String
	},
	data() {
		return {
			internal_value: null,
			initial_value: null,
			isInitializing: true,
			timezoneRegexp: /^[+-]?((0[0-9]|1\d|2[0-3]|[0-9])|((0[0-9]|1\d|2[0-3]|[0-9])){1})$/
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
			var local_offset = new Date(this.date).getTimezoneOffset()
			// local_offset is -180 for Helsinki
			// lets convert it to hh:mm format
			var is_ahead_of_utc = local_offset < 0
			var is_utc = local_offset === 0
			var hours = String(Math.abs(local_offset/60)).padStart(2,"0")
			var minutes = String(Math.abs(local_offset%60)).padStart(2,"0")
			var symbol = ""
			if (is_ahead_of_utc) {
				symbol = "+"
			} else if (is_utc) {
				symbol = ""
			} else {
				symbol = "-"
			}
			this.initial_value = symbol + hours + ":" + minutes
			this.internal_value = this.initial_value
		},
		submitChange(event) {
			if (this.isInitializing) { return }
			var new_value = event.target.value
			if (!new_value || new_value === '') {
				this.internal_value = new_value
				this.initial_value = new_value
				this.$emit('input', new_value)
			} else if (this.timezoneRegexp.test(new_value)) {
				var symbol = "+"
				if (new_value[0]==="+" || new_value[0]==="-") {
					symbol = new_value[0]
					new_value = new_value.substring(1)
				}
				var hours = new_value.split(":")
				var parts = hours.length

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
		validateTimeZone(event) {
			if (this.isInitializing) { return }
			var new_value = event.target.value
			if (this.timezoneRegexp.test(new_value)) {
				this.internal_value = new_value
				this.initial_value = new_value
			}
		},
	},
	created() {
		this.isInitializing = true
		this.initial_value = this.value
		if (!this.initial_value) {
			this.updateOffset()
		}
		this.internal_value = this.initial_value
		this.isInitializing = false
	},
	watch: {
		date(value) {
			var local_offset = new Date(this.date)
			//.getTimezoneOffset()
			console.log("date changed")
			console.log(this.date)
			console.log(local_offset)
			console.log(new Date())
		},
	}
}
</script>
