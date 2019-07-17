<!-- ADD_LICENSE_HEADER -->
<template>
	<div class="input-group">
		<div class="input-group-prepend">
			<span class="input-group-text">Date</span>
		</div>
		<input
			:value="dateString"
			@input="validateDate"
			@change="submitChange"
			placeholder="dd.MM.yyyy"
			class="form-control" />
	</div>
</template>

<script>

export default {
	name: 'datepicker',
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
			dateRegexp: /^((([1-9]|0[1-9]|[12]\d|3[01])\.([1-9]|0[1-9]|1[0-2])(\.[12]\d{3})?)|([1-9]|0[1-9]|[12]\d|3[01]))$/
		}
	},
	computed: {
		dateString: {
			get() {
				return this.internal_value
			},
			set(new_value) {
				if (this.isInitializing) { return }
				if (this.dateRegexp.test(new_value)) {
					var date_array = new_value.split(".")
					this.internal_value = date_array[2] + "-" + date_array[1] + "-" + date_array[0]
				}
			}
		},
	},
	methods: {
		submitChange(event) {
			if (this.isInitializing) { return }
			let new_value = event.target.value
			if (!new_value || new_value === '') {
				this.internal_value = new_value
				this.initial_value = new_value
				this.$emit('input', new_value)
			} else if (this.dateRegexp.test(new_value)) {
				var hours = new_value.split(".")
				var parts = hours.length

				for(var i=0; i<hours.length; i++) {
					hours[i] = hours[i].padStart(2, '0')
				}
				for (var i=0; i<3-parts; i++) {
					hours.push("00")
				}

				// ensure that the month is not empty
				if (hours[1] === "00") {
					hours[1] = String(new Date().getMonth()+1).padStart(2, '0')
				}

				// ensure that the year is not empty
				hours[2] = hours[2].padStart(4, '0')
				if (hours[2] === "0000") {
					hours[2] = new Date().getFullYear()
				}

				new_value = hours.join(".")

				this.$emit('input', new_value)
				this.internal_value = new_value
				this.initial_value = new_value
			} else {
				this.internal_value = this.initial_value
			}
		},
		validateDate(event) {
			if (this.isInitializing) { return }
			const new_value = event.target.value
			if (this.dateRegexp.test(new_value)) {
				this.internal_value = new_value
				this.initial_value = new_value
			}
		},
	},
	created() {
		this.isInitializing = true
		this.internal_value = this.value
		this.initial_value = this.value
		this.isInitializing = false
	}
}
</script>
