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
		>
	</div>
</template>

<script>
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
			inputRegexp: /^[\d:]+$/,
			timeRegexp: /^((0[0-9]|1\d|2[0-3]|[0-9])|((0[0-9]|1\d|2[0-3]|[0-9]):){1}(([0-5][0-9]|[0-9]):?){1,2})$/,
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
		this.isInitializing = true
		this.internalValue = this.value
		this.initialValue = this.value
		this.isInitializing = false
	},
	methods: {
		submitChange(event) {
			if (this.isInitializing) { return }
			let newValue = event.target.value
			if (!newValue || newValue === '') {
				this.internalValue = newValue
				this.initialValue = newValue
				this.$emit('input', newValue)
			} else if (this.timeRegexp.test(newValue)) {
				let hours = newValue.split(":")
				const parts = hours.length
				for(let i=0; i<hours.length; i++) {
					hours[i] = hours[i].padStart(2, '0')
				}
				for (let i=0; i<3-parts; i++) {
					hours.push("00")
				}
				newValue = hours.join(":")
				this.internalValue = newValue
				this.initialValue = newValue
				this.$emit('input', newValue)
			} else {
				this.internalValue = this.initialValue
				this.$emit('input', this.internalValue)
			}
		},
		validate(event) {
			if (this.isInitializing) { return }
			const newValue = event.target.value
			if (this.timeRegexp.test(newValue)) {
				this.internalValue = newValue
				this.initialValue = this.internalValue
			} else if (!this.inputRegexp.test(newValue) && newValue !== '') {
				this.internalValue = this.initialValue
				this.$forceUpdate()
			}
		},
	},
}
</script>
