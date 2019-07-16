<!-- ADD_LICENSE_HEADER -->
<template>
   <input
        :key="componentKey"
        v-bind:value="timeString"
        v-on:input="validateTime"
        v-on:change="submitChange"
        placeholder="hh:mm:ss"
        class="form-control" />
</template>

<script>

export default {
	name: 'time-picker',
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
            componentKey: 0,
            timeRegexp: /^((0[0-9]|1\d|2[0-3]|[0-9])|((0[0-9]|1\d|2[0-3]|[0-9]):){1}(([0-5][0-9]|[0-9]):?){1,2})$/
        }
	},
	computed: {
        timeString: {
			get: function() {
                return this.internal_value
			},
			set: function(new_value) {
				if (this.timeRegexp.test(new_value)) {
                    this.internal_value = new_value
				}
			}
        },
	},
	methods: {
        submitChange: function(event) {
            var new_value = event.target.value
            if (this.timeRegexp.test(new_value)) {
                var hours = new_value.split(":")
                var parts = hours.length

                for(var i=0; i<hours.length; i++) {
                    hours[i] = hours[i].padStart(2, '0')
                }
                for (var i=0; i<3-parts; i++) {
                    hours.push("00")
                }

                new_value = hours.join(":")

                this.internal_value = new_value
                this.initial_value = new_value
                this.$emit('change', new_value)
            } else {
                this.internal_value = this.initial_value
            }
            this.forceRerender()
        },
        validateTime: function(event) {
            var new_value = event.target.value
            if (this.timeRegexp.test(new_value)) {
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