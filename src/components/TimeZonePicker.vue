<!-- ADD_LICENSE_HEADER -->
<template>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Zone</span>
        </div>
        <input
            :key="componentKey"
            v-bind:value="timezoneString"
            v-on:input="validateTimeZone"
            v-on:change="submitChange"
            placeholder="[+-]hh:mm"
            class="form-control" />
    </div>
</template>

<script>

export default {
	name: 'timezonepicker',
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
            isInitializing: true,
            componentKey: 0,
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
            var new_value = event.target.value
            if (!new_value || new_value === '') {
                this.internal_value = new_value
                this.initial_value = new_value
                this.$emit('input', new_value)
            } else if (this.timezoneRegexp.test(new_value)) {
                var symbol = "-"
                if (new_value[0]==="+" || new_value[0]==="-") {
                    symbol = new_value[0]
                    new_value = new_value.substring(1)
                }
                var hours = new_value.split(":")
                var parts = hours.length
                console.log(hours)

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
            this.forceRerender()
        },
        validateTimeZone: function(event) {
            if (this.isInitializing) { return }
            var new_value = event.target.value
            if (this.timezoneRegexp.test(new_value)) {
                this.internal_value = new_value
                this.initial_value = new_value
            }
        },
        forceRerender() {
            this.componentKey += 1;  
        }
	},
	created() {
        this.isInitializing = true
        this.internal_value = this.value
        this.initial_value = this.value
        this.isInitializing = false
	}
}
</script>