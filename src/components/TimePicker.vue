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
			@input="validate"
			@change="submitChange"
			placeholder="hh:mm:ss"
			class="form-control" />
	</div>
</template>

<script>
export default {
	name: 'timepicker',
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
			inputRegexp: /^[\d:]+$/,
			timeRegexp: /^((0[0-9]|1\d|2[0-3]|[0-9])|((0[0-9]|1\d|2[0-3]|[0-9]):){1}(([0-5][0-9]|[0-9]):?){1,2})$/
		}
	},
	computed: {
		timeString: {
			get() {
				return this.internal_value
			},
			set(new_value) {
				if (this.isInitializing) { return }
				if (this.timeRegexp.test(new_value)) {
					this.internal_value = new_value
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
			} else if (this.timeRegexp.test(new_value)) {
				let hours = new_value.split(":")
				const parts = hours.length

				for(var i=0; i<hours.length; i++) {
					hours[i] = hours[i].padStart(2, '0')
				}
				for (var i=0; i<3-parts; i++) {
					hours.push("00")
				}

				new_value = hours.join(":")

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
			if (this.timeRegexp.test(new_value)) {
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
		this.internal_value = this.value
		this.initial_value = this.value
		this.isInitializing = false
	}
}
</script>
