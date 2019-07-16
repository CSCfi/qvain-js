<!-- ADD_LICENSE_HEADER -->
<template>
   <input
        :key="componentKey"
        v-bind:value="dateString"
        v-on:input="validateDate"
        v-on:change="submitChange"
        placeholder="dd.MM.yyyy"
        class="form-control" />
</template>

<script>

export default {
	name: 'date-picker',
	components: {
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        format: String,
        value: String,
    },
	data: function () {
        return {
            internal_value: null,
            initial_value: null,
            time: null,
            componentKey: 0,
            dateRegexp: /^(([1-9]|0[1-9]|[12]\d|3[01])\.([1-9]|0[1-9]|1[0-2])\.[12]\d{3})$/,
        }
	},
	computed: {
        dateString: {
			get: function() {
                return this.internal_value
			},
			set: function(new_value) {
				if (this.dateRegexp.test(new_value)) {
					var date_array = new_value.split(".")
                    this.internal_value = date_array[2] + "-" + date_array[1] + "-" + date_array[0]
				}
			}
        },
	},
	methods: {
        submitChange: function(event) {
            var new_value = event.target.value
            var date_value_is_ok = (this.format === 'date-time' || this.format === 'date') && this.dateRegexp.test(new_value)
            if (date_value_is_ok) {
                this.$emit('change', new_value)
                this.internal_value = new_value
                this.initial_value = new_value
            } else {
                this.internal_value = this.initial_value
            }
            this.forceRerender()
        },
        validateDate: function(event) {
            var new_value = event.target.value
            var date_value_is_ok = (this.format === 'date-time' || this.format === 'date') && this.dateRegexp.test(new_value)
            if (date_value_is_ok) {
                this.$emit('input', new_value)
                this.internal_value = new_value
                this.initial_value = new_value
            }
        },
        forceRerender() {
            this.componentKey += 1;  
        }
	},
	created() {
        this.internal_value = this.value
        this.initial_value = this.value
	}
}
</script>