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
			class="form-control"
			:disabled="disabled"
		/>
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
		disabled: Boolean,
	},
	data() {
		return {
			internalValue: null,
			initialValue: null,
			isInitializing: true,
			inputRegexp: /^[\d\.]+$/,
			dateRegexp: /^((([1-9]|0[1-9]|[12]\d|3[01])\.([1-9]|0[1-9]|1[0-2])(\.[12]\d{3})?)|([1-9]|0[1-9]|[12]\d|3[01]))$/
		}
	},
	computed: {
		dateString: {
			get() {
				return this.internalValue
			}
		},
	},
	methods: {
		submitChange(event) {
			if (this.isInitializing) { return }
			let newValue = event.target.value
			if (!newValue || newValue === '') {
				this.internalValue = newValue
				this.initialValue = newValue
				this.$emit('input', this.toExternalFormat(newValue))
			} else if (this.dateRegexp.test(newValue)) {
				let dateStructure = newValue.split(".")
				const parts = dateStructure.length
				for(var i=0; i<dateStructure.length; i++) {
					dateStructure[i] = dateStructure[i].padStart(2, '0')
				}
				for (var i=0; i<3-parts; i++) {
					dateStructure.push("00")
				}
				// ensure that the month is not empty
				if (dateStructure[1] === "00") {
					dateStructure[1] = String(new Date().getMonth()+1).padStart(2, '0')
				}
				// ensure that the year is not empty
				dateStructure[2] = dateStructure[2].padStart(4, '0')
				if (dateStructure[2] === "0000") {
					dateStructure[2] = new Date().getFullYear()
				}
				newValue = dateStructure.join(".")
				this.internalValue = newValue
				this.initialValue = newValue
				this.$emit('input', this.toExternalFormat(newValue))
			} else {
				this.internalValue = this.initialValue
				this.$emit('input', this.toExternalFormat(this.internalValue))
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
			if (this.dateRegexp.test(newValue)) {
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
		this.internalValue = this.fromExternalFormat(this.value)
		this.initialValue = this.fromExternalFormat(this.value)
		this.isInitializing = false
	}
}
</script>
