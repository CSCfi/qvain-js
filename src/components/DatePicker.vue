<!-- ADD_LICENSE_HEADER -->
<template>
	<div class="input-group">
		<div class="input-group-prepend">
			<span class="input-group-text">Date</span>
		</div>
		<input
			:value="dateString"
			@input="validate"
			@change="submitChange"
			placeholder="dd.MM.yyyy"
			class="form-control" />
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
			inputRegexp: /^[\d\.]+$/,
			dateRegexp: /^((([1-9]|0[1-9]|[12]\d|3[01])\.([1-9]|0[1-9]|1[0-2])(\.[12]\d{3})?)|([1-9]|0[1-9]|[12]\d|3[01]))$/
		}
	},
	computed: {
		dateString: {
			get() {
				return this.internal_value
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
				this.$emit('input', this.toExternalFormat(new_value))
			} else if (this.dateRegexp.test(new_value)) {
				let date_structure = new_value.split(".")
				const parts = date_structure.length
				for(var i=0; i<date_structure.length; i++) {
					date_structure[i] = date_structure[i].padStart(2, '0')
				}
				for (var i=0; i<3-parts; i++) {
					date_structure.push("00")
				}
				// ensure that the month is not empty
				if (date_structure[1] === "00") {
					date_structure[1] = String(new Date().getMonth()+1).padStart(2, '0')
				}
				// ensure that the year is not empty
				date_structure[2] = date_structure[2].padStart(4, '0')
				if (date_structure[2] === "0000") {
					date_structure[2] = new Date().getFullYear()
				}
				new_value = date_structure.join(".")
				this.$emit('input', this.toExternalFormat(new_value))
				this.internal_value = new_value
				this.initial_value = new_value
			} else {
				this.internal_value = this.initial_value
				this.$emit('input', this.toExternalFormat(this.internal_value))
			}
		},
		toExternalFormat(internal_format) {
			if (!internal_format) { return internal_format }
			const [day, month, year] = internal_format.split(".")
			return year + "-" + month + "-" + day
		},
		fromExternalFormat(external_format) {
			if (!external_format) { return external_format }
			const [year, month, day] = external_format.split("-")
			return day + "." + month + "." + year
		},
		validate(event) {
			if (this.isInitializing) { return }
			const new_value = event.target.value
			if (this.dateRegexp.test(new_value)) {
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
		this.internal_value = this.fromExternalFormat(this.value)
		this.initial_value = this.fromExternalFormat(this.value)
		this.isInitializing = false
	}
}
</script>
