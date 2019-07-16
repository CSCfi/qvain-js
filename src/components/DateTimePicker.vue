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
        </b-row>
    </b-container>
</template>

<style>

</style>

<script>
//import Datepicker from 'vuejs-datepicker'
import Datepicker from "@/components/DatePicker.vue"
import Timepicker from "@/components/TimePicker.vue"


export default {
	name: 'datetime-picker',
	components: {
        Datepicker,
        Timepicker,
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
        }
	},

	methods: {
        forceRerender() {
            this.componentKey += 1;  
        }
	},
	created() {
        this.internal_value = this.value
        this.initial_value = this.value
    },
	watch: {
		time() {
            console.log("time has changed")
            console.log(this.time)
			//this.updateValue()
		},
		date() {
			console.log("date has changed")
            console.log(this.date)
			//this.updateValue()
		},
	},
}
</script>