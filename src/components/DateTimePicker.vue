<!-- ADD_LICENSE_HEADER -->
<template>
    <b-container class="datetimepicker" :key="componentKey">
        <b-row>
            <datepicker
                v-if="format === 'date-time' || format === 'date'"
                v-bind:format="format"
                v-model="date">
            </datepicker>
            <timepicker
                v-if="format === 'date-time' || format === 'time'"
                v-bind:format="format"
                v-model="time">
            </timepicker>
            <timezonepicker
                v-if="format === 'date-time' || format === 'time'"
                v-bind:format="format"
                v-model="timezone">
            </timezonepicker>
        </b-row>
    </b-container>
</template>

<style>

</style>

<script>
//import Datepicker from 'vuejs-datepicker'
import DatePicker from "@/components/DatePicker.vue"
import TimePicker from "@/components/TimePicker.vue"
import TimeZonePicker from "@/components/TimeZonePicker.vue"

export default {
	name: 'datetime-picker',
	components: {
        "datepicker": DatePicker,
        "timepicker": TimePicker,
        "timezonepicker": TimeZonePicker,
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
            date: null,
            time: null,
            timezone: null,
        }
	},

	methods: {
        forceRerender() {
            this.componentKey += 1;  
        },
        updateValue() {
            var time_value = this.time
            if (!time_value) {
                time_value = "00:00:00"
            }
            var date_value = this.date
            if (!date_value) {
                date_value = "0000-00-00"
            }
            var time_zone_value = this.timezone
            if (!this.timezone) {
                time_zone_value = "00:00"
            }
            this.internal_value = date_value + "T" + time_value + "-" + time_zone_value
            this.$emit('input', this.internal_value)
        }
	},
	created() {
        this.internal_value = this.value
        this.initial_value = this.value
        if (this.internal_value) {
            this.date = this.internal_value.split("T")[0]
            this.time = this.internal_value.split("T")[1].split("-")[0]
            this.timezone = this.internal_value.split("T")[1].split("-")[1]
        }
    },
	watch: {
		time() {
			this.updateValue()
		},
		date() {
			this.updateValue()
		},
	},
}
</script>