<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<div
		class="container daterange-container"
		:id="property">
		<div class="row">
			<div class="col-sm-2">
				<p>
					{{ title }}
					<delete-button v-if="inArray" @click="$emit('delete', property)"/>
				</p>
				<b-badge v-if="timeBetweenString">
					{{ timeBetweenString }}
				</b-badge>
				<div class="error-badges" v-if="toIsEarlierThanFrom">
					<b-badge
						variant="danger">
						<span>To &lt; From</span>
					</b-badge>
				</div>
			</div>
			<div class="col">
				<datetimepicker
					:title="'From'"
					:format="schema.properties.start_date.format"
					v-model="start">
				</datetimepicker>
			</div>
			<div class="col">
				<datetimepicker
					:title="'To'"
					:format="schema.properties.end_date.format"
					v-model="end">
				</datetimepicker>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.daterange-title.container {
	margin: 0em;
	padding: 0em;
	.row {
		margin: 0em;
		padding: 0em;
		padding-left: 0.5em;
		.col, .col-sm-2 {
			margin: 0em;
			padding: 0em;
		}
	}
}
.daterange-title.container * .input-group {
	margin-top: 0.5em;
}
.daterange-title.container * .input-group:last-child {
	margin-top: 0.25em;
	padding-left: 1em;
}
.error-badges {
	padding-top: 0.5em;
}
</style>

<script>
import DateTimePicker from '@/components/DateTimePicker.vue'
import SchemaBase from '@/widgets/base.vue'
import { distanceInWords } from 'date-fns'
import DeleteButton from '@/partials/DeleteButton.vue'

export default {
	name: 'date-range',
	extends: SchemaBase,
	components: {
		"datetimepicker": DateTimePicker,
		DeleteButton,
	},
	data() {
		return {
			start: null,
			end: null,
			isInitializing: true,
		}
	},
	computed: {
		timeBetweenString() {
			if (!this.end || !this.start) { return null }
			return distanceInWords(this.end, this.start)	
		},
		title() {
			return typeof(this.property)=="number" ? '#' + (this.property + 1) : this.schema.title
		},
		toIsEarlierThanFrom() {
			if (!this.end || !this.start) { return false }
			const endDate = new Date(this.end)
			const startDate = new Date(this.start)
			if (endDate < startDate) {
				return true
			}
		}
	},
	methods: {
		updateValue() {
			if (this.isInitializing) { return }
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: {
				start_date: this.start, end_date: this.end,
			}})
		},
	},
	created() {
		this.isInitializing = true
		this.start = this.value.start_date
		this.end = this.value.end_date
		this.isInitializing = false
	},
	watch: {
		start() {
			if (this.isInitializing) { return }
			this.updateValue()
		},
		end() {
			if (this.isInitializing) { return }
			this.updateValue()
		},
	},
}
</script>
